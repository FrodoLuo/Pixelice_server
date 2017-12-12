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
router.post('/sendVerify', function(req, res) {
   const token = req.cookies.token;
   authService.sendVerify(token, function(err, result, message) {
       if (err) {
           console.log(err);
           res.send({
               message: message
           });
       } else {
           res.send({
               message: message
           });
       }
       res.end();
   })
});
router.post('/signUp', function(req, res) {
    const data = JSON.parse(req.body.vo);
    authService.signUp(data, function (err, result, token) {
        if(err) {
            console.log(err);
            switch (err.errno) {
                case '19':
                    res.send({message: 21});
                    break;
                default:
                    res.send({message: 21});
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
router.get('/verify', function(req, res){
    const verifyCode = req.query.verifyCode;
    console.log(verifyCode);
    authService.verify(verifyCode, function(err, result, message) {
        res.set('Content-Type', 'text/html;charset=utf-8');
        if(err){
            console.log(err);
            res.send('<p>数据库错误</p>');
        }else{
            if(message===21){
                res.send('<p>验证信息错误或已失效, 请重新发送</p>');
            } else {
                res.send('<p>验证已完成</p>');
            }
        }
        res.end();
    });
});
module.exports = router;
