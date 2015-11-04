var express = require('express');
var path = require('path');
var body = require('body-parser'); 
var app = express();
var fs = require('fs'); 
var session = require('express-session'); 
var mongodb = require('mongodb'); 
var bcrypt = require('bcrypt-nodejs'); 
var utils = require('./utils.js'); 

app.listen(8080, function () {
  console.log("running on 8080");
});

app.use(express.static('./statics'));
app.use(body.urlencoded({ extended: false }))
app.use(session({
  secret: "mysecret", 
  resave: false, 
  cookie: {maxAge: 3600000}, 
  saveUninitialized: true
}));

app.route("/")
  .get(function (req, res) {
    res.send("./statics/index.html"); 
  })
  .post(function (req, res) {
    console.log(req.body)
  });

app.get("/restricted", utils.checkUser, function (req, res){
    res.send('protected page'); 
  });

app.get("/logout", function (req, res){
  utils.destroySession(req, res); 
});

app.route("/signup")
  .get(function (req, res){
    res.sendFile(__dirname + "/statics/signup.html")
  })
  .post(function (req, res){
    var user = req.body.username; 
    var pw = req.body.password; 
    bcrypt.hash(pw, null, null, function(err, pw){
      utils.insertUser({username: user, password: pw}, function(){
        //write session
        utils.createSession(req, res, user); 
      });   
    });   
  })

app.route("/login")
  .get(function (req, res){
    res.sendFile(__dirname + "/statics/login.html"); 
  })
  .post(function (req, res){
    var user = req.body.username; 
    var pw = req.body.password; 
    utils.findUser(user, function(user){
      console.log(user);   
       bcrypt.compare(pw, user[0].password, function(err, match) {
          console.log("compare", err, match)
          if (match) {
            utils.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
    }); 
    
  })



