var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lessonSchema=new Schema({
    name:String,
    tittle:String,
    translateTittle:String
});
var Lesson = mongoose.model('Lesson', lessonSchema,'lesson');
module.exports=Lesson;