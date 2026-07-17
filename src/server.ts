import express from 'express';

const app = express()

app.use(express.json());

app.get('/customers', (req, res) => {
    const customers = [{
        name: 'ivo',
        status: 'true'
    }, {
        name: 'arthur',
        status: 'true'
    }, {
        name: 'davi',
        status: 'false'
    }];

    res.status(200).json(customers);
});

app.listen(3000);