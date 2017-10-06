var mysql      = require('mysql');
var pool = mysql.createPool({
    host     : '120.24.225.58',
    user     : 'admin',
    password : 'lyz19960920',
    database : 'pixelice'
});

exports.query = function (sql, param, callback) {
    var message = undefined;
    pool.query(sql, param, callback);
};