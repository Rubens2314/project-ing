const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const eschema=mongoose.Schema;

const eschemausuario=new eschema({
    nombre:String,
    apellido:String,
    email:String,
    telefono:Number,
    cedula:Number,
    password:String,
    idusuario:String,
    tokenAutenticacion: String,
    admin: { type: Boolean, default: false }
});

const ModeloUsuario=mongoose.model('usuarios',eschemausuario);
module.exports=router;

//prueba de conexion
router.get('/', (req, res) => {
    res.send('sigue activo');
});

router.post('/registrarse', (req, res) => {
    const nuevousuario = new ModeloUsuario({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      telefono: req.body.telefono,
      cedula: req.body.cedula,
      password: req.body.password,
      idusuario: req.body.idusuario,
      admin: req.body.admin
    });
    nuevousuario.save()
      .then(() => {
        res.send("Usuario agregado");
      })
      .catch((err) => {
        res.send(err);
      });
});


//verificacion de inicio de sesion
router.post('/iniciar-sesion', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Buscar el usuario por su email y contraseña
  ModeloUsuario.findOne({ email, password })
    .then((usuario) => {
      if (!usuario) {
        // El usuario no existe o las credenciales son inválidas
        res.status(401).send('Credenciales inválidas');
      
      } else {
        // Generar un token de autenticación (por ejemplo, usando jsonwebtoken)
        const token = jwt.sign({ userId: usuario._id }, 'clave_secreta_del_token', { expiresIn: '7d' });
        const userId = usuario.idusuario;
        // Guardar el token en el usuario
        usuario.tokenAutenticacion = token;
        usuario.save()
          .then(() => {
            res.send({
              message: 'Inicio de sesión exitoso',
              token: token,
              userId: userId

            });
          })
          .catch((error) => {
            res.status(500).send('Error al guardar el token de autenticación');
          });
      }
    })
    .catch((error) => {
      res.status(500).send('Error al iniciar sesión');
    });
});
// Middleware para verificar la autenticación
function autenticacionMiddleware(req, res, next) {
  const token = req.headers.authorization;

  // Verificar el token de autenticación
  jwt.verify(token, 'clave_secreta_del_token', (error, decodedToken) => {
    if (error) {
      res.status(401).send('Acceso no autorizado');
    } else {
      // El token es válido, obtener el ID de usuario y continuar con la siguiente ruta
      const userId = decodedToken.userId;
      ModeloUsuario.findById(userId)
        .then((usuario) => {
          if (!usuario) {
            res.status(401).send('Acceso no autorizado');
          } else {
            req.idusuario = usuario.idusuario;
            req.admin = usuario.admin;
            // El usuario está autenticado, continuar con la siguiente ruta
            next();
          }
        })
        .catch((error) => {
          res.status(500).send('Error al verificar la autenticación');
        });
    }
  });
}

// Ruta protegida que requiere autenticación
router.get('/ruta-protegida', autenticacionMiddleware, (req, res) => {

  const idusuario = req.idusuario;
  const admin = req.admin;
  res.send({
    message: 'Acceso autorizado',
    userId: idusuario,
    admin: admin

  });


});

//ruta para saber si el correo ya esta registrado
router.post('/correo', (req, res) => {
  const email = req.body.email;
  ModeloUsuario.findOne({ email })
    .then((usuario) => {
      if (!usuario) {
        res.send('correo no registrado');
      } else {
        res.send('correo registrado');
      }
    }

    )
    .catch((error) => {
      res.status(500).send('Error al verificar el correo');
    }
    );
});

