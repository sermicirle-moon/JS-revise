const express = require('express');
const authenController = require('../controllers/authenController');
const router = express.Router();
const authenValidator = require('../validators/authenValidate');

router.post('/register', authenValidator.registerValidate, authenController.registerController);

module.exports = router;    