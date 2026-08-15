import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ValidationError } from '../errors/index.ts';

export default function validate(schema: ZodType) {
  return (
    request: Request,
    _response: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(request.body);

    if (!result.success)
      return next(new ValidationError(result.error.message));

    next();
  }
}