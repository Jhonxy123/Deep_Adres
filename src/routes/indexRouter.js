// src/routes/indexRouter.js
const express = require('express');
const router = express.Router();
const controladorVistas = require('../controlador/controladorVistas');

// Ruta raíz → index.html
router.get('/', controladorVistas.paginaIndex);

// Ruta /login → login.html
router.get('/login', controladorVistas.paginaLogin);

//Ruta /registro → registro.html
router.get('/registro', controladorVistas.paginaRegistro);

// (Aquí puedes añadir más rutas como /registro, /dashboard, etc.)

module.exports = router;
