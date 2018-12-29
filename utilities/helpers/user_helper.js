'use strict';

const validator = require('validator');
const models = require('../../db/models/index');
const hashlib = require('hash.js');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const util = require('util');
const permission = require('../permisson_utility');
const _ = require('underscore');
const SELF_UPDATE_ALLOWED_FIELDS = ['sex', 'name', 'email', 'managerId'];
const ADMIN_UPDATE_ALLOWED_FIELDS = SELF_UPDATE_ALLOWED_FIELDS.concat(['role', 'status']);
const USER_DETAILS_FIELDS = ['role', 'status', 'sex', 'name', 'email', 'id', 'createdAt', 'updatedAt', 'managerId'];
const config = require('../../config/index');
const notifier = require('../../utilities/notifier/index');
const Op = models.Sequelize.Op;
const sha256 = require('sha256');
const timezoneHelper = require('./timezone_helper');
const TIME = {
    EMAIL_TOKEN_EXPIRATION: 24 * 60 * 60, // seconds
    PASSWORD_TOKEN_EXPIRATION: 15 * 60  // seconds

};

const STRS = {
    INVALID_EMAIL: 'Your email is invalid',
    NAME_MIN_LENGTH: 6,
    INVALID_NAME: 'Name is invalid. it should be atleast 6 chars long',
    PASSWORD_MIN_LENGTH: 6,
    INVALID_PASSWORD: 'Password should be atleast 6 digits long',
    EMAIL_ALREADY_EXIST: 'Email already exist. if you forgot your password you can request for one.',
    EMAIL_PASSWORD_NOT_MATCHED: 'Email and password combination didn\'t matched',
    INVALID_SEX: 'Sex is invalid. Accepted values are ' + models.User.rawAttributes.sex.values,
    EMAIL_NOT_VERIFIED: 'Your email is not verified',
    LOGGED_IN_SUCCESSFUL: 'You have been logged in successful',
    INACTIVE_ACCOUNT: 'Your account have been deactivated',
    INVALID_ROLE: 'You can only sign-up as consumer',
};

const createUserInDatabase = async function (userParams) {

    let uuid = uuidv4();
    try {

        let user = new models.User({
            email: userParams.email || '',
            name: userParams.name || '',
            emailAttributes: {
                token: uuidv4(),
                created: moment().toISOString(),
                expired: moment().add(TIME.EMAIL_TOKEN_EXPIRATION, 'seconds').toISOString(),
                verified: false
            },
            passwordAttributes: {
                salt: uuid,
                hash: sha256(userParams.password + uuid)
            },
            sex: userParams.sex || '',
            status: models.User.rawAttributes.status.defaultValue,
            role: userParams.role || models.User.rawAttributes.role.defaultValue,
            managerId: userParams.managerId
        });

        user.validate();
        await user.save();

        return {
            status: true,
            message: config.MESSAGES.SIGNUP_SUCCESSFUL_MESSAGE,
            args: {
                user: user
            }
        };
    } catch (e) {
        return {
            status: false,
            message: e.message
        }
    }
};

const verifyEmail = async function (email, email_token) {
    let user = await models.User.findOne({where: {email: validator.trim(email, '').toLowerCase()}});
    if (!user)
        return {status: false, message: config.MESSAGES.EMAIL_VERIFICATION_FAILED};

    if (user.emailAttributes.token === email_token && moment().toISOString() < user.emailAttributes.expired) {

        user.emailAttributes = Object.assign({}, user.emailAttributes, {
            updated: moment().toISOString(),
            verified: true
        });
        await user.save();

        return {
            status: true,
            message: config.MESSAGES.SUCCESSFUL_EMAIL_VERIFICATION
        };
    }
    return {status: false, message: config.MESSAGES.EMAIL_VERIFICATION_FAILED}
};

const resendEmailConfirmation = async function (email) {
    let user = await models.User.findOne({where: {email: validator.trim(email, '').toLowerCase()}});
    if (!user)
        return {status: false, message: config.MESSAGES.INVALID_EMAIL};
    user.emailAttributes = {
        token: uuidv4(),
        created: moment().toISOString(),
        expired: moment().add(TIME.EMAIL_TOKEN_EXPIRATION, 'seconds').toISOString(),
        verified: false
    };

    await user.save();
    return {
        status: true,
        args: {
            user: user
        },
        message: config.MESSAGES.SUCCESSFULLY_RESEND_CONFIRMATION_MAIL
    }
};

const resetPassword = async function (email, password_token, password) {
    let user = await models.User.findOne({where: {email: validator.trim(email, '').toLowerCase()}});
    if (!user)
        return {status: false, message: config.MESSAGES.INVALID_EMAIL};
    if (validator.trim(password, '').length < config.MESSAGES.PASSWORD_MIN_LENGTH)
        return {status: false, message: config.MESSAGES.INVALID_PASSWORD};

    if (user.passwordAttributes.token === password_token && moment().toISOString() < user.passwordAttributes.expired) {
        let uuid = uuidv4();
        user.passwordAttributes = {
            salt: uuid,
            hash: sha256(password + uuid),
            updated: moment().toISOString()
        };
        await user.save();
        return {
            status: true,
            message: config.MESSAGES.SUCCESSFULLY_PASSWORD_RESET,
            args: {
                user: user
            }
        }
    }
    return {status: false, message: config.MESSAGES.PASSWORD_RESET_FAILED}
};

const resendPasswordResetToken = async function (email) {
    let user = await models.User.findOne({where: {email: validator.trim(email, '').toLowerCase()}});
    if (!user)
        return {status: false, message: config.MESSAGES.INVALID_EMAIL};

    user.passwordAttributes = {
        token: (Math.floor(Math.random() * 10000000) + 1000000) + '',
        created: moment().toISOString(),
        expired: moment().add(TIME.PASSWORD_TOKEN_EXPIRATION, 'seconds').toISOString()
    };
    await user.save();
    return {
        status: true,
        args: {
            user: user
        },
        message: config.MESSAGES.SUCCESSFULLY_PASSWORD_TOKEN_SENT
    }

};

const listAllUsers = async (pageNumber, pageLimit) => {
    let users = models.User.findAll({
        limit: pageLimit,
        offset: pageLimit * pageNumber,
        attributes: USER_DETAILS_FIELDS
    });
    return users;
};

const updateUserDetails = async (updater, userArgs, userId) => {
    let user = await models.User.findOne({where: {id: userId}});
    userArgs.managerId = userArgs.managerId || null;
    let newManagerId = userArgs.managerId || null;
    let newManager = userArgs.managerId ? await models.User.findOne({where: {id: newManagerId}}) : null;

    if (!user)
        return {status: false, message: util.format(config.MESSAGES.RESOURCE_NOT_FOUND, userId)};
    if (await permission.canUpdateUser(updater, user)) {
        try {
            let updateVals = {};
            let emailUpdate;
            if (updater.role !== 'admin')  // updating self or manager updating client
                updateVals = _.pick(userArgs, SELF_UPDATE_ALLOWED_FIELDS);
            else
                updateVals = _.pick(userArgs, ADMIN_UPDATE_ALLOWED_FIELDS);

            emailUpdate = userArgs.email ? user.email !== userArgs.email : false;
            let managerAssignError = permission.canBeManagerToUserMessage(newManager, user);
            if (managerAssignError != null) {
                return {
                    status: false,
                    message: managerAssignError
                }
            }
            if (newManagerId && newManager === null) {
                return {
                    status: false,
                    message: config.MESSAGES.MANAGER_NOT_FOUND
                }
            }
            Object.assign(user, user, updateVals);
            if (emailUpdate) {
                await user.validate();
                user.emailAttributes = {
                    token: uuidv4(),
                    created: moment().toISOString(),
                    expired: moment().add(TIME.EMAIL_TOKEN_EXPIRATION, 'seconds').toISOString(),
                    verified: false
                }
            } else
                await user.validate({skip: ['email']});

            await user.save();
            if (emailUpdate)
                notifier.notifyEmailConfirmation(user);

            return {
                status: true,
                message: emailUpdate ? 'Field updated. Since your have also updated your email your need to confirm by clicking confirmation link in your email inbox' : 'Fields are updated'
            }
        } catch (e) {
            return {
                status: false,
                message: e.errors[0].message
            }
        }
    } else {
        return {status: false, message: config.MESSAGES.UNAUTHORIZED_ACCESS}
    }
};

const findUserDetails = async (requester, userid) => {
    let u = await models.User.findOne({
        where: {id: userid},
        attributes: USER_DETAILS_FIELDS
    });
    if (!u)
        return {status: false, message: config.MESSAGES.RESOURCE_NOT_FOUND};
    if (permission.canSeeUserDetails(requester, u)) {
        return {status: true, message: '', args: {user: u}};
    } else {
        return {status: false, message: config.MESSAGES.UNAUTHORIZED_ACCESS}
    }
};

const deleteUser = async (requester, userId) => {
    let u = await models.User.findOne({where: {id: userId}});
    if (!u)
        return {status: false, message: config.MESSAGES.RESOURCE_NOT_FOUND};
    if (permission.canDeleteUser(requester, u)) {
        await models.Timezone.destroy({
            where: {
                UserId: u.id
            }
        });
        u.destroy();

        return {status: true, message: config.MESSAGES.RECORD_DELETED_SUCCESSFULLY, args: {user: u}};
    } else return {status: false, message: config.MESSAGES.UNAUTHORIZED_ACCESS}
};

const searchUsers = async (requester, searchParams) => {
    if (permission.canSeeUsersList(requester)) {
        let query = {};
        let page = searchParams.page || 0;

        if (requester.role === 'manager') {
            let allUserIds = await timezoneHelper.filterApplicableUserIds(requester, []);
            query = {
                id: {
                    [Op.in]: allUserIds
                }
            }
        }

        let users = await models.User.findAll({
            limit: config.pageLimit,
            offset: config.pageLimit * page,
            attributes: USER_DETAILS_FIELDS,
            where: query,
            order: [
                ['id', 'DESC']
            ]
        });

        return {status: true, message: '', args: {users: users}};
    } else {
        return {status: false, message: config.MESSAGES.UNAUTHORIZED_ACCESS}
    }
};

const authenticatedUser = async function (email, password) {
    let user = await models.User.findOne({
        where: {email: validator.trim(email, '').toLowerCase()}
    });
    if (!user)
        return {status: false, message: STRS.INVALID_EMAIL};

    let caclulatedHash = sha256(password + user.passwordAttributes.salt || '');
    if (caclulatedHash !== user.passwordAttributes.hash)
        return {status: false, message: STRS.EMAIL_PASSWORD_NOT_MATCHED};
    if (user.emailAttributes.verified === false)
        return {status: false, message: STRS.EMAIL_NOT_VERIFIED};
    if (user.status !== 'active')
        return {status: false, message: STRS.INACTIVE_ACCOUNT};

    return {
        status: true,
        message: STRS.LOGGED_IN_SUCCESSFUL,
        args: {
            user: _.pick(user.dataValues, USER_DETAILS_FIELDS)
        }
    };
};

module.exports.createUserInDatabase = createUserInDatabase;
module.exports.verifyEmail = verifyEmail;
module.exports.resendEmailConfirmation = resendEmailConfirmation;
module.exports.resetPassword = resetPassword;
module.exports.resendPasswordResetToken = resendPasswordResetToken;
module.exports.listAllUsers = listAllUsers;
module.exports.updateUserDetails = updateUserDetails;
module.exports.findUserDetails = findUserDetails;
module.exports.searchUsers = searchUsers;
module.exports.authenticatedUser = authenticatedUser;
module.exports.deleteUser = deleteUser;

