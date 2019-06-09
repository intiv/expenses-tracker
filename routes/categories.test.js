const request = require('supertest');
const app = require('../app/app');

describe('/api/categories', () => {

    const testCategory = {
        name: 'This is a test for post'
    }

    const emptyNameCategory = {
        name: ''
    }

    describe('GET', () => {
        test('It should get 200 status and all categories from / method', async () => {
            const response = await (await request(app)).get('/api/categories');
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
        });
    });

    describe('POST /create', () => {
        test('It should insert a test category with status 200', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: testCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toEqual(1);
            expect(response.body[response.body.length - 1].name).toEqual(testCategory.name);
        });

        test('It should not insert a category with an existing name with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create').send({category: testCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.length).toEqual(1);
        });

        test('It should not insert a category without name property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: emptyNameCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.length).toEqual(1);
        });

    });

});