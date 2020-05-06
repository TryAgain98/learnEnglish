const express = require('express');
const router = express.Router();
const lessonModel = require('../models/lesson.model');
const vocabularyModel = require('../models/vocabulary.model');
const vocabularyC = require('../controllers/vocabulary.controller');

router.get('/',vocabularyC.home);
router.get('/addLesson', vocabularyC.getAddLesson);
router.get('/addVocabulary', vocabularyC.getAddVocabulary);

router.post('/addLesson', vocabularyC.postAddLesson);
router.post('/addVocabulary', vocabularyC.postAddVocabulary);

router.get('/startTakeAnExam',vocabularyC.getStartTakeAnExam);

router.get('/deleteVocabulary',vocabularyC.getDeleteVocabulary);

router.get('/editVocabulary' , vocabularyC.getEditVocabulary);

router.post('/editVocabulary', vocabularyC.postEditVocabulary);

router.get('/showVocabularyFromLesson',vocabularyC.showVocabularyFromLesson);
router.get('/editLesson',vocabularyC.editLesson);

router.post('/editLesson',vocabularyC.postEditLesson);

router.post('/searchVocabulary',vocabularyC.postSearchVocabulary);

router.get('/showLessonPage',vocabularyC.getShowLessonPage);

router.get('/dial',vocabularyC.getDial);

module.exports = router;