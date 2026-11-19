/* backend/Controller/actividadController.js */
const ActividadModel = require('../Models/actividadModels');

/* Controlador de actividades que maneja las solicitudes HTTP y la lógica de negocio */
const actividadController = {
    /* Función para listar todas las actividades */
    listarActividades: async (req, res) => {
        /* Intentar obtener todas las actividades desde el modelo y enviarlas como respuesta JSON */
        try {
            /* Llamar al modelo para obtener todas las actividades */
            const actividades = await ActividadModel.obtenerTodas();
            res.json(actividades);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las actividades', error: error.message });
        }
    },

    /* Función para crear una nueva actividad */
    crearActividad: async (req, res) => {
        const { nombre, materia, prioridad_id } = req.body;

        /* Validar que los campos obligatorios no estén vacíos o nulos */
        if (!nombre || !nombre.trim() || !materia || !materia.trim() || !prioridad_id) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
        }

        /* Intentar crear una nueva actividad usando el modelo y enviar la respuesta correspondiente */
        try {
            const nuevoId = await ActividadModel.crear(nombre.trim(), materia.trim(), prioridad_id);
            res.status(201).json({ mensaje: 'Actividad registrada con éxito', id: nuevoId });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al registrar la actividad', error: error.message });
        }
    },

    /* Función para modificar una actividad existente */
    modificarActividad: async (req, res) => {
        const { id } = req.params;
        const { nombre, materia, estado_id, prioridad_id } = req.body;

        /* Validar que los campos obligatorios no estén vacíos o nulos */
        if (!nombre || !nombre.trim() || !materia || !materia.trim() || !estado_id || !prioridad_id) {
            return res.status(400).json({ mensaje: 'Datos inválidos o campos vacíos.' });
        }

        /* Intentar actualizar la actividad usando el modelo y enviar la respuesta correspondiente */
        try {
            const filas = await ActividadModel.actualizar(id, nombre.trim(), materia.trim(), estado_id, prioridad_id);
            if (filas === 0) return res.status(404).json({ mensaje: 'Actividad no encontrada.' });
            res.json({ mensaje: 'Actividad actualizada correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar la actividad', error: error.message });
        }
    },

    /* Función para actualizar rápidamente el estado de una actividad */
    actualizarEstadoRapido: async (req, res) => {
        const { id } = req.params;
        const { estado_id } = req.body;

        /* Validar que el ID del estado esté presente */
        try {
            await ActividadModel.cambiarEstado(id, estado_id);
            res.json({ mensaje: 'Estado actualizado' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al cambiar estado', error: error.message });
        }
    },

    /* Función para eliminar una actividad existente */
    eliminarActividad: async (req, res) => {
        const { id } = req.params;

        /* Intentar eliminar la actividad usando el modelo y enviar la respuesta correspondiente */
        try {
            const filas = await ActividadModel.eliminar(id);
            if (filas === 0) return res.status(404).json({ mensaje: 'Actividad no encontrada.' });
            res.json({ mensaje: 'Actividad eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar la actividad', error: error.message });
        }
    }
};

/* Exportar el controlador de actividades para ser utilizado en otras partes de la aplicación */
module.exports = actividadController;