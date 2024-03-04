import bcrypt from "bcrypt";
import Usuario from '../models/user.models.js';

const saltRounds = 10;
const EMPLEADO_ROL_ID = 3; // ID del rol de empleado
const LIDER_ROL_ID = 2; // ID del rol de líder

export async function crearCuenta(req, res) {
    try {
        const { correo, clave, confirmarClave, cedula, nombre, apellidos, telefono, direccion, lider } = req.body;

        // Verificar si se proporcionan todos los campos obligatorios
        if (!correo || !clave || !confirmarClave || !cedula || !nombre || !apellidos || !telefono || !direccion) {
            return res.status(400).json({ isOk: false, msj: "Faltan datos obligatorios" });
        }

        // Verificar si la clave y la confirmación de clave coinciden
        if (clave !== confirmarClave) {
            return res.status(400).json({ isOk: false, msj: "La contraseña y su confirmación son diferentes" });
        }

        // Verificar si la cédula ya existe en la base de datos
        const usuarioExistente = await Usuario.findOne({ where: { cedula: cedula } });
        if (usuarioExistente) {
            return res.status(400).json({ isOk: false, msj: "Ya existe un usuario con este número de cédula" });
        }

        // Verificar si el líder seleccionado es válido (tiene el rol de líder)
        if (lider) {
            const liderExistente = await Usuario.findOne({ where: { id: lider, rol_id: LIDER_ROL_ID } });
            if (!liderExistente) {
                return res.status(400).json({ isOk: false, msj: "El líder seleccionado no es válido" });
            }
        }

        // Encriptar la clave
        const hashedClave = await bcrypt.hash(clave, saltRounds);

        // Crear un nuevo usuario con el ID de rol de empleado y el líder seleccionado
        const nuevoUsuario = new Usuario({
            correo,
            clave: hashedClave,
            cedula,
            nombre,
            apellidos,
            telefono,
            direccion,
            rol_id: EMPLEADO_ROL_ID, // Establecer el ID de rol de empleado por defecto
            lider: lider // Asignar el líder seleccionado
        });

        // Guardar el nuevo usuario en la base de datos
        await nuevoUsuario.save();

        // Devolver una respuesta adecuada
        return res.status(201).json({ isOk: true, msj: "Usuario almacenado correctamente" });
    } catch (error) {
        console.error("Error al crear cuenta:", error);
        return res.status(500).json({ isOk: false, msj: "Error interno del servidor" });
    }
}
