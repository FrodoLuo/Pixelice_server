var database = require('./dbconnect');

exports.getUserInfo = function (token, callback) {
    var sql = '' +
        'SELECT * FROM users WHERE userId IN' +
        '(SELECT userId FROM login WHERE token = ?)';
    var param = [token];
    database.query(sql, param, callback);
};
exports.modifyInfo = function (token, vo, callback) {
    console.log(vo);
    database.checkToken(token, function(err, result){
        if(err){
            console.log(err);
            callback(err.errno);
        } else if(result.length === 0){
            callback(41);
        } else {
            var sql = 'UPDATE users SET (nickName, phone, intro, gender) = (?, ?, ?, ?) WHERE userId = ?';
            var param = [vo.nickName, vo.phone, vo.intro, vo.gender, result[0].userId];
            database.query(sql, param, function(err, result) {
                if(err){
                    callback(err.errno);
                }else{
                    callback(20);
                }
            })
        }
    })
}