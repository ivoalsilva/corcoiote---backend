import { Router } from 'express';
import * as UserController from '../controllers/user.controller.ts';
import authenticate from '../middlewares/authenticate.ts';
import validate from '../middlewares/validate.ts';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.ts';

const router = Router();

router.post('/', validate(createUserSchema), UserController.createUser);

router.use(authenticate);

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', validate(updateUserSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
