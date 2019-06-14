const request = require('supertest');
const app = require('../app/app');

const User = require('../models/User');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const db = require('../db/db');

describe('/api/users', () => {

    beforeAll(async () => {
    //     await db.query('TRUNCATE TABLE transactions RESTART IDENTITY CASCADE', {
    //         model: Transaction,
    //         mapToModel: true
    //     });
    //     await db.query('TRUNCATE TABLE categories RESTART IDENTITY CASCADE', {
    //         model: Category,
    //         mapToModel: true
    //     });
        return await db.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE', {
            model: User,
            mapToModel: true
        });
    });

    const testUser = {
        username: 'intiv',
        phone: '+50498927461'
    }

    describe('POST /create/', () => {
        test('It should create a valid user with status 200', async () => {
            const response = await (await request(app)).post('/api/users/create/').send({
                user: testUser
            }).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toBeDefined();
            expect(response.body.user).toMatchObject(testUser);
        });
        
    });

    describe('GET /', () => {
        test('It should get an existing user by its username with status 200', async () => {
            const response = await (await request(app)).get(`/api/users?username=${testUser.username}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toBeDefined();
            expect(response.body.user).toMatchObject(testUser);
        });
    })
});