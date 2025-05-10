require('dotenv').config();
// Importar el cliente de PostgreSQL
const { Pool } = require('pg');

// Configurar la conexión (usando variables de entorno)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Probar la conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Error al conectar a PostgreSQL:', err);
  else console.log('✅ PostgreSQL conectado:', res.rows[0].now);
});

module.exports = pool;