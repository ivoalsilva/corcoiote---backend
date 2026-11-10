import './helpers.ts';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../src/errors/index.ts';
import { signToken, verifyToken } from '../src/lib/jwt.ts';
import { hashPassword, verifyPassword } from '../src/lib/password.ts';
import authenticate from '../src/middlewares/authenticate.ts';
import { captureNext, mockRequest, mockResponse } from './helpers.ts';

describe('password', () => {
	it('gera hashes diferentes para a mesma senha', async () => {
		const first = await hashPassword('12345678');
		const second = await hashPassword('12345678');

		assert.notEqual(first, second);
		assert.notEqual(first, '12345678');
	});

	it('confere a senha correta e recusa a errada', async () => {
		const hash = await hashPassword('12345678');

		assert.equal(await verifyPassword('12345678', hash), true);
		assert.equal(await verifyPassword('errada123', hash), false);
	});

	it('recusa hashes malformados', async () => {
		assert.equal(await verifyPassword('12345678', 'texto-puro'), false);
	});
});

describe('jwt', () => {
	it('recupera o id do usuário a partir do token', () => {
		assert.equal(verifyToken(signToken(7)), 7);
	});

	it('recusa tokens inválidos', () => {
		assert.equal(verifyToken('lixo'), null);
	});

	it('recusa tokens assinados com outro segredo', () => {
		const token = jwt.sign({}, 'outro-segredo', { subject: '7' });
		assert.equal(verifyToken(token), null);
	});

	it('recusa tokens expirados', () => {
		const token = jwt.sign({}, process.env.JWT_SECRET as string, {
			subject: '7',
			expiresIn: -10,
		});
		assert.equal(verifyToken(token), null);
	});
});

describe('authenticate', () => {
	it('recusa requisições sem token', () => {
		const next = captureNext();

		authenticate(mockRequest(), mockResponse(), next);

		assert.ok(next.error instanceof UnauthorizedError);
	});

	it('recusa tokens inválidos', () => {
		const next = captureNext();

		authenticate(
			mockRequest({ headers: { authorization: 'Bearer lixo' } }),
			mockResponse(),
			next,
		);

		assert.ok(next.error instanceof UnauthorizedError);
	});

	it('aceita token válido e guarda o id do usuário', () => {
		const next = captureNext();
		const response = mockResponse();

		authenticate(
			mockRequest({
				headers: { authorization: `Bearer ${signToken(3)}` },
			}),
			response,
			next,
		);

		assert.equal(next.called, true);
		assert.equal(next.error, undefined);
		assert.equal(response.locals.userId, 3);
	});
});
