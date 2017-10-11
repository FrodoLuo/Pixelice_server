var mysql      = require('mysql');

var config = require('../config');

var pool = mysql.createPool(config.CONNECTION_PRODUCTION);

exports.query = function query(sql, param, callback) {
    pool.query(sql, param, callback);
};

exports.checkToken = function (token, callback) {
    var sql = '' +
        'SELECT userId FROM login WHERE token=?';
    var param = [token];
    pool.query(sql, param, callback);
};