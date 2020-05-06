const lessonModel = require('../models/lesson.model');
const vocabularyModel = require('../models/vocabulary.model');

module.exports.home= async function (req, res, next) { 
    let lesson = await lessonModel.find();
    let vocabulary=await vocabularyModel.find().limit(30).skip(10);
    let totalNumberVocabulary=await vocabularyModel.count();
    res.render('index.ejs', {
        lesson: lesson,
        vocabulary:vocabulary,
        totalNumberVocabulary
    });
}
//LESSON
module.exports.getAddLesson=async function (req, res, next) {
    let lesson = await lessonModel.find();
    var skip=0;
    let totalNumberLesson = await lessonModel.count();
    let eachPage=5; // số lesson hiển thị ở mỗi trang là bn
    let lessonPage = await lessonModel.find().limit(eachPage).skip(skip);
    let totalNumberPage=Math.ceil(totalNumberLesson/eachPage); // đếm xem có bao nhiêu trang
    res.render('addLesson.ejs', {
        lesson: lesson,
        totalNumberPage,
        lessonPage,
        totalNumberLesson,
        skip
    });
};
module.exports.getShowLessonPage=async function(req,res,next){
    let skip=parseInt(req.query.id);// trang đó hiển thị ở phần tử nào
    let eachPage=5; // số lesson hiển thị ở mỗi trang là bn 
    let lesson = await lessonModel.find();
    let totalNumberLesson = await lessonModel.count();
    let totalNumberPage=Math.ceil(totalNumberLesson/eachPage); // đếm xem có bao nhiêu trang
    if(skip<0){
        skip=0   
    }
    

    let lessonPage = await lessonModel.find().limit(eachPage).skip(skip*eachPage);
    res.render('addLesson.ejs', {
        lesson: lesson,
        totalNumberPage,
        lessonPage,
        totalNumberLesson,
        skip
    });
}
module.exports.editLesson=async (req,res,next)=>{
    var _id=req.query._id;
    
    var oneLesson=await lessonModel.findOne({_id});
    let lesson = await lessonModel.find();
    res.render('editLesson.ejs', {
        lesson,
        oneLesson
    });
}
module.exports.postEditLesson=async (req,res,next)=>{
    var {_id,name,tittle,translateTittle}=req.body;
    var q = lessonModel.where({ _id });
    q.update({
        $set: {
            _id,
            name,
            tittle,
            translateTittle
        }
    }).exec(); // not executed
    var skip=0;
    let lesson = await lessonModel.find();
    let lessonPage = await lessonModel.find().limit(5).skip(0);
    let totalNumberLesson = await lessonModel.count();
    let eachPage=5; // số lesson hiển thị ở mỗi trang là bn
    let totalNumberPage=Math.ceil(totalNumberLesson/eachPage); // đếm xem có bao nhiêu trang
    res.render('addLesson.ejs', {
        lesson: lesson,
        lessonPage,
        totalNumberPage,
        eachPage,
        totalNumberLesson,
        skip
    });


}
module.exports.postAddLesson= async function (req, res, next) {

    var {name,tittle,translateTittle} = req.body;
    
    let Lesson = new lessonModel({
        name,
        tittle,
        translateTittle
    })
    Lesson.save(function (err, book) {
        if (err) return console.error(err);
    });
    let vocabulary=await vocabularyModel.find();
    let newLesson = await lessonModel.find();
    let totalNumberVocabulary=await vocabularyModel.count();
    res.render('index.ejs', {
        lesson: newLesson,
        vocabulary,
        totalNumberVocabulary
    });
}

// vocabulary
module.exports.getAddVocabulary= async function (req, res, next) {
    let _idLesson=req.query._id;
    let oneLesson= await lessonModel.findOne({_id:_idLesson});
    let lesson = await lessonModel.find();
    res.render('addVocabulary.ejs', {
        lesson,
        oneLesson
    });
}
module.exports.postAddVocabulary=async function (req, res, next) {
    let vocabulary = req.body.vocabulary;
    let translate = req.body.translate;
    let _idLesson = req.body._idLesson;
    let oneLesson= await lessonModel.findOne({_id:_idLesson});
    let newVocabulary = new vocabularyModel({
        vocabulary: vocabulary,
        translate: translate,
        _idLesson: _idLesson,
    });
    newVocabulary.save(function(err,vocabulary){
        if(err) return console.error(err);
        console.log(vocabulary + " saved to vocabulary collection.");
    })
    let newLesson = await lessonModel.find();
    res.render('addVocabulary.ejs', {
        lesson: newLesson,
        oneLesson
    });
}

module.exports.getDeleteVocabulary=async function(req,res,next){
    let id=req.query.id;
    vocabularyModel.deleteOne({ _id: id }, function (err) {});
    let lesson = await lessonModel.find();
    let vocabulary=await vocabularyModel.find();
    let totalNumberVocabulary=await vocabularyModel.count();
    res.render('index.ejs', {
        lesson: lesson,
        vocabulary:vocabulary,
        totalNumberVocabulary
    });
}

module.exports.getEditVocabulary= async (req,res,next)=>{
    let _id=req.query._id;
    let lesson = await lessonModel.find();
    let vocabulary=await vocabularyModel.findOne({_id:_id});
    res.render('editVocabulary.ejs', {
        lesson: lesson,
        vocabulary:vocabulary
    });
}
module.exports.postEditVocabulary= async (req,res,next)=>{
    var {translate,_id} = req.body;
    var q = vocabularyModel.where({ _id: _id });
    q.update({
        $set: {
            vocabulary:req.body.vocabulary,
            translate:req.body.translate,
            _idLesson:req.body._idLesson
        }
    }).exec(); // not executed
    var lesson = await lessonModel.find();
    let totalNumberVocabulary=await vocabularyModel.count();
    let vocabulary=await vocabularyModel.find();
    res.render('index.ejs', {
        lesson: lesson,
        vocabulary:vocabulary,
        totalNumberVocabulary
    });
}

module.exports.showVocabularyFromLesson= async (req,res,next)=>{
    let _idLesson=req.query.id;
    let oneLesson= await lessonModel.findOne({_id:_idLesson});
    let lesson = await lessonModel.find();
    let vocabulary=await vocabularyModel.find({_idLesson});
    let totalNumberVocabulary=await vocabularyModel.count();
    res.render('index.ejs', {
        lesson: lesson,
        vocabulary:vocabulary,
        oneLesson,
        totalNumberVocabulary
    });


}

module.exports.postSearchVocabulary=async (req,res,next)=>{

    var nameSreach=req.body.search;
    console.log(nameSreach);
    name = req.body.search;
    let totalNumberVocabulary=await vocabularyModel.count();
    let vocabulary=await vocabularyModel.find({
        vocabulary: { $regex: '.*' + name + '.*', $options: 'smi' }
    });
    let lesson = await lessonModel.find();
    
    res.render('index.ejs', {
        lesson: lesson,
        vocabulary:vocabulary,
        totalNumberVocabulary
    });
}
//take an exam
function shuffleArray(array) {
    for (let i = array.length -1 ; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
module.exports.getStartTakeAnExam=async function(req,res,next){
    let _idLesson=req.query.id_;
    let nameLesson = await lessonModel.findOne({_id:_idLesson});
    

    let newVocabulary=await vocabularyModel.find({_idLesson:_idLesson});
    
    let countQuestion=await vocabularyModel.find({_idLesson:_idLesson}).count();
    let newLesson = await lessonModel.find();
    res.render('startTakeAnExam.ejs', {
        lesson: newLesson,
        listVocabulary:shuffleArray(newVocabulary),
        countQuestion:countQuestion,
        numberTrueAnswer:0,
        nameLesson:nameLesson.name
    });
}

//dial
module.exports.getDial=async (req,res,next)=>{

    let lesson = await lessonModel.find();
    res.render('dial.ejs', {
        lesson: lesson
    });
}