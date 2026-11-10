import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts';
import authenticate from '../middlewares/authenticate.ts';
import validate from '../middlewares/validate.ts';
import { loginSchema } from '../schemas/auth.schema.ts';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', authenticate, AuthController.me);

export default router;
