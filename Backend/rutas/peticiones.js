
// Dependencias
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const eschema=mongoose.Schema;
const path = require('path');
const storage = multer.diskStorage({
    destination: 'images/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });
//create schema with Time=Date.now()
const eschemapeticiones=new eschema({
    nombre:String,
    apellido:String,
    problema:[String],
    lugar:String,
    imagen:String,
    descripcion:String,
    idusuario:String,
    idpeticion:String,
    aceptado: {
      type: Boolean,
      default: false
    },

    fecha: {
      type: String,
      default: () => {
          const fechaActual = new Date();
          const fechaFormateada = ("0" + fechaActual.getDate()).slice(-2) + "/" +
              ("0" + (fechaActual.getMonth() + 1)).slice(-2) + "/" +
              fechaActual.getFullYear().toString().slice(-2);
          return fechaFormateada;
      }
     },
     hora: {
      type: String,
      default: () => {
          const fechaActual = new Date();
          const horaFormateada = ("0" + fechaActual.getHours()).slice(-2) + ":" +
              ("0" + fechaActual.getMinutes()).slice(-2);
          return horaFormateada;
      }
    } 

});

const peticiones=mongoose.model('peticiones',eschemapeticiones);
module.exports=router;

//guardar peticiones
router.post('/mandar-peticion', upload.single('imagen'), (req, res) => {
    // Guardar petición
  let imagen = null;
  if (req.file) {
    imagen = req.file.filename; // Obtén el nombre del archivo guardado por multer
  }

  const nuevapeticion = new peticiones({
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    problema: req.body.problema,
    lugar: req.body.lugar,
    imagen: imagen, // Establecer la imagen o null
    descripcion: req.body.descripcion,
    idusuario: req.body.idusuario,
    idpeticion: req.body.idpeticion

  });
  
    nuevapeticion.save()
      .then(() => {
        res.send("Peticion agregada");
      })
      .catch((err) => {
        res.send(err);
      }); 
  });

  router.get('/obtener_peticiones/:idusuario', (req, res) => {
    const idusuario = req.params.idusuario;
    peticiones.find({ idusuario }) 
      .then((usuario) => {
        res.send(usuario);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  router.get('/obtener_solicitudes', (req, res) => {
   
    peticiones.find({ aceptado: false }) 
      .then((usuario) => {
        res.send(usuario);
      })
      .catch((err) => {
        res.send(err);
      });
  });

    
//eliminar peticiones por id
router.delete('/eliminar_peticion/:idpeticion', (req, res) => {
  peticiones.findOneAndDelete(req.params.idpeticion)
    .then(() => {
      res.send("Peticion eliminada");
    }
    )
    .catch((err) => {
      res.send(err);
    }
    );
});

//actualizar para aceptar peticiones
router.post('/aceptar_peticion/:idpeticion', (req, res) => {
  const idPeticion = req.params.idpeticion;

  peticiones.findOneAndUpdate(
    { idpeticion: idPeticion },
    { aceptado: true },
    { new: true }
  )
    .then(() => {
      res.send("Peticion actualizada");
    })
    .catch(err => {
      res.send(err);
    });
});

router.get('/obtener_solicitudes_aceptadas', (req, res) => {
   
  peticiones.find({ aceptado: true }) 
    .then((usuario) => {
      res.send(usuario);
    })
    .catch((err) => {
      res.send(err);
    });
});