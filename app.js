'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var animalRoutes = require('./routes/animal');
var userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api', animalRoutes);
app.use('/api',userRoutes);

app.get ('/test', (req, res) => {
    res.status(200).send({
        message: 'mi primer'
    });
});

module.exports = app;