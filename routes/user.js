'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middelware/authenticated');
var md_admin = require('../middelware/is_admin');

var api = express.Router();

api.get('/prueba', [md_auth.ensureAuth, md_admin.isAdmin], UserController.prueba);
api.post('/register', UserController.register);
api.post('/login', UserController.login);
api.post('/update-user/:id', md_auth.ensureAuth,UserController.updateUser);
api.delete('/delete-user/:id', [md_auth.ensureAuth], UserController.deleteUser)
api.put('/update-admin/:id', UserController.updateRoleAdmin);
api.put('/update-pass/', UserController.password);

module.exports = api;