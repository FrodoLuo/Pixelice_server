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

router.post('/signUp', function(req, res) {
    const data = JSON.parse(req.body.vo);
    if (authService.signUp(data)) {
        res.send({
            message: 20
        })
    }else {
        res.send({
            message: 21
        });
    }
});

module.exports = router;
