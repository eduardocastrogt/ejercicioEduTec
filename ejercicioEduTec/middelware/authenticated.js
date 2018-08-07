'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'bicicleta';

exports.ensureAuth = function(req, res, next){
    var authorizationHeader = req.headers.authorization;
    if(!authorizationHeader){
        return res.status(400).send({
            message: 'La petición debe de contener una cabezera de autenticación.'
        });
    }

    var token = req.headers.authorization.replace(/['"]+g/,'');
    try{
        var payload = jwt.decode(token,secret);
        var expireDate = payload.exp;
        var currentDate = moment().unix(); 
        if(expireDate <= currentDate){
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        }

        console.log(payload);
    }catch(exception){
        console.log(exception);
        return res.status(404).send({
            message: 'Token invalido'
        });
    }

    req.user = payload;
    next();
};