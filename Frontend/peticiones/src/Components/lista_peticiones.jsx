import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Peticiones_individual from './peticiones_individual';


function Lista_peticiones() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [idusuario, setIdusuario] = useState('')

    const navigate = useNavigate();
    //useEffect para mandar buscar las peticiones del usuario
    const [datapeticiones, setPeticiones] = useState([])
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
      
      useEffect(() => {
        if (idusuario) {
          axios.get(`/api/peticiones/obtener_peticiones/${idusuario}`).then(res => {
            console.log(res.data);
            console.log('Todo bien');
            setPeticiones(res.data);
          }).catch(err => console.log(err));
        }

      }, [idusuario]);
      const lista_peticiones = datapeticiones.map((usuario) => {
        return (
          <div>
             <Peticiones_individual peticiones={usuario}/>
            
          </div>

        )
      })

  return (
    <div>
         <div>
       
       <nav className="mx-8 shadow-lg shadow-lime-500/50 mb-8 mt-1 border rounded-full bg-white border-b-4  border-lime-500 flex flex-auto justify-between">
         <div className='pl-4 my-2 '>
         <a href="/" className="flex items-center ">
                     <img src={require('../Images/Hi_inge.png')} className="w-20 h-20	" />
                     <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-black">Historial</span>
                  
                     <a href="/" className="text-cyan-700 hover:text-white border border-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:border-cyan-500 dark:text-cyan-500 dark:hover:text-white dark:hover:bg-cyan-500 dark:focus:ring-cyan-800 mt-4 ml-4 mb-2">Inicio</a>
                     <a href="/peticiones" className="text-yellow-500 hover:text-white border border-yellow-500 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-500 dark:focus:ring-cyan-800 mt-4 ml-4 mb-2">Hacer una solicitud</a>
                    
         </a>
           
            
           
         </div>
         <ul className="m-8">
           <li className='border rounded-full hover:bg-orange-400'>
             <button>Cerrar sesión</button>
           </li>
         </ul>
       </nav>
       </div>
       <div>
           <div className='border-b-4 border-lime-500' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h1 className='gugi text-stone-950 pt-2 pb-2 text-3xl'>Historial de peticiones</h1>
           </div>
           
       </div>
     
      
       <div >
       {lista_peticiones}
       {datapeticiones.length === 0 && (
              <div>
                vacio
              </div>
       )}
       </div>
      

    </div>
  )
}

export default Lista_peticiones