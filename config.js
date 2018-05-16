/*
database configs
 */
exports.CONNECTION_LOCALHOST = {
    host: 'localhost',
    user: 'root',
    password: 'LUOYUZHOU_1996',
    database: 'pixelice',
    dateStrings: true
};

exports.CONNECTION_SERVER = {
    host: '120.24.225.58',
    user: 'admin',
    password: 'LuoyuzhoU1996',
    database: 'pixelice',
    dateStrings: true
};
exports.CONNECTION_PRODUCTION = {
    host: 'localhost',
    user: 'root',
    password: 'LuoyuzhoU1996',
    database: 'pixelice',
    dateStrings: true
};
exports.MAIL_POOL_CONFIG = {
    pool: true,
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: 'frodoluo@outlook.com',
        pass: 'lyz19960920'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
    }
};
exports.DEV = {
    CONNECTION_LOCALHOST: {
        host: '120.24.225.58',
        user: 'admin',
        password: 'lyz19960920',
        database: 'pixelice'
    },
    RESOURCE_URL: 'http://207.148.103.8/'
};
exports.PRODUCTION = {
    CONNECTION_PRODUCTION: {
        host: 'localhost',
        user: 'root',
        password: 'LuoyuzhoU1996',
        database: 'pixelice'
    },
    RESOURCE_URL: 'http://207.148.103.8/'
};