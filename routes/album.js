const express = require('express');
const albumService = require('../service/album')

const router = express.Router();
router.get('/getAlbumInfoById', function(req, res) {
  var albumId = req.query.albumId;
  albumService.getAlbumInfoById(albumId, function(message, result) {
    if(message === 20) {
      res.send({
        message,
        data: result
      });
    } else {
      res.send({
        message
      })
    }
  })
});
router.get('/getAlbumPhotos', function(req, res) {
  var albumId = req.query.albumId;
  var token = req.cookies.token;
  albumService.getAlbumContentById(token, albumId, function(message, result){
    if(message === 20) {
      res.send({
        message: 20,
        data: result
      });
    } else {
      res.send({
        message: message,
      })
    }
  })
});
router.post('/getAlbumsByToken', function(req, res) {
  var token = req.cookies.token;
  albumService.getAlbumsByToken(token, function(message, result) {
    if(message === 20) {
      res.send({
        message: 20,
        data: result
      });
    } else {
      res.send({
        message
      })
    }
  })
})
router.get('/getAlbumsByUserId', function(req, res) {
  var userId = req.query.userId;
  albumService.getAlbumsByUserId(userId, function(message, result) {
    if(message === 20) {
      res.send({
        message: 20,
        data: result
      });
    } else {
      res.send({
        message
      })
    }
  })
})
module.exports = router;