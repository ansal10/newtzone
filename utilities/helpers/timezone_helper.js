const wrap = require( "decorator-wrap" ).wrap;
const validator = require( "validator" );
const models = require( "../../db/models/index" );
const hashlib = require( "hash.js" );
const uuidv4 = require( "uuid/v4" );
const moment = require( "moment" );
const permission = require( "../permisson_utility" );
const _ = require( "underscore" );
const util = require( "util" );
const config = require( "../../config/index" );

const LIST_ALL_TIMEZONE_ATTRIBUTES = [ "id", "name", "city", "GMTDifference", "UserId", "createdAt", "updatedAt" ];
const LIST_TIMEZONE_DETAILS_ATTRIBUTES = LIST_ALL_TIMEZONE_ATTRIBUTES.concat( [] );
const UPDATE_TIMEZONE_DETAILS_ATTRIBUTES = _.difference( LIST_TIMEZONE_DETAILS_ATTRIBUTES, [ "id", "createdAt", "updatedAt", "UserId" ] );

const Op = models.Sequelize.Op;

Array.prototype.isArray = true;

const isValidArray = function( v ) {
	return !!( v && v.length > 0 );
};

const listAllTimezone = async( user, params, page ) => {
	let pageNumber = Number( page || 0 );

	let timezones = await models.Timezone.findAll( {
		limit: config.pageLimit,
		offset: config.pageLimit * pageNumber,
		attributes: LIST_ALL_TIMEZONE_ATTRIBUTES,
		where: params,
		order: [
			[ "name", "DESC" ]
		]
	} );
	return timezones;
};

const timezoneDetails = async( user, timezoneId ) => {
	let timezone = await models.Timezone.findOne( {
		where: { id: timezoneId },
		attributes: LIST_TIMEZONE_DETAILS_ATTRIBUTES
	} );
	if (timezone) {
		timezone = timezone.dataValues;
		timezone.edit = await permission.canUpdateTimeZone( user, timezone );
		return {
			status: true,
			message: "",
			args: { timezone: timezone }
		};
	} else {
		return {
			status: false,
			message: util.format( config.MESSAGES.RESOURCE_NOT_FOUND, timezoneId ),
			args: {}
		};
	}
};

const updateTimezone = async( user, timezoneParams, timezoneId ) => {
	let timezone = await models.Timezone.findOne( { where: { id: timezoneId } } );
	if (timezone && await permission.canUpdateTimeZone( user, timezone )) {

		try {
			timezoneParams = _.pick( timezoneParams, UPDATE_TIMEZONE_DETAILS_ATTRIBUTES );
			Object.assign( timezone, timezone, timezoneParams );
			await timezone.validate();
			await timezone.save();
			return {
				status: true,
				message: config.MESSAGES.RESOURCE_UPDATED_SUCCESSFULLY,
				args: {
					timezone: timezone
				}
			};
		} catch (e) {
			return {
				status: false,
				message: e.errors[ 0 ].message,
				args: {}
			};
		}

	} else {
		return {
			status: false,
			message: config.MESSAGES.UNAUTHORIZED_ACCESS,
			args: {}
		};
	}
};

const createTimezoneInDatabase = async( user, timezoneParams ) => {
	if (permission.canCreateTimezone( user )) {
		timezoneParams = _.pick( timezoneParams, UPDATE_TIMEZONE_DETAILS_ATTRIBUTES );
		timezoneParams = Object.assign( {}, timezoneParams, { UserId: user.id } );
		try {
			let timezone = new models.Timezone( timezoneParams );
			timezone.validate();
			await timezone.save();
			return {
				status: true,
				message: config.MESSAGES.RESOURCE_CREATED_SUCCESSFULLY,
				args: {
					timezone: timezone
				}
			};
		} catch (e) {
			return {
				status: false,
				message: e.message || e.errors[ 0 ].message,
				args: {}
			};
		}
	} else {
		return {
			status: false,
			message: config.MESSAGES.UNAUTHORIZED_ACCESS,
			args: {}
		};
	}
};

const searchTimezone = async( user, searchParams, page ) => {
	try {

		let query = {};
		if (isValidArray( searchParams.GMTDifference )) {  // [-1000,1000]
			query = Object.assign( {}, query, {
				GMTDifference: {
					[ Op.between ]: searchParams.GMTDifference
				}
			} );
		}
		if (isValidArray( searchParams.ids )) {
			query = Object.assign( {}, query, {
				id: {
					[ Op.in ]: _.map( searchParams.ids, ( i ) => {
						return Number( i );
					} )
				}
			} );
		}
		let userIds = await filterApplicableUserIds( user, searchParams.UserId );
		if (isValidArray( userIds )) {
			query = Object.assign( {}, query, {  // only acceptable ids
				UserId: {
					[ Op.in ]: userIds
				}
			} );
		}

		if (searchParams.city){
			query = Object.assign({}, query, {
				city:{
					[Op.iLike]: `%${searchParams.city}%`
				}
			})
		}

		if (searchParams.name){
			query = Object.assign({}, query, {
				name:{
					[Op.iLike]: `%${searchParams.name}%`
				}
			})
		}

		return await listAllTimezone( user, query, page );
	} catch (e) {
		return {
			status: false,
			message: "Incompatible data passed",
			args: {}
		};
	}
};

const deleteTimezone = async( user, timezoneId ) => {
	let timezone = await models.Timezone.findOne( { where: { id: timezoneId } } );
	if (timezone) {
		if (await permission.canUpdateTimeZone( user, timezone )) {
			await timezone.destroy();
			return {
				status: true,
				message: config.MESSAGES.RECORD_DELETED_SUCCESSFULLY
			};
		}
		return {
			status: false,
			message: config.MESSAGES.UNAUTHORIZED_ACCESS
		};
	} else {
		return {
			status: false,
			message: util.format( config.MESSAGES.RESOURCE_NOT_FOUND, timezoneId )
		};
	}
};

const filterApplicableUserIds = async( user, userIds ) => {
	if (user.role === "consumer") {
		return [ user.id ];
	} else if (user.role === "manager") {
		userIds = userIds || [];
		let applicableUsers = await models.User.findAll( { where: { managerId: user.id } } );
		let allUserIds = applicableUsers.map( u => u.id );
		allUserIds.push( user.id );
		if (userIds && userIds.length > 0) {
			return _.filter( userIds, id => allUserIds.includes( id ) );
		} else {
			return allUserIds;
		}
	} else {
		if (isValidArray( userIds )) {
			return userIds;
		} else {
			return [];
		}
	}
};


module.exports.listAllTimezone = listAllTimezone;
module.exports.timezoneDetails = timezoneDetails;
module.exports.updateTimezone = updateTimezone;
module.exports.createTimezoneInDatabase = createTimezoneInDatabase;
module.exports.searchTimezone = searchTimezone;
module.exports.deleteTimezone = deleteTimezone;
module.exports.filterApplicableUserIds = filterApplicableUserIds;
