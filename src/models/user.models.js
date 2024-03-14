// Importar Sequelize y la conexión a la base de datos
const Sequelize = require('sequelize');
const sequelize = require('../conexion.js');
const Rol = require('./roles.model.js');

// Definir el modelo para la tabla Usuarios
const Usuario = sequelize.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  correo: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      name: 'usuarios_correo',
      msg: 'El correo ya está en uso.'
    }
  },
  clave: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cedula: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      name: 'usuarios_cedula',
      msg: 'La cédula ya está en uso.'
    }
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
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  rol_id: {
    type: Sequelize.INTEGER,
    defaultValue: 3,
    allowNull: false
  },
  lider: {
    type: Sequelize.STRING,
    defaultValue: null,
    allowNull: true
  },
});

// Establecer relación de clave externa (foreign key)
Usuario.belongsTo(Rol, { foreignKey: 'rol_id' });

// Sincronizar el modelo con la base de datos y crear la tabla si no existe, pero de manera segura
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados correctamente.');
  })
  .catch(error => {
    console.error('Error al sincronizar los modelos:', error);
  });

// Exportar el modelo
module.exports = Usuario;
