// src/app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const indexRouter = require('./routes/indexRouter');

const app = express();

// 1. Para poder leer datos de formularios POST:
app.use(express.urlencoded({ extended: false }));

// 2. Configuración de sesiones:
app.use(session({
    secret: 'clave_super_secreta',      // reemplaza por una cadena segura
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30 }   // 30 minutos
  }));

// 1. Middleware para servir archivos estáticos (CSS, imágenes, etc.)
//app.use('/css', express.static(path.join(__dirname, 'vistas/css')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'vistas')));
//app.use('/img',express.static(path.join(__dirname, 'public/img')));



// 2. Si quisieras usar un motor de vistas (EJS, Pug...), aquí lo configuras.
//    Para HTML plano con sendFile no hace falta.

// 3. Registra tu router principal
app.use('/', indexRouter);

// 4. Manejo de 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// 5. Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
