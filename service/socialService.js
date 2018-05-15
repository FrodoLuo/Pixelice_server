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
      const nickName = result[0].nickName;
      database.insert(
        `
        insert into follow(userId, followedId, createTime)
        select ?,?,?
        where ? not in (select userId from follow where userId=? and followedId=?)
        `,
        [userId, followedId, new Date().format('yyyy-MM-dd'), userId, userId, followedId],
        function (err, result) {
          if (err) {
            console.log(err);
            callback(21);
          } else {
            callback(20, result);
            updateFollows(followedId);
            broadCast([followedId], `${nickName}关注了你`);
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
          if (err) {
            console.log(err);
            callback(21);
          } else {
            callback(20, result);
            updateFollows(followedId);
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
      select count(*) as followers from follow where followedId=?
    )
    where userId=?
    `,
    [userId, userId],
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
}
exports.sendMessage = function (token, receiverId, content, callback) {
  database.checkToken(token, function (err, result) {
    if (err) {
      console.log(err);
      callback(21);
    } else if (result.length === 1) {
      database.insert(
        `
        insert into message(userId, content, createTime, fromId)
        values(?,?,?,?)
        `,
        [receiverId, content, new Date().format('yyyy-MM-dd hh:mm:ss'), result[0].userId],
        function (err, result) {
          if (err) {
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
exports.fetchMessages = function (token, callback) {
  database.checkToken(token, function (err, result) {
    if (err) {
      console.log(err);
      callback(21);
    } else if (result.length === 1) {
      database.query(
        `
          select m.*, u.nickName, u.avatarUrl 
          from message m
          join users u
          on m.fromId=u.userId
          where m.userId=?
          order by m.read, m.messageId desc
        `,
        [result[0].userId],
        function (err, result) {
          if (err) {
            console.log(err);
            callback(21);
          } else {
            callback(20, result);
          }
        }
      );
    } else {
      callback(41);
    }
  })
}
exports.fetchSentMessages = function (token, callback) {
  database.checkToken(token, function (err, result) {
    if (err) {
      console.log(err);
      callback(21);
    } else if (result.length === 1) {
      database.query(
        `
          select m.*, u.nickName, u.avatarUrl 
          from message m
          join users u
          on m.userId=u.userId
          where m.fromId=?
        `,
        [result[0].userId],
        function (err, result) {
          if (err) {
            console.log(err);
            callback(21);
          } else {
            callback(20, result);
          }
        }
      );
    } else {
      callback(41);
    }
  })
}
exports.getMessageDetail = function (token, messageId, callback) {
  database.checkToken(token, function (err, result) {
    if (err) {
      console.log(err);
      callback(21);
    } else if (result.length === 1) {
      // console.log([result[0].userId, parseInt(messageId)]);
      database.insert(
        `
          update message
          set read="t"
          where userId=? and messageId=?
        `,
        [result[0].userId, parseInt(messageId)],
        function (err, result) {
          if (err) {
            console.log(err)
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
exports.fetchUnreadCount = function (token, callback) {
  database.checkToken(token, function (err, result) {
    if (err) {
      console.log(err);
      callback(21);
    } else if (result.length === 1) {
      database.query('select count(*) as unread from message where read="f" and userId=?', [result[0].userId], function (err, result) {
        if (err) {
          console.log(err);
          callback(21);
        } else {
          callback(20, result[0].unread || 0);
        }
      })
    }
  })
}

exports.getFollowedUser = function (token, callback) {
  database.checkToken(token, function (err, result) {
    if (err) {
      console.log(err);
      callback(21);
    } else if (result.length === 1) {
      database.query(
        `select * from users where userId in (select followedId from follow where userId=?)`,
        [result[0].userId],
        function (err, result) {
          if (err) {
            console.log(err);
            callback(21);
          } else {
            callback(20, result);
          }
        }
      )
    }
  })
}

exports.broadToFollowers = function (userId, content) {
  database.query('select userId from follow where followedId=?', [userId], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      const toIds = [];
      for (const item of result) {
        toIds.push(item.userId);
      }
      broadCast(toIds, content);
    }
  })
}

broadCast = function (toIds, content) {
  const params = [];
  const createTime = new Date().format('yyyy-MM-dd hh:mm:ss');
  for (const id of toIds) {
    params.push([id, content, createTime, 1])
  }
  database.multiInsert(
    `
    insert into message(userId, content, createTime, fromId)
    values(?,?,?,?)
    `,
    params,
    function (err, result) {
      if (err) {
        console.log(err);
      }
    }
  )
}
exports.getHotUsers = function (callback) {
  database.query('select * from users where userId > 10 order by followers limit 5', function (err, result) {
    if (err) {
      console.log(err);
      callback(21);
    } else {
      var fetchedList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      var index = 0;
      var re = [];
      while (re.length < 3 && re.length < result.length) {
          index = Math.random() * result.length;
          index = parseInt(index);
          if (fetchedList[index] === 0) {
              re.push(result[index]);
              fetchedList[index] = 1;
          }

      }
      callback(20, re);
    }
  })
}
exports.broadCast = broadCast;