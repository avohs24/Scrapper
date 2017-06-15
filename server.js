var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');

//require models for DB
var Article = require('./models/Article.js');
var Comment = require('./models/Comment.js');

//scraping tools
var request = require('request');
var cheerio = require('cheerio');


mongoose.Promise = Promise;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));


//serve our static documents within the public directory
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/scrapper');
var db = mongoose.connection;

db.on('error', function(error){
  console.log('Mongoose Error: ', error);
});

db.once('open', function(){
  console.log('Mongoose connection successful');
});

app.get('/scrape', function(req, res){
  request("http://www.businessinsider.com/", function(error, response, html){
    var $ = cheerio.load(html);


    $('a.title').each(function(i, element){
      var result = [];
      console.log(result);

      result.title = $(this).text();
      result.link = $(this).attr('href');

      var entry = new Article(result);

      entry.save(function(err, doc){
        if(err){
          console.log(err);
        }else{
          console.log(doc);
        }
      });

    });
        res.send("Scrape Complete");
  });
});


app.get('/articles', function(req, res){
  Article.find({}, function(error, doc){
    if (error){
      console.log(error);
    }else {
      res.send(doc);
    }
  });
});

app.get('/articles/:id', function(req, res){
  Article.find({"_id": req.params.id})
  .populate('comment')
  .exec(function(error, doc){
    if(error){
      console.log(error);
    }else {
    res.json(doc);
  }
  });
});


app.post('/articles/:id', function(req, res){
  var newComment = new Comment(req.body);

  newComment.save(function(error, doc){
    if(error){
      console.log(error);
    }else{
      Article.findOneAndUpdate({'_id': req.params.id}, {'comment': doc._id})

      .exec(function(err, doc){
        if(err){
          console.log(err);
        }else{
          res.send(doc);
        }
      });
    }
  });
});

app.listen(3000, function(){
  console.log("App running on port 3000!");
});
