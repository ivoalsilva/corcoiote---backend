import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1)
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.boolean().optional()
});

export type CreateCustomer = z.infer<typeof createCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
