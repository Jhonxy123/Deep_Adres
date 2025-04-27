// src/models/DAO_usuario.js
const db     = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Busca un usuario por su email y mapea los campos a {id, email, password_hash, nombre}
 * @param {string} email
 * @returns {Promise<null|{id:number,email:string,password_hash:string,nombre:string}>}
 */
async function findByEmail(email) {
  const result = await db.query(
    `SELECT
       id,
       correo       AS email,
       contrasena   AS password_hash,
       nombre
     FROM usuario
     WHERE correo = $1`,
    [ email ]
  );
  return result.rows[0] || null;
}

/**
 * Valida que la contraseña en texto plano coincida con el hash almacenado.
 * @param {string} email
 * @param {string} plainPassword
 * @returns {Promise<null|{id,email,nombre}>}  // usuario sin el hash si ok; null si falla
 */
async function authenticate(email, plainPassword) {
  const user = await findByEmail(email);
  if (!user) {
    console.log('authenticate: usuario no encontrado:', email);
    return null;
  }

  // imprime para depurar
  console.log('authenticate: password plano:', `"${plainPassword}"`);
  console.log('authenticate: hash en DB   :', user.password_hash);

  // Asegurémonos de que lleguen ambos valores
  if (!plainPassword || !user.password_hash) {
    console.error('authenticate: faltan datos:', { plainPassword, password_hash: user.password_hash });
    return null;
  }

  const match = await bcrypt.compare(plainPassword, user.password_hash);
  if (!match) {
    console.log('authenticate: contraseña no coincide para', email);
    return null;
  }

  // Devolvemos sólo lo que el controlador necesita
  const { id, email: correo, nombre } = user;
  return { id, email: correo, nombre };
}

module.exports = { findByEmail, authenticate };
