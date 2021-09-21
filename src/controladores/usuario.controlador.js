'use strict'
// IMPORTACIONES
var Usuario = require("../modelos/usuario.model");
var Empresa = require("../modelos/empresa.model");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");
var fs = require('fs');
var path = require('path');

function registrarUsuario(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;

    if (req.user.rol === 'ROL_EMPRESA') {
        if (params.username && params.password) {
            usuarioModel.username = params.username;
            usuarioModel.empresa = req.user.sub;
            usuarioModel.puesto = params.puesto;
            usuarioModel.departamento = params.departamento;
            usuarioModel.rol = "ROL_USUARIO";
            usuarioModel.image = null;
            Usuario.find({
                username: params.username
            }).exec((err, adminoEncontrado) => {
                if (err) return console.log({ mensaje: "Error en la peticion" });
                if (adminoEncontrado.length >= 1) {
                    return res.status(500).send("Este usuario ya existe");
                } else {
                    bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;
                        usuarioModel.save((err, usuarioguardado) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (usuarioguardado) {
                                res.status(200).send({ usuarioguardado });
                            } else {
                                res.status(500).send({ mensaje: "Error al registrar el usuario" });
                            }
                        });
                    });
                }
            });
        } else {
            if (err) return res.status(500).send({ mensaje: "No puede deje espacios vacios" });
        }
    } else {
        return res.status(500).send({ mensaje: 'Solo la Empresa puede registrar Empleados' })
    }
}

function editarUsuario(req, res) {
    var params = req.body;

    delete params.password;
    delete params.rol;

    if (req.user.rol === 'ROL_EMPRESA') {
        Usuario.updateOne({ _id: params._id }, {
            $set: {
                username: params.username,
                puesto: params.puesto,
                departamento: params.departamento,
            }
        }, { new: true }, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'No se a podido editar al Usuario' });

            return res.status(200).send({ usuarioEncontrado })
        })
    } else {
        return res.status(500).send({ message: 'No tienes permiso para actualizar los datos' });
    }
}

function eliminarUsuario(req, res) {
    var params = req.body;

    if (req.user.rol === 'ROL_EMPRESA') {
        Usuario.deleteOne({ _id: params._id }, (err, usuarioEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioEliminada) return res.status(500).send({ mensaje: 'No se a podido eliminar a la Empresa' });

            return res.status(200).send({ usuarioEliminada })
        })
    }
}

function obtenerUsuarioID(req, res) {

}

function obtenerUsuarioNom(req, res) {

}

function obtenerUsuarioPuesto(req, res) {

}

function obtenerUsuarioDep(req, res) {

}

function obtenerUsuariosEmpresa(req, res) {
    var empresaID = req.user.sub;

    if (req.params.id) {
        empresaID = req.params.id;
    }

    Usuario.find({ empresa: empresaID }).populate('empresa', '_id username').exec((err, usuariosEncontrados) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!usuariosEncontrados) return res.status(404).send({ message: 'No tiene registrado ningun empleado' });
        return res.status(500).send({ usuariosEncontrados })
    })
}

module.exports = {
    registrarUsuario,
    editarUsuario,
    eliminarUsuario,
    obtenerUsuarioID,
    obtenerUsuarioNom,
    obtenerUsuarioPuesto,
    obtenerUsuarioDep,
    obtenerUsuariosEmpresa
}