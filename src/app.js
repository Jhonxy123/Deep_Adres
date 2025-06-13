const express = require('express');
const path = require('path');
const session = require('express-session');
const indexRouter = require('./routes/indexRouter');

const app = express();


// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));


app.use(express.json());
//Para poder leer datos de formularios POST:
app.use(express.urlencoded({ extended: false }));

//Configuración de sesiones:
app.use(session({
    secret: 'clave_super_secreta',    
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30 } 
  }));

app.get('/historial_sinverificar', (req, res) => {
  const resultado = []; // o datos reales desde la base de datos
  res.render('historial_sinverificar', { resultado });
});

app.get('/historial_verificado', (req, res) => {
  const resultado = []; // o datos reales desde la base de datos
  res.render('historial_verificado', { resultado });
});
//Middleware para servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'vistas')));
app.use(express.static(path.join(__dirname, 'vistas/componentes')));


app.use('/', indexRouter);

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

//Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});



