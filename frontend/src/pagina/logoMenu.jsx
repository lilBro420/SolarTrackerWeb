import { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logoEmpresa from '../assets/logoEmpresa.png';
import "../styles/solarPanel.css";

function LogoMenu() {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();

  const usuarioAutenticado = localStorage.getItem('usuarioAutenticado') === 'true';

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioAutenticado');
    localStorage.removeItem('user'); // Si guardas datos del usuario
    navigate('/');
  };

  return (
    <div
      className="logo-menu-container"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="logo-toggle" onClick={() => setMostrarMenu(!mostrarMenu)}>
        <img src={logoEmpresa} alt="Logo Empresa" className="logo-icon" />
        <span className={`arrow ${hovering || mostrarMenu ? "abajo" : "arriba"}`}>▲</span>
      </div>

      {(hovering || mostrarMenu) && (
        <Nav className="menu-desplegable">
          {usuarioAutenticado ? (
            <>
              <Nav.Link as={Link} to="/perfil">Perfil</Nav.Link>
              <Nav.Link as={Link} to="/home">Panel</Nav.Link>
              <Nav.Link onClick={cerrarSesion}>Cerrar Sesión</Nav.Link>
            </>
         ) : (
  <>
    <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
    <Nav.Link as={Link} to="/salvar-contrasena">Recuperar Contraseña</Nav.Link>
  </>
)}
        </Nav>
      )}
    </div>
  );
}

export default LogoMenu;