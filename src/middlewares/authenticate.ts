import type { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '../errors/index.ts';
import { verifyToken } from '../lib/jwt.ts';

export default function authenticate(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	const [scheme, token] = request.headers.authorization?.split(' ') ?? [];

	if (scheme !== 'Bearer' || !token) {
		return next(new UnauthorizedError('Token de acesso não informado.'));
	}

	const userId = verifyToken(token);

	if (userId === null) {
		return next(
			new UnauthorizedError('Token de acesso inválido ou expirado.'),
		);
	}

	response.locals.userId = userId;

	next();
}
