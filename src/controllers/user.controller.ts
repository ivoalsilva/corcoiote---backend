import type { Request, Response } from 'express';
import type { CreateUser, UpdateUser } from '../schemas/user.schema.ts';
import * as UserService from '../services/user.service.ts';
import parseId from '../utils/parseId.ts';

export async function getAllUsers(
  _request: Request,
  response: Response
): Promise<void> {
  const users = await UserService.findAllUsers();

  response.status(200).json(users);
}

export async function getUserById(
  request: Request,
  response: Response
): Promise<void> {
  const id = parseId(request.params.id);

  const user = await UserService.findUserById(id);

  response.status(200).json(user);
}

export async function createUser(
  request: Request,
  response: Response
): Promise<void> {
  const data = request.body as CreateUser;

  const user = await UserService.insertUser(data);

  response.status(201).json(user);
}

export async function updateUser(
  request: Request,
  response: Response
): Promise<void> {
  const id = parseId(request.params.id);
  const data = request.body as UpdateUser;

  const user = await UserService.modifyUser(id, data);

  response.status(200).json(user);
}

export async function deleteUser(
  request: Request,
  response: Response
): Promise<void> {
  const id = parseId(request.params.id);

  await UserService.removeUser(id);

  response.status(204).send();
}
