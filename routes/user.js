var express = require('express');
var router = express.Router();
var authService = require('../service/userService');

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
