var database = require('./dbconnect');
var fs = require('fs');

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
                    callback(40, result);
                } else {
                    callback(20, result);
                }
            }
        );
    })
}
exports.modifyAvatar = function(file, dir, userId, callback) {
    var uploadedPath = file.path;
    var dstPath = dir;
    dstPath = dstPath + file.originalFilename;
    //重命名为真实文件名
    fs.rename(uploadedPath, dstPath, function (err) {
        if (err) {
            callback({ message: 21 });
        } else {
            const url='http://207.148.103.8'+dstPath.substring(1);
            database.insert('update users set avatarUrl=? where userId=?', [url, userId], function(err, result) {
                if(err) {
                    console.log(err);
                    callback({
                        message: 21
                    })
                } else {
                    callback({
                        message: 20
                    })
                }
            })
            
        }
    });
}