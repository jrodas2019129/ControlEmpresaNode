'use strict'
// IMPORTACIONES
var Producto = require("../modelos/producto.model");
var fs = require('fs');
var path = require('path');

function registrarProducto(req, res) {
    var empresaID = req.user.sub
    var params = req.body;

    if (req.user.rol === 'ROL_EMPRESA') {
        if (params.nombre) {
            var productoModel = new Producto();
            productoModel.nombre = params.nombre;
            productoModel.nombreProveedor = params.nombreProveedor;
            productoModel.stock = params.stock;
            productoModel.cantidadVendida = 0;
            productoModel.empresa = empresaID;

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

function aumentarProductos(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;
    var stock = Number(params.stock)

    Producto.findOneAndUpdate({ 'empresa': empresaID, _id: params._id }, { $inc: { stock: stock } }, { new: true }, (err, productoEditado) => {
        return res.status(200).send({ productoEditado })

    })
}

function obtenerProductosCantidadMayor(req, res) {
    var empresaID = req.user.sub;

    Producto.find({ 'empresa': empresaID }, (err, productoEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'No encontramos el producto que desea' })
        return res.status(200).send({ productoEncontrado })

    }).sort({ "stock": -1 })
}

function obtenerProductosCantidadMenor(req, res) {
    var empresaID = req.user.sub;

    Producto.find({ 'empresa': empresaID }, (err, productoEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'No encontramos el producto que desea' })
        return res.status(200).send({ productoEncontrado })

    }).sort({ "stock": 1 })
}

function obtenerProductoNom(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;

    Producto.find({ 'empresa': empresaID, nombre: params.nombre }, (err, productoEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'No encontramos el producto que desea' })
        return res.status(200).send({ productoEncontrado })

    })
}

function obtenerProductoPro(req, res) {
    var empresaID = req.user.sub;
    var params = req.body;

    Producto.find({ 'empresa': empresaID, nombreProveedor: params.nombreProveedor }, (err, productoEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'No encontramos el producto que desea' })
        return res.status(200).send({ productoEncontrado })

    })
}

function ventaProductos(req, res) {
    var params = req.body;
    var cantidadVendida = Number(params.cantidadVendida)

    Producto.findOne({ _id: params._id }, (err, productoEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'error' });

        if (productoEncontrado.stock < cantidadVendida) {
            return res.status(200).send({ mensaje: 'No hay sufiente producto para realizar la venta' });
        } else {
            Producto.findOneAndUpdate({ _id: params._id }, { $inc: { cantidadVendida: cantidadVendida, stock: -cantidadVendida } }, { new: true }, (err, productoEditado) => {
                return res.status(200).send({ productoEditado });
            });
        }
    })
}

module.exports = {
    registrarProducto,
    aumentarProductos,
    obtenerProductosCantidadMayor,
    obtenerProductosCantidadMenor,
    obtenerProductoNom,
    obtenerProductoPro,
    ventaProductos
}