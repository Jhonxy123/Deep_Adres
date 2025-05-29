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
       nombre
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
       Nombre`,
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
 * 
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

  const { id, email: correo, nombre } = user;
  return { id, email: correo, nombre };
}







module.exports = { findByEmail, authenticate, registrar_usuario, encontrarUsuario};
