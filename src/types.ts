export type Customer = {
    id: number;
    name: string;
    email: string;
    imageUrl: string | null;
    createdAt: Date;
}

export type ValidationFielError = {
    fiel: string;
    message: string;
}
