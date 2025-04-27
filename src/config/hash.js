// hash.js
//Y ejecútalo con: node hash.js
//admin123 es la contraseña que pasara hacer un hash
/*-- Sustituye esto con el hash que obtuviste en el paso anterior:
UPDATE usuario
SET contrasena = '$2b$10$FGU5skrQRkal9h6YIho41.hsdFpQCK4yVx6wcODvhfhE44UKcFjEu'
WHERE correo = 'carlos.mendoza@example.com';
*/ 

const bcrypt = require('bcrypt');

(async () => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    console.log(hash);
  } catch (err) {
    console.error(err);
  }
})();
