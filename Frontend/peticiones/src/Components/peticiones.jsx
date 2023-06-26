import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import uniqid from 'uniqid';



function Peticiones() {
    //hooks
    //hook para el estado de los campos
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [problema, setProblema] = useState([])
    const [lugar, setLugar] = useState('')
    const [imagen, setImagen] = useState(null)
    const [descripcion, setDescripcion] = useState('')
    const [idusuario, setIdusuario] = useState('')
    //hook para validar modal
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    //hook para validar si esta logueado
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //hook para hacer el cambio de condicion del formulario a la imagen
    const [enviado, setEnviado] = useState(false);
    const navigate = useNavigate();
      
    const handleProblemaChange = (event) => {
      console.log('entra');
      const selectedProblema = event.target.value;
      setSelectedOption(event.target.value);
      setProblema([selectedProblema]);
   
      setShowModal(true);

      
    };
    const handleImagenChange = (event) => {
      const file = event.target.files[0];
      setImagen(file);
    };
    //handle para la segunda opcion 
    const handleProblemaChange2 = (event) => {
      const selectedProblema = event.target.value;
    
      setProblema(prevProblema => {
        // Verificar si el arreglo tiene al menos dos elementos
        if (prevProblema.length >= 2) {
          return [prevProblema[0], selectedProblema]; // Reemplazar solo el segundo elemento
        } else {
          return prevProblema.concat(selectedProblema); // Agregar el nuevo valor si el arreglo tiene menos de dos elementos
        }
      });
      
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
              console.log(response.data.message); // Acceso autorizado
              setIdusuario(response.data.userId);
              setIsLoggedIn(true);
            })
            .catch(error => {
              console.log('Acceso no autorizado'); // El token no es válido o el usuario no está autenticado
              setIsLoggedIn(false);
           
            });
        } else {
          setIsLoggedIn(false);
          navigate('/inicio_sesion');
        }
      }, []);
    
    function mandarpeticion() {
    
      var mandar_peticion = {
        nombre: nombre,
        apellido: apellido,
        problema: problema,
        lugar: lugar,
        imagen: imagen,
        descripcion: descripcion,
        idusuario:idusuario,
        idpeticion:uniqid()

      } 
      

        // Obtener el token de autenticación del localStorage o de donde se almacene
      const token = localStorage.getItem('token');

      // Hacer una solicitud GET para obtener el ID de usuario
      axios.get('/api/usuario/ruta-protegida', {
        headers: {
          Authorization: token
        }
      })
      .then(response => {
       
        console.log(idusuario);
        // Realizar la solicitud de petición con el ID de usuario
        axios.post('/api/peticiones/mandar-peticion', mandar_peticion, {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data' // Especificar el tipo de contenido como multipart/form-data
          }
        })
          .then(res => {
            console.log('peticion enviada');
            setEnviado(true);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(error => {
        navigate('/inicio_sesion');
      });
    }
    //actualizacion del array con useEffect (para ver si funciona)
    useEffect(() => {
      console.log(problema);
    }, [problema]);
    
    //UseEffect para el cambio de condicion del formulario a la imagen
    useEffect(() => {
      console.log(enviado);
    }, [enviado]);
    
    
  return (
    <div>
      {!enviado && (
     
        <div> 
            <div className=' rounded-lg  border-2 border-black shadow-2xl shadow-cyan-500/50 flex flex-col  mx-auto md:mr-40 md:ml-40 mt-6 mb-8'>
        <h1 className="gugi text-stone-950 pt-10 pb-10 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Solicitar ayuda
        </h1>
        <form className="pl-6  pr-6 md:pl-28 md:pr-28">
          
          <div className='flex flex-row mx-auto md:mr-30 md:ml-3s0 mt-6 mb-8'>
          <label htmlFor="name" className="md:ml-4 md:mr-8 mt-2 mb-2 gugi font-medium text-orange-600">
            Nombre:
          </label>
          <input
            id="name"
            className={`flex flex-col mr-8 rounded-full border-2 p-2.5 text-black w-full mb-4 placeholder-dark  border-stone-800  `}
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
        
          />
          
          <label htmlFor="lastname" className="ml-8 mr-8 mt-2 mb-1 gugi font-medium text-orange-600">
            Apellidos:
          </label>
          <input
            id="apellido"
            className={`rounded-full border-2 p-2.5  text-black	w-full mb-4 placeholder-dark  border-stone-800`}
            placeholder="Apellidos"
            required
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}

          
          />
          </div>
        
      
          
          <label className="flex justify-center  mb-2 gugi font-medium text-orange-600">
            Tipo de Problema:
          </label>
          <select
            id="problema"
            className={`rounded-md border-2 p-2.5 text-black w-full mb-4 placeholder-dark border-stone-800
            `}
            value={selectedOption}
            onChange={handleProblemaChange} 
            >
      
                <option value="ninguno">Selecciona una opcion</option>
                <option value="Computador (Impresora)">Computador (Impresoras)</option>
                <option value="Software(Antares,Internet)">Software (Antare, Internet) </option>

          </select>
          <p>Selected option: {selectedOption}</p>
          {problema.includes("Computador (Impresora)") && showModal==true && (
          
              <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none rounded-lg">
                <div className="rounded-lg border-2 border-black shadow-2xl shadow-cyan-500/50 sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/2 2xl:w-1/3 max-h-screen bg-gray-50 flex flex-col overflow-y-auto">
                  <h1 className="gugi text-red-700 pt-10 pb-10 text-3xl sm:text-4xl md:text-5xl lg:text-3xl xl:text-3xl 2xl:text-8xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Componente del computador con problemas:
                  </h1>
                  <div className="sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <select
                      id="problema-2"
                      className="rounded-md border-2 p-2.5 text-black w-1/2 mb-4 placeholder-dark border-stone-800"
                      onChange={handleProblemaChange2}
                    >
                      <option value="?">Selecciona una opción</option>
                      <option value="Teclado/Mouse">Teclado/Mouse</option>
                      <option value="Pantalla">Pantalla</option>
                      <option value="No enciende">No enciende</option>
                      <option value="Esta lento">Esta lento</option>
                      <option value="Otro Problema">Otro Problema</option>
                    </select>
                  </div>
                  <div className="sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mb-4"
                      onClick={() => setShowModal(false)}
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              </div>
            )}
            {problema.includes("Software(Antares,Internet)") && showModal==true && (
              
              <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none rounded-lg">
              <div className="rounded-lg border-2 border-black shadow-2xl shadow-cyan-500/50 sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/2 2xl:w-1/3 max-h-screen bg-gray-50 flex flex-col overflow-y-auto">
                  <h1 className="gugi text-red-700 pt-10 pb-10 text-3xl sm:text-4xl md:text-5xl lg:text-3xl xl:text-3xl 2xl:text-8xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Componente del computador con problemas:
                  </h1>
                  <div className="sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <select
                      id="problema-2"
                      className="rounded-md border-2 p-2.5 text-black w-1/2 mb-4 placeholder-dark border-stone-800"
                      onChange={handleProblemaChange2}
                    >
                      <option value="?">Selecciona una opción</option>
                      <option value="Antares no abre">Antares no abre </option>
                      <option value="Fallo de internet">No hay internet </option>
                      <option value="Otro Problema">Otro problema</option>
                    </select>
                  </div>
                  <div className="sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mb-4"
                      onClick={() => setShowModal(false)}
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              </div>
            )}
        
          
          <label htmlFor="ubicacion" className="flex justify-center  mb-2 gugi font-medium text-orange-600">
            Lugar
          </label>
          <input
            type="text"
            id="lugar"
            className={`rounded-full border-2 p-2.5  text-black	w-full mb-4 placeholder-dark border-stone-800`}
            placeholder="sitio donde se presenta el problema"
            required    
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
          
          />
          <label htmlFor="ubicacion" className="flex justify-center  mb-2 gugi font-medium text-orange-600">
                  Imagen del problema (opcional):
              </label>
                
            <input class="rounded-full border-2 p-2.5 text-black w-full mb-4 placeholder-dark border-stone-800" id="file_input" type="file"
            accept="image/*"
             onChange={handleImagenChange}
            />
          
          
          <label htmlFor="Descripcion" className="flex justify-center  mb-2 gugi font-medium text-orange-600">
            Descripcion del problema:
          </label>
          <textarea
            type="Description"
          
            className={`rounded-md border-2 p-2.5  text-black	w-full mb-4 placeholder-dark border-stone-800 `}
            placeholder='Describe aqui tu problema con mas detalle...'
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}

          
          />
          
          <div className="pt-8 pb-8" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-4 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"  
              onClick={mandarpeticion}
            >
              Enviar solicitud
            </button>
          </div>
        </form>
        </div>
        </div>
     )} 
     {enviado && (
      <div className='bg-slate-800 h-screen flex flex-col'>
      <div className=' flex flex-col ml-40 mt-40 mr-40'>
        <div className='flex justify-center items-center'>
          <img src={require('../Images/cheque.png')} className='h-40 w-40' />
          
        </div>
        <div className='mt-8 flex justify-center gugi text-3xl text-white'> Solicitud enviada correctamente </div>
        <div className='mt-8 flex justify-row '  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          <button type="button" className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4 mb-2  "
          onClick={() => {window.location.reload();}}
          
          > Hacer otra solicitud </button>
          <a href='/' className="text-white bg-gradient-to-br from-purple-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 ml-4 mb-2" > Volver al inicio </a>
        
        </div>
    
      </div>
    </div>
     )}
    </div>
  )
}

export default Peticiones