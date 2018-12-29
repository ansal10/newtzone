
const emailUtility = require('./emailer/email_utility');
const util = require('util');
const config = require('../../config/index');

const notifyEmailConfirmation = async (user) => {
    if(process.env.NODE_ENV !== 'test') {
        let confirmationUrl = util.format("%s/api/v1/user/verify_email?email=%s&emailToken=%s", config.baseUrl, user.email, user.emailAttributes.token);
        await emailUtility.sendEmailConfirmationMail(user.name, user.email, confirmationUrl);
        return true;
    }else{
        console.log('Notifier Mocked..... not a production environment');
        return false;
    }
};

const notifyPasswordReset = async (user) => {
    if(process.env.NODE_ENV !== 'test') {
        await emailUtility.sendPasswordResetTokenMail(user.name, user.email, user.passwordAttributes.token);
        return true;
    }else{
        console.log('Notifier Mocked..... not a production environment');
        return false;
    }
};

module.exports = {
    notifyEmailConfirmation: notifyEmailConfirmation,
    notifyPasswordReset: notifyPasswordReset
};
