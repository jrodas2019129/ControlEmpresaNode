'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    empresa: { type: Schema.ObjectId, ref: 'empresas' },
    nombreProveedor: String,
    stock: Number,
    cantidadVendida: Number,
});

module.exports = mongoose.model('productos', ProductoSchema);