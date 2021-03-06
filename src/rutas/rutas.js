'use strict'
var express = require("express");
var multiparty = require("connect-multiparty");

var md_autorizacion = require("../middlewares/authenticated.js");
var md_subir = multiparty({ uploadDir: './src/imagenes/empresas' })

var api = express.Router();
var usuarioControlador = require("../controladores/usuario.controlador");
var empresaControlador = require("../controladores/empresa.controlador")
var productoControlador = require("../controladores/producto.controlador");

// Funciones Controlador Usuarios
api.post("/registrarUsuario", md_autorizacion.ensureAuth, usuarioControlador.registrarUsuario);
api.put("/editarUsuario", md_autorizacion.ensureAuth, usuarioControlador.editarUsuario);
api.post("/eliminarUsuario", usuarioControlador.eliminarUsuario);
api.get("/obtenerUsuarioID", md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuarioID);
api.post("/obtenerUsuarioNom", md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuarioNom);
api.post('/obtenerEmpleadoNombre', md_autorizacion.ensureAuth, usuarioControlador.obtenerEmpleadoNombre);
api.get("/obtenerUsuarioDep", md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuarioDep)
api.get("/obtenerUsuarioPuesto", md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuarioPuesto);
api.get("/obtenerUsuarioDep", md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuarioDep)
api.get("/obtenerUsuariosEmpresa/:id?", md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuariosEmpresa)
api.get("/verEmpleados", md_autorizacion.ensureAuth, usuarioControlador.verEmpleados);
api.get("/obtenerEmpleado/:id", md_autorizacion.ensureAuth, usuarioControlador.obtenerEmpleado);
api.post("/obtenerGeneral", md_autorizacion.ensureAuth, usuarioControlador.obtenerGeneral);


// Funciones Controlador Empresa
api.post("/login", empresaControlador.login);
api.post("/registrarEmpresa", md_autorizacion.ensureAuth, empresaControlador.registrarEmpresa);
api.put("/editarEmpresa", md_autorizacion.ensureAuth, empresaControlador.editarEmpresa);
api.post("/eliminarEmpresa", empresaControlador.eliminarEmpresa)
api.get("/obtenerEmpresaID/:id", md_autorizacion.ensureAuth, empresaControlador.obtenerEmpresaID);
api.get("/obtenerEmpresas", md_autorizacion.ensureAuth, empresaControlador.obtenerEmpresas);
api.post("/subirImagen", [md_autorizacion.ensureAuth, md_subir], empresaControlador.subirImagen)
api.get('/obtenerImagen/:imagen', empresaControlador.obtenerImagen);
api.get("/verCuenta", md_autorizacion.ensureAuth, empresaControlador.verCuenta)

// Funciones Controlador Producto
api.post("/registrarProducto", md_autorizacion.ensureAuth, productoControlador.registrarProducto);
api.post("/aumentarProductos", productoControlador.aumentarProductos);
api.get("/obtenerProductosCantidadMayor", md_autorizacion.ensureAuth, productoControlador.obtenerProductosCantidadMayor);
api.get("/obtenerProductosCantidadMenor", md_autorizacion.ensureAuth, productoControlador.obtenerProductosCantidadMenor);
api.get("/obtenerProductoNom", md_autorizacion.ensureAuth, productoControlador.obtenerProductoNom);
api.get("/obtenerProductoPro", md_autorizacion.ensureAuth, productoControlador.obtenerProductoPro);
api.post("/ventaProductos", productoControlador.ventaProductos)
api.put("/editarProducto", md_autorizacion.ensureAuth, productoControlador.editarProducto);
api.delete("/eliminarProducto", md_autorizacion.ensureAuth, productoControlador.eliminarProducto);
api.get("/verProductos", md_autorizacion.ensureAuth, productoControlador.verProductos);
api.get("/obtenerProducto/:id", md_autorizacion.ensureAuth, productoControlador.obtenerProducto);
api.post("/eliminarProductoNombre", productoControlador.eliminarProductoNombre);
api.post("/obtenerGeneralProducto", md_autorizacion.ensureAuth, productoControlador.obtenerGeneralProducto);

module.exports = api;