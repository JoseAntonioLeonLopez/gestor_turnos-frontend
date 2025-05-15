# Sistema de Gestión de Turnos - Frontend

Este repositorio contiene el frontend para el Sistema de Gestión de Turnos, una aplicación web moderna para la administración eficiente de turnos en entornos médicos o de servicio al cliente.

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (normalmente viene con Node.js)

## Configuración del Entorno

1. Clonar el repositorio:
   ```
   git clone https://github.com/JoseAntonioLeonLopez/gestor_turnos-frontend
   cd sistema-turnos-frontend
   ```

2. Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   VITE_URL=http://localhost:3000
   VITE_API_URL=http://localhost:3000/api/turnos
   ```

## Instalación y Ejecución

1. Instalar las dependencias:
   ```
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).
