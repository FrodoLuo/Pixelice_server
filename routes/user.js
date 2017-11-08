var express = require('express');
var router = express.Router();
var authService = require('../service/userService');

/* GET users listing. */
router.post('/userInfo', function(req, res) {
    authService.getUserInfo(req.cookies.token, function(err, result) {
        if ( err || result.length === 0 ) {
            console.log(err);
            res.send({
                message: 21
            });
        } else  {
            res.send({
                message: 20,
                data: result[0]
            })
        }
    });
});

router.post('/modifyInfo', function(req, res) {
    authService.modifyInfo(req.cookies.token, req.body.userInfo, function(message){
        res.send({
            message: message
        })
    })
});

router.get('/hostInfo', function(req, res) {
    authService.getHostInfo(req.query.hostId, function(err, result) {
        if(err){
            console.log(err);
            res.send({
                message: 21,
                data: undefined
            });
        } else if(result.length === 0){
            res.send({
                messgae: 24,
                data: undefined
            });
        } else {
            res.send({
                message: 20,
                data: result[0]
            })
        }
    });
});
module.exports = router;
