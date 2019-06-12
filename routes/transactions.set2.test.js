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

    const invalidQtyTransaction = {
        quantity: '50.567',
        categoryId: 1
    }

    const invalidCatTransaction = {
        quantity: '20.00',
        categoryId: 2
    }

    const noCatTransaction = {
        quantity: '50.00'
    }

    describe('POST /create/', () => {
        test('It should insert a valid transaction with status 200', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: testTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.transactions.length).toBe(1);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });

        test('It should insert a transaction with incorrect precision by rounding to 2 with status 200', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: invalidQtyTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.transactions.length).toBe(2);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });

        test('It shouldnt insert a transaction with a non-existent category id with status 500', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: invalidCatTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.transactions.length).toBe(2);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });

        test('It shouldnt insert a transaction without a category id with status 500', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: noCatTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.transactions.length).toBe(2);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });

    });

    describe('GET /', () => {
        test('It should get all transactions with status 200', async () => {
            const response = await (await request(app)).get('/api/transactions');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('transactions');
            expect(response.body.transactions).toBeDefined();
            expect(response.body.transactions.length).toBe(2);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });
    });

    describe('DELETE /delete/', () => {
        test('It should delete 1 transaction with matching id with status 200', async () => {
            testTransaction.id = 1;
            const response = await (await request(app)).delete('/api/transactions/delete').send({transaction: testTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.transactions.length).toBe(1);
            expect(response.body.transactions[0]).not.toMatchObject(testTransaction);
        });

        test('It shouldnt delete a transaction if none match the id with status 500', async () => {
            invalidQtyTransaction.id = 4;
            const response = await (await request(app)).delete('/api/transactions/delete').send({transaction: invalidQtyTransaction}).set('Content-Type', 'application/json');
            console.log(response.body.transactions);

            expect(response.statusCode).toBe(500);
            expect(response.body.transactions.length).toBe(1);
        });
    });


});