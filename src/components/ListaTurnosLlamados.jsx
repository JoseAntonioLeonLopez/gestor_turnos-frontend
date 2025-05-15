import React, { useState, useEffect } from 'react';
import { verTurnosLlamados } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import '../styles/ListaTurnos.css';

const ListaTurnosLlamados = () => {
  // Estado para almacenar los turnos llamados
  const [turnosLlamados, setTurnosLlamados] = useState([]);
  // Hook personalizado para manejar WebSocket
  const { socket } = useWebSocket();

  useEffect(() => {
    // Función para obtener los turnos llamados desde la API
    const fetchTurnosLlamados = async () => {
      try {
        const turnos = await verTurnosLlamados();
        setTurnosLlamados(turnos);
      } catch (error) {
        console.error('Error al obtener turnos llamados:', error);
      }
    };

    // Llamar a la función para obtener los turnos
    fetchTurnosLlamados();

    // Configurar el listener de WebSocket para nuevos turnos
    if (socket) {
      socket.on('nuevoTurno', (turno) => {
        if (turno.estado === 'llamado') {
          // Añadir nuevo turno llamado
          setTurnosLlamados(prevTurnos => [...prevTurnos, turno]);
        } else {
          // Remover turno si ya no está en estado "llamado"
          setTurnosLlamados(prevTurnos => 
            prevTurnos.filter(t => t.id !== turno.id)
          );
        }
      });
    }

    // Limpiar el listener al desmontar el componente
    return () => {
      if (socket) {
        socket.off('nuevoTurno');
      }
    };
  }, [socket]);

  // Renderizar la lista de turnos llamados
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
