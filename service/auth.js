var database = require('./dbconnect');
var md5 = require('md5');

exports.signUp = function (vo, callback) {
    console.log(vo);
    var sql_users = 'INSERT INTO users(nickName, email, avatarUrl, intro, phone, gender, verified) VALUE(?,?,?,?,?,?,?)';
    var param_users = [vo.nickName, vo.email, vo.avatarUrl, vo.intro, vo.phone, vo.gender, vo.verified];
    database.query(sql_users, param_users, function (err, result) {
        if(err){
            console.log(err);
            callback(err, result);
        }else {
            var sql_login = 'INSERT INTO login(username, password, userId, token) VALUE(?,?,?,?)';
            var token = createToken(vo.username);
            var param_login = [vo.username, vo.password, result.insertId, token];
            database.query(sql_login, param_login, function(err, result) {
                callback(err,result,token);
            });
        }
    });

};

exports.getUserInfo = function (token, callback) {
    var sql = '' +
        'SELECT * FROM users WHERE userId IN' +
        '(SELECT userId FROM login WHERE token = ?)';
    var param = [token];
    database.query(sql, param, callback);
};
function createToken(username) {
    var string = username + Math.random().toString() + new Date().getSeconds().toString();
    console.log(string);
    return md5(string);
}