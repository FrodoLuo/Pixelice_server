var database = require('./dbconnect');

exports.signUp = function (vo) {
    console.log(vo);
    var sql = 'INSERT INTO users(nickName, email, avatarUrl, intro, phone, gender, verified) VALUE(?,?,?,?,?,?,?)';
    var param = [vo.nickName, vo.email, vo.avatarUrl, vo.intro, vo.phone, vo.gender, vo.verified];
    database.query(sql, param, function(err, result) {
        if(err){
            console.log(err.message);
            return false;
        }
        console.log(result);
        return true;
    });
};