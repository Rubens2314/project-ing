
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Registrar from './Components/registrar';
import Iniciar_sesion from './Components/inicio_sesion';
import Principal from './Components/Principal';
import Peticiones from './Components/peticiones';
import Lista_peticiones from './Components/lista_peticiones';
import Ver_solicitudes from './Components/ver_solicitudes';
import Solicitudes_aceptadas from './Components/peticiones_aceptadas';
function App() {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <BrowserRouter>
       <Routes>
       <Route path="/" element={<Principal />} exact ></Route>
       <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/registro" element={<Registrar />} exact ></Route>
        <Route path="/inicio_sesion" element={<Iniciar_sesion setIsLoggedIn={setIsLoggedIn}/>} exact></Route>
        <Route path="/peticiones" element={<Peticiones />} exact></Route>
        <Route path='/lista_peticiones' element={<Lista_peticiones/>} exact></Route>
        <Route path='/ver_solicitudes' element={<Ver_solicitudes/>} exact></Route>
        <Route path='/peticiones_aceptadas' element={<Solicitudes_aceptadas/>} exact></Route>
       </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
