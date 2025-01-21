import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { URL } from '../config';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(URL); // Asegúrate de que esta URL coincida con la de tu servidor
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
