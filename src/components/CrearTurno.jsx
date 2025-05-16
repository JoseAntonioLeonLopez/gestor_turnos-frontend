import { useState, useEffect } from 'react';
import { generarTurno } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import '../styles/CrearTurno.css';

const CrearTurno = () => {
  // Estados para manejar el turno, cuenta regresiva, nombre y validación
  const [turno, setTurno] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const { socket } = useWebSocket();
  const [nombre, setNombre] = useState('');
  const [nombreValido, setNombreValido] = useState(false);

  // Manejar cambios en el input del nombre y validar
  const handleNombreChange = (e) => {
    const input = e.target.value;
    setNombre(input);
  
    // Validación: 3-40 caracteres, solo letras y espacios
    const esValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,40}$/.test(input);
    setNombreValido(esValido);
  };

  // Generar un nuevo turno
  const handleGenerarTurno = async () => {
    if (!nombreValido) return;
    
    try {
      const nuevoTurno = await generarTurno(nombre);
      setTurno(nuevoTurno);
    } catch (error) {
      console.error('Error al generar turno:', error);
    }
  };

  // Efecto para manejar la cuenta regresiva
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

  // Efecto para escuchar nuevos turnos vía WebSocket
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

  // Renderizado del componente
  return (
    <div className="turno-container">
      {turno ? (
        // Mostrar información del turno generado
        <div>
          <h2>Tu turno es: {turno.codigo}</h2>
          <p>Nombre: {turno.nombre}</p>
          <p>Tiempo restante: {countdown} segundos</p>
        </div>
      ) : (
        // Formulario para generar un nuevo turno
        <div className="input-container">
          <input
            type="text"
            placeholder="Introduce tu nombre"
            value={nombre}
            onChange={handleNombreChange}
            className={nombreValido ? 'input-valido' : 'input-invalido'}
            required
            maxLength={40}
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
