import Sequelize from 'sequelize';
import sequelize from '../conexion.js';

const Usuario = sequelize.define('usuario', {
  correo: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  clave: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cedula: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  apellidos: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telefono: {
    type: Sequelize.STRING,
    allowNull: false
  },
  direccion: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rol_id: {
    type: Sequelize.INTEGER,
    allowNull: false, // Opcional dependiendo de tus requisitos
    defaultValue: 3 // Valor predeterminado para el rol de trabajador
  },
  lider: {
    type: Sequelize.STRING, // Cambiar el tipo de datos según tus necesidades (puede ser STRING, INTEGER, etc.)
    allowNull: true // Permitir que el campo sea nulo
  }

});

// Sincronizar el modelo con la base de datos (solo si necesitas crear la tabla)
// Este método se puede eliminar si ya tienes la tabla creada en tu base de datos
Usuario.sync();

export default Usuario;
