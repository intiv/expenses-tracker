const request = require('supertest');
const app = require('../app/app');
const Category = require('../models/Category');

describe('/api/categories', () => {

    beforeAll(() => {
        return Category.destroy({where: {}, truncate: true});
    });

    const testCategory = {
        name: 'Medical supplies'
    }

    const emptyNameCategory = {
        name: ''
    }

    const noNameCategory = {

    }

    const nonExistingCategory = {
        name: 'Food'
    }

    describe('GET /', () => {
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

        test('It should not insert a category with empty name property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: emptyNameCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.length).toEqual(1);
        });

        test('It should not insert a category without name property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: noNameCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.length).toEqual(1);
        });

    });

    describe('DELETE /', () => {
        test('It should not delete category if none match with status 500', async () => {
            const response = await (await request(app)).delete('/api/categories/delete').send({category: nonExistingCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.length).toEqual(1);
        });

        test('It should delete 1 matching category with status 200', async () => {
            const response = await (await request(app)).delete('/api/categories/delete').send({category: testCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toEqual(0);
        });

        
    });


});