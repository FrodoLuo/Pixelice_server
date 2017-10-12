var database = require('./dbconnect');
var fs = require('fs');
var fsHelper = require('./file/fshelper');
var config = require('../config');

exports.upload = function (token, list, info, callback) {
    console.log(token);
    console.log(list);
    console.log(info);
    var name;
    database.checkToken(token, function(err, result) {
        if(result.length!==1){
            callback(21);
        }else{
            var userId = result[0].userId;
            var fromDir = './public/temp/' + userId + '/files/';
            var dstDir = './data/' + userId + '/photos/';
            var dstDir_ = 'data/' + userId + '/photos/';
            if(!fs.existsSync(dstDir)){
                fsHelper.mkdirsSync(dstDir);
            }
            var sql = 'INSERT INTO photos (photoUrl, userId, title, intro) VALUE ?';
            var param=[];
            // const date = new Date().
            for (var i = 0; i < list.length; i += 1) {
                name =info.title +'_'+ Math.random().toString()+'\.'+list[i].split('\.')[1];
                fs.rename(fromDir+list[i], dstDir+name, function(err){
                    if(err){
                        console.log(err);
                        callback(41);
                    }else{
                        param.push([config.PRODUCTION.RESOURCE_URL+dstDir_+name, userId, info.title, info.intro]);
                        console.log(param);
                    }
                });
            }
            console.log(param);
            database.query(sql, [param], function(err, result){
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