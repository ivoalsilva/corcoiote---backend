import type { Request, Response } from 'express';
import type { Login } from '../schemas/auth.schema.ts';
import * as AuthService from '../services/auth.service.ts';
import * as UserService from '../services/user.service.ts';

export async function login(
  request: Request,
  response: Response
): Promise<void> {
  const data = request.body as Login;

  const result = await AuthService.login(data);

  response.status(200).json(result);
}

export async function me(
  _request: Request,
  response: Response
): Promise<void> {
  const user = await UserService.findUserById(response.locals.userId);

  response.status(200).json(user);
}
