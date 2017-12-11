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
    database.checkToken(token, function (err, result) {
        if (err) {
            console.log(err);
            callback(err.errno);
        } else if (result.length === 0) {
            callback(41);
        } else {
            var sql = 'UPDATE users SET (nickName, phone, intro, gender) = (?, ?, ?, ?) WHERE userId = ?';
            var param = [vo.nickName, vo.phone, vo.intro, vo.gender, result[0].userId];
            database.query(sql, param, function (err, result) {
                if (err) {
                    callback(err.errno);
                } else {
                    callback(20);
                }
            })
        }
    })
}
exports.getHostInfo = function (token, hostId, callback) {
    let userId = 0;
    database.checkToken(token, function (err, result) {
        if (err) {
            console.log(err);
        } else if(result.length===1){
            userId=result[0].userId;
        }
        database.query(
            `select userId, nickName, intro, gender, followers, avatarUrl,
            (case when userId in(select followedId from follow where userId=?) then "t" else "f" end) as followed            
            from users where userId=?`,
            [userId, hostId],
            function(err, result) {
                if(err){
                    console.log(err);
                    callback(21);
                } else if(userId === result[0].userId) {
                    callback(40);
                } else {
                    callback(20, result);
                }
            }
        );
    })
}