var database = require('./dbconnect');
exports.getAlbumInfoById = function(albumId, callback) {
  database.query(`select * from albums join photos on albums.coverPhotoId=photos.photoId where albumId=?`, [albumId], function(err, result) {
    if(err) {
      console.log(err);
      callback(21);
    } else {
      callback(20, result[0]);
    }
  });
}
exports.getAlbumContentById = function(token, albumId, callback) {
  database.checkToken(token, function(err, result) {
    if(err) {
      console.log(err)
    }
    if(result.length===0){
      result.push({userId: -1});
    }
    database.query(
      `
        select album_have.*, photos.*, users.nickName, users.avatarUrl
        from album_have 
        join photos
        on photos.photoId=album_have.photoId
        join users
        on photos.userId=users.userId
        where albumId=? and albumId in 
          (select albumId from albums where private="f" or photos.userId=?)
      `, 
      [albumId, result[0].userId],
      function(err, result){
        if(err) {
          console.log(err);
          callback(21);
        } else  {
          callback(20, result);
        } 
      }
    );
  })
}
exports.getAlbumsByToken = function(token, callback) {
  database.checkToken(token, function(err, result) {
    if(result.length === 1) {
      database.query('select albums.*, p.zipUrl from albums join photos p on albums.coverPhotoId=p.photoId where albums.userId=?', [result[0].userId], function(err, result) {
        if(err) {
          console.log(err);
          callback(21);
        } else {
          callback(20, result);
        }
      })
    } else {
      callback(41);
    }
  })
}
exports.getAlbumsByUserId = function(userId, callback) {
  database.query('select albums.*, p.zipUrl from albums join photos p on albums.coverPhotoId=p.photoId where albums.userId=?', [userId], function(err, result) {
    if(err) {
      console.log(err);
      callback(21);
    } else {
      callback(20, result);
    }
  })
}
exports.createAlbum = function(album, token, callback) {
  database.checkToken(token, function(err, result) {
    if(result.length === 1) {
      database.insert(
        'insert into albums(userId, albumName, createDate, private) values(?,?,?,?)',
        [result[0].userId, album.albumName, new Date().format('yyyy-MM-dd'), album.private],
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
exports.removeAlbum = function(albumId, token, callback) {
  database.checkToken(token, function(err, result) {
    if(result.length === 1) {
      database.query(
        `
          update albums
          set deleted='t'
          where albumsId=? and userId=?
        `,
        [albumId, result[0].userId],
        function(err, result) {
          if(err) {
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
exports.addToAlbum = function(token, photoId, albumId, callback) {
  database.checkToken(token, function(err, result) {
    if(result.length === 1) {
      database.insert(
        `
          insert into album_have(albumId, photoId) 
          select ?,? 
          where ? in (select albumId from albums where userId=?) 
            and ? in (select photoId from photos where userId=?)
            and ? not in (select photoId from album_have where albumId=? and photoId=?)
        `,
        [albumId, photoId, albumId, result[0].userId, photoId, result[0].userId, photoId, albumId, photoId],
        function(err, result) {
          if(err) {
            console.log(err);
            callback(21);
          } else {
            callback(20);
          }
        }
      )
    }else {
      callback(41);
    }
  })
}
exports.removeFromAlbum = function(token, photoId, albumId, callback) {
  database.checkToken(token, function(err, result) {
    if(result.length === 1) {
      database.insert(
        'delete from album_have where albumId=? and photoId=? and albumId in(select albumId from albums where userId=?)',
        [albumId, photoId, result[0].userId],
        callback
      )
    } else {
      callback(41);
    }
  })
}
exports.modifyAlbum = function(token, album, callback) {
  console.log(album);
  database.checkToken(token, function(err, result) {
    if(result.length !== 1) {
      callback(41);
    } else {
      database.query(
        `
          update albums
          set albumName=?, description=?, private=?
          where albumId=? and albumId in (
            select albumId from albums where userId=?
          )
        `,
        [
          album.albumName,
          album.description,
          album.private,
          album.albumId,
          result[0].userId,
        ],
        function(err, result) {
          if(err) {
            console.log(err)
            callback(21);
          } else {
            console.log(result);
            callback(20, result);
          }
        }
      )
    }
  })
}
exports.checkPhotoInAlbum = function(photoId, callback) {
  database.query(`select albumId from album_have where photoId=?`, [photoId], function(err, result) {
    if(err) {
      console.log(err);
      callback(21);
    } else {
      callback(20, result);
    }
  })
}