const { Op } = require('sequelize');
const Permiso = require('../models/permiso.model.js');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

// Verificar token de autenticación y autorización
function verificarToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ isOk: false, msj: 'Acceso denegado. No proporcionó token de autenticación.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.usuario = decoded.usuario;
    next();
  } catch (error) {
    res.status(400).json({ isOk: false, msj: 'Token de autenticación inválido.' });
  }
}

// Reglas de validación
const validarGestionarPermiso = [
  check('idPermiso', 'El ID de permiso es obligatorio y debe ser un UUID válido.').notEmpty().isUUID(4),
  check('nuevoEstado', 'El nuevo estado es obligatorio y debe ser una cadena válida.').notEmpty().isString(),
];

// Controlador para aprobar o rechazar un permiso por el líder de área
async function gestionarPermisoPorLider(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ isOk: false, msj: errors.array() });
  }

  try {
    const { idPermiso, nuevoEstado } = req.body;

    // Verificar si el usuario está autorizado para esta acción
    if (req.usuario.rol !== 'lider') {
      return res.status(403).json({ isOk: false, msj: 'Acceso denegado. No está autorizado para gestionar permisos como líder.' });
    }

    const permiso = await Permiso.findOne({ where: { id: idPermiso } });
    if (!permiso) {
      return res.status(404).json({ isOk: false, msj: "Permiso no encontrado" });
    }

    // Verificar si el nuevo estado es válido para el líder
    if (!['LIDER APROBÓ', 'LIDER RECHAZÓ'].includes(nuevoEstado)) {
      return res.status(400).json({ isOk: false, msj: "El nuevo estado proporcionado no es válido para el líder" });
    }

    // Actualizar el estado del permiso y la aprobación del líder
    permiso.estado = nuevoEstado;
    permiso.aprobacion_lider = nuevoEstado === 'LIDER APROBÓ' ? 1 : 0; // Actualizar el campo aprobacion_lider
    await permiso.save();

    return res.status(200).json({ isOk: true, msj: `Permiso ${nuevoEstado.toLowerCase()} por el líder de área` });
  } catch (error) {
    console.error("Error al gestionar permiso por líder:", error);
    return res.status(500).json({ isOk: false, msj: "Error interno del servidor" });
  }
}

// Controlador para aprobar o rechazar un permiso por el departamento de Recursos Humanos
async function gestionarPermisoPorRecursosHumanos(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ isOk: false, msj: errors.array() });
  }

  try {
    const { idPermiso, nuevoEstado } = req.body;

    // Verificar si el usuario está autorizado para esta acción
    if (req.usuario.rol !== 'recursos_humanos') {
      return res.status(403).json({ isOk: false, msj: 'Acceso denegado. No está autorizado para gestionar permisos como Recursos Humanos.' });
    }

    const permiso = await Permiso.findOne({ where: { id: idPermiso } });
    if (!permiso) {
      return res.status(404).json({ isOk: false, msj: "Permiso no encontrado" });
    }

    // Verificar si el nuevo estado es válido para Recursos Humanos
    if (!['RECURSOS HUMANOS APROBÓ', 'RECURSOS HUMANOS RECHAZÓ'].includes(nuevoEstado)) {
      return res.status(400).json({ isOk: false, msj: "El nuevo estado proporcionado no es válido para Recursos Humanos" });
    }

    // Actualizar el estado del permiso y la aprobación de Recursos Humanos
    permiso.estado = nuevoEstado;
    permiso.aprobacion_recursos_humanos = nuevoEstado === 'RECURSOS HUMANOS APROBÓ' ? 1 : 0; // Actualizar el campo aprobacion_recursos_humanos
    await permiso.save();

    return res.status(200).json({ isOk: true, msj: `Permiso ${nuevoEstado.toLowerCase()} por el departamento de Recursos Humanos` });
  } catch (error) {
    console.error("Error al gestionar permiso por Recursos Humanos:", error);
    return res.status(500).json({ isOk: false, msj: "Error interno del servidor" });
  }
}

module.exports = {
  verificarToken,
  validarGestionarPermiso,
  gestionarPermisoPorLider,
  gestionarPermisoPorRecursosHumanos
};
