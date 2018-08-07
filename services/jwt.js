'use strict'

var jwt = require('jwt-simple');
var momment = require('moment');
var secret = 'bicicleta';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: momment().unix(),
        exp: momment().add(30, 'days').unix()
    };//¿Qué es un payload? = esta recibiendo o entregando

    return jwt.encode(payload, secret);
}