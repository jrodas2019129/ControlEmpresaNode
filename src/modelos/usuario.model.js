'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    username: String,
    empresa: { type: Schema.ObjectId, ref: 'empresas' },
    puesto: String,
    departamento: String,
    imagen: String
});

module.exports = mongoose.model('usuarios', UsuarioSchema);