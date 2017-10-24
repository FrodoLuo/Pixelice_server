var mysql = require('mysql');
var sqlite3 = require('sqlite3');

//
// var config = require('../config');
//
// var pool = mysql.createPool(config.CONNECTION_SERVER);
/**
 *
 * @param sql 查询sql语句, 必选
 * @param param 可选
 * @param callback 必选
 */
var query = function (sql, param, callback) {
    callback = callback||param;
    var sqlite3Connect = new sqlite3.Database('./database/pixelice.db');
    sqlite3Connect.all(sql, param, function(err, result){
        callback(err,result);
        sqlite3Connect.close();
    });
};

exports.query = query;

exports.checkToken = function (token, callback) {
    var sql = '' +
        'SELECT userId FROM login WHERE token=?';
    var param = [token];
    sqlite3Connect.all(sql, param, callback);
};

// var sql = 'SELECT photos.photoUrl, users.nickName as author FROM photos JOIN users ON photos.userId=users.userId';
// var k = function(err, result) {
//     console.log(err);
//     console.log(result);
// };
// sqlite3Connect.all(sql, k);
// query('select * from users where userId=?',[59],function(err,result){
//     console.log(result);
// });