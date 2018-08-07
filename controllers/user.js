'use strict'
//Modulos cosas propias de node
var bcrypt = require('bcrypt-nodejs')
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt');
var constants = require('../Utils/Constants');


var User = require('../models/user');

function prueba(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuarios'
    })
}


function register(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.lastname && params.email && params.password){
        user.name  = params.name;
        user.lastname = params.lastname;
        user.email = params.email;
        //user.password = params.password;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({email: user.email}, (err, issetUser) => {
            if(err){
                res.status(500).send({
                    message: constants.constants.ERROR_IN_REQUEST
                });
            }else{
                if(!issetUser){
                    bcrypt.hash(params.password, null,null, (err, hash)=> {
                        user.password = hash;

                        user.save((err, userStored) => {
                            if(err){
                                res.status(500).send({
                                    message: constants.constants.USER_NOT_SAVE
                                });
                            }else{
                                if(!userStored){
                                    res.status(404).send({
                                        message: constants.constants.USER_NOT_REGISTER
                                    });
                                }else{
                                    res.status(200).send({
                                        user: userStored
                                    });
                                }
                            }
                        });
                    });
                }else{
                    res.status(200).send({
                        message: constants.constants.USER_NOT_REGISTER
                    });
                }
            }
        });
    }else{
        res.status(200).send({
            message: 'Parametros erroneos'
        });
    }
}

function login(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email:email}, (err,issetUser)=>{
        if(err){
            res.status(600).send({
                message: 'Error al buscar su usuario'
            });
        }else{
            if(issetUser){
                bcrypt.compare(password,issetUser.password,(err, check)=>{
                    /*if(err){
                        res.status(401).send({
                            message: 'Verifique su password'
                        });
                    }else */if(check){
                                if(params.gettoken){
                                    res.status(200).send({
                                        token: jwt.createToken(issetUser)
                                    });
                                }else{
                                    res.status(200).send({
                                        issetUser
                                    });
                                }
                        /*res.status(200).send({
                            message: 'token pendiente'
                        });*/
                    }else{
                        res.status(200).send({
                            message: 'El usuario no se ha logueado correctamente'
                        });
                    }
                });
            }else{
                res.status(404).send({
                    message: 'El usuario no ha podido loguearse'
                });
            }
        }
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var updateData = req.body;
    delete updateData.password;

    if(userId != req.user.sub){
        return res.status(401).send({
            message: 'No tiene permiso para modificar este usuario'
        });
    }

    User.findOneAndUpdate(userId, updateData, {new: true}, (err, userUpdated) =>{
        if(err){
            res.status(500).send({
                message: 'Error al actualizar el usuario'
            });
        }else{
            if(!userUpdated){
                res.status(404).send({
                    message: 'No se ha podido actualizar el usuario'
                });
            }else{
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    });
}



function deleteUser(req, res){
    var userId = req.params.id;

    User.findByIdAndRemove(userId, (err, userRemove) =>{
        if(err){
            res.status(500).send({
                message: 'Error en la petición'
            });
        }else{
            if(!userRemove){
                res.status(404).send({
                    message: 'No se ha encontrado el usuario'
                });
            }else{
                res.status(200).send({
                    message: `El usuario ${userRemoved.email} se ha eliminado exitosamente`
                });
            }
        }
    });
}

function updateRoleAdmin(req, res){
    var userId = req.params.id;
    var informacion = {role: "ROLE_ADMIN"};
    var update = informacion;

    User.findByIdAndUpdate(userId, update, (err, userUpdated)=> {
        if(err){
            res.status(500).send({
                message: 'Error en la petición'
            });
        }else{
            if(!userUpdated){
                res.status(400).send({
                    message: 'No se ha actualizado el usuario'
                });
            }else{
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    } );
}

function password(req, res){

    var userEmail = req.body.email;
    var user = new User();

    User.findOne({email: user.email}, (err, updatePass) => {
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }else{
            if(updatePass){
                bcrypt.hash(req.body.password, null, null, (err, hash) =>{
                    user.update({password: hash});
                });
            }
        }
    });

}

module.exports = {
    prueba,
    register,
    login,
    updateUser,
    deleteUser,
    updateRoleAdmin,
    password
}


//base de datos Redis