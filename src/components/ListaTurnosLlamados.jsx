import { useState, useEffect } from 'react';
import { verTurnosLlamados } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import '../styles/ListaTurnos.css';

const ListaTurnosLlamados = () => {
  // Estado para almacenar los turnos llamados, inicializado como un array vacío
  const [turnosLlamados, setTurnosLlamados] = useState([]);
  
  // Hook personalizado para manejar la conexión WebSocket
  const { socket } = useWebSocket();

  useEffect(() => {
    // Función asíncrona para obtener los turnos llamados desde la API
    const fetchTurnosLlamados = async () => {
      try {
        const turnos = await verTurnosLlamados();
        // Asegurarse de que los turnos obtenidos sean un array antes de actualizar el estado
        setTurnosLlamados(Array.isArray(turnos) ? turnos : []);
      } catch (error) {
        console.error('Error al obtener turnos llamados:', error);
        // En caso de error, establecer un array vacío
        setTurnosLlamados([]);
      }
    };

    // Llamar a la función para obtener los turnos
    fetchTurnosLlamados();

    // Configurar el listener de WebSocket para nuevos turnos si el socket existe
    if (socket) {
      socket.on('nuevoTurno', (turno) => {
        if (turno.estado === 'llamado') {
          // Añadir nuevo turno llamado al estado
          setTurnosLlamados(prevTurnos => [...prevTurnos, turno]);
        } else {
          // Remover turno del estado si ya no está en estado "llamado"
          setTurnosLlamados(prevTurnos => 
            prevTurnos.filter(t => t.id !== turno.id)
          );
        }
      });
    }

    // Función de limpieza: remover el listener de WebSocket al desmontar el componente
    return () => {
      if (socket) {
        socket.off('nuevoTurno');
      }
    };
  }, [socket]); // El efecto se ejecuta cuando el socket cambia

  // Renderizar la lista de turnos llamados
  return (
    <div className="lista-turnos">
      <h2 className="lista-turnos__titulo">Turnos Llamados</h2>
      {/* Verificar si turnosLlamados es un array y tiene elementos */}
      {Array.isArray(turnosLlamados) && turnosLlamados.length > 0 ? (
        <ul className="lista-turnos__contenedor">
          {/* Mapear cada turno a un elemento de lista */}
          {turnosLlamados.map((turno) => (
            <li key={turno.id} className="lista-turnos__item">
              {turno.codigo}
            </li>
          ))}
        </ul>
      ) : (
        // Mostrar mensaje si no hay turnos llamados
        <p className="lista-turnos__mensaje">No hay turnos llamados.</p>
      )}
    </div>
  );  
};

export default ListaTurnosLlamados;
