var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '120.24.225.58',
    user     : 'admin',
    password : 'lyz19960920',
    database : 'pixelice'
});

function connect() {
    connection.connect();
}
function close(){
    connection.end();
}
exports.query = function (sql, param, callback) {
    console.log(sql);
    console.log(param);
    connect();
    connection.query(sql, param, callback);
    close();
};