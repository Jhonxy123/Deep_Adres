const express = require('express');
const path = require('path');
const session = require('express-session');
const indexRouter = require('./routes/indexRouter');

const app = express();

//Para poder leer datos de formularios POST:
app.use(express.urlencoded({ extended: false }));

//Configuración de sesiones:
app.use(session({
    secret: 'clave_super_secreta',    
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30 } 
  }));

//Middleware para servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'vistas')));


app.use('/', indexRouter);

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

//Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
