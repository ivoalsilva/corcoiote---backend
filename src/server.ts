import express from 'express';
import errorHandler from './middlewares/errorHandler.ts';
import requestLogger from './middlewares/requestLogger.ts';
import CustomerRouter from './routes/customer.route.ts';

const app = express();

app.use(requestLogger);

app.use(express.json());

app.use('/customers', CustomerRouter);

app.use(errorHandler);

app.listen(Number(process.env.PORT));
