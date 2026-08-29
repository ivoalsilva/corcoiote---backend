import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  imageUrl: z.url().optional()
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  imageUrl: z.url().optional()
});

export type CreateCustomer = z.infer<typeof createCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
