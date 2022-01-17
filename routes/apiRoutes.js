const express = require('express');
const userController = require('../controller/userController')
const route = express.Router();

route.get('/', userController.home);
route.post('/signup', userController.signup);
route.get('/verify', userController.verify);
module.exports = route; 