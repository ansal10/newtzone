process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const assert = require('chai').assert;
const truncate = require('../truncate');
const timezoneFactory = require('../factories/timezone');
const timezoneHelper = require('../../../utilities/helpers/timezone_helper');
const userFactory = require('../factories/user');
const moment = require('moment');


describe('Timezone model', () => {
    let timezone;
    let user;

    beforeEach(async () => {
        await truncate();
        timezone = await timezoneFactory();
        user = await userFactory();
    });

    it('should do something', async () => {
        await expect(12).to.equal(12)
    });

});
