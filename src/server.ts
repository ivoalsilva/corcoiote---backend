import express from 'express';
import customerRouter from './routes/customer.route.ts';
import requestLogger from './middlewares/requestLogger.ts';
import errorHandler from './middlewares/errorHandler.ts';

const app = express()

app.use(express.json());

app.use('/customers' , customerRouter);

app.use(errorHandler);

app.listen(3000);