import type { NextFunction, Request, Response } from 'express';

process.env.JWT_SECRET ??= 'segredo-de-teste';

export type MockResponse = Response & {
	statusCode: number;
	body: unknown;
};

export function mockResponse(): MockResponse {
	const response = {
		statusCode: 200,
		body: undefined as unknown,
		locals: {} as Record<string, unknown>,
		status(code: number) {
			response.statusCode = code;
			return response;
		},
		json(body: unknown) {
			response.body = body;
			return response;
		},
	};

	return response as unknown as MockResponse;
}

export function mockRequest(data: Partial<Request> = {}): Request {
	return { body: {}, headers: {}, params: {}, query: {}, ...data } as Request;
}

export function captureNext(): NextFunction & {
	error: unknown;
	called: boolean;
} {
	const next = ((error?: unknown) => {
		next.called = true;
		next.error = error;
	}) as NextFunction & { error: unknown; called: boolean };

	next.called = false;
	next.error = undefined;

	return next;
}
