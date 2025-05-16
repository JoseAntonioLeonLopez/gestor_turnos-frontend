import axios from 'axios';
import { API_URL } from '../config';

// Función para generar un nuevo turno
export const generarTurno = async (nombre) => {
  const response = await axios.post(`${API_URL}/generar`, { nombre });
  return response.data;
};

// Función para obtener los turnos en espera
export const verTurnosEnEspera = async () => {
  const response = await axios.get(`${API_URL}/en-espera`);
  return response.data;
};

// Función para obtener los turnos llamados
export const verTurnosLlamados = async () => {
  const response = await axios.get(`${API_URL}/llamados`);
  return response.data;
};

// Función para avanzar al siguiente turno
export const avanzarTurno = async () => {
  const response = await axios.post(`${API_URL}/avanzar`);
  return response.data;
};

// Función para marcar un turno como en atención
export const atenderTurno = async () => {
  const response = await axios.post(`${API_URL}/atender`);
  return response.data;
};

// Función para finalizar un turno
export const finalizarTurno = async () => {
  const response = await axios.post(`${API_URL}/finalizar`);
  return response.data;
};

// Función para obtener el estado del panel
export const obtenerEstadoPanel = async () => {
  const response = await axios.get(`${API_URL}/estado-panel`);
  return response.data;
};