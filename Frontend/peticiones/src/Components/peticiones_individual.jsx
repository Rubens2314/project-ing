import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

//icons:
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {faHand} from '@fortawesome/free-solid-svg-icons'




function Peticiones_individual({peticiones}) {
    const imageUrl = '/images/' + peticiones.imagen;
    const [isAdmin, setIsAdmin] = useState(false);
  
  
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
          })
          .catch(error => {
            console.log('Acceso no autorizado'); // El token no es válido o el usuario no está autenticado
       
          });
         
  
      } 
    }, []);
    //handle delete
    const handleDelete = () => {
      const id=peticiones.idpeticion
      axios.delete(`/api/peticiones/eliminar_peticion/${id}`).then(res => {
         window.location.reload();
      }).catch(err => console.log(err));
    
    }
    // handle aceptar
    const handleAceptar = () => {
      const id=peticiones.idpeticion
      axios.post(`/api/peticiones/aceptar_peticion/${id}`).then(res => {
          window.location.reload();
      }).catch(err => console.log(err));
      
    }
    

     return (
        <div>
        {isAdmin ===false && (
            <div  class=" flex flex-col mr-56 ml-56 mt-4 mb-4 pt-8 pl-8 pb-16 rounded-lg border-double border-4 border-yellow-500 " > 
            <h2 className="gugi text-red-700 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Problema </h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.problema[0]}, {peticiones.problema[1]}</h1>
            <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Nombre del solicitante</h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.nombre} {peticiones.apellido}</h1>
            <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Sitio</h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.lugar}</h1>
            <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Descripcion </h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.descripcion}</h1>
            <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Fecha y hora </h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.fecha} {peticiones.hora}</h1>
            
            {peticiones.imagen != null && (
               
              <div className='flex flex-col' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Imagen de evidencia</h2>
              <img className='pt-4 w-56 h-32' src={imageUrl} alt="Imagen" />
              </div>
    
            )}
    
            </div>
          )}

            {isAdmin===true && peticiones.aceptado===false &&(
           <div  class="rounded-lg shadow-lg shadow-cyan-500/50 flex justify-center p-20 mx-8" > 
           <FontAwesomeIcon icon={faHand} shake className="text-8xl text-yellow-400" />
          </div>
    
          
          )}
          {isAdmin===true && peticiones.aceptado===true &&(
            <div  class=" flex flex-col mr-56 ml-56 mt-4 mb-4 pt-8 pl-8 pb-16 rounded-lg border-double border-4 border-blue-500 " > 
            <h2 className="gugi text-red-700 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Problema </h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.problema[0]}, {peticiones.problema[1]}</h1>
            <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Nombre del solicitante</h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.nombre} {peticiones.apellido}</h1>
            <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Sitio</h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.lugar}</h1>
            <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Descripcion </h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.descripcion}</h1>
            <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Fecha y hora </h2>
            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{peticiones.fecha} {peticiones.hora}</h1>
            
            {peticiones.imagen != null && (
               
              <div className='flex flex-col' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <h2 className="gugi text-red-700 pt-4 text-3xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Imagen de evidencia</h2>
              <img className='pt-4 w-56 h-32' src={imageUrl} alt="Imagen" />
              </div>
    
            )}

            </div>
          )}
      
        </div>
       
    );
}

export default Peticiones_individual;