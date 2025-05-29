// src/models/DAO_usuario.js
const db     = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Busca un usuario por su email y mapea los campos a {id, email, password_hash, nombre}
 * @param {string} email
 * @returns {Promise<null|{id:String,email:string,password_hash:string,nombre:string}>}
 */
async function findByEmail(email) {
  const result = await db.query(
    `SELECT
       id,
       correo       AS email,
       contrasena   AS password_hash,
       nombre,
       ID_Tipo_usuario AS id_tipo_usuario
     FROM usuario
     WHERE correo = $1`,
    [ email ]
  );
  return result.rows[0] || null;
}

async function findByUser(email) {
  const result = await db.query(
    `SELECT
       id,
       correo       AS email,
       contrasena   AS password_hash,
       nombre,
       ID_Tipo_usuario AS id_tipo_usuario
     FROM usuario
     WHERE id = $1`,
    [ email ]
  );
  return result.rows[0] || null;
}

async function encontrarUsuario(email) {
  const result = await db.query(
    `SELECT id FROM usuario WHERE correo=$1`,
    [email]
  );
  return result.rows[0]?.id || null; // Devuelve directamente el ID o null
}

async function encontrarContrasena(email) {
  const result = await db.query(
    `SELECT contrasena FROM usuario WHERE correo=$1`,
    [email]
  );
  return result.rows[0]?.contrasena || null;
}

/**
 * Busca un usuario por su cédula
 * @param {string} cedula
 * @returns {Promise<null|{id:number, cedula:string}>}
 */
async function findByCedula(cedula) {
  const result = await db.query(
    `SELECT 
       id,
       cedula
     FROM usuario
     WHERE cedula = $1`,
    [cedula]
  );
  return result.rows[0] || null;
}




async function registrar_usuario(nombre, correo, cedula) {
  /* Validación de contraseñas
  if (contrasena !== comprobar_contrasena) {
    throw new Error('Las contraseñas no coinciden');
  }*/

  // Verificar correo existente
  const usuarioExistente = await findByEmail(correo);
  if (usuarioExistente) {
    throw new Error('El correo electronico ya esta registrado');
  }
    const cedulaExistente = await findByCedula(cedula);
  if (cedulaExistente) {
    throw new Error('La cédula ya está registrada');
  }
  // Inserción en la base de datos
  const result = await db.query(
    `INSERT INTO Usuario (
       Nombre,
       Cedula,
       Correo,
       id_tipo_usuario
     ) VALUES ($1, $2, $3, 2)
     RETURNING 
       ID,
       Correo AS email,
       Nombre,
       ID_Tipo_usuario`,
    [nombre, cedula, correo]
  );

  if (result.rows[0]) {
    const contrasena = await encontrarContrasena(correo);
    const hashedPassword = await bcrypt.hash(contrasena, 10);;
    
    await db.query(
      `UPDATE usuario 
      SET contrasena = $1
      WHERE ID = $2`,
      [hashedPassword, result.rows[0].id]
    );
  }

  if (!result.rows[0]) {
    throw new Error('Error al registrar usuario');
  }

  return result.rows[0];
}

/**
 * Valida que la contraseña en texto plano coincida con el hash almacenado.
 * @param {string} email
 * @param {string} plainPassword
 * @returns {Promise<null|{id,email,nombre,tipo}>}
 // usuario sin el hash si ok; null si falla
 */
async function authenticate(email, plainPassword) {
  
  const user = await findByUser(email);
  if (!user) {
    console.log('authenticate: usuario no encontrado:', email);
    throw new Error('El usuario no fue encontrado');
    //return null;
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
    throw new Error('La contraseña no coincide para el correo proporcionado');
    //return null;
  }

  // Devolvemos sólo lo que el controlador necesita

  const { id, email: correo, nombre, id_tipo_usuario } = user;
  return { id, email: correo, nombre, tipo: id_tipo_usuario };
}







module.exports = { findByEmail, authenticate, registrar_usuario, encontrarUsuario};
