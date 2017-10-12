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
module.exports = router;