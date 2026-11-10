export type User = {
	id: number;
	name: string;
	email: string;
	password: string;
	createdAt: Date;
};

export type PublicUser = Omit<User, 'password'>;

export type Customer = {
	id: number;
	name: string;
	email: string;
	imageUrl: string | null;
	createdAt: Date;
};

type InvoiceStatus = 'PENDING' | 'PAID';

export type Invoice = {
	id: number;
	amount: number;
	status: InvoiceStatus;
	date: Date;
	customerId: number;
	createdAt: Date;
};

export type Page = {
	page: number;
};

export type ValidationFieldError = {
	field: string;
	message: string;
};
