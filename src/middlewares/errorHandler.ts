import type { NextFunction, Request, Response } from 'express';

import { Prisma } from '../../prisma/generated/client.ts';
import {
	ConflictError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from '../errors/index.ts';

function isBodyParserError(
	error: unknown,
): error is { status: number; type: string } {
	return (
		typeof error === 'object' &&
		error !== null &&
		'type' in error &&
		error.type === 'entity.parse.failed'
	);
}

export default function errorHandler(
	error: unknown,
	_request: Request,
	response: Response,
	_next: NextFunction,
) {
	if (
		error instanceof NotFoundError ||
		error instanceof ConflictError ||
		error instanceof UnauthorizedError
	) {
		response.status(error.statusCode).json({ message: error.message });
		return;
	}

	if (error instanceof ValidationError) {
		response.status(error.statusCode).json({
			message: error.message,
			fields: error.fields,
		});
		return;
	}

	if (isBodyParserError(error)) {
		response.status(400).json({ message: 'JSON inválido.' });
		return;
	}

	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === 'P2002') {
			response
				.status(409)
				.json({ message: 'Registro já existente com esses dados.' });
			return;
		}

		if (error.code === 'P2025') {
			response.status(404).json({ message: 'Registro não encontrado.' });
			return;
		}

		if (error.code === 'P2003') {
			response
				.status(400)
				.json({ message: 'Registro relacionado não encontrado.' });
			return;
		}
	}

	console.error(error);

	response.status(500).json({ message: 'Erro interno do servidor.' });
}
