import axios from 'axios';
import { API_URL } from '../config';

export const generarTurno = async (nombre) => {
  const response = await axios.post(`${API_URL}/generar`, { nombre });
  return response.data;
};

export const verTurnosEnEspera = async () => {
  const response = await axios.get(`${API_URL}/en-espera`);
  return response.data;
};

export const verTurnosLlamados = async () => {
  const response = await axios.get(`${API_URL}/llamados`);
  return response.data;
};

export const avanzarTurno = async () => {
  const response = await axios.post(`${API_URL}/avanzar`);
  return response.data;
};

export const atenderTurno = async () => {
  const response = await axios.post(`${API_URL}/atender`);
  return response.data;
};

export const finalizarTurno = async () => {
  const response = await axios.post(`${API_URL}/finalizar`);
  return response.data;
};
