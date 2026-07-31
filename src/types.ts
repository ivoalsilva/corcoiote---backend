export type Customer = {
    id: number;
    name: string;
    status: boolean;
}

export type CreateCustomer = Pick<Customer, 'name'>;
export type updateCustomerCustomer = Omit<Customer, 'id'>;