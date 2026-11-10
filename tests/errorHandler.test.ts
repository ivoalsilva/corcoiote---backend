import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Prisma } from '../prisma/generated/client.ts';
import {
	ConflictError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from '../src/errors/index.ts';
import errorHandler from '../src/middlewares/errorHandler.ts';
import { captureNext, mockRequest, mockResponse } from './helpers.ts';

function handle(error: unknown) {
	const response = mockResponse();
	errorHandler(error, mockRequest(), response, captureNext());
	return response;
}

function prismaError(code: string) {
	return new Prisma.PrismaClientKnownRequestError('erro', {
		code,
		clientVersion: 'teste',
	});
}

describe('errorHandler', () => {
	it('responde com o status dos erros da aplicação', () => {
		assert.equal(handle(new NotFoundError('x')).statusCode, 404);
		assert.equal(handle(new ConflictError('x')).statusCode, 409);
		assert.equal(handle(new UnauthorizedError('x')).statusCode, 401);
	});

	it('inclui os campos nos erros de validação', () => {
		const fields = [{ field: 'email', message: 'inválido' }];
		const response = handle(
			new ValidationError('Dados inválidos.', fields),
		);

		assert.equal(response.statusCode, 400);
		assert.deepEqual(response.body, {
			message: 'Dados inválidos.',
			fields,
		});
	});

	it('responde 400 para JSON malformado', () => {
		const response = handle({ type: 'entity.parse.failed', status: 400 });
		assert.equal(response.statusCode, 400);
	});

	it('traduz os erros conhecidos do prisma', () => {
		assert.equal(handle(prismaError('P2002')).statusCode, 409);
		assert.equal(handle(prismaError('P2025')).statusCode, 404);
		assert.equal(handle(prismaError('P2003')).statusCode, 400);
	});

	it('responde 500 para erros desconhecidos', (context) => {
		const consoleError = context.mock.method(console, 'error', () => {});

		assert.equal(handle(new Error('boom')).statusCode, 500);
		assert.equal(consoleError.mock.callCount(), 1);
	});
});
