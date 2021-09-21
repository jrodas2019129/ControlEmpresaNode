'use strict'
var express = require("express");
var md_autorizacion = require("../middlewares/authenticated.js");

var api = express.Router();
var usuarioControlador = require("../controladores/usuario.controlador");
var empresaControlador = require("../controladores/empresa.controlador")
var productoControlador = require("../controladores/producto.controlador");

// Funciones Controlador Usuarios
api.post("/registrarUsuario", md_autorizacion.ensureAuth, usuarioControlador.registrarUsuario);
api.put("/editarUsuario", md_autorizacion.ensureAuth, usuarioControlador.editarUsuario);
api.delete("/eliminarUsuario", md_autorizacion.ensureAuth, usuarioControlador.eliminarUsuario);
api.get("/obtenerUsuarioID", usuarioControlador.obtenerUsuarioID);
api.get("/obtenerUsuarioNom", md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuarioNom);
api.get("/obtenerUsuariosEmpresa/:id?", md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuariosEmpresa)


// Funciones Controlador Empresa
api.post("/login", empresaControlador.login);
api.post("/registrarEmpresa", md_autorizacion.ensureAuth, empresaControlador.registrarEmpresa);
api.put("/editarEmpresa", md_autorizacion.ensureAuth, empresaControlador.editarEmpresa);
api.delete("/eliminarEmpresa", md_autorizacion.ensureAuth, empresaControlador.eliminarEmpresa)
api.get("/obtenerEmpresaID/:id", md_autorizacion.ensureAuth, empresaControlador.obtenerEmpresaID);
api.get("/obtenerEmpresas", md_autorizacion.ensureAuth, empresaControlador.obtenerEmpresas);

// Funciones Controlador Producto
api.post("/registrarProducto", md_autorizacion.ensureAuth, productoControlador.registrarProducto);
api.post("/aumentarProductos", productoControlador.aumentarProductos)
api.post("/ventaProductos", productoControlador.ventaProductos)

module.exports = api;