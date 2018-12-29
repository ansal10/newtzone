process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = require('chai').assert;
const should = chai.should();
const truncate = require('../db/truncate');
const moment = require('moment');
const faker = require('faker');
const timezoneFactory = require('../db/factories/timezone');
const userFactory = require('../db/factories/user');
const hashlib = require('hash.js');
const sinon = require('sinon');
const controllerMiddleware = require('../../utilities/controller_middlewares');
const models = require('../../db/models/index');
const server = require('../../app');
const request = require('supertest');
const _ = require('underscore');
const sha256 = require('sha256');

chai.use(chaiHttp);

describe('Timezones', async () => {

    const users = await models.User.findAll();
    let defaultTimeZoneParams = {
        name: faker.name.findName() + faker.name.findName(),
        city: faker.address.city(),
        GMTDifference: 120,
        UserId: _.sample(users).id,
    };
    let user = null;
    const authenticatedUser = request.agent(server);

    beforeEach(async () => {
        await truncate();
        user = await userFactory({
            emailAttributes: { verified: true},
            passwordAttributes: {salt: '1234', hash: sha256('1234'+ '1234')},
            role: 'admin'
        });
        let res = await await authenticatedUser
            .post('/api/v1/user/login')
            .send({"email": user.email, "password": "1234"});

    });

    describe('/search POST Search timezones', async () => {

        it('it should return all timezones of user successful', async () => {
            await timezoneFactory({UserId: user.id});
            await timezoneFactory({UserId: user.id});
            let res = await authenticatedUser
                .post('/api/v1/timezone/search')
                .send({});
            res.should.have.status(200);
            assert(res.body.success.data.length === 2);
        });
        it('it should return no property', async () => {
            let res = await authenticatedUser
                .post('/api/v1/timezone/search');
            res.should.have.status(200);
            assert(res.body.success.data.length === 0);
        });

        it('should search timezones for admin', async () => {
            let u1 = await userFactory({role: 'consumer'});
            let u2 = await userFactory({role: 'consumer'});
            await timezoneFactory({UserId: u1.id});
            await timezoneFactory({UserId: u2.id});

            let res = await authenticatedUser
                .post('/api/v1/timezone/search');
            let body = res.body;
            res.should.have.status(200);
        });
    });

    describe('/ POST Timezone', async () => {
        it('should create timezone with successfull parameters', async() => {
            let res = await authenticatedUser.post('/api/v1/timezone').send(defaultTimeZoneParams);
            res.should.have.status(201);
            if(res.body.error)
                console.log(res.body.error.message);

        });
    });

    describe('/:id DELETE', async () => {
        it('should delete the record successfully', async () => {
            let h = await timezoneFactory();
            let res = await authenticatedUser
                .delete('/api/v1/timezone/'+h.id);
            res.should.have.status(200);
            expect( (await models.Timezone.findOne({where:{id: h.id}})) == null)
        });

        it('should not delete the record successfully', async () => {
            let h = await timezoneFactory();
            let res = await authenticatedUser
                .delete('/api/v1/timezone/'+(h.id +1));
            res.should.have.status(400);
            expect( (await models.Timezone.findOne({where:{id: h.id}})) != null)
        });
    });

    describe('/:id PUT', async () => {
        it('should update the record successfully', async () => {
            let h = await timezoneFactory();
            let res = await authenticatedUser
                .put('/api/v1/timezone/'+h.id)
                .send({GMTDifference:150});
            res.should.have.status(200);
            let h2 = await models.Timezone.findOne({where:{id: h.id}});
            expect(h2.GMTDifference === 150)

        });

        it('should not update the record successfully', async () => {
            let h = await timezoneFactory();
            let res = await authenticatedUser
                .put('/api/v1/timezone/'+(h.id +1));
            res.should.have.status(400);
            expect( (await models.Timezone.findOne({where:{id: h.id}})).GMTDifference === h.GMTDifference)
        });
    });
});
