'use strict'
// IMPORTACIONES
var Usuario = require("../modelos/usuario.model");
var Empresa = require("../modelos/empresa.model");
var Producto = require("../modelos/producto.model");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");
var fs = require('fs');
var path = require('path');

function registrarProducto(req, res) {
    var productoModel = new Producto();
    var params = req.body;

    if (req.user.rol === 'ROL_EMPRESA') {
        if (params.nombre) {
            productoModel.nombre = params.nombre;
            productoModel.nombreProveedor = params.nombreProveedor;
            productoModel.stock = params.stock;
            productoModel.cantidadVendida = 0;
            productoModel.empresa = req.user.sub;

            Producto.find({
                nombre: params.nombre
            }).exec((err, productoNoEncontrado) => {
                if (err) return console.log({ mensaje: "Error en la peticion" });
                if (productoNoEncontrado.length >= 1) {
                    return res.status(500).send("Este producto ya existe");
                } else {
                    productoModel.save((err, productoGuardado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (productoGuardado) {
                            res.status(200).send({ productoGuardado });
                        } else {
                            res.status(500).send({ mensaje: "Error al registrar producto" });
                        }
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

module.exports = {
    registrarProducto
}