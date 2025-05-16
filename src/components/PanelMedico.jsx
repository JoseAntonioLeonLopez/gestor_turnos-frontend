import { useState, useEffect } from 'react';
import { avanzarTurno, atenderTurno, finalizarTurno, verTurnosEnEspera, obtenerEstadoPanel } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import '../styles/PanelMedico.css';

const PanelMedico = () => {
  const [turnoActual, setTurnoActual] = useState(null);
  const [estado, setEstado] = useState('espera');
  const [turnosEnEspera, setTurnosEnEspera] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const { socket } = useWebSocket();

  useEffect(() => {
    const cargarEstadoInicial = async () => {
      try {
        const estadoGuardado = localStorage.getItem('estadoPanel');
        if (estadoGuardado) {
          const { estado: estadoGuardadoObj, turnoActual: turnoActualGuardado } = JSON.parse(estadoGuardado);
          setEstado(estadoGuardadoObj);
          setTurnoActual(turnoActualGuardado);
        } else {
          const { estado: estadoObtenido, turnoActual: turnoActualObtenido } = await obtenerEstadoPanel();
          setEstado(estadoObtenido);
          setTurnoActual(turnoActualObtenido);
        }
        await obtenerTurnosEnEspera();
      } catch (error) {
        console.error('Error al cargar el estado inicial:', error);
      }
    };

    cargarEstadoInicial();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('nuevoTurno', (turno) => {
        if (turno.estado === 'llamado' || turno.estado === 'atendiendo') {
          actualizarEstadoPanel(turno);
        } else if (turno.estado === 'en espera') {
          setTurnosEnEspera((prevTurnos) => [...prevTurnos.filter(t => t.codigo !== turno.codigo), turno]);
        }
      });

      socket.on('turnosEnEspera', (turnos) => {
        setTurnosEnEspera(turnos);
      });
    }

    return () => {
      if (socket) {
        socket.off('nuevoTurno');
        socket.off('turnosEnEspera');
      }
    };
  }, [socket]);

  const actualizarEstadoPanel = (turno) => {
    let nuevoEstado = estado;
    let nuevoTurnoActual = turnoActual;

    if (turno.estado === 'llamado') {
      nuevoEstado = 'llamado';
      nuevoTurnoActual = turno;
    } else if (turno.estado === 'atendiendo') {
      nuevoEstado = 'atendiendo';
      nuevoTurnoActual = turno;
    } else if (turno.estado === 'en espera') {
      setTurnosEnEspera((prevTurnos) => [...prevTurnos.filter(t => t.codigo !== turno.codigo), turno]);
    }
    
    setEstado(nuevoEstado);
    setTurnoActual(nuevoTurnoActual);
    
    // Guardar el estado en localStorage
    localStorage.setItem('estadoPanel', JSON.stringify({ estado: nuevoEstado, turnoActual: nuevoTurnoActual }));
  };

  const handleAvanzarTurno = async () => {
    try {
      const nuevoTurno = await avanzarTurno();
      if (nuevoTurno) {
        actualizarEstadoPanel(nuevoTurno);
      } else {
        setEstado('sin_turnos');
        localStorage.setItem('estadoPanel', JSON.stringify({ estado: 'sin_turnos', turnoActual: null }));
      }
    } catch (error) {
      console.error('Error al avanzar turno:', error);
    }
  };

  const handleAtenderTurno = async () => {
    try {
      const turnoAtendiendo = await atenderTurno();
      actualizarEstadoPanel(turnoAtendiendo);
    } catch (error) {
      console.error('Error al atender turno:', error);
    }
  };

  const handleFinalizarTurno = async () => {
    try {
      await finalizarTurno();
      setTurnoActual(null);
      setEstado('espera');
      localStorage.setItem('estadoPanel', JSON.stringify({ estado: 'espera', turnoActual: null }));
    } catch (error) {
      console.error('Error al finalizar turno:', error);
    }
  };

  const obtenerTurnosEnEspera = async () => {
    try {
      const turnos = await verTurnosEnEspera();
      setTurnosEnEspera(turnos);
    } catch (error) {
      console.error('Error al obtener turnos en espera:', error);
    }
  };

  const mostrarTooltip = (nombre) => {
    setTooltipContent(nombre);
    setTooltipVisible(true);
    setTimeout(() => setTooltipVisible(false), 3000); // Ocultar después de 3 segundos
  };

  // Renderizado del componente
  return (
    <div className="panel-medico">
      <h2 className="panel-titulo">Panel Médico</h2>
      <div className="panel-contenido">
        <div className="turnos-en-espera">
          <h3>Turnos en Espera:</h3>
          <ul>
            {turnosEnEspera.map((turno) => (
              <li key={turno.codigo}>
                <span className="turno-codigo">{turno.codigo}</span>
                <span 
                  className="turno-nombre" 
                  onClick={() => mostrarTooltip(turno.nombre)}
                >
                  {turno.nombre}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`estado-panel estado-${estado}`}>
          {estado === 'espera' && (
            <>
              <p>Esperando turno...</p>
              <button onClick={handleAvanzarTurno}>Siguiente Turno</button>
            </>
          )}

          {(estado === 'llamado' || estado === 'atendiendo') && (
            <>
              <p>Turno actual: <strong>{turnoActual?.codigo}</strong></p>
              <p className="nombre-paciente">
                Nombre del paciente: 
                <strong 
                  onClick={() => mostrarTooltip(turnoActual?.nombre)}
                >
                  {turnoActual?.nombre}
                </strong>
              </p>
              {estado === 'llamado' ? (
                <button onClick={handleAtenderTurno}>Atender</button>
              ) : (
                <button onClick={handleFinalizarTurno}>Finalizar</button>
              )}
            </>
          )}

          {estado === 'sin_turnos' && (
            <>
              <p>No hay más turnos disponibles.</p>
              <button onClick={handleAvanzarTurno}>Verificar nuevos turnos</button>
            </>
          )}
        </div>
      </div>
      {tooltipVisible && (
        <div className="tooltip">{tooltipContent}</div>
      )}
    </div>
  );
};

export default PanelMedico;