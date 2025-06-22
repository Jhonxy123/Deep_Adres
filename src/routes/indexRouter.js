const express = require('express');
const router = express.Router();
const controladorVistas = require('../controlador/controladorVistas');
const controladorUsuario = require('../controlador/controladorUsuario');
const controladorIndem = require('../controlador/controladorIndem');
const indemnizacionDAO = require('../modelo/DAO_indemnizacion'); 

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

router.get('/historialusuario/visualizar-pdf/:id', controladorVistas.mostrarVistaPreviaPDF);

//Ruta para ver el texto de la indemnización sin verificar
router.get('/indemnizacion_por_verificar/observar_form/:radicado',controladorVistas.observarIndemSin);
router.post('/indemnizacion_por_verificar/observar_form/:radicado',controladorVistas.guardarIndemnizacionVerificada);


router.get('/graficos', controladorVistas.mostrarGraficas);
// Agregar esta ruta en indexRouter.js
router.get('/graficos/por-mes', async (req, res) => {
    try {
        const anio = req.query.anio || new Date().getFullYear();
        const indemnizacionesPorMes = await indemnizacionDAO.obtenerIndemnizacionesPorMes(anio);
        
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        
        // Inicializar todos los meses con 0
        const datosPorMes = meses.map((mes, index) => {
            return {
                mes: mes,
                cantidad: 0
            };
        });

        // Actualizar con los datos reales
        indemnizacionesPorMes.forEach(item => {
            const mesIndex = parseInt(item.mes) - 1;
            if (mesIndex >= 0 && mesIndex < 12) {
                datosPorMes[mesIndex].cantidad = parseInt(item.cantidad);
            }
        });

        res.json(datosPorMes);
    } catch (error) {
        console.error('Error al obtener datos por mes:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});


module.exports = router;
