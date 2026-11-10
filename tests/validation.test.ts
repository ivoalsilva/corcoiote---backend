import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ValidationError } from '../src/errors/index.ts';
import validate from '../src/middlewares/validate.ts';
import { createInvoiceSchema } from '../src/schemas/invoice.schema.ts';
import { parsePage } from '../src/schemas/page.schema.ts';
import { createUserSchema } from '../src/schemas/user.schema.ts';
import parseId from '../src/utils/parseId.ts';
import { captureNext, mockRequest, mockResponse } from './helpers.ts';

describe('parseId', () => {
	it('converte ids numéricos válidos', () => {
		assert.equal(parseId('42'), 42);
	});

	for (const value of ['abc', '0', '-1', '1.5', '']) {
		it(`rejeita "${value}"`, () => {
			assert.throws(() => parseId(value), ValidationError);
		});
	}
});

describe('parsePage', () => {
	it('usa a página 1 por padrão', () => {
		assert.deepEqual(parsePage({}), { page: 1 });
	});

	it('converte a página da query string', () => {
		assert.deepEqual(parsePage({ page: '3' }), { page: 3 });
	});

	it('rejeita páginas inválidas', () => {
		assert.throws(() => parsePage({ page: '0' }), ValidationError);
		assert.throws(() => parsePage({ page: 'x' }), ValidationError);
	});
});

describe('createInvoiceSchema', () => {
	const valid = {
		amount: 1500,
		status: 'PENDING',
		date: '2026-01-10',
		customerId: 1,
	};

	it('aceita uma fatura válida e converte a data', () => {
		const result = createInvoiceSchema.parse(valid);
		assert.ok(result.date instanceof Date);
	});

	it('rejeita valor decimal com mensagem de inteiro', () => {
		const result = createInvoiceSchema.safeParse({
			...valid,
			amount: 15.5,
		});
		assert.equal(result.success, false);
		assert.match(result.error?.issues[0]?.message ?? '', /inteiro/);
	});

	it('rejeita valor negativo', () => {
		const result = createInvoiceSchema.safeParse({ ...valid, amount: -3 });
		assert.match(result.error?.issues[0]?.message ?? '', /maior que zero/);
	});

	it('rejeita status desconhecido', () => {
		assert.equal(
			createInvoiceSchema.safeParse({ ...valid, status: 'LATE' }).success,
			false,
		);
	});
});

describe('createUserSchema', () => {
	it('exige senha com no mínimo 8 caracteres', () => {
		const result = createUserSchema.safeParse({
			name: 'Ivo',
			email: 'ivo@x.com',
			password: '123',
		});
		assert.equal(result.success, false);
	});
});

describe('validate', () => {
	it('substitui o corpo pelos dados validados', () => {
		const request = mockRequest({
			body: {
				amount: 1500,
				status: 'PAID',
				date: '2026-01-10',
				customerId: 1,
				extra: 'removido',
			},
		});
		const next = captureNext();

		validate(createInvoiceSchema)(request, mockResponse(), next);

		assert.equal(next.error, undefined);
		assert.ok(request.body.date instanceof Date);
		assert.equal('extra' in request.body, false);
	});

	it('repassa um ValidationError com os campos inválidos', () => {
		const next = captureNext();

		validate(createInvoiceSchema)(
			mockRequest({ body: {} }),
			mockResponse(),
			next,
		);

		assert.ok(next.error instanceof ValidationError);
		assert.ok(next.error.fields.some((field) => field.field === 'amount'));
	});
});
