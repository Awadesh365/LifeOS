import { models } from '../../../../models';
import { shortId } from '../../../../utils/id';

function filterByMonthYear<T extends { date: string }>(entries: T[], month?: string, year?: string) {
  if (!month || !year) return entries;

  return entries.filter((entry) => {
    const date = new Date(entry.date);
    return date.getMonth() + 1 === parseInt(month, 10) && date.getFullYear() === parseInt(year, 10);
  });
}

export async function listEntries(month?: string, year?: string) {
  const entries = await models.WealthEntry.findAll({ raw: true });
  return filterByMonthYear(entries as any[], month, year);
}

export async function createEntry(input: Record<string, any>) {
  const created = await models.WealthEntry.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function deleteEntry(id: string) {
  await models.WealthEntry.destroy({ where: { id } });
  return { ok: true };
}

export async function listInvestments() {
  return models.Investment.findAll({ raw: true });
}

export async function createInvestment(input: Record<string, any>) {
  const created = await models.Investment.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function updateInvestment(id: string, input: Record<string, any>) {
  await models.Investment.update(input, { where: { id } });
  return models.Investment.findByPk(id, { raw: true });
}

export async function getSummary(month?: string, year?: string) {
  const entries = await models.WealthEntry.findAll({ raw: true });
  const filtered = filterByMonthYear(entries as any[], month, year);

  const income = filtered.filter((entry) => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
  const expenses = filtered.filter((entry) => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
  const investmentsVal = filtered.filter((entry) => entry.type === 'investment').reduce((sum, entry) => sum + entry.amount, 0);

  return { income, expenses, investments: investmentsVal, savings: income - expenses - investmentsVal };
}
