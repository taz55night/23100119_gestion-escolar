/* Configuración de la conexión a la base de datos MySQL utilizando mysql2/promise */
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

/* Exportar el pool de conexiones para ser utilizado en otras partes de la aplicación */
module.exports = pool;