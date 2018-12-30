process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = require('chai').assert;
const should = chai.should();
const userFactory = require('../db/factories/user');
const truncate = require('../db/truncate');
const userHelper = require('../../utilities/helpers/user_helper');
const moment = require('moment');
const models = require('../../db/models/index');
const hashlib = require('hash.js');
const sinon = require('sinon');
const controllerMiddleware = require('../../utilities/controller_middlewares');
let server = require('../../app');
const session = require( "express-session" );
const request = require('supertest');
const sha256 = require('sha256');

chai.use(chaiHttp);

const authenticatedUser = request.agent(server);
const consumerAuthenticatedUser = request.agent(server);
const managerAuthenticatedUser = request.agent(server);


describe('Users', async () => {
    let defaultUser = {
        email: 'jonasdick@gmail.com',
        name: 'Jon dick',
        password: 'test1234',
        sex: 'male',
        role: 'consumer',
        status: 'active'
    };

    let user = null ;
    let consumerUser = null;
    let managerUser = null;


    beforeEach(async () => {
        await truncate();

        user = await userFactory({
            emailAttributes: { verified: true},
            passwordAttributes: {salt: '1234', hash: sha256('1234'+ '1234')},
            role: 'admin'
        });
        consumerUser = await userFactory({
            emailAttributes: { verified: true},
            passwordAttributes: {salt: '1234', hash: sha256('1234'+ '1234')},
            role: 'consumer'
        });

        let res = await authenticatedUser
            .post('/api/v1/user/login')
            .send({"email": user.email, "password": "1234"});
        await consumerAuthenticatedUser.post('/api/v1/user/login').send({email: consumerUser.email, password: '1234'});


        res.status
    });

    afterEach(async () =>{

    });

    describe('/:id PUT update user details', async ()=>{
        it('should update user details', async () => {
            let res = await authenticatedUser
                .put('/api/v1/user/'+user.id)
                .send({sex:'male', status: user.status});
            res.should.have.status(200);
        });

    })


});
