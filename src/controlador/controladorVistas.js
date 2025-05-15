// src/controlador/controladorVistas.js
const path = require('path');
const usuarioDAO = require('../modelo/DAO_Usuario');

exports.paginaIndex = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'vistas', 'index.html'));
};

exports.paginaRegistro = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'vistas', 'registro.html'));
};



exports.registrarUsuario = async (req, res) => {
  const { nombre, correo, cedula, contrasena, confirmar_contrasena } = req.body;

  try {
    const usuarioRegistrado = await usuarioDAO.registrar_usuario(
      nombre,
      correo,
      cedula,
      contrasena,
      confirmar_contrasena
    );
    
    req.session.user = usuarioRegistrado;
    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Error en registro:', err);
    
    if (err.message === 'El correo electronico ya esta registrado') {
      return res.status(400).json({ error: err.message });
    } else if (err.message === 'Las contraseñas no coinciden') {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Error en el servidor' });
  }
};




// GET /login
exports.paginaLogin = (req, res) => {
    if (req.session.user) return res.redirect('/paginaMenuUSer');
    res.sendFile(path.join(__dirname, '..', 'vistas', 'login.html'));
};
  

// POST /login
exports.loginProcess = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await usuarioDAO.authenticate(email, password);
      if (!user) {
        // credenciales inválidas
        return res.redirect('/login?error=Credenciales%20incorrectas');
      }
  
      // Login exitoso → guarda sólo lo necesario en sesión
      req.session.user = user;
      res.redirect('/paginaMenuUSer');
  
    } catch (err) {
      console.error('Error en loginProcess:', err);
      res.redirect('/login?error=Error%20del%20servidor');
    }
  };







  // GET /dashboard
exports.paginaMenuUser = (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login?error=Debes%20loguearte');
    }
    res.sendFile(path.join(__dirname, '..', 'vistas', 'menu_user.html'));
  };