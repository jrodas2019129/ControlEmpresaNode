'use strict'
// IMPORTACIONES
var Usuario = require("../modelos/usuario.model");
var Empresa = require('../modelos/empresa.model')
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");
var fs = require('fs');
var path = require('path');

function adminApp(req, res) {
    var empresaModel = Empresa();
    empresaModel.username = "ADMIN";
    empresaModel.rol = "ROL_ADMIN";
    Empresa.find({
        username: "ADMIN"
    }).exec((err, adminoEncontrado) => {
        if (err) return console.log({ mensaje: "Error creando Administrador" });
        if (adminoEncontrado.length >= 1) {
            return console.log("El Administrador está listo");
        } else {
            bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
                empresaModel.password = passwordEncriptada;
                empresaModel.save((err, usuarioguardado) => {
                    if (err) return console.log({ mensaje: "Error en la peticion" });
                    if (usuarioguardado) {
                        console.log("Administrador listo");
                    } else {
                        console.log({ mensaje: "El administrador no está listo" });
                    }
                });
            });
        }
    });
}

function login(req, res) {
    var params = req.body;

    Empresa.findOne({ username: params.username }, (err, EmpresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (EmpresaEncontrada) {
            bcrypt.compare(params.password, EmpresaEncontrada.password, (err, passVerificada) => {
                if (err) return res.status(500).send({ mensaje: "Error en la petición" });
                if (passVerificada) {
                    if (params.getToken == "true") {
                        return res.status(200).send({
                            token: jwt.createToken(EmpresaEncontrada)
                        });
                    } else {
                        EmpresaEncontrada.password = undefined;
                        return res.status(200).send({ EmpresaEncontrada });
                    }
                } else {
                    return res.status(500).send({ mensaje: "El usuario no se ha podido identificar" });
                }
            })
        } else {
            return res.status(500).send({ mensaje: "Error al buscar usuario" });
        }
    });
}

function registrarEmpresa(req, res) {
    var empresaModel = new Empresa();
    var params = req.body;

    if (req.user.rol === 'ROL_ADMIN') {
        if (params.username && params.password) {
            empresaModel.username = params.username;
            empresaModel.rol = "ROL_EMPRESA";
            empresaModel.imagen = null;

            Empresa.find({
                username: params.username
            }).exec((err, EmpresaEncontrada) => {
                if (err) return console.log({ mensaje: "Error en la peticion" });
                if (EmpresaEncontrada.length >= 1) {
                    return res.status(500).send("Esta empresa ya existe");
                } else {
                    bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                        empresaModel.password = passwordEncriptada;
                        empresaModel.save((err, empresaGuardada) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (empresaGuardada) {
                                res.status(200).send({ empresaGuardada });
                            } else {
                                res.status(500).send({ mensaje: "Error al registrar la empresa" });
                            }
                        });
                    });
                }
            });
        } else {
            if (err) return res.status(500).send({ mensaje: "No puede deje espacios vacios" });
        }
    } else {
        return res.status(500).send({ mensaje: 'Solo el ADMIN puede crear Empresas' })
    }
}

function editarEmpresa(req, res) {
    var params = req.body;

    delete params.password;
    delete params.rol;

    if (req.user.rol === 'ROL_ADMIN') {
        Empresa.updateOne({ _id: params._id }, {
            $set: {
                username: params.username
            }
        }, { new: true }, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEncontrada) return res.status(500).send({ mensaje: 'No se a podido editar la Empresa' });

            return res.status(200).send({ empresaEncontrada })
        })
    } else {
        return res.status(500).send({ message: 'No tienes permiso para actualizar los datos' });
    }
}

function eliminarEmpresa(req, res) {
    var params = req.body;

    if (req.user.rol === 'ROL_ADMIN') {
        Empresa.deleteOne({ _id: params._id }, {
            $set: {
                username: params.username
            }
        }, { new: true }, (err, empresaEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEliminada) return res.status(500).send({ mensaje: 'No se a podido eliminar a la Empresa' });

            return res.status(200).send({ empresaEliminada })
        })
    }
}

function obtenerEmpresaID(req, res) {
    var empresaID = req.params.id;

    if (req.user.rol === "ROL_ADMIN") {
        Empresa.findOne({ empresaID, rol: "ROL_EMPRESA" }, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEncontrada) return res.status(500).send({ mensaje: 'Error al obtener la empresa.' });
            return res.status(200).send({ empresaEncontrada });
        })
    }
}

function obtenerEmpresas(req, res) {

    if (req.user.rol === "ROL_ADMIN") {
        Empresa.find({ rol: "ROL_EMPRESA" }).exec((err, empresasEncontradas) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de obtener Usuarios' });
            if (!empresasEncontradas) return res.status(500).send({ mensaje: 'Error en la consutla de Usuarios o no tiene datos' });
            return res.status(200).send({ empresasEncontradas });
        })
    }
}

module.exports = {
    adminApp,
    login,
    registrarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    obtenerEmpresaID,
    obtenerEmpresas
}