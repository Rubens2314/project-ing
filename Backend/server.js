const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
//importar conexion mongoDB
const archivoBD=require('./conexion');

//Importacion del archivo rutas y modelo usuario
const rutausuario=require('./rutas/usuario');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api/usuario',rutausuario);

//importacion del archivo rutas y modelo peticiones
const rutapeticiones=require('./rutas/peticiones');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api/peticiones',rutapeticiones);

// Configurar la carpeta "images" como una carpeta estática
app.use('/images', express.static(path.join(__dirname, 'images')))

app.get('/', function(req, res) {
    res.send('Server online');
});
//configurar server basico
app.listen(5000,function(){
    console.log("Server online");
  
});  