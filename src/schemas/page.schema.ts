import { z } from 'zod';

import { ValidationError } from '../errors/index.ts';
import type { Page } from '../types.ts';

export const pageQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
});

export function parsePage(query: unknown): Page {
	const result = pageQuerySchema.safeParse(query);

	if (!result.success) {
		throw new ValidationError('Dados inválidos.', [
			{
				field: 'page',
				message: 'A página deve ser um inteiro positivo.',
			},
		]);
	}

	return result.data;
}
