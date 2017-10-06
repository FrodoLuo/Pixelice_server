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
router.post('/signIn', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    authService.signIn(username, password, function(err, result, message, token) {
        if(message === 20) {
            res.send({
                message: 20,
                token: token
            }).end();
        } else if (message === 21) {
            res.send({
                message: 21
            }).end();
        } else {
            res.status(500).send('Wrong with the database.').end();
        }
    })
});
module.exports = router;
