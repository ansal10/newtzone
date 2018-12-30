
module.exports = {
    development: {
        username: 'postgres',
        password: null,
        database: 'timezones',
        host: '127.0.0.1',
        dialect: 'postgres'
    },
    test: {
	    username: 'postgres',
	    password: null,
	    database: 'timezones_test',
	    host: '127.0.0.1',
	    dialect: 'postgres'
    },
    production:{
        username: 'postgres',
        password: null,
        database: 'timezones',
        host: '127.0.0.1',
        dialect: 'postgres'
    }
};
