import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildPostings, displayBalance, parseMoneyToMinor } from '../../services/money/ledger.js';

describe('money ledger semantics', () => {
  it('uses fixed-point minor units and rejects unsafe precision', () => {
    assert.equal(parseMoneyToMinor('6499.50'), 649950n);
    assert.throws(() => parseMoneyToMinor('1.001'));
    assert.throws(() => parseMoneyToMinor(0));
  });

  it('creates two balanced postings for owned-account transfers', () => {
    assert.deepEqual(buildPostings({
      type: 'transfer', amount: '50000', sourceAccountId: 'bank', destinationAccountId: 'fd',
      sourceAccountType: 'bank', destinationAccountType: 'deposit',
    }), [
      { accountId: 'bank', amount: '-50000.00', role: 'source' },
      { accountId: 'fd', amount: '50000.00', role: 'destination' },
    ]);
  });

  it('records card purchases as an increasing liability without a second expense on payment', () => {
    assert.equal(buildPostings({
      type: 'expense', amount: '2000', sourceAccountId: 'card', sourceAccountType: 'credit_card',
    })[0].amount, '-2000.00');
    assert.equal(displayBalance(-200000n, 'credit_card'), 200000n);
    assert.deepEqual(buildPostings({
      type: 'transfer', amount: '2000', sourceAccountId: 'bank', destinationAccountId: 'card',
      sourceAccountType: 'bank', destinationAccountType: 'credit_card',
    }).map((posting) => posting.amount), ['-2000.00', '2000.00']);
    assert.equal(buildPostings({
      type: 'refund', amount: '500', destinationAccountId: 'card', destinationAccountType: 'credit_card',
    })[0].amount, '500.00');
  });

  it('keeps investment and deposit funding out of expense semantics', () => {
    for (const type of ['deposit_funding', 'investment_contribution'] as const) {
      const postings = buildPostings({
        type, amount: '8000', sourceAccountId: 'bank', destinationAccountId: 'position',
        sourceAccountType: 'bank', destinationAccountType: type === 'deposit_funding' ? 'deposit' : 'investment',
      });
      assert.equal(postings.reduce((sum, posting) => sum + parseFloat(posting.amount), 0), 0);
    }
  });
});
