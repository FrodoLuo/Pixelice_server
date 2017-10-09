var mysql      = require('mysql');

var config = require('../config');

var pool = mysql.createPool(config.CONNECTION_SERVER);

exports.query = function (sql, param, callback) {
    pool.query(sql, param, callback);
};