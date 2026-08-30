import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeBrandColor, normalizeTheme, normalizeUserId } from '../../services/preferences/preferences.service.js';

test('theme preferences accept only supported modes', () => {
  assert.equal(normalizeTheme('system'), 'system');
  assert.equal(normalizeTheme('light'), 'light');
  assert.equal(normalizeTheme('dark'), 'dark');
  assert.throws(() => normalizeTheme('midnight'), /Theme must be/);
});

test('brand colors accept normalized six-digit hex values', () => {
  assert.equal(normalizeBrandColor('#e55555', 'primaryColor'), '#E55555');
  assert.throws(() => normalizeBrandColor('red', 'primaryColor'), /6-digit hex/);
  assert.throws(() => normalizeBrandColor('#fff', 'secondaryColor'), /6-digit hex/);
});

test('user preference ids are normalized and validated', () => {
  assert.equal(normalizeUserId(' Awadesh '), 'awadesh');
  assert.throws(() => normalizeUserId('../admin'), /Invalid user id/);
});
