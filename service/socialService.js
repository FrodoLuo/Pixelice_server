const database = require('./dbconnect');

exports.likePhoto = function (token, photoId, callback) {
  database.checkToken(token, function (err, result) {
    if (result.length === 1) {
      database.insert(
        `
          insert into like(userId, photoId)
          select ?,?
          from like
          where ? not in (select photoId from like where userId=? and photoId=?)
        `,
        [result[0].userId, photoId, photoId, result[0].userId, photoId],
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
    `,
    [photoId],
    function (err) {
      if (err) {
        console.log(err)
      }
    }
  )
}