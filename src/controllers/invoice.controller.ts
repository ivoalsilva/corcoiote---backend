import type { Request, Response } from 'express';
import type {
	CreateInvoice,
	UpdateInvoice,
} from '../schemas/invoice.schema.ts';
import { parsePage } from '../schemas/page.schema.ts';
import * as InvoiceService from '../services/invoice.service.ts';
import parseId from '../utils/parseId.ts';

export async function getAllInvoices(
	request: Request,
	response: Response,
): Promise<void> {
	const page = parsePage(request.query);

	const invoices = await InvoiceService.findAllInvoices(page);

	response.status(200).json(invoices);
}

export async function getInvoiceById(
	request: Request,
	response: Response,
): Promise<void> {
	const id = parseId(request.params.id);

	const invoice = await InvoiceService.findInvoiceById(id);

	response.status(200).json(invoice);
}

export async function createInvoice(
	request: Request,
	response: Response,
): Promise<void> {
	const data = request.body as CreateInvoice;

	const invoice = await InvoiceService.insertInvoice(data);

	response.status(201).json(invoice);
}

export async function updateInvoice(
	request: Request,
	response: Response,
): Promise<void> {
	const id = parseId(request.params.id);
	const data = request.body as UpdateInvoice;

	const invoice = await InvoiceService.modifyInvoice(id, data);

	response.status(200).json(invoice);
}

export async function deleteInvoice(
	request: Request,
	response: Response,
): Promise<void> {
	const id = parseId(request.params.id);

	await InvoiceService.removeInvoice(id);

	response.status(204).send();
}
