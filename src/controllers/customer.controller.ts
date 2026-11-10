import type { Request, Response } from 'express';

import type {
	CreateCustomer,
	UpdateCustomer,
} from '../schemas/customer.schema.ts';

import { parsePage } from '../schemas/page.schema.ts';
import * as CustomerService from '../services/customer.service.ts';
import parseId from '../utils/parseId.ts';

export async function getAllCustomers(
	request: Request,
	response: Response,
): Promise<void> {
	const page = parsePage(request.query);
	const customers = await CustomerService.findAllCustomer(page);
	response.status(200).json(customers);
}

export async function getCustomerById(
	request: Request,
	response: Response,
): Promise<void> {
	const id = parseId(request.params.id);
	const customer = await CustomerService.findCustomerById(id);
	response.status(200).json(customer);
}

export async function createCustomer(
	request: Request,
	response: Response,
): Promise<void> {
	const { name, email, imageUrl } = request.body as CreateCustomer;

	const customer = await CustomerService.insertCustomer({
		name,
		email,
		imageUrl,
	});

	response.status(201).json(customer);
}

export async function updateCustomer(
	request: Request,
	response: Response,
): Promise<void> {
	const id = parseId(request.params.id);

	const { name, email, imageUrl } = request.body as UpdateCustomer;

	const customer = await CustomerService.modifyCustomer(id, {
		name,
		email,
		imageUrl,
	});

	response.status(200).json(customer);
}

export async function deleteCustomer(
	request: Request,
	response: Response,
): Promise<void> {
	const id = parseId(request.params.id);

	await CustomerService.removeCustomer(id);

	response.status(204).send();
}
