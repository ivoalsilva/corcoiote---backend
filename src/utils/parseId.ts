import { ValidationError } from '../errors/index.ts';

export default function parseId(value: unknown): number {
	const id = Number(value);

	if (!Number.isInteger(id) || id <= 0) {
		throw new ValidationError('Dados inválidos.', [
			{
				field: 'id',
				message: 'O id deve ser um número inteiro positivo.',
			},
		]);
	}

	return id;
}
