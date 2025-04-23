import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { URL } from '../config';

// Creación del contexto para WebSocket
export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  // Estado para almacenar la conexión del socket
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Crear una nueva conexión de socket
    const newSocket = io(URL); // URL debe coincidir con la del servidor
    setSocket(newSocket);

    // Función de limpieza para cerrar la conexión cuando el componente se desmonte
    return () => newSocket.close();
  }, []);

  // Proporcionar el socket a todos los componentes hijos
  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
