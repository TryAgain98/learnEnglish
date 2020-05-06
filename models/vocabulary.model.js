var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vocabularySchema=new Schema({
    vocabulary : String,
    translate:String,
    _idLesson:String
});
var Vocabulary = mongoose.model('Vocabulary', vocabularySchema,'vocabulary');
module.exports=Vocabulary;