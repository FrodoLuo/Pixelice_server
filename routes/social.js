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
    if (message === 20) {
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
router.post('/follow', function (req, res) {
  const token = req.cookies.token;
  const followedId = req.body.followedId;
  socialService.follow(token, followedId, function (message, result) {
    res.send({ message, data: result });
  })
})

router.post('/unfollow', function (req, res) {
  const token = req.cookies.token;
  const followedId = req.body.followedId;
  socialService.unfollow(token, followedId, function (message, result) {
    res.send({ message, data: result });
  })
})

router.post('/sendMessage', function (req, res) {
  const token = req.cookies.token;
  const receiverId = req.body.receiverId;
  const content = req.body.content;
  socialService.sendMessage(token, receiverId, content, function (message, result) {
    res.send({
      message,
      data: result,
    });
  })
})

router.post('/fetchMessages', function (req, res) {
  const token = req.cookies.token;
  socialService.fetchMessages(token, function (message, result) {
    res.send({
      message,
      data: result,
    })
  })
})
router.post('/fetchSentMessages', function (req, res) {
  const token = req.cookies.token;
  socialService.fetchSentMessages(token, function (message, result) {
    res.send({
      message,
      data: result,
    })
  })
})
router.post('/messageDetail', function (req, res) {
  const token = req.cookies.token;
  const messageId = req.body.messageId;
  socialService.getMessageDetail(token, messageId, function (message, result) {
    res.send({
      message,
      data: result,
    })
  })
})
router.post('/countUnread', function (req, res) {
  const token = req.cookies.token;
  socialService.fetchUnreadCount(token, function (message, result) {
    res.send({
      message,
      data: result
    })
  })
})

router.post('/getFollowedUsers', function (req, res) {
  const token = req.cookies.token;
  socialService.getFollowedUser(token, function (message, result) {
    res.send({
      message,
      data: result,
    })
  })
})
module.exports = router;
