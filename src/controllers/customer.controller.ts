import type { Request, Response } from 'express'
import { findAllCustomer } from '../services/customer.service.ts'

export function getAllCustomers(
    _request: Request,
    response: Response) {
    const customers = findAllCustomer()
    response.status(200).json(customers);
}