import { useState, useEffect } from 'react';
import { avanzarTurno, atenderTurno, finalizarTurno, verTurnosEnEspera } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import '../styles/PanelMedico.css';

const PanelMedico = () => {
  // Estados para manejar el turno actual, el estado del panel y los turnos en espera
  const [turnoActual, setTurnoActual] = useState(null);
  const [estado, setEstado] = useState('espera');
  const [turnosEnEspera, setTurnosEnEspera] = useState([]);
  
  // Hook personalizado para manejar la conexión WebSocket
  const { socket } = useWebSocket();
  
  // Función para avanzar al siguiente turno
  const handleAvanzarTurno = async () => {
    try {
      const nuevoTurno = await avanzarTurno();
      if (nuevoTurno) {
        setTurnoActual(nuevoTurno);
        setEstado('llamado');
      } else {
        setEstado('sin_turnos');
      }
    } catch (error) {
      console.error('Error al avanzar turno:', error);
      setEstado('sin_turnos');
    }
  };

  // Función para atender el turno actual
  const handleAtenderTurno = async () => {
    try {
      const turnoAtendiendo = await atenderTurno();
      setTurnoActual(turnoAtendiendo);
      setEstado('atendiendo');
    } catch (error) {
      console.error('Error al atender turno:', error);
    }
  };

  // Función para finalizar el turno actual
  const handleFinalizarTurno = async () => {
    try {
      await finalizarTurno();
      setTurnoActual(null);
      setEstado('espera');
    } catch (error) {
      console.error('Error al finalizar turno:', error);
    }
  };

  // Función para obtener los turnos en espera
  const obtenerTurnosEnEspera = async () => {
    try {
      const turnos = await verTurnosEnEspera();
      setTurnosEnEspera(Array.isArray(turnos) ? turnos : []);
    } catch (error) {
      console.error('Error al obtener turnos en espera:', error);
      setTurnosEnEspera([]);
    }
  };

  // Efecto para cargar turnos en espera y manejar eventos de WebSocket
  useEffect(() => {
    obtenerTurnosEnEspera();
  
    if (socket) {
      // Manejar eventos de nuevo turno
      socket.on('nuevoTurno', (turno) => {
        if (turno.estado === 'llamado') {
          setTurnoActual(turno);
          setEstado('llamado');
        } else if (turno.estado === 'en espera') {
          setTurnosEnEspera((prevTurnos) => {
            if (!Array.isArray(prevTurnos)) prevTurnos = [];
            const nuevosTurnos = prevTurnos.filter(t => t.codigo !== turno.codigo);
            return [...nuevosTurnos, turno];
          });
        }
      });      
  
      // Manejar eventos de actualización de turnos en espera
      socket.on('turnosEnEspera', (nuevosTurnosEnEspera) => {
        setTurnosEnEspera(Array.isArray(nuevosTurnosEnEspera) ? nuevosTurnosEnEspera : []);
      });
    }
  
    // Limpiar listeners al desmontar el componente
    return () => {
      if (socket) {
        socket.off('nuevoTurno');
        socket.off('turnosEnEspera');
      }
    };
  }, [socket]);

  // Renderizado del componente
  return (
    <div className="panel-medico">
      <h2>Panel Médico</h2>
      {/* Renderizado de turnos en espera */}
      <div className="turnos-en-espera">
        <h3>Turnos en Espera:</h3>
        {Array.isArray(turnosEnEspera) && turnosEnEspera.length > 0 ? (
          <ul>
            {turnosEnEspera.map((turno) => (
              <li key={turno.codigo}>
                <p>Turno: {turno.codigo} - Paciente: {turno.nombre}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay turnos en espera.</p>
        )}
      </div>

      {/* Renderizado condicional basado en el estado */}
      {estado === 'espera' && (
        <div className="estado-espera">
          <p>Esperando turno...</p>
          <button onClick={handleAvanzarTurno}>Siguiente Turno</button>
        </div>
      )}

      {estado === 'llamado' && turnoActual && (
        <div className="estado-llamado">
          <p>Turno actual: <strong>{turnoActual.codigo}</strong></p>
          <p>Nombre del paciente: <strong>{turnoActual.nombre}</strong></p>
          <button onClick={handleAtenderTurno}>Atender</button>
        </div>
      )}

      {estado === 'atendiendo' && turnoActual && (
        <div className="estado-atendiendo">
          <p>Atendiendo turno: <strong>{turnoActual.codigo}</strong></p>
          <p>Nombre del paciente: <strong>{turnoActual.nombre}</strong></p>
          <button onClick={handleFinalizarTurno}>Finalizar</button>
        </div>
      )}

      {estado === 'sin_turnos' && (
        <div className="estado-sin-turnos">
          <p>No hay más turnos disponibles.</p>
          <button onClick={handleAvanzarTurno}>Verificar nuevos turnos</button>
        </div>
      )}
    </div>
  );
};

export default PanelMedico;
