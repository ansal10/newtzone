const faker = require('faker');
const sha256 = require('sha256');
const _ = require('underscore');
const moment = require('moment');
module.exports = {
    up: async (queryInterface, Sequelize) => {

        let Users = [
            {
                name: 'Prashant Admin',
                email: 'inboxpk22@gmail.com',
                emailAttributes: JSON.stringify({
                    verified: true
                }),
                passwordAttributes: JSON.stringify({
                    salt: '1234',
                    hash: sha256('pass1234' + '1234')
                }),
                role: 'admin',
                status: 'active',
                sex: 'male',
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
            },
            {
                name: 'Prashant Manager',
                email: 'inbox.pk22@gmail.com',
                emailAttributes: JSON.stringify({
                    verified: true
                }),
                passwordAttributes: JSON.stringify({
                    salt: '1234',
                    hash: sha256('pass1234' + '1234')
                }),
                role: 'manager',
                status: 'active',
                sex: 'male',
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
            },
            {
                name: 'Prashant Consumer',
                email: 'inboxpk.22@gmail.com',
                emailAttributes: JSON.stringify({
                    verified: true
                }),
                passwordAttributes: JSON.stringify({
                    salt: '1234',
                    hash: sha256('pass1234' + '1234')
                }),
                role: 'consumer',
                status: 'active',
                sex: 'male',
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
            }
        ];

        for (let i = 0; i < 100; i++) {
            Users.push({
                name: faker.name.findName(),
                email: faker.internet.email(),
                emailAttributes: JSON.stringify({
                    verified: true
                }),
                passwordAttributes: JSON.stringify({
                    salt: '1234',
                    hash: sha256('pass1234' + '1234')
                }),
                role: _.sample(['admin', 'consumer', 'manager']),
                status: _.sample(['active', 'inactive']),
                sex: _.sample(['male', 'female', 'other']),
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
            })
        }
        try {
            return await queryInterface.bulkInsert('Users', Users, {});
        }catch (e) {
            console.error(e);
        }
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
