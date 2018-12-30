const models = require( "../db/models/index" );


const canSeeUsersList = ( user ) => {
	return ["admin", 'manager'].includes(user.role);
};

const canUpdateTimeZone = async( user, timezone ) => {
	if (user.role === "consumer" && timezone.UserId === user.id) {
		return true;
	} else if (user.role === "manager") {
		if (timezone.UserId === user.id) {
			return true;
		}
		let timezoneUser = await models.User.findAll( { where: { id: timezone.UserId } } );
		return timezoneUser.managerId === user.id;
	} else {
		return user.role === "admin";
	}
};

const canUpdateUser = async( user1, user2 ) => {
	if (user1.id === user2.id) { // can edit himself{
		return true;
	} else if (user1.role === "manager" && user2.managerId === user1.id ) {
		return true;
	}
	return user1.role === "admin";
};

const canCreateTimezone = ( user ) => {
	return true;
};

const canSeeUserDetails = ( user1, user2 ) => {
	if (user1.id === user2.id) { // can edit himself{
		return true;
	} else if (user1.role === "manager" && user2.managerId === user1.id ) {
		return true;
	}
	return user1.role === "admin";
};

const canDeleteUser = ( user1, user2 ) => {
	if (user1.role === "admin") {
		return true;
	}
};

const canBeManagerToUserMessage = ( manager, user ) => {  //
	if (manager == null) {
		return null;
	}

	if (manager.role === "manager") {
		if (manager.id === user.id) {  // cannot be manager of self
			return "Cannot assign yourself as a manager to yourself";
		} else if (user.role === "manager" || user.role === "consumer") {
			return null;  // user can manage
		} else {
			return "Manager cannot be assigned to admin";
		}
	} else {
		return "The manager id is invalid or the person is not a manager";
	}
};

module.exports.canSeeUsersList = canSeeUsersList;
module.exports.canUpdateTimeZone = canUpdateTimeZone;
module.exports.canUpdateUser = canUpdateUser;
module.exports.canCreateTimezone = canCreateTimezone;
module.exports.canSeeUserDetails = canSeeUserDetails;
module.exports.canDeleteUser = canDeleteUser;
module.exports.canBeManagerToUserMessage = canBeManagerToUserMessage;
