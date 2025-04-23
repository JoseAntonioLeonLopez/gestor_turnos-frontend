import React, { useState, useEffect } from 'react';
import { avanzarTurno, atenderTurno, finalizarTurno, verTurnosEnEspera } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import '../styles/PanelMedico.css';

const PanelMedico = () => {
  // Estados para manejar el turno actual, estado del panel y turnos en espera
  const [turnoActual, setTurnoActual] = useState(null);
  const [estado, setEstado] = useState('espera'); // 'espera', 'llamado', 'atendiendo', 'sin_turnos'
  const [turnosEnEspera, setTurnosEnEspera] = useState([]);
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
      if (error.response && error.response.status === 404) {
        setEstado('sin_turnos');
      }
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
      setTurnosEnEspera(turnos);
    } catch (error) {
      console.error('Error al obtener turnos en espera:', error);
    }
  };

  // Efecto para cargar turnos en espera y manejar eventos de WebSocket
  useEffect(() => {
    obtenerTurnosEnEspera();
  
    if (socket) {
      // Manejar nuevos turnos
      socket.on('nuevoTurno', (turno) => {
        if (turno.estado === 'llamado') {
          setTurnoActual(turno);
          setEstado('llamado');
        } else if (turno.estado === 'en espera') {
          setTurnosEnEspera((prevTurnos) => {
            const nuevosTurnos = prevTurnos.filter(t => t.codigo !== turno.codigo);
            return [...nuevosTurnos, turno];
          });
        }
      });      
  
      // Actualizar lista de turnos en espera
      socket.on('turnosEnEspera', (turnosEnEspera) => {
        setTurnosEnEspera(turnosEnEspera);
      });
    }
  
    // Limpiar listeners al desmontar
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
      {/* Lista de turnos en espera */}
      <div className="turnos-en-espera">
        <h3>Turnos en Espera:</h3>
        <ul>
          {turnosEnEspera.map((turno) => (
            <li key={turno.codigo}>
              <p>Turno: {turno.codigo} - Paciente: {turno.nombre}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Renderizado condicional basado en el estado */}
      {estado === 'espera' && (
        <div className="estado-espera">
          <p>Esperando turno...</p>
          <button onClick={handleAvanzarTurno}>Siguiente Turno</button>
        </div>
      )}

      {estado === 'llamado' && (
        <div className="estado-llamado">
          <p>Turno actual: <strong>{turnoActual?.codigo}</strong></p>
          <p>Nombre del paciente: <strong>{turnoActual?.nombre}</strong></p>
          <button onClick={handleAtenderTurno}>Atender</button>
        </div>
      )}

      {estado === 'atendiendo' && (
        <div className="estado-atendiendo">
          <p>Atendiendo turno: <strong>{turnoActual?.codigo}</strong></p>
          <p>Nombre del paciente: <strong>{turnoActual?.nombre}</strong></p>
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
