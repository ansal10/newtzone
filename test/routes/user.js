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
const controllerMiddleware = require('../../utilities/controller_middlewares');
let server = require('../../app');
const sinon = require('sinon');
const hashlib = require('hash.js');

chai.use(chaiHttp);

describe('Users', async () => {

    let defaultUser = {
        email: 'jonasdick@gmail.com',
        name: 'Jon dick',
        password: 'test1234',
        sex: 'male',
        role: 'consumer',
        status: 'active'
    };

    beforeEach(async () => {
        await truncate();
    });


    describe('/signup user', () => {
        it('it should signup user successfull user', async () => {
            let user = {
                email: 'jonasdick@gmail.com',
                name: 'Jon dick',
                password: 'test1234',
                sex: 'male',
                role: 'consumer',
                status: 'active'
            };
            let res = await chai.request(server)
                .post('/api/v1/user/signup')
                .send(user);

            let u = await models.User.findOne({where: {email: user.email}});
            res.should.have.status(201);
            assert(u.emailAttributes.verified !== true);
        });

        it('it should not signup duplicate user', async () => {
            let user = {
                email: 'jonasdick@gmail.com',
                name: 'Jon dick',
                password: 'test1234',
                sex: 'male',
                role: 'consumer',
                status: 'active'
            };
            await userHelper.createUserInDatabase(user);

            let res = await chai.request(server)
                .post('/api/v1/user/signup')
                .send(user);

            res.should.have.status(400)
        });

        it('should throw meaning full error message', async () => {
            let user = {
                email: 'thi@gmail.com',
                name: 'Don',
                password: 'Sed',
                sex: 'male',
                role: 'consumer',
                status: 'active',
            };

            let retVal = await userHelper.createUserInDatabase(user);
            assert(retVal.status === true)

        });

    });

    describe('/login user', () => {
        it('should logged in for true user', async () => {
            let user = {
                email: 'jonasdick@gmail.com',
                name: 'Jon dick',
                password: 'test1234',
                sex: 'male',
                role: 'consumer',
                status: 'active'
            };
            let retVal = await userHelper.createUserInDatabase(user);
            let u = retVal.args.user;
            u.emailAttributes = Object.assign({}, u.emailAttributes, {verified: true});
            await u.save();

            let res = await chai.request(server)
                .post('/api/v1/user/login')
                .send(user);
            res.should.have.status(200)
        });

        it('should not logged in for invalid user', async () => {
            let user = {
                email: 'jonasdick@gmail.com',
                password: 'test1234',
            };
            let res = await chai.request(server)
                .post('/api/v1/user/login')
                .send(user);
            res.should.have.status(400)
        });

        it('should not logged in for invalid password', async () => {
            let user = {
                email: 'jonasdick@gmail.com',
                name: 'Jon dick',
                password: 'test1234',
                sex: 'male',
                role: 'consumer',
                status: 'active'
            };
            await userHelper.createUserInDatabase(user);
            let res = await chai.request(server)
                .post('/api/v1/user/login')
                .send({email: user.email, password: 'hello'});
            res.should.have.status(400)
        });
    });

    describe('/verify_email user', () => {
        it('should verify email with correct token', async () => {
            let retVal = await userHelper.createUserInDatabase(defaultUser);
            let res = await chai.request(server)
                .get('/api/v1/user/verify_email')
                .query({email: retVal.args.user.email, emailToken: retVal.args.user.emailAttributes.token});

            res.should.have.status(200);
        });

        it('should not verify email with wrong token', async () => {
            let retVal = await userHelper.createUserInDatabase(defaultUser);
            let res = await chai.request(server)
                .get('/api/v1/user/verify_email')
                .query({email: retVal.args.user.email, emailToken: retVal.args.user.emailAttributes.token + '-'});

            res.should.have.status(400);
        });

        it('should not verify email with expired token', async () => {
            let retVal = await userHelper.createUserInDatabase(defaultUser);
            let user = retVal.args.user;
            let emailAttributes = Object.assign({}, user.emailAttributes, {expired: moment().add(-1, 'hour').toISOString()});
            user.emailAttributes = emailAttributes;
            await user.save();

            let res = await chai.request(server)
                .get('/api/v1/user/verify_email')
                .query({email: retVal.args.user.email, emailToken: retVal.args.user.emailAttributes.token});

            res.should.have.status(400);
        });
    });

    describe('/password_reset user', () => {
        it('should reset password with correct token', async () => {
            await userHelper.createUserInDatabase(defaultUser);
            let retVal = await userHelper.resendPasswordResetToken(defaultUser.email);
            expect(retVal.status).to.be.equal(true);

            let user = retVal.args.user;

            let res = await chai.request(server)
                .post('/api/v1/user/password_reset')
                .send({email: user.email, password: '123456', passwordToken: user.passwordAttributes.token});
            res.should.have.status(200);

        });
    });

});