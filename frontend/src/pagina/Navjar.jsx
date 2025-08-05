import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from 'react-router-dom';

function EjemploNavbar() {
  return (
    <Navbar className="navBg" expand="lg">
      <Container>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="menu">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/Equipo">Equipo</Nav.Link>
            <Nav.Link as={Link} to="/Empresa">Empresa</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default EjemploNavbar;
