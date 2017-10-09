/*
database configs
 */
exports.CONNECTION_LOCALHOST = {
    host     : 'localhost',
    user     : 'root',
    password : 'LUOYUZHOU_1996',
    database : 'pixelice'
};

exports.CONNECTION_SERVER = {
    host     : '120.24.225.58',
    user     : 'admin',
    password : 'lyz19960920',
    database : 'pixelice'
};
exports.MAIL_POOL_CONFIG = {
    pool: true,
    host: 'smtp.fstudio.top',
    port: 465,
    secure: true,
    auth: {
        user: 'accountmanage@fstudio.top',
        pass: 'LUOYUZHOU_1996'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
};