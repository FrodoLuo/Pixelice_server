var database = require('./dbconnect');
var fs = require('fs');

exports.preUpload = function(file, callback) {
    var uploadedPath = file.path;
    var dstPath = './public/temp/files/' + file.originalFilename;
    //重命名为真实文件名
    fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
            callback({message: 21});
        } else {
            callback({
                message: 20
            })
        }
    });
};