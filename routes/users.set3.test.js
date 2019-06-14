const request = require('supertest');
const app = require('../app/app');

const User = require('../models/User');

describe('/api/users', () => {

    beforeAll(() => {
        return User.destroy({truncate: true, cascade: true});
    })

    describe('POST /create/', () => {

    });
});