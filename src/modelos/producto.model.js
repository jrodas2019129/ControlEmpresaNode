'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    nombreProveedor: String,
    stock: Number,
    cantidadVendida: Number,
    empresa: { type: Schema.ObjectId, ref: 'empresas' }
});

module.exports = mongoose.model('productos', ProductoSchema);