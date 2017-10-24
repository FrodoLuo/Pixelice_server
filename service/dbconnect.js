var mysql = require('mysql');
var sqlite3 = require('sqlite3').verbose();

var sqlite3Connect = new sqlite3.Database('../database/pixelice.db');
//
// var config = require('../config');
//
// var pool = mysql.createPool(config.CONNECTION_SERVER);

exports.query = function query(sql, param, callback) {
    sqlite3Connect.all(sql, param, callback);
};

exports.checkToken = function (token, callback) {
    var sql = '' +
        'SELECT userId FROM login WHERE token=?';
    var param = [token];
    sqlite3Connect.all(sql, param, callback);
};