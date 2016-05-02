var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    // var data = {
    //     client_id: 'ae2404b9bbc55d36c197',
    //     client_secret: 'a6d683de104c74aeeb93405b7ecea1073aa0a962',
    //     code: req.query.code
    // };

    // request.post('https://github.com/login/oauth/access_token', data, function(err, response, body){
    //     //console.log(body);
    //     res.end(body);
    // });
    var url = 'https://github.com/login/oauth/access_token';
    url+='?client_id='+process.env.STARRED_CLIENT_ID;
    url+='&client_secret='+process.env.STARRED_CLIENT_SECRET;
    url+='&code='+req.query.code;
    var options = {
      url: url,
      headers: {
        'Accept': 'application/json'
      }
    };
    request.post(options, function(err, response, body){
        res.cookie('access_token', JSON.parse(body).access_token)
        res.redirect('/');
    });
});

module.exports = router;