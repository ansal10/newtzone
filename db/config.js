
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
	    username: 'root',
	    password: null,
	    database: 'timezones_prod',
	    host: '127.0.0.1',
	    dialect: 'postgres'
    }
};
