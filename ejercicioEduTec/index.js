'use strict'

var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://user:Inicio123@ds231961.mlab.com:23490/mongotec')
//mongoose.connect('mongodb://localhost:27017/Zoo');
/*    .then(() => {
        console.log('La consexion a mongo a sido exitosa');
        app.listen(port, () => {
            console.log('El servidor local de node y express esta corriendo');
        });
    })
    .catch(err => console.log(err));*/

    app.listen(port);

    console.log('EduTec BackEnd is running...');