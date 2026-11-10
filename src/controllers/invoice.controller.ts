import type { Request, Response } from 'express';
import { ValidationError } from '../errors/index.ts';
import {
  type CreateInvoice,
  pageQuerySchema,
  type UpdateInvoice
} from '../schemas/invoice.schema.ts';
import * as InvoiceService from '../services/invoice.service.ts';
import parseId from '../utils/parseId.ts';

export async function getAllInvoices(
  request: Request,
  response: Response
): Promise<void> {
  const result = pageQuerySchema.safeParse(request.query);

  if (!result.success) {
    throw new ValidationError('Dados inválidos.', [
      { field: 'page', message: 'A página deve ser um inteiro positivo.' }
    ]);
  }

  const invoices = await InvoiceService.findAllInvoices(result.data);

  response.status(200).json(invoices);
}

export async function getInvoiceById(
  request: Request,
  response: Response
): Promise<void> {
  const id = parseId(request.params.id);

  const invoice = await InvoiceService.findInvoiceById(id);

  response.status(200).json(invoice);
}

export async function createInvoice(
  request: Request,
  response: Response
): Promise<void> {
  const data = request.body as CreateInvoice;

  const invoice = await InvoiceService.insertInvoice(data);

  response.status(201).json(invoice);
}

export async function updateInvoice(
  request: Request,
  response: Response
): Promise<void> {
  const id = parseId(request.params.id);
  const data = request.body as UpdateInvoice;

  const invoice = await InvoiceService.modifyInvoice(id, data);

  response.status(200).json(invoice);
}

export async function deleteInvoice(
  request: Request,
  response: Response
): Promise<void> {
  const id = parseId(request.params.id);

  await InvoiceService.removeInvoice(id);

  response.status(204).send();
}
