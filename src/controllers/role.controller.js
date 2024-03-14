const jwt = require("jsonwebtoken");
const Usuario = require('../models/user.models.js');

const secretKey = process.env.LLAVE || "tu_clave_secreta";
const expiresIn = '1d'; // El token expirará después de 1 día

async function asignarRol(req, res) {
    try {
        const { userId, nuevoRolId } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {
            return res.status(404).json({ ok: false, menssage: "Usuario no encontrado" });
        }

        // Actualizar el rol del usuario
        usuario.rol_id = nuevoRolId;
        await usuario.save();

        // Generar un nuevo token con la información actualizada del usuario
        const token = jwt.sign({ correo: usuario.correo, id: usuario.id }, secretKey, { expiresIn });

        // Devolver una respuesta adecuada con los datos del usuario actualizados y el nuevo token
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

        return res.status(200).json({ ok: true, menssage: "Rol asignado correctamente", usuario: datosUsuario, token });
    } catch (error) {
        console.error("Error al asignar rol:", error);
        return res.status(500).json({ ok: false, menssage: "Error interno del servidor" });
    }
}

module.exports = { asignarRol };
