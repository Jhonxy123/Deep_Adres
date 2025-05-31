import path from 'path';
import usuarioDAO from '../modelo/DAO_Usuario.js';
import indemnizacionDAO from '../modelo/DAO_indemnizacion.js'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { enviarEmail } from '../../services/mail.services.js';

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

export const paginaFormulario = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'vistas', 'formulario.html'));
};

export const historal_usuario = async (req,res) => {
   res.sendFile(path.join(__dirname, '..', 'vistas', 'historial.ejs'));
};


export const guardarFormulario = async (req, res) => {
  try {
    const jsonData = req.body;
    const userId = req.session.user.id;
    
    if (!jsonData || Object.keys(jsonData).length === 0) {
      return res.status(400).send('Datos requeridos');
    }

    // Agrega el ID del usuario si está autenticado
    const datosParaGuardar = {
      ...jsonData,
      userId: req.user?.id
    };

    const resultado = await usuarioDAO.guardarFormularioDB(datosParaGuardar, userId);
    console.log('Formulario guardado con radicado:', resultado.no_radicado);
    
    res.redirect('/paginaMenuUser');
  } catch (error) {
    console.error('Error al guardar formulario:', error);
    res.status(500).send('Error interno');
  }
};

export const traerHistorial = async (req,res) => {
  try{
    const userId = req.session.user.id;

    const resultado = await indemnizacionDAO.encontrarIndemnizaciones(userId);

    res.render('historial',{resultado});

  }catch(error){
    console.error('Error al traer la información: '.error);
    res.status(500).send('Error interno');
  }
};




export const registrarUsuario = async (req, res) => {
  const { nombre, correo, cedula} = req.body;

  try {
    const usuarioRegistrado = await usuarioDAO.registrar_usuario(
      nombre,
      correo,
      cedula
    );

    const id = await usuarioDAO.encontrarUsuario(correo);


    const enviar = await enviarEmail(correo,id,"TOKEN EJEMPLO");
    
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
  if (req.session.user) {
    const tipo = req.session.user.tipo;
    if (tipo === 1) return res.redirect('/paginaMenuAdmin');
    if (tipo === 2) return res.redirect('/paginaMenuUser');
  }
  res.sendFile(path.join(__dirname, '..', 'vistas', 'login.html'));
};


export const loginProcess = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usuarioDAO.authenticate(email, password);

    req.session.user = user;

    const token = jwt.sign(
      { user: email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      path: "/"
    };

    res.cookie("jwt", token, cookieOptions);

    const redirectPath = user.tipo === 1 ? '/paginaMenuAdmin' : '/paginaMenuUser';

    return res.status(200).json({ message: "Login exitoso", redirect: redirectPath });

  } catch (err) {
    console.error('Error en loginProcess:', err.message);
    return res.status(400).json({ error: err.message });
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