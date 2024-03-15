const bcrypt = require("bcrypt");
const Usuario = require("../models/user.models.js");
const jwt = require("jsonwebtoken");
const Rol = require("../models/roles.model.js");

const secretKey = process.env.LLAVE || "tu_clave_secreta";
const expiresIn = '1d';

async function iniciarSesion(req, res) {
  try {
    const { cedula, clave } = req.body;

    // Validar que se proporcionen la cedula y la clave
    if (!cedula || !clave) {
      return res.status(400).json({ ok: false, message: "Por favor, proporcione la cedula y la clave" });
    }

    // Buscar el usuario en la base de datos por su cedula
    const usuario = await Usuario.findOne({ where: { cedula: cedula } });

    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).json({ ok: false, message: "Credenciales incorrectas" });
    }

    // Verificar si la contraseña es correcta
    const contraseñaValida = await bcrypt.compare(clave, usuario.clave);
    if (!contraseñaValida) {
      return res.status(401).json({ ok: false, message: "Credenciales incorrectas" });
    }

    // Obtener el rol del usuario
    const rol = await Rol.findOne({ where: { id: usuario.rol_id } });

    // Generar token JWT con una fecha de expiración
    const token = jwt.sign({ correo: usuario.correo, id: usuario.id, rol: usuario.rol_id }, secretKey, { expiresIn });

    // Devolver una respuesta adecuada con el token y los datos del usuario (sin la clave)
    const datosUsuario = {
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      rol: rol.nombre
    };

    return res.status(200).json({ ok: true, token, usuario: datosUsuario, message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ ok: false, message: "Error interno del servidor" });
  }
}

module.exports = { iniciarSesion };