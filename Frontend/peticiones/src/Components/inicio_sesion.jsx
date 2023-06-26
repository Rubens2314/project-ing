import React from 'react'
import '@fontsource/gugi';
import '../css/inicio_sesion.css'
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Inicio_sesion({setIsLoggedIn}) {
  //hook para el estado de los campos
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [camposIncompletos, setCamposIncompletos] = useState([]);
  const navigate = useNavigate();
  const campos = []
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const [showModal, setShowModal] = useState(false);
  function iniciarSesion(){
     var iniciarSesion = {
        email: email,
        password: password
     }
      //validacion de campos
      if (!emailRegex.test(email)) {
        if (email === '') {
          campos.push('email')
        }else{
          campos.pop('email')
          campos.push('email_invalido')
        }
      } 
      if (email === '') {
        campos.pop('email_invalido')
        campos.push('email')
      }
      if (password === '') {
        campos.push('password')
      }
      setCamposIncompletos(campos)
      if (campos.length > 0) {
        return
      }
      axios.post('/api/usuario/iniciar-sesion', iniciarSesion)
    .then(res => {
      if (res.data.message === 'Inicio de sesión exitoso') {
        // Mostrar token en consola
        console.log(res.data.token);
        
        // Verificar la autenticación antes de redirigir al usuario
        axios.get('/api/usuario/ruta-protegida', {
          headers: {
            Authorization: res.data.token
          }
        })
          .then(response => {
            console.log(response.data.message); // Acceso autorizado
            setIsLoggedIn(true);
            //obtener el token
            localStorage.setItem('token', res.data.token);
            console.log(res.data.userId);
            navigate('/'); // Redirige al componente "Principal" después de un inicio de sesión exitoso
          })
          .catch(error => {
            console.log('Acceso no autorizado'); // El token no es válido o el usuario no está autenticado
          });
      }
        
      
    }
    )
    .catch(err => {
      console.log('error');
      setShowModal(true)
    })
  }
  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      axios.get('/api/usuario/ruta-protegida', {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          console.log(response.data.message); // Acceso autorizado
          navigate('/');
          setIsLoggedIn(true);
        })
        .catch(error => {
          console.log('Acceso no autorizado'); // El token no es válido o el usuario no está autenticado
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    
    }
  }, []);

  return (
    
    <div className='fondo'>

    
    <div className='fondo_inicio '>
     
      <h1 className="titulo_inicio" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img className="logo" src={require('../Images/Hi_inge.png')} alt="logo"  />
        Iniciar sesion
      </h1>
      <form className="pl-6 pr-6 md:pl-28 md:pr-28">
        <label htmlFor="email" className="block mb-2 gugi font-medium text-orange-600">
          Ingresa el email:
        </label>
        <input
          type="email"
          id="email"
          className={` input_inicio  ${
            camposIncompletos.includes('email') ? 'border-red-500': ' border-stone-800' 
          }`}
          placeholder="hi@hello.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}    
          
        />
        {camposIncompletos.includes('email') && (<p className="ml-4 text-sm text-red-500 dark:text-red-500"><span className="font-medium">Complete el campo de Email.</span> </p>)}
        {camposIncompletos.includes('email_invalido') && (<p className="ml-4 text-sm text-red-500 dark:text-red-500"><span className="font-medium">Email invalido, ejemplo de email valido: hiEngineer@hello.com .</span> </p>)}
        
        <label htmlFor="password" className="block mb-2 gugi pt-1 font-medium text-orange-600">
          contraseña:
        </label>
        <input
          type="password"
          id="password"
          className={` input_inicio  ${
            camposIncompletos.includes('password') ? 'border-red-500': ' border-stone-800' 
          }`}
          placeholder="********"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {camposIncompletos.includes('password') && (<p className="ml-4 text-sm text-red-500 dark:text-red-500"><span className="font-medium">Complete el campo de contraseña.</span> </p>)}
        <div className="espacio_boton_inicio" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            type="button"
            className="boton_inicio"
            onClick={iniciarSesion}
          >
            Iniciar sesión
          </button>
        </div>
        {showModal==true && (
          
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none rounded-lg">
            <div className="rounded-lg border-2 border-black shadow-2xl shadow-cyan-500/50 sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/2 2xl:w-1/3 max-h-screen bg-slate-700	 flex flex-col overflow-y-auto">
            <h1 className="gugi  text-orange-600 pt-10  text-3xl sm:text-4xl md:text-5xl lg:text-3xl xl:text-3xl 2xl:text-8xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Error al Iniciar sesion: 
                  </h1>
            <h1 className="gugi text-white pt-10 pb-10 text-3xl sm:text-4xl md:text-5xl lg:text-3xl xl:text-3xl 2xl:text-8xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Email o contraseña incorrectos
                  </h1>
              <div className="sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                  type="button"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mb-4"
                  onClick={() => setShowModal(false)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
      <div className="espacio_boton_registro"style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <a
          href="/registro"
          className="boton_registro"
        >
          Registrarse
        </a>
      </div>
      
    </div>
    </div>
   
  )
}
