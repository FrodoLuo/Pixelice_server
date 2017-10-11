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
exports.sendVerify = function(des, verifyCode, callback) {
    console.log(des);
   const sendConfig = {
       from: 'accountmanage@fstudio.top',
       to: des,
       subject: 'Pixelice邮箱认证',
       html: '' +
       '<div>' +
       '    亲爱的用户您好： <br />' +
       '    欢迎加入Pixelice, 点击下方连接完成帐号验证.    ' +
       '    <div>' +
       '        <a href="http://120.24.225.58/api/auth/verify?verifyCode='+verifyCode+'">邮箱验证</a>' +
       '    </div>' +
       '    <div>如果您不能打开链接, 请右键复制连接到地址栏并转入.</div>' +
       '    <div>请勿回复此邮箱</div>' +
       '    <div>如果您并没有注册Pixelice, 请无视这封邮件</div>' +
       '    <div>Fstudio工作室 敬上</div>' +
       '</div>'
   };
   transporter.sendMail(sendConfig, callback);
};
transporter