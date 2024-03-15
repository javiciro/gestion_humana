const nodemailer = require('nodemailer');
const Permiso = require('../models/permiso.model.js');
const Usuario = require('../models/user.models.js');

// Configura el transporte de correo electrónico
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cirocristian259@gmail.com',
    pass: 'kennhbtycrvkfqoi'
  }
});

/**
 * Función para enviar un correo electrónico
 * @param {string} destinatario - El correo electrónico del destinatario
 * @param {string} asunto - El asunto del correo electrónico
 * @param {string} cuerpo - El cuerpo del correo electrónico
 */
async function enviarCorreo(destinatario, asunto, cuerpo) {
  const mailOptions = {
    from: 'tu_correo@gmail.com',
    to: destinatario,
    subject: asunto,
    text: cuerpo
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
}

/**
 * Controlador para solicitar un permiso
 * @param {object} req - Objeto de solicitud HTTP
 * @param {object} res - Objeto de respuesta HTTP
 */
async function solicitarPermiso(req, res) {
  const { usuario_id, permiso, observaciones, fechaInicio, fechaFin, tipoPermiso } = req.body;

  // Validaciones de datos obligatorios
  const missingFields = [];
  if (!usuario_id) missingFields.push('usuario_id');
  if (!permiso) missingFields.push('permiso');
  if (!observaciones) missingFields.push('observaciones');
  if (!fechaInicio) missingFields.push('fechaInicio');
  if (!fechaFin) missingFields.push('fechaFin');
  if (!tipoPermiso) missingFields.push('tipoPermiso');

  if (missingFields.length > 0) {
    return res.status(400).json({
      isOk: false,
      msj: "Faltan datos obligatorios",
      missingFields
    });
  }

  try {
    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findOne({ where: { id: usuario_id } });
    if (!usuario) {
      return res.status(400).json({ isOk: false, msj: "No existe un usuario con este ID" });
    }

    // Obtener el líder asignado al trabajador
    const lider = await Usuario.findOne({ where: { id: usuario.lider } });
    if (!lider) {
      return res.status(400).json({ isOk: false, msj: "No se encontró el líder asignado al trabajador" });
    }

    // Crear un nuevo permiso con los datos proporcionados y estado inicial en espera
    const nuevoPermiso = {
      usuario_id,
      permiso,
      observaciones,
      fecha: fechaInicio,
      fechaFin,
      tipoPermiso,
      estado: 'EN ESPERA'
    };

    // Guardar el nuevo permiso en la base de datos
    const permisoGuardado = await Permiso.create(nuevoPermiso);

    // Envía correo electrónico al líder asignado
    await enviarCorreo(lider.correo, 'Permiso Solicitado', `Se ha solicitado un permiso. Detalles: ${JSON.stringify(permisoGuardado)}`);

    // Buscar al usuario con el rol de Recursos Humanos
    const usuarioRecursosHumanos = await Usuario.findOne({ where: { rol_id: 1 } });
    if (!usuarioRecursosHumanos) {
      return res.status(400).json({ isOk: false, msj: "No se encontró ningún usuario con el rol de Recursos Humanos" });
    }

    // Envía correo electrónico al usuario de Recursos Humanos
    await enviarCorreo(usuarioRecursosHumanos.correo, 'Permiso Solicitado', `Se ha solicitado un permiso. Detalles: ${JSON.stringify(permisoGuardado)}`);

    // Devolver una respuesta adecuada con los datos del permiso creado
    return res.status(201).json({ isOk: true, msj: "Permiso solicitado correctamente", permiso: permisoGuardado });
  } catch (error) {
    console.error("Error al solicitar permiso:", error);
    return res.status(500).json({ isOk: false, msj: "Error interno del servidor" });
  }
}

module.exports = { solicitarPermiso };
