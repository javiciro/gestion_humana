const Permiso = require('../models/permiso.model.js');

// Controlador para aprobar o rechazar un permiso por el líder de área
async function gestionarPermisoPorLider(req, res) {
  try {
    const { idPermiso, nuevoEstado } = req.body;

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
    await permiso.save();

    return res.status(200).json({ isOk: true, msj: `Permiso ${nuevoEstado.toLowerCase()} por el líder de área` });
  } catch (error) {
    console.error("Error al gestionar permiso por líder:", error);
    return res.status(500).json({ isOk: false, msj: "Error interno del servidor" });
  }
}

// Controlador para aprobar o rechazar un permiso por el departamento de Recursos Humanos
async function gestionarPermisoPorRecursosHumanos(req, res) {
  try {
    const { idPermiso, nuevoEstado } = req.body;

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
    await permiso.save();

    return res.status(200).json({ isOk: true, msj: `Permiso ${nuevoEstado.toLowerCase()} por el departamento de Recursos Humanos` });
  } catch (error) {
    console.error("Error al gestionar permiso por Recursos Humanos:", error);
    return res.status(500).json({ isOk: false, msj: "Error interno del servidor" });
  }
}

module.exports = {
  gestionarPermisoPorLider,
  gestionarPermisoPorRecursosHumanos
};
