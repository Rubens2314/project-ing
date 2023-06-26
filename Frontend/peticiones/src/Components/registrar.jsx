import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import uniqid from 'uniqid'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/registrar.css'

//icons
import {AiOutlineRollback} from 'react-icons/ai'



function Registrar() {
  //hooks
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [cedula, setCedula] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registrado, setRegistrado] = useState(false);
  const [camposIncompletos, setCamposIncompletos] = useState([]);
  const [camposValidos, setCamposValidos] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [tipo_user, setTipo_user] = useState('no registrado');
  const [confirmacion, setConfirmacion] = useState(true);
  const [correoregistrado, setCorreoregistrado] = useState(false);
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const [isAdmin, setIsAdmin] = useState(false);
  const navegate = useNavigate();
  const Swal = require('sweetalert2')

  const handleAdminOrUser = (event) => {
    console.log('entra');
    const selectedtipo = event.target.value;
    if (selectedtipo === 'admin') {
      setAdmin(true);
      setConfirmacion(false);
    } 

    if (selectedtipo === 'usuario') {
      setAdmin(false);
      setConfirmacion(false);
    }
    if (selectedtipo === 'ninguno') {
       setConfirmacion(true);
    }
  
  };


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.get('/api/usuario/ruta-protegida', {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          console.log(response.data.message); 
          console.log(response.data.userId);
        
          response.data.admin ? setIsAdmin(true) : setIsAdmin(false);
          setTipo_user(() => (response.data.admin ? 'admin' : 'usuario'));

          
        
        })
        .catch(error => {
          console.log('Acceso no autorizado'); // El token no es válido o el usuario no está autenticado
     
        });
       

    } 
  }, []);

if (registrado && tipo_user === 'admin') {
  Swal.fire({
    icon: 'success',
    title: 'Registro exitoso',
    color: 'white',
    showConfirmButton: true,
    showCancelButton: true,
    
    background: 'rgb(15 23 42)',
  
    customClass: {
      container: 'my-swal-container',

    },
    cancelButtonText: 'Ir a inicio',
    confirmButtonText: 'Hacer otro registro',
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload()
     } else if (result.isDismissed) {
      navegate('/')
     }
  });
  if(registrado && tipo_user === 'usuario'){
  Swal.fire({
    icon: 'success',
    title: 'Registro exitoso',
    color: 'white',
    showConfirmButton: true,
    showCancelButton: true,
    
    background: 'rgb(15 23 42)',
  
    customClass: {
      container: 'my-swal-container ',

    },
    cancelButtonText: 'Ir a inicio',
    confirmButtonText: 'Iniciar sesion',
  }).then((result) => {
    if (result.isConfirmed) {
       navegate('/inicio_sesion')
      } else if (result.isDismissed) {
      navegate('/')
     }
  });
}
  setRegistrado(false)

}
function agregarUsuario(){
    var campos = []
    var campos_valido=[]
    var usuario = {
      nombre: nombre,
      apellido: apellido,
      cedula: cedula,
      telefono: telefono,
      email: email,
      password: password,
      idusuario: uniqid(),
      admin: admin
    }
    //validacion de campos
  
    if (nombre === '') {
      campos.push('nombre');
    } else {
      // Validar cantidad de caracteres y caracteres especiales en nombre
      if (nombre.length < 3  || nombre.includes('@') || /[^\w\s]/.test(nombre) || !/^[A-Za-z]+$/.test(nombre)) {
        // Agregar mensaje de error específico para el nombre
        campos.push('nombre (invalido)');
      }else {
        campos_valido.push('nombre valido');
      }

    }
    
    if (apellido === '') {
      campos.push('apellido');
    } else {
      // Validar cantidad de caracteres y caracteres especiales en apellido y solo letras
      if (apellido.length < 3 || apellido.includes('@') || /[^\w\s]/.test(apellido) || !/^[A-Za-z]+$/.test(apellido)  ) {
        // Agregar mensaje de error específico para el apellido
        campos.push('apellido (invalido)');
      }else {
        campos_valido.push('apellido valido');
      }
    }
    
    if (cedula === '') {
      campos.push('cedula');
    } else {
      // Validar longitud de cédula
      if (cedula.length > 10 || cedula.length < 8 ) {
        // Agregar mensaje de error específico para la cédula
        campos.push('cedula (invalida)');
      }else {
        campos_valido.push('cedula (valida)');
      }
    }
    
    if (telefono === '') {
      campos.push('telefono');
    } else {
      // Validar longitud de teléfono
      if (telefono.length !== 9) {
        // Agregar mensaje de error específico para el teléfono
        campos.push('telefono (invalido)');
      }else{
        campos_valido.push('telefono (valido)');
      }
    }
    if (!emailRegex.test(email)) {
      if (email === '') {
        campos.push('email')
        setCorreoregistrado(false)

      }else{
        campos.pop('email')
        campos.push('email (invalido)')
        setCorreoregistrado(false)

      }

    }else{
      
      campos_valido.push('email (valido)');
      setCorreoregistrado(false)


    } 
    if (email === '') {
      campos.pop('email (invalido)')
      campos.push('email')
      setCorreoregistrado(false)

    }

  if (password.length < 8) {
    if (password === '') {
      campos.push('password')

    }
    else{
     
      campos.push('password (invalido)')
    }
  }
    if (confirmacion === true) {
      campos.push('ninguno')
    }
    setCamposIncompletos(campos)
    setCamposValidos(campos_valido)
    if (campos.length > 0 ) {
      return
    }
    //conexion con usuario.js
    axios.post('/api/usuario/correo', usuario)
    .then(res => {
      if (res.data === 'correo no registrado') {
       axios.post('/api/usuario/registrarse', usuario)
        .then(res => {
          if (res.data === 'Usuario agregado') {
            setRegistrado(true)
            setCorreoregistrado(false)
            campos.pop('email (valido)')


          }
        }
        )
      } else {
        setCorreoregistrado(true)
      }
    })
    .catch(err => {
      console.log(err)
    }
    )

    
  }

  if (tipo_user === 'usuario') {
    navegate('/')
  }

  return(
   <div className='fondo_registro' >
   
   <div className='contenedor_registro'>
      
    
   <div className='flex flex-row' style={{ display: 'flex', alignItems: 'center' }}>
  <a href='/' className='contenedor_registro_a' style={{ marginRight: 'auto' }}>
    <AiOutlineRollback className='contenedor_registro_icono'/>
  </a>
  <div className="contenedor_registro_h1_container" style={{ flex: '1', textAlign: 'center' }}>
    <h1 className="contenedor_registro_h1">
      Registrate
    </h1>
  </div>
</div>


      
      <form className='flex flex-col contenedor_form'>
      <div className='flex flex-row justify-between'>
        <label htmlFor="name" className="titulo_input_r">
          Nombre
        </label>
        <label htmlFor="lastname" className="titulo_input_r_2">
          Apellido
        </label>
      </div>
        <div className='flex flex-row'>
        
        <input
          id="name"
          type='text'
          className={`diseño_input ${
            camposIncompletos.includes('nombre') ? 'border-red-500': ' border-stone-800' 
          }`}
          placeholder="Nombre"
          required value={nombre} onChange={(e) => setNombre(e.target.value)}
        />

        


        
        <input
          id="apellido"
          type='text'
          className={`diseño_input ${
            camposIncompletos.includes('apellido') ? 'border-red-500': ' border-stone-800' 
          }`}
          placeholder="Apellido"
          value={apellido} onChange={(e) => setApellido(e.target.value)
          }
        />
       

         </div>
         <div  className='flex flex-row justify-between'>
         {camposIncompletos.includes('nombre') && (<p className="diseño_completa"><span className="font-medium">Complete el campo.</span> </p>)}
         {camposIncompletos.includes('nombre (invalido)') && (<p className="diseño_completa"><span className="font-medium">Nombre invalido.</span> </p>)}
         {camposValidos.includes('nombre valido') && (<p className="diseño_completa_v"><span className="font-medium">Nombre valido.</span> </p>)}
         {camposIncompletos.includes('apellido') && (<p className="diseño_completa"><span className="font-medium">Complete el campo.</span> </p>)}
         {camposIncompletos.includes('apellido (invalido)') && (<p className="diseño_completa2"><span className="font-medium">Apellido invalido</span> </p>)}
          {camposValidos.includes('apellido valido') && (<p className="diseño_completa_v"><span className="font-medium">Apellido valido</span> </p>)}
     
        </div>
         <div  className='flex flex-row justify-between'>
        <label htmlFor="name" className="titulo_input_r">
          Cedula
        </label>
        <label htmlFor="lastname" className="titulo_input_r_2">
          Telefono
        </label>
        </div>
         <div className='flex flex-row'>
       
        <input
          type="number"
          id="cedula"
          className={`diseño_input
          ${camposIncompletos.includes('cedula') ? ' border-red-500': ' border-stone-800' 
        }`}
          placeholder="Cedula"
          required
          value={cedula} onChange={(e) => setCedula(e.target.value)}
        />
   
        
        
        <input
          type="number"
          id="telefono"
          className={`diseño_input ${
            camposIncompletos.includes('telefono') ?'border-red-500': ' border-stone-800' 
          }`}
          placeholder="Telefono"
          required    
          value={telefono} onChange={(e) => setTelefono(e.target.value)}
        />
       
        </div>
        <div  className='flex flex-row justify-between'>
         {camposIncompletos.includes('cedula') && (<p className="diseño_completa"><span className="font-medium">Complete el campo.</span> </p>)}
          {camposIncompletos.includes('cedula (invalida)') && (<p className="diseño_completa"><span className="font-medium">Cedula invalida.</span> </p>)}
          {camposValidos.includes('cedula (valida)') && (<p className="diseño_completa_v"><span className="font-medium">Cedula valida.</span> </p>)}
         {camposIncompletos.includes('telefono') && (<p className="diseño_completa"><span className="font-medium">Complete el campo.</span> </p>)}
          {camposIncompletos.includes('telefono (invalido)') && (<p className="diseño_completa"><span className="font-medium">Telefono invalido</span> </p>)}
          {camposValidos.includes('telefono (valido)') && (<p className="diseño_completa_v"><span className="font-medium">Telefono valido</span> </p>)}
     
        </div>
         <div  className='flex flex-row justify-between'>
        <label htmlFor="name" className="titulo_input_r">
          Email
        </label>
        <label htmlFor="lastname" className="titulo_input_r_2">
           Contraseña
        </label>
     
        </div>

        
         <div className='flex flex-row' >
   
        
        <input
          type="email"
          id="email"
          className={`diseño_input ${
            camposIncompletos.includes('email') ? 'border-red-500': ' border-stone-800' 
          }`}
          placeholder="Email"
          required value={email} onChange={(e) => setEmail(e.target.value)}

        />
     
       
        <input
          type="password"
          id="password"
          className={`diseño_input ${
            camposIncompletos.includes('password') ? 'border-red-500': ' border-stone-800' 
          }`}
          placeholder='Contraseña'
          required value={password} onChange={(e) => setPassword(e.target.value)}
        />
        
          </div>
            
         <div  className='flex flex-row'>
         {camposIncompletos.includes('email') && (<p className="diseño_completa"><span className="font-medium">Complete el campo.</span> </p>)}
          {camposIncompletos.includes('email (invalido)') && (<p className="diseño_completa"><span className="font-medium">Email invalido.</span> </p>)}
          {camposValidos.includes('email (valido)') && !correoregistrado  && (<p className="diseño_completa_v"><span className="font-medium">Email valido.</span> </p>)}
          {correoregistrado && (<p className="diseño_completa"><span className="font-medium">Este email ya esta registrado.</span> </p>)}

         {camposIncompletos.includes('password') && (<p className="diseño_completa"><span className="font-medium">Complete el campo.</span> </p>)}
          {camposIncompletos.includes('password (invalido)') && (<p className="diseño_completa"><span className="font-medium">Contraseña invalida</span> </p>)}
     
        </div>
        {isAdmin === true && (
          <div className='flex flex-col'style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} > 
                 <label  className="titulo_input_r">
              Tipo de Usuario
            </label>
            <select
              id="problema"
              className={`diseño_input_select ${
                camposIncompletos.includes('ninguno') ? 'border-red-500': ' border-stone-800' 
              }`}
             
              onChange={handleAdminOrUser}
              >
        
                  <option value="ninguno" >Selecciona una opcion</option>
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>

            </select>
          </div>
        )}
         {camposIncompletos.includes('ninguno') && (<p className="ml-4 text-sm text-red-500 dark:text-red-500" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><span className="font-medium">Seleccione una opcion.</span>  </p>)}
           
         
        <div className="pt-8 pb-8" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            type="button"
            className="boton_registro_user"  onClick={agregarUsuario}
          >
            Registrarse
          </button>
        </div>
      </form>
      
    </div>
   </div >
  )
  
}

export default Registrar