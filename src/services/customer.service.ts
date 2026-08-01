import customers from "../mocks/customer.mock.ts";
import type { Customer } from "../types.ts";
import { NotFoundError } from "../errors/index.ts";

export function findAllCustomer(): Customer[] {
    return customers;
}

export function findCustumerById(id: number) {
    const customer = customers.find((customer) => customer.id === id)

    if (!customer) {
        throw new NotFoundError(`Cliente de id ${id} não encontrado.`);
    }
    return customer;
}

export function insertCustomer(name: string) {
    const id = customers[customers.length - 1].id;
    const customer: Customer = {
        id: id + 1,
        name,
        status: true
    }
    customers.push(customer);

    return customer;
}

export function modifyCustomer(id: number, name: string, status: boolean) {
    const customer = customers.find((customer) => customer.id === id)

    if (!customer) {
        throw new NotFoundError(`Cliente de id ${id} não encontrado.`);
    }

    if(name) customer.name = name;
    if(status !== undefined) customer.status = status;

    return customer
}

export function removeCustomer(id: number) {
    const index = customers.findIndex((customer) => customer.id === id)

    if (index === -1) {
        throw new NotFoundError(`Cliente de id ${id} não encontrado.`);
    }

    customers.splice(index , 1);
}