"use strict";
const sequelizeTransforms = require( "sequelize-transforms" ),
	validator = require( "validator" ),
	config = require( "../../config/index" ),
	util = require( "util" ),
	moment = require( "moment" );

Array.prototype.isArray = true;

module.exports = ( DataType, Sequelize ) => {
	const Timezone = DataType.define( "Timezone", {
		"id": {
			"allowNull": false,
			"autoIncrement": true,
			"primaryKey": true,
			"type": Sequelize.INTEGER
		},
		"name": {
			"type": Sequelize.STRING,
			"allowNull": false,
			"trim": true,
			"validate": {
				"len": {
					"args": [ 3, 50 ],
					"msg": "Name should be in range 10 to 50 words"
				}
			}
		},
		"city": {
			"type": Sequelize.STRING,
			"allowNull": false,
			"trim": true,
			"validate": {
				"len": {
					"args": [ 3, 50 ],
					"msg": "city should be in range 5 to 50"
				}
			}
		},
		"GMTDifference": {
			"type": Sequelize.INTEGER,
			"allowNull": false,
			toInteger: true,
			"validate": {
				isValidField: ( value, next ) => {
					if (value >= 960 || value <= -960) {
						next("GMTDifference must be between -16 hrs to +16 hrs" );
					}else if (value % 15 !== 0){
						next("GMT Difference must be a multiple of 15 minutes")
					}
					else next();
				}
			}
		},
		"UserId": {
			"type": Sequelize.INTEGER,
			"references": {
				"model": "Users",
				"key": "id"
			},
			"onUpdate": "CASCADE",
			"onDelete": "SET NULL"
		},
		"createdAt": {
			"allowNull": false,
			"type": Sequelize.DATE
		},
		"updatedAt": {
			"allowNull": false,
			"type": Sequelize.DATE
		}

	} );

	Timezone.associate = function( models ) {
		Timezone.belongsTo( models.User );
	};

	sequelizeTransforms( Timezone, {
		"toDouble": ( val, def ) => {
			return Number( val );
		},
		toInteger: (val, def) =>{
			return parseInt(val);
		}
	} );
	return Timezone;
};
