const request = require('supertest');
const app = require('../app/app');

const User = require('../models/User');
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
        await User.sync({force: true});
        return await db.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE', {
            model: User,
            mapToModel: true
        });
    });

    const testUser = {
        username: 'intiv',
        phone: '+50498927461'
    }

    const testUser2 = {
        username: 'rgaldamez'
    }

    const noUsernameUser = {
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

        test('It should create a user without a phone number with status 200', async () => {
            const response = await (await request(app)).post('/api/users/create/').send({
                user: testUser2
            }).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toBeDefined();
            expect(response.body.user.phone).toBeNull();
            expect(response.body.user).toMatchObject(testUser2);
        }); 
        
        test('It should\'t create a user without a username with status 500', async () => {
            const response = await (await request(app)).post('/api/users/create/').send({
                user: testUser2
            }).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body).not.toHaveProperty('user');
            expect(response.body).toHaveProperty('errorMessage');
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