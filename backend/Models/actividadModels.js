/* Modelo para manejar las operaciones relacionadas con las actividades en la base de datos */
const db = require('../config/database');

/* Objeto que contiene las funciones para interactuar con la base de datos de actividades */
const ActividadModel = {
    /* Función para obtener todas las actividades junto con sus estados y prioridades */
    obtenerTodas: async () => {
        const query = `
            SELECT 
                a.pkid_actividad,
                a.vch_nombre,
                a.vch_materia,
                a.int_estado_id,
                e.vch_descripcion AS estado,
                a.int_prioridad_id,
                p.vch_descripcion AS prioridad
            FROM tbl_actividades a
            INNER JOIN tbl_estados_actividad e ON a.int_estado_id = e.pkid_estado
            INNER JOIN tbl_prioridades_actividad p ON a.int_prioridad_id = p.pkid_prioridad
            ORDER BY a.pkid_actividad DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    crear: async (nombre, materia, prioridadId) => {
        // Estado inicial 1 = 'Pendiente'
        const query = `
            INSERT INTO tbl_actividades (vch_nombre, vch_materia, int_estado_id, int_prioridad_id)
            VALUES (?, ?, 1, ?)
        `;
        /* Ejecutar la consulta de inserción y devolver el ID de la nueva actividad */
        const [result] = await db.query(query, [nombre, materia, prioridadId]);
        return result.insertId;
    },

    /* Función para actualizar una actividad existente */
    actualizar: async (id, nombre, materia, estadoId, prioridadId) => {
        const query = `
            UPDATE tbl_actividades 
            SET vch_nombre = ?, vch_materia = ?, int_estado_id = ?, int_prioridad_id = ?
            WHERE pkid_actividad = ?
        `;
        /* Ejecutar la consulta de actualización y devolver el número de filas afectadas */
        const [result] = await db.query(query, [nombre, materia, estadoId, prioridadId, id]);
        return result.affectedRows;
    },

    /* Función para cambiar rápidamente el estado de una actividad */
    cambiarEstado: async (id, estadoId) => {
        const query = `UPDATE tbl_actividades SET int_estado_id = ? WHERE pkid_actividad = ?`;
        const [result] = await db.query(query, [estadoId, id]);
        return result.affectedRows;
    },

    /* Función para eliminar una actividad existente */
    eliminar: async (id) => {
        const query = `DELETE FROM tbl_actividades WHERE pkid_actividad = ?`;
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
};

/* Exportar el modelo de actividades para ser utilizado en otras partes de la aplicación */
module.exports = ActividadModel;