const express = require('express');
const router = express.Router();
const controladorVistas = require('../controlador/controladorVistas');

// Ruta raíz → index.html
router.get('/', controladorVistas.paginaIndex);

// Ruta /login → login.html
router.get('/login', controladorVistas.paginaLogin);
router.post('/login', controladorVistas.loginProcess);

// Ruta /registro → registro.html
router.get('/registro', controladorVistas.paginaRegistro);
router.post('/registro', controladorVistas.registrarUsuario);

// Ruta protegida /paginaMenuUser
router.get('/paginaMenuUser', controladorVistas.paginaMenuUser);
router.get('/paginaMenuAdmin', controladorVistas.paginaMenuAdmin);

// Ruta para logout
router.get('/logout', controladorVistas.logout);

module.exports = router;
