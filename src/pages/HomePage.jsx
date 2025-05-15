import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Bienvenido al Sistema de Turnos</h1>
      <div className="button-container">
        <Link to="/turno" className="nav-button">
          Crear Turno
        </Link>
        <Link to="/llamados" className="nav-button">
          Turnos Llamados
        </Link>
        <Link to="/medico" className="nav-button">
          Panel Médico
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
