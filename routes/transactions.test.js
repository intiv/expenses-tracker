const request = require('supertest');
const app = require('../app/app');
const Transaction = require('../models/Transaction');

describe('/api/transactions', () => {

    beforeAll(() => {
        return Transaction.destroy({truncate: true, cascade: true});
    });

    const testTransaction = {
        quantity: '100.00',
        categoryId: 1
    }

    describe('GET /', () => {
        test('It should get all transactions with status 200', async () => {
            const response = await (await request(app)).get('/api/transactions');
            expect(response.statusCode).toBe(200);
        });
    });

    describe('POST /create/', () => {
        test('It should insert a valid transaction with status 200', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: testTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.transactions.length).toBe(1);
            console.log(response.body.transactions[0]);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });
    });
});