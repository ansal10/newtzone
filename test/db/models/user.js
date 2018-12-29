process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const assert = require('chai').assert;
const truncate = require('../truncate');
const models = require('../../../db/models/index');
const userFactory = require('../factories/user');
const timezoneFactory = require('../factories/timezone');
const userHelper = require('../../../utilities/helpers/user_helper');

describe('User model', () => {
    let user, timezone;
    beforeEach(async () => {
        await truncate();
    });

    it('should allow manager to assign timezone', async () => {
        user = await userFactory();
        console.log("user id is " + user.id);
        let h2 = await timezoneFactory();``
        h2.UserId= user.id;
        await h2.save();
        let timezones = await models.Timezone.findAll({include:[{model:models.User}]});
        console.log(timezones)
    });

    it('should check update user details', async () => {
        let user = {
            email: 'johndick@gmail.com',
            password: 'john1234',
            name: 'John Dick',
            sex: 'male',
            role: 'consumer',
            status: 'active'
        };
        await userHelper.createUserInDatabase(user);
        let u = await models.User.findOne({where: {email: user.email}});
        assert(u.emailAttributes.verified === false);
        assert(u.status === 'active');

        await models.User.update({status: 'inactive'}, {where: {id: u.id}});
        u = await models.User.findOne({where: {email: user.email}});
        assert(u.emailAttributes.verified === false);
        assert(u.status === 'inactive');

    });

    it('should validates models while updating', async function () {
        let user = {
            email: 'johndick@gmail.com',
            password: 'john1234',
            name: 'John Dick',
            sex: 'male',
            role: 'consumer',
            status: 'active'
        };
        let retVal = await userHelper.createUserInDatabase(user);
        assert(retVal.status===true);
        try{
            let u = await models.User.findOne({where:{email: user.email}});
            Object.assign(u, u, {role:'admhuin', email:'ansadasdasd@gmail.com'});
            // let x = await u.validate({skip:['email'], fields:['role', 'sex', 'status']});
            let x = await u.validate();
            console.log(x);
            await u.save();

        }catch (e) {
            console.log(e.errors[0].message);
        }
    });

    it('should order users based on id desc', async () => {
        await userFactory();
        await userFactory();
        await userFactory();
        await userFactory();
        await userFactory();
        let users = await models.User.findAll({where:{}, order:[ ['id', 'DESC'] ]});
        expect(users[0].id > users[users.length -1].id)
    });

    it('should order users based on id asc', async () => {
        await userFactory();
        await userFactory();
        await userFactory();
        await userFactory();
        await userFactory();
        let users = await models.User.findAll({where:{} });
        expect(users[0].id  < users[users.length -1].id)
    });

});