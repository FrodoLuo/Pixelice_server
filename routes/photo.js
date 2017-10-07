var express = require('express');
var router = express.Router();

/* GET users listing. */
/**
 * 根据传入照片id获取照片的url的方法, 返回值为未压缩的图片的url
 */
router.get('/photo', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;