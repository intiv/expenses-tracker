const request = require('supertest');
const app = require('../app/app');
const Category = require('../models/Category');
const db = require('../db/db');

describe('/api/categories', () => {

    beforeAll(() => {
        return db.query('TRUNCATE TABLE categories RESTART IDENTITY CASCADE', {
            model: Category,
            mapToModel: true
        }).then();
    });

    const testCategory = {
        name: 'Medical supplies',
        type: 'Income'
    }

    let testCategory2 = {
        name: 'Coffee'
    }

    const emptyNameCategory = {
        name: ''
    }

    const noNameCategory = {

    }

    const nonExistingCategory = {
        name: 'Food'
    }

    

    describe('POST /create', () => {
        test('It should insert a test category with status 200', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: testCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.categories.length).toEqual(1);
            const retCategory = response.body.categories[0];
            expect(retCategory.name).toEqual(testCategory.name);
            expect(retCategory.type).toEqual(testCategory.type);

        });

        test('It should insert a category with a valid name but no type, setting it to Expense by default with status 200', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: testCategory2}).set('Content-Type', 'application/json');
            expect(response.body.categories.length).toEqual(2);
            const retCategory = response.body.categories[1];
            expect(retCategory.name).toEqual(testCategory2.name);
            expect(retCategory.type).toEqual('Expense');
        });

        test('It should not insert a category with an existing name with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create').send({category: testCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);
        });

        test('It should not insert a category with empty name property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: emptyNameCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);
        });

        test('It should not insert a category with an invalid type property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: {...nonExistingCategory, type: 'Owed'}}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);

        });

        test('It should not insert a category without name property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: noNameCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);
        });

    });

    describe('GET /', () => {
        test('It should get all categories with status 200', async () => {
            const response = await (await request(app)).get('/api/categories');
            expect(response.statusCode).toBe(200);
            expect(response.body.categories.length).toBe(2);
            expect(response.body.categories[0]).toMatchObject(testCategory);
            expect(response.body.categories[1]).toMatchObject({...testCategory2, type: 'Expense'});
        });

        test('It should get a category from a valid id with status 200', async () => {
            const response = await (await request(app)).get(`/api/categories/find/id?id=1`);
            expect(response.statusCode).toBe(200);
            expect(response.body.category).toBeDefined();
            expect(response.body.category).toMatchObject(testCategory);
        });

        test('It shouldn\'t get a category from a non-existent id with status 500', async () => {
            const response = await (await request(app)).get(`/api/categories/find/id?id=1756`);
            expect(response.statusCode).toBe(500);
            expect(response.body).not.toHaveProperty('category');
            expect(response.body).toHaveProperty('errorMessage');
            expect(response.body.errorMessage).toBeDefined();
        });
    });

    describe('DELETE /', () => {
        test('It should not delete category if none match with status 500', async () => {
            const response = await (await request(app)).delete('/api/categories/delete').send({category: nonExistingCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);
            expect(response.body.categories[0]).toMatchObject(testCategory);
            expect(response.body.categories[1]).toMatchObject({...testCategory2, type: 'Expense'});
        });

        test('It should delete 1 matching category with status 200', async () => {
            const response = await (await request(app)).delete('/api/categories/delete').send({category: testCategory2}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.categories.length).toEqual(1);
            expect(response.body.categories[0]).toMatchObject(testCategory);
        });

        
    });


});