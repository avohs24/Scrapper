var mongoose = require('mongoose');

//Create Schema Class
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: {
    type: String
}
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
