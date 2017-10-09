var nodemailer = require('nodemailer');
var config = require('../config');

const transporter = nodemailer.createTransport(config.MAIL_POOL_CONFIG);

exports.sendMail = function(des, subject, content, html, callback) {
    const sendConfig = {
        from: 'accountmanage@fstudio.top',
        to: des,
        subject: subject,
        html: html,
        text: content
    };
    transporter.sendMail(sendConfig, callback)
};