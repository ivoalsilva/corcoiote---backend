import type { NextFunction, Request, Response } from 'express';

export default function requestLogger(
	request: Request,
	_response: Response,
	next: NextFunction,
) {
	console.log(`${request.method} ${request.url}`);

	next();
}
