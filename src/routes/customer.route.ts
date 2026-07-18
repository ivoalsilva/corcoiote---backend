import { Router } from "express";
import { getAllCustomers } from "../controllers/customer.controller.ts";

const router = Router();

router.get('/' , getAllCustomers);

export default router;