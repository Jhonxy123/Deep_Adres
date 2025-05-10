const pool = require('../config/db');

class UserModel {
  static async getAllUsers() {
    const query = 'SELECT * FROM usuario';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async createUser(nombre, email) {
    const query = 'INSERT INTO usuarios (nombre, ema,il) VALUES ($1, $2) RETURNING *';
    const values = [nombre, email];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

module.exports = UserModel;