'use strict'
// IMPORTACIONES
var Usuario = require("../modelos/usuario.model");
var fs = require('fs');
var path = require('path');

function registrarUsuario(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;

    if (req.user.rol === 'ROL_EMPRESA') {
        if (params.username) {
            usuarioModel.username = params.username;
            usuarioModel.empresa = req.user.sub;
            usuarioModel.puesto = params.puesto;
            usuarioModel.departamento = params.departamento;
            usuarioModel.image = null;
            Usuario.findOne({ username: params.username, empresa: req.user.sub }).exec((err, adminoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                if (!adminoEncontrado) {
                    usuarioModel.save((err, adminoEncontrado) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                        if (!adminoEncontrado) return res.status(500).send({ mensaje: 'no se guardó la liga' });
                        return res.status(200).send({ adminoEncontrado });
                    });

                } else {
                    return res.status(500).send({ mensaje: 'este equipo ya existe' });
                }
            });

        } else {
            return res.status(500).send({ mensaje: 'no puede dejar parametros vacios' });
        }

    } else {
        return res.status(500).send({ mensaje: 'no tienes permisos' });
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
    var empresaID = req.user.sub;
    var params = req.body;

    Usuario.find({ 'empresa': empresaID, _id: params._id }, (err, usuarioEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'No existe o no es parte de la empresa el empleado que busca' })
        return res.status(200).send({ usuarioEncontrado })

    })
}

function obtenerUsuarioNom(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;

    Usuario.find({ 'empresa': empresaID, username: params.username }, (err, usuarioEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'No existe o no es parte de la empresa el empleado que busca' })
        return res.status(200).send({ usuarioEncontrado })

    })
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

function verEmpleados(req, res) {

    Usuario.find({ empresa: req.user.sub }, (err, usuarioEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!usuarioEncontradas) return res.status(500).send({ mensaje: 'Aún no hay empleados' });

        return res.status(200).send({ usuarioEncontradas });
    });
}

function obtenerEmpleado(req, res) {
    var id = req.params.id;

    Usuario.findOne({ _id: id }, (err, usuario_registrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!usuario_registrado) return res.status(500).send({ mensaje: "Error en peticion" });
        return res.status(200).send({ usuario_registrado });
    })

}

function obtenerGeneral(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;
    if (req.user.rol === 'ROL_EMPRESA') {
        Usuario.findOne({ 'empresa': empresaID, username: params.username }, (err, usuarioEncontrado) => {
            if (err) res.status(500).send({ mensaje: 'No existe o no es parte de la empresa el empleado que busca' })
            if (usuarioEncontrado) return res.status(200).send({ usuarioEncontrado })

            Usuario.findOne({ 'empresa': empresaID, puesto: params.puesto }, (err, usuarioEncontrado) => {
                if (err) res.status(500).send({ mensaje: 'No existe o no es parte de la empresa el empleado que busca' })
                if (usuarioEncontrado) return res.status(200).send({ usuarioEncontrado })

                Usuario.findOne({ 'empresa': empresaID, departamento: params.departamento }, (err, usuarioEncontrado) => {
                    if (err) res.status(500).send({ mensaje: 'No existe o no es parte de la empresa el empleado que busca' })
                    if (usuarioEncontrado) return res.status(200).send({ usuarioEncontrado })


                })
            })

        })


    } else res.status(500).send({ mensaje: "No tienes permisos" });
}

function obtenerEmpleadoNombre(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;
    if (req.user.rol === 'ROL_EMPRESA') {
        Usuario.findOne({ 'empresa': empresaID, username: params.username }, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
            if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
            return res.status(200).send({ usuarioEncontrado });
        });

    }
}

function obtenerUsuarioPuesto(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;
    if (req.user.rol === 'ROL_EMPRESA') {
        Usuario.findOne({ 'empresa': empresaID, puesto: params.puesto }, (err, usuarioEncontrado) => {
            if (err) res.status(500).send({ mensaje: 'No existe o no es parte de la empresa el empleado que busca' })
            return res.status(200).send({ usuarioEncontrado })

        })
    }
}

function obtenerUsuarioDep(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;

    if (req.user.rol === 'ROL_EMPRESA') {
        Usuario.findOne({ 'empresa': empresaID, departamento: params.departamento }, (err, usuarioEncontrado) => {
            if (err) res.status(500).send({ mensaje: 'No existe o no es parte de la empresa el empleado que busca' })
            return res.status(200).send({ usuarioEncontrado })

        })
    }

}

module.exports = {
    registrarUsuario,
    editarUsuario,
    eliminarUsuario,
    obtenerUsuarioID,
    obtenerUsuarioNom,
    obtenerUsuarioPuesto,
    obtenerUsuarioDep,
    obtenerUsuariosEmpresa,
    verEmpleados,
    obtenerEmpleado,
    obtenerGeneral,
    obtenerEmpleadoNombre
}