import { NotFoundError } from "../errors/index.ts";

import type {
  CreateCustomer,
  UpdateCustomer,
} from "../schemas/customer.schema.ts";

import type { Customer, Page } from "../types.ts";

import prisma from "../lib/prisma.ts";

const PAGE_SIZE = 10;

export async function findAllCustomer({ page }: Page): Promise<Customer[]> {
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return customers;
}

export async function findCustomerById(id: number): Promise<Customer> {
  const customer = await prisma.customer.findUnique({ where: { id } });

  if (!customer) {
    throw new NotFoundError(`Cliente de id ${id} não encontrado.`);
  }

  return customer;
}

export async function insertCustomer({
  name,
  email,
  imageUrl,
}: CreateCustomer): Promise<Customer> {
  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      imageUrl,
    },
  });

  return customer;
}

export async function modifyCustomer(
  id: number,
  { name, email, imageUrl }: UpdateCustomer,
): Promise<Customer> {
  await findCustomerById(id);

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name,
      email,
      imageUrl,
    },
  });

  return customer;
}

export async function removeCustomer(id: number): Promise<void> {
  await findCustomerById(id);

  await prisma.customer.delete({ where: { id } });
}
