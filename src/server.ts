import express from 'express';
import customerRouter from './routes/customer.route.ts';

const app = express()

app.use(express.json());

app.use('/customers' , customerRouter);

app.listen(3000);