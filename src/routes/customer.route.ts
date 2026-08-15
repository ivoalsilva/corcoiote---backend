import { Router } from 'express';
import * as CustomerController from '../controllers/customer.controller.ts';
import validate from '../middlewares/validate.ts';
import { createCustomerSchema, updateCustomerSchema } from '../schemas/customer.schema.ts';

const router = Router();

router.get('/', CustomerController.getAllCustomers);
router.get('/:id', CustomerController.getCustomerById);
router.post(
  '/',
  validate(createCustomerSchema),
  CustomerController.createCustomer
);
router.put(
  '/:id',
  validate(updateCustomerSchema),
  CustomerController.updateCustomer
);
router.delete('/:id', CustomerController.deleteCustomer);

export default router;
