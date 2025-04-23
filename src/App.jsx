import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CrearTurnoPage from './pages/CrearTurnoPage';
import TurnosLlamadosPage from './pages/TurnosLlamadosPage';
import PanelMedicoPage from './pages/PanelMedicoPage';
import { WebSocketProvider } from './context/WebSocketContext';

function App() {
  return (
    <WebSocketProvider>
      <Router>
        {/* Define las rutas de la aplicación */}
        <Routes>
          <Route path="/" element={<CrearTurnoPage />} />
          <Route path="/llamados" element={<TurnosLlamadosPage />} />
          <Route path="/medico" element={<PanelMedicoPage />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
