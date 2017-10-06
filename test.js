var md5 = require('md5');
function createToken(username) {
    var string = username + Math.random().toString() + new Date().getSeconds().toString();
    console.log(string);
    return md5(string);
}
console.log(createToken('lyz1996'));