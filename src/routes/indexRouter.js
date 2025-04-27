// src/routes/indexRouter.js
const express = require('express');
const router = express.Router();
const controladorVistas = require('../controlador/controladorVistas');

// Ruta raíz → index.html
router.get('/', controladorVistas.paginaIndex);

// Ruta /login → login.html
router.get('/login', controladorVistas.paginaLogin);
router.post('/login',  controladorVistas.loginProcess);

//Ruta /registro → registro.html
router.get('/registro', controladorVistas.paginaRegistro);

//Ruta /r → registro.html
router.get('/paginaMenuUser', controladorVistas.paginaMenuUser);

// (Aquí puedes añadir más rutas como /registro, /dashboard, etc.)

module.exports = router;
