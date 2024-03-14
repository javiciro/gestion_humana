const bcrypt = require("bcrypt");
const Usuario = require("../models/user.models.js");
const jwt = require("jsonwebtoken");

// Utilizamos process.env.LLAVE si has configurado una clave secreta en tu entorno
const secretKey = process.env.LLAVE || "tu_clave_secreta";
const expiresIn = '1d'; // El token expirará después de 1 día

async function iniciarSesion(req, res) {
    try {
        const { correo, clave } = req.body;

        // Buscar el usuario en la base de datos por su correo electrónico
        const usuario = await Usuario.findOne({ where: { correo: correo } });

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
        }

        // Verificar si la contraseña es correcta
        const contraseñaValida = await bcrypt.compare(clave, usuario.clave);
        if (!contraseñaValida) {
            return res.status(401).json({ ok: false, message: "Contraseña incorrecta" });
        }

        // Generar token JWT con una fecha de expiración
        const token = jwt.sign({ correo: usuario.correo, id: usuario.id }, secretKey, { expiresIn });

        // Devolver una respuesta adecuada con el token y los datos del usuario (sin la clave)
        const datosUsuario = {
            correo: usuario.correo,
            cedula: usuario.cedula,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            rol_id: usuario.rol_id,
            lider: usuario.lider
        };

        return res.status(200).json({ ok: true, token, usuario: datosUsuario, message: "Inicio de sesión exitoso" });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
}

module.exports = { iniciarSesion };
