const request = require('supertest');
const app = require('../app/app');
const Transaction = require('../models/Transaction');

const moment = require('moment');

describe('/api/transactions', () => {

    beforeAll(async () => {
        await Transaction.sync({force: true});
    //     return db.query('TRUNCATE TABLE transactions RESTART IDENTITY CASCADE', {
    //         model: Transaction,
    //         mapToModel: true
    //     }).then();
    });

    const testTransaction = {
        quantity: '100.00',
        categoryId: 1,
        userId: 1
    }

    const testTransaction2 = {
        quantity: '80.00',
        categoryId: 3,
        userId: 2
    }

    const invalidPrecisionTransaction = {
        quantity: '50.567',
        categoryId: 1,
        userId: 1
    }


    const invalidQtyTransaction = {
        quantity: '0',
        categoryId: 1,
        userId: 1
    }

    const invalidCatTransaction = {
        quantity: '20.00',
        categoryId: 2,
        userId: 1
    }

    const noCatTransaction = {
        quantity: '50.00',
        userId: 1
    }

    describe('POST /create/', () => {
        test('It should insert a valid transaction with status 200', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: testTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.transactions.length).toBe(1);
            //console.log(response.body.transactions[0]);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });

        test('It should insert a transaction with incorrect precision by rounding to 2 with status 200', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: invalidPrecisionTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.transactions.length).toBe(2);
            invalidPrecisionTransaction.quantity = parseFloat(invalidPrecisionTransaction.quantity).toFixed(2).toString();
            expect(response.body.transactions[1]).toMatchObject(invalidPrecisionTransaction);
        });

        test('It should insert a transaction for a different user with status 200', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: testTransaction2}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.transactions.length).toBe(3);
            expect(response.body.transactions[2]).toMatchObject(testTransaction2);
        });

        test('It shouldnt insert a transaction with quantity lower than 0.01 with status 500', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: invalidQtyTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.transactions.length).toBe(3);
            expect(response.body).not.toHaveProperty('user');
            expect(response.body).toHaveProperty('errorMessage');
        });

        test('It shouldnt insert a transaction with a non-existent category id with status 500', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: invalidCatTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.transactions.length).toBe(3);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });

        test('It shouldnt insert a transaction without a category id with status 500', async () => {
            const response = await (await request(app)).post('/api/transactions/create/').send({transaction: noCatTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.transactions.length).toBe(3);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });

    });

    describe('GET /', () => {
        test('It should get all transactions with status 200', async () => {
            const response = await (await request(app)).get(`/api/transactions?userId=${testTransaction.userId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('transactions');
            expect(response.body.transactions).toBeDefined();
            expect(response.body.transactions.length).toBe(2);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });

        test('It should get only this month\'s transactions for user 1 with status 200', async () => {
            const month = moment().month();
            const beginDate = moment().month(month).date(1).format('YYYY-MM-DD');
            const endDate = moment().month(month+1).date(1).format('YYYY-MM-DD');
            
            const response = await (await request(app)).get(`/api/transactions/monthly?beginDate=${beginDate}&endDate=${endDate}&userId=${testTransaction.userId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('transactions');
            expect(response.body.transactions).toBeDefined();
            expect(response.body.transactions.length).not.toBe(0);
            expect(response.body.transactions[0]).toMatchObject(testTransaction);
        });

        test('It should get only this month\'s transactions for user 2 with status 200', async () => {
            const month = moment().month();
            const beginDate = moment().month(month).date(1).format('YYYY-MM-DD');
            const endDate = moment().month(month+1).date(1).format('YYYY-MM-DD');
            
            const response = await (await request(app)).get(`/api/transactions/monthly?beginDate=${beginDate}&endDate=${endDate}&userId=${testTransaction2.userId}`);
            //expect(response.statusCode)
        });

        test('It should not get any transactions with invalid time frame with status 200', async () => {
            let month = moment().month();
            const beginDate = moment().month(month+2).date(1).format('YYYY-MM-DD');
            const endDate = moment().month(month+3).date(1).format('YYYY-MM-DD');
            const response = await (await request(app)).get(`/api/transactions/monthly?beginDate=${beginDate}&endDate=${endDate}&userId=${testTransaction.userId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('transactions');
            expect(response.body.transactions).toBeDefined();
            expect(response.body.transactions.length).toBe(0);
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
            invalidPrecisionTransaction.id = 4;
            const response = await (await request(app)).delete('/api/transactions/delete').send({transaction: invalidPrecisionTransaction}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.transactions.length).toBe(1);
        });
    });


});