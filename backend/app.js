/* backend/app.js */
const express = require('express');
const cors = require('cors');
const path = require('path');
/* Cargar variables de entorno desde un archivo .env */
require('dotenv').config();

/* Importar las rutas de actividades */
const actividadRoutes = require('./Routes/actividadRoutes.js');

/* Crear una instancia de la aplicación Express */
const app = express();

/* Configurar el puerto desde las variables de entorno o usar 3000 por defecto */
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../frontend'))); // o 'frontend' según dónde esté tu carpeta
app.use(cors());
app.use(express.json());

/* Usar las rutas de actividades para manejar las solicitudes a /api/actividades */
app.use('/api/actividades', actividadRoutes);

/* Iniciar el servidor y escuchar en el puerto especificado */
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});