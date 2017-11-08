var database = require('./dbconnect');
var fs = require('fs');
var fsHelper = require('./file/fshelper');
var config = require('../config');
var images = require('images');
require('./dateTimeHelper');

exports.upload = function (token, list, info, callback) {
    var name;
    database.checkToken(token, function(err, result) {
        if(result.length!==1){
            callback(21);
        }else{
            var userId = result[0].userId;
            var fromDir = './public/temp/' + userId + '/files/';
            var dstDir = './data/' + userId + '/photos/';
            var dstDir_ = 'data/' + userId + '/photos/';
            var zipDir = './data/' + userId + '/photos/zip/';
            var zipDir_ = 'data/' + userId + '/photos/zip/';
            if(!fs.existsSync(dstDir)){
                fsHelper.mkdirsSync(dstDir);
            }
            var sql = 'INSERT INTO photos (photoUrl,zipUrl,userId,title,intro,date) VALUES (?,?,?,?,?,?)';
            var param=[];
            const date = new Date();
            
            for (var i = 0; i < list.length; i += 1) {
                const name = info.title +'_'+ Math.random().toString()+'\.'+list[i].split('\.')[1];
                const zip_name = 'zip_'+name;
                param.push([
                    config.PRODUCTION.RESOURCE_URL+dstDir_+name,
                    config.PRODUCTION.RESOURCE_URL+zipDir_+name,
                    userId,
                    info.title,
                    info.intro,
                    date.format('yyyy-MM-dd hh:mm:ss')
                ]);
                const fromName = fromDir+list[i];
                const dstName = dstDir+name;
                fs.rename(fromName, dstDir + name, function(err){
                    if(err){
                        console.log(err);
                        callback(41);
                    }
                    if(!fs.existsSync(dstDir+'zip/')){
                        fsHelper.mkdirsSync(dstDir+'zip/');
                    }
                    images(dstName).size(400).save(dstDir + 'zip/' + name);
                });
            }
            console.log(param);
            database.multiInsert(sql, param, function(err, result){
                if(err){
                    console.log(err);
                    callback(41);
                }else{
                    callback(20);
                }
            });
        }
    });
};

exports.preUpload = function(file, dir, callback) {
    var uploadedPath = file.path;
    var dstPath = dir;
    dstPath = dstPath + file.originalFilename;
    //重命名为真实文件名
    fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
            callback({message: 21});
        } else {
            callback({
                message: 20
            })
        }
    });
};

exports.fetchPhotos = function(token, callback) {
    database.checkToken(token, function(err, result){
        if (err) {
            console.log(err);
            callback(41);
        } else if (result.length === 0) {
            callback(21);
        } else {
            var sql = 'SELECT * FROM photos WHERE userId = ?';
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

exports.getNewPhotos = function(callback) {
    var sql = 'SELECT photos.*, users.nickName, users.avatarUrl ' +
        'FROM photos ' +
        'INNER JOIN users ' +
        'ON photos.userId=users.userId ' +
        'ORDER BY photoId DESC';
    database.query(sql, function(err, result){
        if(err){
            console.log(err);
            callback(41);
        }else{
            if(result.length > 20){
                result = result.slice(0, 20);
            }
            callback(20, result);
        }
    })
};

exports.getHotPhotos = function(callback) {
    var sql = 'SELECT photos.*, users.nickName, users.avatarUrl ' +
        'FROM photos ' +
        'INNER JOIN users ' +
        'ON photos.userId=users.userId ' +
        'ORDER BY photoId DESC';
    database.query(sql, function(err, result){
        if(err){
            console.log(err);
            callback(41);
        }else{
            if(result.length > 20){
                result = result.slice(0, 20);
            }
            callback(20, result);
        }
    })
};

exports.randomPhoto = function(callback) {
    var sql = 'SELECT photos.*, users.nickName as author FROM photos JOIN users ON photos.userId=users.userId';
    database.query(sql, function(err, result) {
        if(err){
            console.log(err);
            callback(45);
        } else {
            var index = 0;
            var re = [];
            while(re.length < 5){
                index = Math.random()*result.length;
                index = parseInt(index);
                re.push(result[index]);
            }
            callback(20, re);
        }
    })
};

exports.searchPhoto = function(keyString, callback) {
    var photolist = [];
    var queryList = "";
    var keywords = splitKeywords(keyString);
    queryList = queryList + 'photos.title LIKE "%'+keywords[0]+'%" ' + 'OR photos.intro LIKE "%'+keywords[0]+'%" ';
    for (var i = 1; i < keywords.length; i += 1) {
        queryList = queryList + ' OR photo.title LIKE "%' + keywords[i]+'%" ' + 'OR photos.intro LIKE "%'+keywords[0]+'%" ';
    }
    var sql = 
    'SELECT photos.*, users.nickName, users.avatarUrl ' +
    'FROM photos ' +
    'INNER JOIN users ' +
    'ON photos.userId=users.userId ' +
    'WHERE '+ queryList +
    'ORDER BY photoId DESC';
    database.query(sql, function(err, result) {
        callback(err, result);
    })
}

function splitKeywords(keyString) {
    return keyString.split(' ');
}