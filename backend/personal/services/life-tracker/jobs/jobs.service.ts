import { models } from '../../../models/index.js';
import { todayIsoDate } from '../../../utils/date.js';
import { shortId } from '../../../utils/id.js';

export async function listJobs() {
  return models.Job.findAll({ raw: true });
}

export async function createJob(input: Record<string, any>) {
  const created = await models.Job.create({
    id: shortId(),
    company: input.company,
    role: input.role,
    date: input.date || todayIsoDate(),
    salary: input.salary || '',
    status: input.status || 'applied',
    link: input.link || '',
    notes: input.notes || '',
  });
  return created.toJSON();
}

export async function updateJob(id: string, input: Record<string, any>) {
  await models.Job.update(input, { where: { id } });
  return models.Job.findByPk(id, { raw: true });
}

export async function updateJobStatus(id: string, status: string) {
  await models.Job.update({ status }, { where: { id } });
  return models.Job.findByPk(id, { raw: true });
}

export async function deleteJob(id: string) {
  await models.Job.destroy({ where: { id } });
  return { ok: true };
}
