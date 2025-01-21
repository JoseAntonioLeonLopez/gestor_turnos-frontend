import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../context/WebSocketContext';

export const useWebSocket = () => {
  const socket = useContext(WebSocketContext);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket) {
      setIsConnected(true);

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [socket]);

  return { socket, isConnected };
};
