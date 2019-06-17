const request = require('supertest');
const app = require('../app/app');

const Category = require('../models/Category');

describe('/api/categories', () => {
    let user;
    let testCategories = [];
    beforeAll(async () => {
        await Category.sync({force: true});
        let res = await (await request(app)).get('/api/users?username=intiv');
        user = res.body.user;
        testCategories = [ {
            name: 'Medical supplies',
            type: 'Income',
            userId: 1
        },
        {
            name: 'Coffee',
            userId: 1
        },
        {
            name: '',
            userId: 1
        },
        {
            userId: 1
        },
        {
            name: 'Food',
            userId: 1
        },
        {
            name: 'Coffee',
            userId: 2
        }];
    });


    

    describe('POST /create', () => {
        test('It should insert a test category with status 200', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: testCategories[0]}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.categories.length).toEqual(1);
            expect(response.body.categories[0]).toMatchObject(testCategories[0]);
        });

        test('It should insert a category with a valid name but no type, setting it to Expense by default with status 200', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: testCategories[1]}).set('Content-Type', 'application/json');
            expect(response.body.categories.length).toEqual(2);
            expect(response.body.categories[1]).toMatchObject(testCategories[1]);
        });

        test('It should not insert a category with an existing name and equal userId with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create').send({category: testCategories[0]}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);
        });

        test('It should not insert a category with empty name property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: testCategories[2]}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);
        });

        test('It should not insert a category with an invalid type property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: {...testCategories[4], type: 'Owed'}}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);

        });

        test('It should not insert a category without name property with status 500', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: testCategories[3]}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);
        });

        test('It should insert a category for a different user with status 200', async () => {
            const response = await (await request(app)).post('/api/categories/create/').send({category: testCategories[5]}).set('Content-Type', 'application/json');
            
            expect(response.statusCode).toBe(200);
            expect(response.body.categories.length).toEqual(1);
            expect(response.body.categories[0]).toMatchObject(testCategories[5]);
        });

    });

    describe('GET /', () => {
        test('It should get a user\'s categories with status 200', async () => {
            const response = await (await request(app)).get('/api/categories?userId=1');
            expect(response.statusCode).toBe(200);
            expect(response.body.categories.length).toBe(2);
            expect(response.body.categories[0]).toMatchObject(testCategories[0]);
            expect(response.body.categories[1]).toMatchObject({...testCategories[1], type: 'Expense'});
        });

        test('It should get a category from a valid id with status 200', async () => {
            const response = await (await request(app)).get(`/api/categories/find/id?id=1`);
            expect(response.statusCode).toBe(200);
            expect(response.body.category).toBeDefined();
            expect(response.body.category).toMatchObject(testCategories[0]);
        });

        test('It should get a category by name for one user with status 200', async () => {
            const response = await (await request(app)).get(`/api/categories/find/name?name=coffee&userId=2`);
            expect(response.statusCode).toBe(200);
            expect(response.body.category).toBeDefined();
            expect(response.body.category).toMatchObject(testCategories[5]);
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
        test('It should not delete a category if none match with status 500', async () => {
            const response = await (await request(app)).delete('/api/categories/delete').send({category: testCategories[4]}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body.categories.length).toEqual(2);
            expect(response.body.categories[0]).toMatchObject(testCategories[0]);
            expect(response.body.categories[1]).toMatchObject({...testCategories[1], type: 'Expense'});
        });

        test('It should delete 1 matching category with status 200', async () => {
            const response = await (await request(app)).delete('/api/categories/delete').send({category: testCategories[1]}).set('Content-Type', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.categories.length).toEqual(1);
            expect(response.body.categories[0]).toMatchObject(testCategories[0]);
        });

        
    });


});