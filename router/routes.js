const express = require('express');
const route = express.Router();
const userController = require('../Controller/user.controller');

route.post('/register',userController.register);
route.post('/login',userController.auth);
route.put('/logout',userController.logout);
route.get('/list',userController.list);
route.get('/listById',userController.listById);
route.get('/search',userController.search);
route.put('/updateUser',userController.updateUser);
module.exports =route;