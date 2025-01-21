import React, { useState, useEffect } from 'react';
import { generarTurno } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import '../styles/CrearTurno.css';

const CrearTurno = () => {
  const [turno, setTurno] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const { socket } = useWebSocket();
  const [nombre, setNombre] = useState('');
  const [nombreValido, setNombreValido] = useState(false);

  const handleNombreChange = (e) => {
    const input = e.target.value;
    setNombre(input);
  
    // Validación simple (mínimo 3, máximo 50 caracteres, solo letras y espacios)
    const esValido = /^[a-zA-Z\s]{3,50}$/.test(input);
    setNombreValido(esValido);
  };

  const handleGenerarTurno = async () => {
    if (!nombreValido) return;
    
    try {
      const nuevoTurno = await generarTurno(nombre);
      setTurno(nuevoTurno);
      setCountdown(5);
    } catch (error) {
      console.error('Error al generar turno:', error);
    }
  };

  useEffect(() => {
    let timer;
    if (turno && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      // Recargar la página cuando el contador llegue a 0
      window.location.reload();
    }
    return () => clearTimeout(timer);
  }, [turno, countdown]);

  useEffect(() => {
    if (socket) {
      socket.on('nuevoTurno', (nuevoTurno) => {
        console.log('Nuevo turno recibido:', nuevoTurno);
      });
    }
    return () => {
      if (socket) {
        socket.off('nuevoTurno');
      }
    };
  }, [socket]);

  return (
    <div className="turno-container">
      {turno ? (
        <div>
          <h2>Tu turno es: {turno.codigo}</h2>
          <p>Nombre: {turno.nombre}</p>
          <p>Tiempo restante: {countdown} segundos</p>
        </div>
      ) : (
        <div className="input-container">
          <input
            type="text"
            placeholder="Introduce tu nombre"
            value={nombre}
            onChange={handleNombreChange}
            className={nombreValido ? 'input-valido' : 'input-invalido'}
          />
          <button 
            className="generar-turno-btn" 
            onClick={handleGenerarTurno} 
            disabled={!nombreValido}
          >
            Generar Turno
          </button>
        </div>
      )}
    </div>
  );
};

export default CrearTurno;
