'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Timezones', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull:false
            },
            city: {
                type: Sequelize.STRING,
                allowNull:false
            },
            GMTDifference: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            UserId:{
                type: Sequelize.INTEGER,
                references:{
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }).then( async () =>{
	        await queryInterface.addIndex('Timezones', ['name'], {name: 'Timezones_name_index'});
	        await queryInterface.addIndex('Timezones', ['city'], {name: 'Timezones_city_index'});
	        await queryInterface.addIndex('Timezones', ['GMTDifference'], {name: 'Timezones_GMTDifference_index'});
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Timezones').then( async () =>{
	        await queryInterface.removeIndex('Timezones', 'Timezones_name_index');
	        await queryInterface.removeIndex('Timezones', 'Timezones_city_index');
	        await queryInterface.removeIndex('Timezones', 'Timezones_GMTDifference_index');
        });
    }
};
