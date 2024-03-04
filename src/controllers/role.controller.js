// role.controller.js

import Usuario from '../models/user.models.js';

// Función para cambiar el rol de un usuario
export async function asignarRol(req, res) {
    try {
        const { userId, nuevoRolId } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {
            return res.status(404).json({ ok: false, menssage: "Usuario no encontrado" });
        }

        // Verificar si el nuevo rol es válido (opcional, dependiendo de tus requisitos)

        // Actualizar el rol del usuario
        usuario.rol_id = nuevoRolId;
        await usuario.save();

        return res.status(200).json({ ok: true, menssage: "Rol asignado correctamente" });
    } catch (error) {
        console.error("Error al asignar rol:", error);
        return res.status(500).json({ ok: false, menssage: "Error interno del servidor" });
    }
}
