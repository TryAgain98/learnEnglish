require('dotenv').config();
const vocabularyModel = require('./models/vocabulary.model');
const startDialApiRoute=require('./api/routesAPI/startDial.route');
const express = require('express');
const vocabularyC=require('./controllers/vocabulary.controller');
const app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

const vocabularyRoute = require('./routes/vocabulary.route');

var mongoose = require('mongoose');
mongoose.connect(process.env.urlMongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
 
});

const bodyParser = require('body-parser');
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/',vocabularyC.home);
app.use('/vocabulary', vocabularyRoute);
app.use('/startDial',startDialApiRoute);

io.on('connection', function (socket) {

  socket.on('getData-client',async function(data){
    let _idLesson=data;
    let newVocabulary=await vocabularyModel.find({_idLesson:_idLesson});
    let countQuestion=await vocabularyModel.find({_idLesson:_idLesson}).count();
    socket.emit('server-returnData', {
        listVocabulary:newVocabulary,
        countQuestion:countQuestion,
        numberTrueAnswer:0
    });
  });


  socket.on('client-send', function (data) { // khi user làm xong 1 câu
    
    var inputVocabulary = data.vocabulary; // từ nhập vào-
    var numberTrueAnswer = data.numberTrueAnswer;
    var listVocabulary = data.listVocabulary;
    var translate=null;
    var correctAnswer=null;
    var numberFalseAnswer=data.numberFalseAnswer;
    var listWrongV=data.listWrongV; // ds cac tu vung lam sai 
    
    if(data.listVocabulary.length>0){
      var oldVocabulary = data.listVocabulary[0].vocabulary;
      translate=data.listVocabulary[0].translate; // nghia trong db
      //error
      correctAnswer =
    {
      oldVocabulary,
      translate,
      inputVocabulary
    }
      if ( inputVocabulary.toLowerCase().trim() == oldVocabulary.toLowerCase().trim()) {
        if(numberFalseAnswer!=1){
          numberTrueAnswer++;
        }
        numberFalseAnswer=0;
        correctAnswer=null;
        listVocabulary.splice(0, 1);
      }
      else{
        
        var vocabulary={
          vocablary:oldVocabulary,
          translate:translate
        }
        if(numberFalseAnswer!=1){
          listWrongV.push(vocabulary);
        }
        numberFalseAnswer=1;
      }
    }
    
    
    socket.emit('server-send',{
      listVocabulary,
      numberTrueAnswer,
      navbarLesson:data.navbarLesson,
      correctAnswer,
      numberFalseAnswer,
      listWrongV
    });
    
    if(listVocabulary.length ===0){
      var totalQ=data.totalQ;
      var grade=parseFloat(numberTrueAnswer)/parseFloat(totalQ);
       
      socket.emit('server-send-inform',{
        numberTrueAnswer,
        totalQ:totalQ,
        grade:grade.toExponential(2)*10,
        listWrongV
      });
      return ;
    }

  });
});






http.listen(3000, function () {
  console.log('listening on *:3000');
});
