// src/controlador/controladorVistas.js
const path = require('path');

exports.paginaIndex = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'vistas', 'index.html'));
};

exports.paginaLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'vistas', 'login.html'));
};

exports.paginaRegistro = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'vistas', 'registro.html'));
  };