// src/app.js
const express = require('express');
const path = require('path');
const indexRouter = require('./routes/indexRouter');

const app = express();

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
