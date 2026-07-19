import { models } from '../../../models/index.js';
import { shortId } from '../../../utils/id.js';

export async function listContacts() {
  return models.Contact.findAll({ raw: true });
}

export async function createContact(input: Record<string, any>) {
  const created = await models.Contact.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function updateContact(id: string, input: Record<string, any>) {
  await models.Contact.update(input, { where: { id } });
  return models.Contact.findByPk(id, { raw: true });
}

export async function deleteContact(id: string) {
  await models.Contact.destroy({ where: { id } });
  return { ok: true };
}
