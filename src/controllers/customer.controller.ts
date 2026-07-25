import type { Request, Response } from 'express'
import * as CustomerService from '../services/customer.service.ts'
import type { CreateCustomer } from '../types.ts';

export function getAllCustomers(
    _request: Request,
    response: Response) {
    const customers = CustomerService.findAllCustomer()
    response.status(200).json(customers);
}

export function getCustomerById(request: Request, response: Response): void {
    const id = Number(request.params.id);

    const customer = CustomerService.findCustumerById(id);

    response.status(200).json(customer);
}

export function createCustomer(request: Request, response: Response): void {
    const {name} = request.body as CreateCustomer;

    const customer = CustomerService.insertCustomer(name);

    response.status(201).json(customer);
}