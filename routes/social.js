const express = require('express');
const socialService = require('../service/socialService')

const router = express.Router();

router.post('/like', function (req, res) {
  const photoId = req.body.photoId;
  const token = req.cookies.token;
  socialService.likePhoto(token, photoId, function (message) {
    res.send({
      message
    })
  })
})
router.post('/dislike', function (req, res) {
  const photoId = req.body.photoId;
  const token = req.cookies.token;
  socialService.dislikePhoto(token, photoId, function (message) {
    res.send({
      message
    })
  })
})
router.post('/checkLiked', function (req, res) {
  const token = req.cookies.token;
  socialService.checkLiked(token, function (message, result) {
    if(message === 20) {
      res.send({
        message,
        data: result,
      });
    } else {
      res.send({
        message,
      });
    }
  })
})
module.exports = router;
