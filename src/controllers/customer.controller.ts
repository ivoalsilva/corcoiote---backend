import type { Request, Response } from 'express'
import * as CustomerService from '../services/customer.service.ts'

export function getAllCustomers(
    _request: Request,
    response: Response) {
    const customers = CustomerService.findAllCustomer()
    response.status(200).json(customers);
}

export function getById(request: Request , response: Response): void {
    const id = Number(request.params.id);

    const customer = CustomerService.findCustumerById(id);

    response.status(200).json(customer);
}