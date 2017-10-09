var mysql      = require('mysql');

var config = require('../config');

var pool = mysql.createPool(config.CONNECTION_LOCALHOST);

exports.query = function (sql, param, callback) {
    pool.query(sql, param, callback);
};