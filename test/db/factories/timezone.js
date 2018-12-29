const faker = require('faker');
const models = require('../../../db/models/index');
const moment = require('moment');
const _ = require('underscore');
/**
 * Generate an object which container attributes needed
 * to successfully create a user instance.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       An object to build the user from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        name: faker.name.firstName() + faker.name.firstName(),
        city: faker.address.city(),
        GMTDifference: randomInteger(-64, 64)*15 ,
    };
    return Object.assign({}, defaultProps, props);
};

const randomInteger = (min, max) => {
    let r = Math.random() * (max - min) + min;
    r = parseFloat(Number(r).toFixed(0));
    return r;
};

/**
 * Generates a user instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       A user instance
 */
module.exports = async (props = {}) =>
    models.Timezone.create(await data(props));