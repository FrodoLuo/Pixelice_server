var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

var photoService = require('../service/photo');

/* GET users listing. */
/**
 * 根据传入照片id获取照片的url的方法, 返回值为未压缩的图片的url
 */
router.get('/photo/:photoId', function(req, res) {
    res.send('respond with a resource');
});

router.post('/upload', function(req, res){

});
router.post('/preUpload', function(req, res){
    //生成multiparty对象，并配置上传目标路径
    console.log('here');
    var form = new multiparty.Form({uploadDir: './public/temp/files/'});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        if(err){
            res.send({message: 21});
        } else {
            photoService.preUpload(files.file[0], function(result) {
                res.send({ message: result.message });
            })
        }
    });
});
module.exports = router;