import express from "express";
import errorHandler from "./middlewares/errorHandler.ts";
import requestLogger from "./middlewares/requestLogger.ts";
import CustomerRouter from "./routes/customer.route.ts";
import InvoiceRouter from "./routes/invoice.route.ts";

const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(requestLogger);

app.use(express.json());

app.use("/customers", CustomerRouter);
app.use("/invoices", InvoiceRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
