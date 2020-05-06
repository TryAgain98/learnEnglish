const express = require('express');
const router = express.Router();
const userController=require('../controllersAPI/startDial.controller');

router.get('/',userController.index);

module.exports=router;