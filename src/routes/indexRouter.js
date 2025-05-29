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
router.get('/registro',controladorVistas.paginaRegistro);
router.post('/registro',controladorVistas.registrarUsuario);

//Ruta /r → registro.html
router.get('/paginaMenuUser', controladorVistas.paginaMenuUser);

// Nueva ruta para el logout
router.get('/logout', controladorVistas.logout); // Usando GET

//Nueva ruta para formulario
router.get('/formulario', controladorVistas.paginaFormulario);


module.exports = router;
