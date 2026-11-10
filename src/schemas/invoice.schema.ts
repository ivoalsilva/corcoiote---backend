import { z } from 'zod';

export const createInvoiceSchema = z.object({
  amount: z
    .number('Entrada inválida: esperava-se um número.')
    .int()
    .positive(),
  status: z.enum(['PENDING', 'PAID']),
  date: z.coerce.date(),
  customerId: z
    .number()
    .int()
    .positive()
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export const pageQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1)
});

export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;
