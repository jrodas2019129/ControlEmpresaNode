// IMPORTACION
const mongoose = require("mongoose")
const app = require("./app")
var empresaControlador = require("./src/controladores/empresa.controlador")

mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://admin:admin@cluster0.j4rss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Se encuentra conectado a la base de datos');

    app.listen(process.env.PORT || 3000, function() {
        console.log("Servidor corriendo en el puerto 3000");
        empresaControlador.adminApp();
    })
}).catch(err => console.log(err))