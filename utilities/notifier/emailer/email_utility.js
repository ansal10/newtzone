"use strict";
const nodemailer = require('nodemailer');
const config = require('../../../config/index');
const transporter = nodemailer.createTransport(config.smtpConfig);
const template = require('./email_templates');

let defaultMailOptions = {
    from: config.smtpConfig.auth.user, // sender address
    to: '', // list of receivers
    subject: 'Hello ✔', // Subject line
    html: '<b>Hello world? you are doing great</b>' // html body
};

const sendEmailConfirmationMail = async (name, email, confirmationUrl) => {
    let templateOption = template.sendEmailConfirmationMailTemplate(name, email, confirmationUrl);
    let mailOption = Object.assign({}, defaultMailOptions, {
        to: email,
        subject: templateOption.subject,
        html: templateOption.html
    });

    try {
        let retVal = await transporter.sendMail(mailOption);
        // console.error(` Mocked Email  Confirmation Link : ${confirmationUrl}`);
        return {
            status: true
        }

    }catch (e) {
        console.error(e);
        return {
            status: false
        }
    }
};

const sendPasswordResetTokenMail = async (name, email, token) => {
    let templateOption = template.sendPasswordResetMailTemplate(name, email, token);
    let mailOption = Object.assign({}, defaultMailOptions, {
        to: email,
        subject: templateOption.subject,
        html: templateOption.html
    });


    try {
        let retVal = await transporter.sendMail(mailOption);
        // console.error(`Mocked Email Password reset token: ${token}`);
        console.log('sent email to: ', email);
        return {
            status: true
        }

    }catch (e) {
        console.error(e);
        return {
            status: false
        }
    }
};
module.exports = {
    sendEmailConfirmationMail: sendEmailConfirmationMail,
    sendPasswordResetTokenMail: sendPasswordResetTokenMail
};
