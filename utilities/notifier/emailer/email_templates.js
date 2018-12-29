const util = require('util');
const fs = require('fs');
const sendEmailConfirmationMailTemplate = (name, email, confirmationUrl) => {
    let htmlContent = fs.readFileSync('utilities/notifier/emailer/templates/send_email_confirmation_mail.html', 'utf8');
    htmlContent = util.format(htmlContent, name, confirmationUrl, confirmationUrl, confirmationUrl);
    return {
        subject: util.format("Hello %s, Confirm your email for Aptrental", name),
        html: htmlContent
    }
};

const sendPasswordResetMailTemplate = (name, email, token) => {
    let htmlContent = fs.readFileSync('utilities/notifier/emailer/templates/password_reset_token_mail.html', 'utf8');
    htmlContent = util.format(htmlContent, name, token);
    return {
        subject: util.format("Hello %s, Password reset token", name),
        html: htmlContent
    }
};


module.exports = {
    sendEmailConfirmationMailTemplate: sendEmailConfirmationMailTemplate,
    sendPasswordResetMailTemplate: sendPasswordResetMailTemplate,
};