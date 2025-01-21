import React, { useState, useEffect } from 'react';
import { verTurnosLlamados } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import '../styles/ListaTurnos.css';

const ListaTurnosLlamados = () => {
  const [turnosLlamados, setTurnosLlamados] = useState([]);
  const { socket } = useWebSocket();

  useEffect(() => {
    const fetchTurnosLlamados = async () => {
      try {
        const turnos = await verTurnosLlamados();
        setTurnosLlamados(turnos);
      } catch (error) {
        console.error('Error al obtener turnos llamados:', error);
      }
    };

    fetchTurnosLlamados();

    if (socket) {
      socket.on('nuevoTurno', (turno) => {
        if (turno.estado === 'llamado') {
          setTurnosLlamados(prevTurnos => [...prevTurnos, turno]);
        } else {
          setTurnosLlamados(prevTurnos => 
            prevTurnos.filter(t => t.id !== turno.id)
          );
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('nuevoTurno');
      }
    };
  }, [socket]);

  return (
    <div className="lista-turnos">
      <h2 className="lista-turnos__titulo">Turnos Llamados</h2>
      {turnosLlamados.length > 0 ? (
        <ul className="lista-turnos__contenedor">
          {turnosLlamados.map((turno) => (
            <li key={turno.id} className="lista-turnos__item">
              {turno.codigo}
            </li>
          ))}
        </ul>
      ) : (
        <p className="lista-turnos__mensaje">No hay turnos llamados.</p>
      )}
    </div>
  );  
};

export default ListaTurnosLlamados;
