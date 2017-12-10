const database = require('./dbconnect');

exports.likePhoto = function (token, photoId, callback) {
  database.checkToken(token, function (err, result) {
    if (result.length === 1) {
      database.insert(
        `
          insert into like(userId, photoId)
          select ?,?
          where ? not in (select photoId from like where userId=? and photoId=?)
        `,
        [result[0].userId, photoId, photoId, result[0].userId, photoId],
        function (err, result) {
          if (err) {
            console.log(err);
            callback(21);
          } else {
            callback(20);
            updateLikes(photoId);
          }
        }
      )
    } else {
      callback(41);
    }
  })
}

exports.dislikePhoto = function (token, photoId, callback) {
  database.checkToken(token, function (err, result) {
    if (result.length === 1) {
      database.insert(
        `
          delete from like
          where userId=? and photoId=?
        `,
        [result[0].userId, photoId],
        function (err) {
          if (err) {
            console.log(err);
            callback(21);
          } else {
            callback(20);
            updateLikes(photoId);
          }
        }
      )
    } else {
      callback(41);
    }
  })
}
exports.checkLiked = function (token, callback) {
  database.checkToken(token, function (err, result) {
    if (result.length === 1) {
      database.query(`select photoId from like where userId=?`, [result[0].userId], function (err, result) {
        if (err) {
          console.log(err);
          callback(21);
        } else {
          callback(20, result);
        }
      })
    } else {
      callback(42);
    }
  })
}
function updateLikes(photoId) {
  database.insert(
    `
      update photos
      set liked=(select count(*) as liked from like where photoId=?)
      where photoId=?
    `,
    [photoId, photoId],
    function (err) {
      if (err) {
        console.log(err)
      }
    }
  )
}

exports.follow = function (token, followedId, callback) {
  database.checkToken(token, function (err, result) {
    if (err) {
      console.log(err);
      callback(21);
    } else if (result.length === 1) {
      const userId = result[0].userId;
      database.insert(
        `
        insert into follow(userId, followedId, createTime)
        select ?,?,?
        where ? not in (select userId from follow where userId=? and followedId=?)
        `,
        [userId, followedId, new Date().format('yyyy-MM-dd'), userId, userId, followedId],
        function (err, result) {
          if(err) {
            console.log(err);
            callback(21);
          } else {
            callback(20, result);
          }
        }
      )
    } else {
      callback(41);
    }
  })
}
exports.unfollow = function (token, followedId, callback) {
  database.checkToken(token, function (err, result) {
    if (err) {
      console.log(err);
      callback(21);
    } else if (result.length === 1) {
      const userId = result[0].userId;
      database.insert(
        `
        delete from follow
        where userId=? and followedId=?
        `,
        [userId, followedId],
        function (err, result) {
          if(err) {
            console.log(err);
            callback(21);
          } else {
            callback(20, result);
          }
        }
      )
    } else {
      callback(41);
    }
  })
}
function updateFollows(userId) {
  database.insert(
    `
    update users
    set followers=(
      select count(*) as followers from follow where userId=?
    )
    where userId=?
    `,
    [userId, userId],
    function(err) {
      if(err){
        console.log(err);
      }
    }
  );
}
exports.sendMessage = function(token, receiverId, content, callback) {
  database.checkToken(token, function(err, result) {
    if(err) {
      console.log(err);
      callback(21);
    } else if (result.length === 1) {
      database.insert(
        `
        insert into message(userId, content, createTime, fromId)
        values(?,?,?,?)
        `,
        [receiverId, content, new Date().format('yyyy-MM-dd hh:mm:ss'), result[0].userId],
        function(err, result) {
          if(err) {
            console.log(err);
            callback(21);
          } else {
            callback(20, result);
          }
        }
      )
    } else {
      callback(41);
    }
  })
}