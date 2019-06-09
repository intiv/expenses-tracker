const request = require('supertest');
const app = require('../app/app');
const router = require('./categories');

describe('/api/categories tests', () => {
    test('It should get 200 status from GET method', async () => {
        const response = await (await request(app)).get('/api/categories');
        return expect(response.statusCode).toBe(200);
    });
});