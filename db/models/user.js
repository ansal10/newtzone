'use strict';
const validator = require('validator');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING,
            trim: true,
            validate:{
                len:{
                    args: [3,140],
                    msg: "Name is not valid, it should be min length 3 and max 140"
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull:false,
            unique:true,
            lowercase: true,
            trim: true,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Email is Required field"
                },
                isValidField: (value, next) =>{
                    if(!validator.isEmail(value))
                        return next('Not an valid email');
                    else {
                        User.findOne({where:{email: value.toLowerCase()}}).then((u)=>{
                            if(u)
                                return next("Email already exist");
                            else
                                next();
                        })

                    }
                },
                len: {
                    args: [6,140],
                    msg: "Email length is not in this range of 6 to 140"
                },
            },
        },

        emailAttributes: {              // token, created, expired, updated, verified
            type: Sequelize.JSONB,
            defaultValue: {}
        },
        passwordAttributes:{           // token, created, expired, updated, hash, salt
            type: Sequelize.JSONB,
            defaultValue: {}
        },
        role: {
            type: Sequelize.ENUM('admin', 'consumer', 'manager'),
            defaultValue: 'consumer',
            validate:{
                isValidField: (val, next)=>{
                    if(!User.rawAttributes.role.values.includes(val))
                        return next('Role should be only ' + User.rawAttributes.role.values );
                    else next();
                }
            }
        },
        status:{
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active',
            validate:{
                isValidField: (val, next)=>{
                    if(!User.rawAttributes.status.values.includes(val))
                        return next('Status should be only ' + User.rawAttributes.status.values );
                    else next();
                }
            }
        },
        sex: {
            type: Sequelize.ENUM('male', 'female', 'other'),
            validate:{
                isValidField: (val, next)=>{
                    if(!User.rawAttributes.sex.values.includes(val))
                        return next('Sex should be only '+User.rawAttributes.sex.values );
                    else next();
                }
            }
        },
	    managerId: {
		    type: Sequelize.INTEGER,
		    allowNull: true,
		    validate:{
			    isValidField: async (val, next) => {
				    if (val){
					    let user = await User.findOne({where:{id: val, role: 'manager'}});
					    if (!user)
						    next('Sorry the manager id is not valid');
					    else next();
				    } else next();
			    }
		    }
	    },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
    }, {});
    User.associate = function (models) {
        // associations can be defined here
    };

    sequelizeTransforms( User, {
        "toDouble": ( val, def ) => {
            return Number( val );
        },
        toInteger: (val, def) =>{
            return val ? parseInt(val) : 0;
        }
    } );

    return User;
};
