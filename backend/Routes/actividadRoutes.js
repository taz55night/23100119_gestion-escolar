/* backend/Routes/actividadRoutes.js */
const express = require('express');

/* Crear un enrutador de Express para manejar las rutas relacionadas con actividades */
const router = express.Router();

/* Importar el controlador de actividades que contiene la lógica para manejar las solicitudes */
const actividadController = require('../Controller/actividadController');

/* Definir las rutas y asociarlas con las funciones del controlador */
router.get('/', actividadController.listarActividades);
router.post('/', actividadController.crearActividad);
router.put('/:id', actividadController.modificarActividad);
router.patch('/:id/estado', actividadController.actualizarEstadoRapido);
router.delete('/:id', actividadController.eliminarActividad);

module.exports = router;