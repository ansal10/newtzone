'use strict';
const models = require('../models/index');
const _ = require('underscore');
const util = require('util');
const moment = require('moment');
const faker = require('faker');

const randomInteger = (min, max) => {
    let r = Math.random() * (max - min) + min;
    r = parseFloat(Number(r).toFixed(0));
    return r;
};

module.exports = {
    up: async (queryInterface, Sequelize) => {

        const users = await models.User.findAll();

        let timezones = [];
        for (let i = 0; i < 2000; i++) {
            let d = moment().add(Math.random()*10000 - 5000, 'minutes');
            let data = {
                "createdAt": d.toISOString(),
                'updatedAt': d.toISOString(),
                GMTDifference: randomInteger(-64, 64)*15,
                name: faker.company.companyName(),
                city: faker.address.city(),
                UserId: _.sample(users).id,
            };
            timezones.push(data);
        }

        try {
         return await models.Timezone.bulkCreate(timezones);
        }catch (e) {
            console.error(e);
        }
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Timezones', null, {});
    }
};
