var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var fsHelper = require('../service/file/fshelper');

var database = require('../service/dbconnect');
var photoService = require('../service/photo');

/* GET users listing. */
/**
 * 根据传入照片id获取照片的url的方法, 返回值为未压缩的图片的url
 */
router.get('/photo/:photoId', function(req, res) {
    res.send('respond with a resource');
});

/**
 * 根据req中cookie的token来获取该用户所上传的照片信息列表
 */
router.post('/fetchPhotos', function(req, res) {
    const token = req.cookies.token;
    photoService.fetchPhotos(token, function(message, result){
        if(message === 20){
            res.send({
                message: message,
                data: result
            })
        }
    });
});
/**
 * 根据上传界面的结果, 将文件从temp中移动到用户file中
 */
router.post('/upload', function(req, res){
    photoService.upload(req.cookies.token, req.body.list, req.body.info, function(message){
        res.send({
            message: message
        });
        res.end();
    });
});
/**
 * 图片预先上传
 */
router.post('/preUpload', function(req, res){
    console.log(req.cookies.token);
    database.checkToken(req.cookies.token, function (err,result) {
        if(err||result.length===0) {
            res.send({message: 41});
            res.end();
        }else{
            //生成multiparty对象，并配置上传目标路径
            const uploadDir = './public/temp/' + result[0].userId + '/files/';
            var form = new multiparty.Form({uploadDir: uploadDir});
            if(!fs.existsSync(uploadDir)) {
                fsHelper.mkdirsSync(uploadDir);
            }
            //上传完成后处理
            form.parse(req, function(err, fields, files) {
                if(err){
                    console.log(err);
                    res.send({message: 21});
                } else {
                    photoService.preUpload(files.file[0], uploadDir, function(result) {
                        res.send({ message: result.message });
                    })
                }
            });
        }
    });
});

/**
 * 根据创建id获取最近的20张图片
 */
router.post('/getNewPhotos', function(req, res) {
    photoService.getNewPhotos(function(message, result){
        if (message !== 20) {
            res.send({
                message: message
            });
            res.end()
        } else {
            res.send({
                message: message,
                data: result
            })
        }
    })
});
/**
 * 根据图片的liked来获取最受欢迎的20张图片
 */
router.post('/getHotPhotos', function(req, res) {

});
module.exports = router;