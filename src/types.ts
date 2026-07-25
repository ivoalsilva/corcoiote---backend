export type Customer = {
    id: number;
    name: string;
    status: boolean;
}

export type CreateCustomer = Omit<Customer, 'id' | 'status'>;