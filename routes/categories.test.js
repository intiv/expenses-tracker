const request = require('supertest');
const app = require('../app/app');
const Category = require('../models/Category');

describe('/api/categories', () => {

    beforeAll(() => {
        return Category.destroy({where: {}, truncate: true});
    });

    const testCategory = {
        name: 'Medical supplies',
        type: 'Expense'
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
            expect(response.body.length).toEqual(1);
            const retCategory = response.body[response.body.length - 1];
            expect(retCategory.name).toEqual(testCategory.name);
            expect(retCategory.type).toEqual(testCategory.type);

        });

        test('It should insert a category with a valid name but no type, setting it to Expense by default with status 200', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: testCategory2}).set('Content-Type', 'application/json');
            expect(response.body.length).toEqual(2);
            const retCategory = response.body[response.body.length - 1];
            expect(retCategory.name).toEqual(testCategory2.name);
            expect(retCategory.type).toEqual('Expense');
        });

        test('It should not insert a category with an existing name with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create').send({category: testCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.length).toEqual(2);
        });

        test('It should not insert a category with empty name property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: emptyNameCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.length).toEqual(2);
        });

        test('It should not insert a category without name property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: noNameCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.length).toEqual(2);
        });

    });

    describe('GET /', () => {
        test('It should get all categories with status 200', async () => {
            const response = await (await request(app)).get('/api/categories');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0]).toMatchObject(testCategory);
            expect(response.body[1]).toMatchObject({...testCategory2, type: 'Expense'});
        });
    });

    describe('DELETE /', () => {
        test('It should not delete category if none match with status 500', async () => {
            const response = await (await request(app)).delete('/api/categories/delete').send({category: nonExistingCategory}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.length).toEqual(2);
            expect(response.body[0]).toMatchObject(testCategory);
            expect(response.body[1]).toMatchObject({...testCategory2, type: 'Expense'});
        });

        test('It should delete 1 matching category with status 200', async () => {
            const response = await (await request(app)).delete('/api/categories/delete').send({category: testCategory2}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toEqual(1);
            expect(response.body[0]).toMatchObject(testCategory);
        });

        
    });


});