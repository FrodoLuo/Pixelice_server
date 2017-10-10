var database = require('./dbconnect');
var mailer = require('./mailService');
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

exports.signIn = function (username, password, callback) {
    var sql = '' +
        'SELECT userId FROM login WHERE username = ? AND password = ?';
    var param = [username, password];
    database.query(sql, param, function (err, result) {
        if (err) {
            callback(err, result, 22);
        } else {
            if (result.length === 0){
                callback(err, result, 21);
            } else {
                var token = createToken(username);
                sql = '' +
                    'UPDATE login SET token = ? WHERE userId = ?';
                param = [token, result[0].userId];
                database.query(sql, param, function(err, result) {
                    if(err){
                        callback(err, result , 22);
                    } else {
                        callback(err, result , 20, token);
                    }
                })
            }
        }
    })
};

exports.getUserInfo = function (token, callback) {
    var sql = '' +
        'SELECT * FROM users WHERE userId IN' +
        '(SELECT userId FROM login WHERE token = ?)';
    var param = [token];
    database.query(sql, param, callback);
};
exports.sendVerify = function (token, callback){
    var sql = '' +
        'SELECT userId FROM login WHERE token=?';
    var param = [token];
    database.query(sql, param, function(err, result) {
        if(err){
            callback(err, result, 50);
        }else if(result.length===0) {
            callback(err, result, 21);
        }else{
            console.log(result);
            sql = 'REPLACE INTO verify (userId, verifyCode) VALUE(?,?)';
            const userId = result[0].userId;
            const verifyCode = createVerifyCode();
            param = [userId, verifyCode];
            database.query(sql,param,function (err, result) {
                if(err){
                    console.log(err);
                    callback(err, result, 50);
                } else {
                    sql = 'SELECT email, verified FROM users WHERE userId = ?';
                    param = [userId];
                    database.query(sql, param, function(err, result){
                        console.log(result);
                        if(result[0].verified==='1'){
                            callback(err, result, 23);
                        } else {
                            mailer.sendVerify(result[0].email, verifyCode, function(err, result){
                                if(err){
                                    callback(err, result, 50);
                                }else{
                                    console.log(result);
                                    callback(err, result, 20);
                                }
                            });
                        }
                    });
                }
            })
        }
    })
};
exports.verify = function(verifyCode, callback) {
    var sql = 'SELECT userId FROM verify WHERE verifyCode = ?';
    var param = [verifyCode];
    database.query(sql, param, function (err, result) {
       if(err || result.length === 0){
           callback(err, result, 21);
       } else {
           console.log(result[0].userId);
           sql = 'UPDATE users SET verified = ? WHERE userId = ?';
           param = [true, result[0].userId];
           database.query(sql,param,callback);
       }
    });
};
function createToken(username) {
    var string = username + Math.random().toString() + new Date().getSeconds().toString();
    console.log(string);
    return md5(string);
}
function createVerifyCode() {
    var string = Math.random().toString() + new Date().getSeconds().toString() + Math.random().toString();
    return md5(string);
}