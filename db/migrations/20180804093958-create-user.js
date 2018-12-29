'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,

            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,

            },
            emailAttributes: {              // token, created, expired, updated, verified
                type: Sequelize.JSONB,
                defaultValue: {}
            },
            passwordAttributes: {           // token, created, expired, updated, hash, salt
                type: Sequelize.JSONB,
                defaultValue: {}
            },
            role: {
                type: Sequelize.ENUM('admin', 'consumer', 'manager'),
                defaultValue: 'consumer'
            },
            status: {
                type: Sequelize.ENUM('active', 'inactive'),
                defaultValue: 'active'
            },
            sex: {
                type: Sequelize.ENUM('male', 'female', 'other')
            },
	        managerId: {
		        type: Sequelize.INTEGER,
		        allowNull: true
	        },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }).then( async () => {
            await queryInterface.addIndex('Users', ['role'], {name: 'Users_role_index'});
            await queryInterface.addIndex('Users', ['status'], {name: 'Users_status_index'});
            await queryInterface.addIndex('Users', ['sex'], {name: 'Users_sex_index'});
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users').then( async ()=>{
            await queryInterface.removeIndex('Users', 'Users_role_index');
            await queryInterface.removeIndex('Users', 'Users_status_index');
            await queryInterface.removeIndex('Users', 'Users_sex_index');
        });
    }
};
