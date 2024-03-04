import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from '../models/user.models.js';

const secretKey = "tu_clave_secreta";
// const secretKey = process.env.LLAVE; // Clave secreta para firmar el token, guárdala de forma segura // Clave secreta para firmar el token, guárdala de forma segura

export async function iniciarSesion(req, res) {
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

        // Generar token JWT
        const token = jwt.sign({ correo: usuario.correo, id: usuario.id }, secretKey);

        // Devolver una respuesta adecuada con el token
        return res.status(200).json({ ok: true, token, message: "Inicio de sesión exitoso" });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
}
