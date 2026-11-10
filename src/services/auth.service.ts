import { UnauthorizedError } from '../errors/index.ts';
import { signToken } from '../lib/jwt.ts';
import { verifyPassword } from '../lib/password.ts';
import prisma from '../lib/prisma.ts';
import type { Login } from '../schemas/auth.schema.ts';
import type { PublicUser } from '../types.ts';

export async function login({
  email,
  password
}: Login): Promise<{ token: string; user: PublicUser }> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.password))) {
    throw new UnauthorizedError('E-mail ou senha inválidos.');
  }

  const { password: _password, ...publicUser } = user;

  return { token: signToken(user.id), user: publicUser };
}
