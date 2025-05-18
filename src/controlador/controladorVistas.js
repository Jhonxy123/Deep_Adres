import path from 'path';
import usuarioDAO from '../modelo/DAO_Usuario.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuración de variables de entorno y __dirname
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Controladores
export const paginaIndex = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'vistas', 'index.html'));
};

export const paginaRegistro = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'vistas', 'registro.html'));
};

export const registrarUsuario = async (req, res) => {
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
    } else if (err.message === 'La cédula ya está registrada') {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const paginaLogin = (req, res) => {
    if (req.session.user) return res.redirect('/paginaMenuUSer');
    res.sendFile(path.join(__dirname, '..', 'vistas', 'login.html'));
};

export const loginProcess = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await usuarioDAO.authenticate(email, password);
      if (!user) {
        return res.redirect('/login?error=Credenciales%20incorrectas');
      }
  
      req.session.user = user;
      const token = jwt.sign(
        {user: email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRATION}
      );

      const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        path: "/"
      };

      res.cookie("jwt", token, cookieOptions);

if (user.tipo === 1) {
  console.log('Redirigiendo a admin...');
  return res.redirect('/paginaMenuAdmin');
} else {
  console.log('Redirigiendo a user...');
  return res.redirect('/paginaMenuUser');
}// Redirección directa
  
    } catch (err) {
      console.error('Error en loginProcess:', err);
      return res.redirect('/login?error=Error%20del%20servidor');
    }
};


export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir sesión:', err);
            return res.status(500).redirect('/login.html?error=Error%20al%20cerrar%20sesión');
        }
        
        res.clearCookie('jwt');
        return res.redirect('/login.html'); // Redirección directa
    });
};

export const paginaMenuUser = (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 2) {
    return res.redirect('/login?error=Acceso%20denegado');
  }
  res.sendFile(path.join(__dirname, '..', 'vistas', 'menu_user.html'));
};

export const paginaMenuAdmin = (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 1) {
    return res.redirect('/login?error=Acceso%20denegado');
  }
  res.sendFile(path.join(__dirname, '..', 'vistas', 'menu_admin.html'));
};