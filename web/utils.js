var mongodb = require('mongodb'); 
var url = "mongodb://localhost:27017/test"; 

///////////////////////////
/////MONGO STUFF//////////
/////////////////////////

module.exports.insertUser = function (user, callback){
  mongodb.connect(url, function(err, db){
    if(err){
      console.log(err); 
    } 
    else {
      console.log("connected to mongo at ", url); 
      db.collection('users').insert(user); 
      db.close(); 
      callback ? callback() : null;  
    }
  });
};

module.exports.findUser = function(user, callback){
  mongodb.connect(url, function(err, db){
    if(err){
      console.log(err); 
    }
    else {
      db.collection('users').find({username: user}).toArray(function(err, results){
        callback(results); 
        db.close(); //it must be closed here or it won't work
      }); 
    }
  });
}


///////////////////////////
/////SESSION STUFF////////
/////////////////////////

module.exports.createSession = function (req, res, user) {
 return req.session.regenerate(function() {
    req.session.user = user;
    res.redirect('/');
  });
};

module.exports.destroySession = function (req, res){
  return req.session.destroy(function(){
    res.redirect('/'); 
  });
};

var isLoggedIn = function(req) {
  return req.session ? !! req.session.user : false;
};

module.exports.checkUser = function(req, res, next){
  console.log(req.session); 
  if (!isLoggedIn(req)) {
    res.redirect('/signup');
  } else {
    next();
  }
};

