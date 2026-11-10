import { NotFoundError } from '../errors/index.ts';
import { hashPassword } from '../lib/password.ts';
import prisma from '../lib/prisma.ts';
import type { CreateUser, UpdateUser } from '../schemas/user.schema.ts';
import type { PublicUser } from '../types.ts';

const omitPassword = { password: true } as const;

export async function findAllUsers(): Promise<PublicUser[]> {
	return await prisma.user.findMany({ omit: omitPassword });
}

export async function findUserById(id: number): Promise<PublicUser> {
	const user = await prisma.user.findUnique({
		where: { id },
		omit: omitPassword,
	});

	if (!user) throw new NotFoundError(`Usuário de id ${id} não encontrado.`);

	return user;
}

export async function insertUser({
	name,
	email,
	password,
}: CreateUser): Promise<PublicUser> {
	return await prisma.user.create({
		data: {
			name,
			email,
			password: await hashPassword(password),
		},
		omit: omitPassword,
	});
}

export async function modifyUser(
	id: number,
	{ name, email, password }: UpdateUser,
): Promise<PublicUser> {
	await findUserById(id);

	return await prisma.user.update({
		where: { id },
		data: {
			name,
			email,
			password: password ? await hashPassword(password) : undefined,
		},
		omit: omitPassword,
	});
}

export async function removeUser(id: number): Promise<void> {
	await findUserById(id);

	await prisma.user.delete({ where: { id } });
}
