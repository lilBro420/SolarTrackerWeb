import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pagina/home';
import EjemploNavbar from './pagina/Navjar';
import Registro from './pagina/registro';
import Login from './pagina/login';
import './App.css';
import LogoMenu from "./pagina/logoMenu";
import Empresa from "./pagina/Empresa";
import Equipo from './pagina/Equipo';
import InicioLanding from './pagina/InicioLanding';
import 'bootstrap/dist/css/bootstrap.min.css';
import Perfil from './pagina/Perfil';
import EditarNombre from './pagina/EditarNombre';
import EditarContraseña from './pagina/EditarContraseña';
//import RecuperarContraseña from './pagina/RecuperarContraseña';
import SalvarContrasena from './pagina/SalvarContrasena';

import React from 'react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
    <Router>
      <LogoMenu />   
      <EjemploNavbar />
      <Routes>
        <Route path="/" element={<InicioLanding />} />
        <Route path='/Equipo' element={<Equipo />} />
        <Route path="/Empresa" element={<Empresa />} />
        <Route path="/home" element={<Inicio />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editar-nombre" element={<EditarNombre />} />
        <Route path="/editar-contraseña" element={<EditarContraseña />} />
        <Route path="/salvar-contrasena" element={<SalvarContrasena />} />

      </Routes>
    </Router>
  );
}

export default App;

