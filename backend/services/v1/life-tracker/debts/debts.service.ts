import { models, sequelize } from '../../../../models';
import { todayIsoDate } from '../../../../utils/date';
import { createHttpError } from '../../../../utils/httpError';
import { shortId } from '../../../../utils/id';

export async function listDebts() {
  return models.Debt.findAll({ raw: true });
}

export async function createDebt(input: Record<string, any>) {
  const created = await models.Debt.create({
    id: shortId(),
    personName: input.personName,
    totalAmount: input.totalAmount,
    remainingAmount: input.totalAmount,
    targetMonth: input.targetMonth,
    notes: input.notes,
  });
  return created.toJSON();
}

export async function payDebt(debtId: string, input: Record<string, any>) {
  return sequelize.transaction(async (transaction) => {
    const debt = await models.Debt.findByPk(debtId, { transaction });

    if (!debt) {
      throw createHttpError(404, 'Debt not found');
    }

    const debtData = debt.toJSON() as any;
    const amount = Number(input.amount);
    await models.DebtPayment.create({
      id: shortId(),
      debtId,
      amount,
      paymentDate: todayIsoDate(),
      notes: input.notes,
    }, { transaction });

    const newPaid = (debtData.paidAmount || 0) + amount;
    const newRemaining = debtData.totalAmount - newPaid;
    const newStatus = newRemaining <= 0 ? 'paid' : 'active';

    await debt.update({
      paidAmount: newPaid,
      remainingAmount: Math.max(0, newRemaining),
      status: newStatus,
    }, { transaction });

    return debt.toJSON();
  });
}

export async function listPayments(debtId: string) {
  return models.DebtPayment.findAll({ where: { debtId }, raw: true });
}

export async function deleteDebt(id: string) {
  await models.DebtPayment.destroy({ where: { debtId: id } });
  await models.Debt.destroy({ where: { id } });
  return { ok: true };
}
