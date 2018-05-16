var express = require('express');
var router = express.Router();
var authService = require('../service/userService');
var fs = require('fs');
var fsHelper = require('../service/file/fshelper');
var multiparty = require('multiparty');
var database = require('../service/dbconnect');

/* GET users listing. */
router.post('/userInfo', function (req, res) {
    authService.getUserInfo(req.cookies.token, function (err, result) {
        if (err || result.length === 0) {
            console.log(err);
            res.send({
                message: 21
            });
        } else {
            res.send({
                message: 20,
                data: result[0]
            })
        }
    });
});

router.post('/modifyInfo', function (req, res) {
    authService.modifyInfo(req.cookies.token, req.body.userInfo, function (message) {
        res.send({
            message: message
        })
    })
});
router.post('/modifyAvatar', function(req, res) {
    console.log(req.cookies.token);
    let userId = 0;
    database.checkToken(req.cookies.token, function (err, result) {
        if (err || result.length === 0) {
            res.send({ message: 41 });
            res.end();
        } else {
            userId = result[0].userId;
            //生成multiparty对象，并配置上传目标路径
            const uploadDir = './data/avatar/' + result[0].userId + '/files/';
            var form = new multiparty.Form({ uploadDir: uploadDir });
            if (!fs.existsSync(uploadDir)) {
                fsHelper.mkdirsSync(uploadDir);
            }
            //上传完成后处理
            form.parse(req, function (err, fields, files) {
                if (err) {
                    console.log(err);
                    res.send({ message: 21 });
                } else {
                    authService.modifyAvatar(files.file[0], uploadDir, userId, function (result) {
                        res.send({ message: result.message });
                    })
                }
            });
        }
    });
});
router.get('/hostInfo', function (req, res) {
    var token = req.cookies.token
    authService.getHostInfo(token, req.query.hostId, function (message, result) {
        if(message === 20 || message === 40){
            res.send({
                message,
                data: result[0]
            })
        } else {
            res.send({
                message,
            })
        }
    });
});
module.exports = router;
