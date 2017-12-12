var database = require('./dbconnect');
var fs = require('fs');
var fsHelper = require('./file/fshelper');
var config = require('../config');
var images = require('images');
var socialService = require('./socialService');
require('./dateTimeHelper');

exports.upload = function (token, list, info, callback) {
    var name;
    database.checkToken(token, function (err, result) {
        if (result.length !== 1) {
            callback(41);
        } else {
            var userId = result[0].userId;
            var nickName = result[0].nickName;
            var fromDir = './public/temp/' + userId + '/files/';
            var dstDir = './data/' + userId + '/photos/';
            var dstDir_ = 'data/' + userId + '/photos/';
            var zipDir = './data/' + userId + '/photos/zip/';
            var zipDir_ = 'data/' + userId + '/photos/zip/';
            if (!fs.existsSync(dstDir)) {
                fsHelper.mkdirsSync(dstDir);
            }
            var sql = 'INSERT INTO photos (photoUrl,zipUrl,userId,title,intro,date,tags) VALUES (?,?,?,?,?,?,?)';
            var param = [];
            const date = new Date();

            for (var i = 0; i < list.length; i += 1) {
                const name = info.title + '_' + Math.random().toString() + '\.' + list[i].split('\.')[1];
                const zip_name = 'zip_' + name;
                param.push([
                    config.PRODUCTION.RESOURCE_URL + dstDir_ + name,
                    config.PRODUCTION.RESOURCE_URL + zipDir_ + name,
                    userId,
                    info.title,
                    info.intro,
                    date.format('yyyy-MM-dd hh:mm:ss'),
                    info.tags
                ]);
                const fromName = fromDir + list[i];
                const dstName = dstDir + name;
                fs.rename(fromName, dstDir + name, function (err) {
                    if (err) {
                        console.log("rename:" + err);
                        callback(21);
                    }
                    if (!fs.existsSync(dstDir + 'zip/')) {
                        fsHelper.mkdirsSync(dstDir + 'zip/');
                    }
                    images(dstName).size(400).save(dstDir + 'zip/' + name);
                });
            }
            console.log(param);
            database.multiInsert(sql, param, function (message, result) {
                if (message === 20) {
                    callback(20, result);
                    socialService.broadToFollowers(userId, `您关注的${nickName}上传了${param.length}张新照片`)
                } else {
                    callback(21);
                }
            });
        }
    });
};

exports.preUpload = function (file, dir, callback) {
    var uploadedPath = file.path;
    var dstPath = dir;
    dstPath = dstPath + file.originalFilename;
    //重命名为真实文件名
    fs.rename(uploadedPath, dstPath, function (err) {
        if (err) {
            callback({ message: 21 });
        } else {
            callback({
                message: 20
            })
        }
    });
};

exports.fetchPhotos = function (token, callback) {
    database.checkToken(token, function (err, result) {
        if (err) {
            console.log(err);
            callback(41);
        } else if (result.length === 0) {
            callback(21);
        } else {
            var sql = 'SELECT * FROM photos WHERE userId = ? and deleted="f"';
            var param = [result[0].userId];
            database.query(sql, param, function (err, result) {
                if (err) {
                    console.log(err);
                    callback(41);
                } else {
                    callback(20, result);
                }
            })
        }
    })
};

exports.fetchPhotosById = function (userId, callback) {
    var sql = 'SELECT photos.*, users.nickName, users.avatarUrl, users.userId FROM photos JOIN users On photos.userId=users.userId WHERE photos.userId = ? and deleted="f"';
    var param = [userId];
    database.query(sql, param, function (err, result) {
        if (err) {
            console.log(err);
            callback(21);
        } else {
            callback(20, result);
        }
    })
};

exports.getNewPhotos = function (callback) {
    var sql = 'SELECT photos.*, users.nickName, users.avatarUrl, users.userId ' +
        'FROM photos ' +
        'INNER JOIN users ' +
        'ON photos.userId=users.userId ' +
        'where deleted="f" ' +
        'ORDER BY photoId DESC';
    database.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            callback(41);
        } else {
            if (result.length > 20) {
                result = result.slice(0, 20);
            }
            callback(20, result);
        }
    })
};

exports.getHotPhotos = function (callback) {
    var sql = 'SELECT photos.*, users.nickName, users.avatarUrl, users.userId ' +
        'FROM photos ' +
        'INNER JOIN users ' +
        'ON photos.userId=users.userId ' +
        'where deleted="f" ' +
        'ORDER BY liked DESC limit 15';
    database.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            callback(41);
        } else {
            var fetchedList = {};
            var index = 0;
            var re = [];
            while (re.length < 9) {
                index = Math.random() * result.length;
                index = parseInt(index);
                if (fetchedList[index] !== 1) {
                    re.push(result[index]);
                    fetchedList[index] = 1;
                }

            }
            callback(20, re);
        }
    })
};

exports.randomPhoto = function (callback) {
    var sql = 'SELECT photos.*, users.nickName, users.userId as author FROM photos JOIN users ON photos.userId=users.userId where deleted="f" order by photos.photoId limit 10';
    database.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            callback(21);
        } else {
            var fetchedList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            var index = 0;
            var re = [];
            while (re.length < 5) {
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
};

exports.searchPhoto = function (keyString, callback) {
    var photolist = [];
    var queryList = "";
    var keywords = splitKeywords(keyString);
    queryList = queryList + 'photos.title LIKE "%' + keywords[0] + '%" ' + 'OR photos.intro LIKE "%' + keywords[0] + '%" ';
    for (var i = 1; i < keywords.length; i += 1) {
        queryList = queryList + ' OR photos.title LIKE "%' + keywords[i] + '%" ' + 'OR photos.intro LIKE "%' + keywords[0] + '%" ' + 'OR photos.tags LIKE "%' + keywords[0] + '%" ';
    }
    var sql =
        'SELECT photos.*, users.nickName, users.avatarUrl, users.userId ' +
        'FROM photos ' +
        'INNER JOIN users ' +
        'ON photos.userId=users.userId ' +
        'WHERE ' + queryList +
        'AND deleted="f" ' +
        'ORDER BY photoId DESC';
    database.query(sql, function (err, result) {
        callback(err, result);
    })
}

function splitKeywords(keyString) {
    return keyString.split(' ');
}

exports.getLikedPhotos = function (token, callback) {
    database.checkToken(token, function (err, result) {
        if (err) {
            console.log(err);
            callback(21);
        } else if (result.length === 1) {
            database.query(
                `select p.*, u.nickName, u.avatarUrl from photos p join users u on p.userId=u.userId  where p.deleted="f" p.userId=? and photoId in (select photoId from like where userId=?)`,
                [result[0].userId, result[0].userId],
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
exports.deletePhoto = function (token, photoId, callback) {
    database.checkToken(token, function (err, result) {
        if (err) {
            console.log(err);
            callback(21);
        } else if (result.length === 1) {
            database.insert('update photos set deleted="t" where userId=? and photoId=?', [result[0].userId, photoId], function (err, result) {
                if (err) {
                    console.log(err);
                    callback(21);
                } else {
                    callback(20);
                }
            });
        }
    })
}