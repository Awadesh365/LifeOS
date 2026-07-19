import { Router } from 'express';

import * as contactsApiController from '../../../controllers/api_controllers/life-tracker/contacts/contacts.api.controller.js';

const router = Router();

router.get('/', contactsApiController.listContacts);
router.post('/', contactsApiController.createContact);
router.put('/:id', contactsApiController.updateContact);
router.delete('/:id', contactsApiController.deleteContact);

export default router;
