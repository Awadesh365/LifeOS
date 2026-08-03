import { asyncHandler } from '../../../../../utils/asyncHandler';
import * as contactsService from '../../../../../services/v1/life-tracker/contacts/contacts.service';

export const listContacts = asyncHandler(async (_req, res) => {
  res.json(await contactsService.listContacts());
});

export const createContact = asyncHandler(async (req, res) => {
  res.json(await contactsService.createContact(req.body));
});

export const updateContact = asyncHandler(async (req, res) => {
  res.json(await contactsService.updateContact(req.params.id, req.body));
});

export const deleteContact = asyncHandler(async (req, res) => {
  res.json(await contactsService.deleteContact(req.params.id));
});
