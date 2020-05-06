var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gradeSchema=new Schema({
    id_lesson:String,
    grade:Number
});
var Grade = mongoose.model('Grade', gradeSchema,'grade');
module.exports=Grade;