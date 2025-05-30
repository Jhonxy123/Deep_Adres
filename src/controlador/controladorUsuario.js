// Controlador para manejar las operaciones relacionadas con el usuario 
import usuarioDAO from '../modelo/DAO_Usuario.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const cambiarContrasena = async (req, res) => {
  // Obtener el ID del usuario de la sesión (más seguro que recibirlo por body)
  const userId = req.session.user?.id;
  
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Validaciones básicas
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Las nuevas contraseñas no coinciden' });
    }

    // Validar contraseña actual
    const isValid = await usuarioDAO.validateCurrentPassword(userId, currentPassword);
    if (!isValid) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await usuarioDAO.actualizarContrasena(userId, hashedPassword);

    res.status(200).json({ 
      success: true, 
      message: 'Contraseña actualizada correctamente' 
    });

  } catch (err) {
    console.error('Error en cambiarContrasena:', err);
    res.status(500).json({ 
      error: err.message || 'Error al cambiar contraseña' 
    });
  }
};