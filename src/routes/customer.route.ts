import { Router } from "express";
import * as CustomerController from "../controllers/customer.controller.ts";

const router = Router();

router.get('/' , CustomerController.getAllCustomers);
router.get('/:id' , CustomerController.getById);

export default router;