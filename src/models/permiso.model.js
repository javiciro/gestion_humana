// Importar Sequelize y la conexión a la base de datos
const Sequelize = require('sequelize');
const sequelize = require('../conexion.js');

// Importar el modelo de usuario
const Usuario = require('./user.models.js'); // Asegúrate de que la ruta sea correcta

// Definir el modelo para la tabla Permisos
const Permiso = sequelize.define('permisos', {
  id: {
    type: Sequelize.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tipoPermiso: {
    type: Sequelize.ENUM('CITA_MEDICA','OTRO','COMPENSA'),
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false
  },
  fechaFin: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  observaciones: {
    type: Sequelize.TEXT,
    defaultValue: null
  },

  aprobacion_lider: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  aprobacion_recursos_humanos: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  estado: {
    type: Sequelize.ENUM('EN ESPERA','LIDER APROBÓ','LIDER RECHAZÓ','RECURSOS HUMANOS APROBÓ','RECURSOS HUMANOS RECHAZÓ'),
    allowNull: false,
    defaultValue: 'EN ESPERA'
  }
});

// Establecer relación de clave externa (foreign key)
Permiso.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Sincronizar el modelo con la base de datos y crear la tabla si no existe
Permiso.sync({ alter: true });

// Exportar el modelo
module.exports = Permiso;
