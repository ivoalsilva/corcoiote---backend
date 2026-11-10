import type { ValidationFieldError } from '../types.ts';

export class NotFoundError extends Error {
	statusCode: number;

	constructor(message: string) {
		super(message);
		this.statusCode = 404;
	}
}

export class ValidationError extends Error {
	statusCode: number;

	fields: ValidationFieldError[];

	constructor(message: string, fields: ValidationFieldError[]) {
		super(message);
		this.statusCode = 400;
		this.fields = fields;
	}
}

export class UnauthorizedError extends Error {
	statusCode: number;

	constructor(message: string) {
		super(message);
		this.statusCode = 401;
	}
}

export class ConflictError extends Error {
	statusCode: number;

	constructor(message: string) {
		super(message);
		this.statusCode = 409;
	}
}
