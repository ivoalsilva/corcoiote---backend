import { Router } from "express";
import * as CustomerController from "../controllers/customer.controller.ts";

const router = Router();

router.get('/' , CustomerController.getAllCustomers);
router.get('/:id' , CustomerController.getCustomerById);
router.post('/', CustomerController.createCustomer);
router.put('/:id' , CustomerController.updateCustomer);

export default router;