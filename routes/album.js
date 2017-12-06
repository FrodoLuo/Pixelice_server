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
router.post('/modifyAlbum', function(req, res) {
  var token = req.cookies.token;
  albumService.modifyAlbum(token, req.body.album, function(message, result) {
    if(message === 20) {
      res.send({
        message,
        data: result,
      })
    } else {
      res.send({
        message
      })
    }
  })
})
router.post('/createAlbum', function(req, res) {
  const token = req.cookies.token;
  const album = req.body.album;
  console.log(album);
  albumService.createAlbum(album, token, function(message, result) {
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
router.post('/removeAlbum', function(req, res) {
  const token = req.cookies.token;
  const albumId = req.body.albumId;
  albumService.removeAlbum(albumId, token, function(message, result) {
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
router.post('/addToAlbum', function(req, res) {
  const token = req.cookies.token;
  const albumId = req.body.albumId;
  const photoId = req.body.photoId;
  albumService.addToAlbum(token, photoId, albumId, function(message, result) {
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
  });
})
router.post('/removeFromAlbum', function(req, res) {
  const token = req.cookies.token;
  const albumId = req.body.albumId;
  const photoId = req.body.photoId;
  albumService.removeFromAlbum(token, photoId, albumId, function(message, result) {
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
  });
})
router.post('/findInAlbum', function(req, res) {
  const photoId = req.body.photoId;
  albumService.checkPhotoInAlbum(photoId, function(message, result) {
    if(message === 20) {
      res.send({
        message,
        data: result,
      });
    } else {
      res.send({
        message,
      })
    }
  })
})
router.post('/quickFetch', function(req, res) {
  const albumId = req.body.albumId;
  albumService.quickFetchPhotoByAlbum(albumId, function(message, result) {
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
})
module.exports = router;