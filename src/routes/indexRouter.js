const express = require('express');
const router = express.Router();
const controladorVistas = require('../controlador/controladorVistas');
const controladorUsuario = require('../controlador/controladorUsuario');
const controladorIndem = require('../controlador/controladorIndem');

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

// Nueva ruta para el logout
router.get('/logout', controladorVistas.logout); // Usando GET

//Nueva ruta para formulario
router.get('/formulario', controladorVistas.paginaFormulario);
router.post('/formulario', controladorVistas.guardarFormulario);

// Nueva ruta para cambio de contraseña
router.post('/recuperar_cont', controladorUsuario.cambiarContrasena);

//Ruta para el historial del usuario
router.get('/historialusuario',controladorVistas.traerHistorial);
router.get('/formulario_guardado/:radicado', controladorIndem.mostrarDetalle);

//Ruta para el historial del usuario
router.get('/indemnizacion_por_verificar',controladorVistas.indem_por_ver);
router.delete('/indemnizacion_por_verificar/eliminar/:radicado', controladorVistas.eliminarIndemnizacion);


router.get('/historial_indem_verificado',controladorVistas.indem_verificada);
router.get('/historial_indem_verificado/indem_validadas/:radicado',controladorVistas.observarIndemVerificada);



//Ruta para ver el texto de la indemnización sin verificar
router.get('/indemnizacion_por_verificar/observar_form/:radicado',controladorVistas.observarIndemSin);
router.post('/indemnizacion_por_verificar/observar_form/:radicado',controladorVistas.guardarIndemnizacionVerificada);


module.exports = router;