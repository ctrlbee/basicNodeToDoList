var express = require('express');
var path = require('path');
var body = require('body-parser'); 
var app = express();
var fs = require('fs'); 

app.use(body.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  fs.readFile(path.join(__dirname, 'statics/index.html'), function(err, content){
    res.end(content);
  })
});

app.post("/", function (req, res) {
  console.log(req.body)

});

app.listen(8080, function () {
  console.log("running on 8080");
});
