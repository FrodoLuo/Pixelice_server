var express = require('express');
var router = express.Router();
var authService = require('../service/auth');

router.post('/test', function(req, res) {
    console.log('req is: ' + req.body.test);
    res.send({
        message: 20,
        body: req.body,
        param: req.params,
        query: req.query
    });
});
router.post('/userInfo', function(req, res) {
    console.log(req.cookies.token);
    authService.getUserInfo(req.cookies.token, function(err, result) {
       if (err) {
           console.log(err);
           res.send({
               message: 21
           });
       } else {
           res.send({
               message: 20,
               data: result
           })
       }
    });
});
router.post('/signUp', function(req, res) {
    const data = JSON.parse(req.body.vo);
    authService.signUp(data, function (err, result, token) {
        if(err) {
            console.log(err);
            switch (err.code) {
                case 'ER_DUP_ENTRY':
                    res.send({message: 21});
                    break;
            }
        } else {
            console.log(result);
            console.log(token);
            res.send({
                message: 20,
                token: token
            });
        }
    })
});

module.exports = router;
