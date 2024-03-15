const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/user.models.js");

const secretKey = "tu_clave_secreta";
const saltRounds = 10;
const EMPLEADO_ROL_ID = 3;
const LIDER_ROL_ID = 2;
const expiresIn = '1d';

async function crearCuenta(req, res) {
  try {
    const {
      correo,
      clave,
      confirmarClave,
      cedula,
      nombre,
      apellidos,
      telefono,
      direccion,
      lider,
    } = req.body;

    // Validación de campos obligatorios
    if (!correo || !clave || !confirmarClave || !cedula || !nombre || !apellidos || !telefono || !direccion) {
      return res.status(400).json({
        isOk: false,
        msj: "Faltan datos obligatorios",
      });
    }

    // Validación de coincidencia de clave y confirmación de clave
    if (clave !== confirmarClave) {
      return res.status(400).json({
        isOk: false,
        msj: "La contraseña y su confirmación son diferentes",
      });
    }

    // Validación de cédula única
    const usuarioExistente = await Usuario.findOne({
      where: {
        cedula: cedula,
      },
    });
    if (usuarioExistente) {
      return res.status(400).json({
        isOk: false,
        msj: "Ya existe un usuario con este número de cédula",
      });
    }

    // Validación de rol de líder
    if (lider) {
      const liderExistente = await Usuario.findOne({
        where: {
          id: lider,
          rol_id: LIDER_ROL_ID,
        },
      });
      if (!liderExistente) {
        return res.status(400).json({
          isOk: false,
          msj: "El líder seleccionado no es válido",
        });
      }
    }

    // Encriptación de clave
    const hashedClave = await bcrypt.hash(clave, saltRounds);

    // Creación de usuario
    const nuevoUsuario = await Usuario.create({
      correo,
      clave: hashedClave,
      cedula,
      nombre,
      apellidos,
      telefono,
      direccion,
      rol_id: EMPLEADO_ROL_ID,
      lider,
    });

    // Generación de token
    const token = jwt.sign(
      {
        correo: nuevoUsuario.correo,
        id: nuevoUsuario.id,
      },
      secretKey,
      {
        expiresIn,
      }
    );

    // Devolución de respuesta
    const datosUsuario = {
      correo,
      cedula,
      nombre,
      apellidos,
      telefono,
      direccion,
      rol_id: EMPLEADO_ROL_ID,
      lider,
    };

    return res.status(201).json({
      isOk: true,
      msj: "Usuario almacenado correctamente",
      usuario: datosUsuario,
      token,
    });
  } catch (error) {
    console.error("Error al crear cuenta:", error);
    return res.status(500).json({
      isOk: false,
      msj: "Error interno del servidor",
    });
  }
}

async function obtenerLideres(req, res) {
  try {
    // Buscar todos los usuarios con rol de líder
    const lideres = await Usuario.findAll({
      where: {
        rol_id: LIDER_ROL_ID,
      },
    });

    // Verificar si se encontraron líderes
    if (!lideres || lideres.length === 0) {
      return res.status(404).json({
        isOk: false,
        msj: "No se encontraron líderes",
      });
    }

    // Devolución de la lista de líderes
    return res.status(200).json({
      isOk: true,
      msj: "Lista de líderes obtenida correctamente",
      lideres,
    });
  } catch (error) {
    console.error("Error al obtener líderes:", error);
    return res.status(500).json({
      isOk: false,
      msj: "Error interno del servidor al obtener líderes",
    });
  }
}

module.exports = {
  crearCuenta,
  obtenerLideres,
};
