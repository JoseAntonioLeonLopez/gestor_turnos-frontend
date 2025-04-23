import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../context/WebSocketContext';

export const useWebSocket = () => {
  // Obtener el socket del contexto WebSocket
  const socket = useContext(WebSocketContext);
  
  // Estado para controlar si el socket está conectado
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket) {
      // Inicialmente, asumimos que el socket está conectado
      setIsConnected(true);

      // Escuchar eventos de conexión y desconexión
      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      // Función de limpieza para remover los listeners
      return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [socket]);

  // Retornar el socket y el estado de conexión
  return { socket, isConnected };
};
