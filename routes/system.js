const express = require('express');
const databse = require('../service/dbconnect');
const router = express.Router();

router.post('/users', function(req, res) {
  databse.checkToken(req.cookies.token, function(err, result) {
    if(result[0].userId !== 1) {
      res.sendStatus(503);
    } else {
      databse.query('select * from users', function(err, result) {
        if(err){
          console.log(err);
          res.send({
            message: 21,
            data: result,
          })
        } else {
          res.send({
            message: 20,
            data: result,
          })
        }
      })
    }
  })
})
router.post('/photos', function(req, res) {
  databse.checkToken(req.cookies.token, function(err, result) {
    if(result[0].userId !== 1) {
      res.sendStatus(503);
    } else {
      databse.query('select * from photos', function(err, result) {
        if(err){
          console.log(err);
          res.send({
            message: 21,
            data: result,
          })
        } else {
          res.send({
            message: 20,
            data: result,
          })
        }
      })
    }
  })
})
router.post('/albums', function(req, res) {
  databse.checkToken(req.cookies.token, function(err, result) {
    if(result[0].userId !== 1) {
      res.sendStatus(503);
    } else {
      databse.query('select * from albums', function(err, result) {
        if(err){
          console.log(err);
          res.send({
            message: 21,
            data: result,
          })
        } else {
          res.send({
            message: 20,
            data: result,
          })
        }
      })
    }
  })
})
router.post('/logins', function(req, res) {
  databse.checkToken(req.cookies.token, function(err, result) {
    if(result[0].userId !== 1) {
      res.sendStatus(503);
    } else {
      databse.query('select * from login', function(err, result) {
        if(err){
          console.log(err);
          res.send({
            message: 21,
            data: result,
          })
        } else {
          res.send({
            message: 20,
            data: result,
          })
        }
      })
    }
  })
})

module.exports = router;
