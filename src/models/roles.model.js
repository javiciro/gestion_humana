// Importar Sequelize y la conexión a la base de datos
const Sequelize = require('sequelize');
const sequelize = require('../conexion.js');

// Define el modelo para la tabla Roles
const Rol = sequelize.define('roles', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Sincronizar el modelo con la base de datos y crear la tabla si no existe
Rol.sync({ alter: true })
  .then(() => {
    console.log('Modelo de roles sincronizado correctamente.');
    // Define los datos de los roles
    const rolesData = [
      { id: 1, nombre: 'recursos_humanos' },
      { id: 2, nombre: 'lideres' },
      { id: 3, nombre: 'trabajadores' },
      { id: 4, nombre: 'administradores' }
    ];

    // Función para inicializar los roles
    const initRoles = async () => {
      try {
        // Itera sobre los datos de los roles
        for (const data of rolesData) {
          // Busca el rol en la base de datos
          const rol = await Rol.findOne({ where: { id: data.id } });

          // Si no se encuentra el rol, créalo
          if (!rol) {
            await Rol.create(data);
            console.log(`Rol ${data.nombre} creado.`);
          }
        }
        console.log('Se han agregado los roles correctamente.');
      } catch (error) {
        console.error('Error al inicializar los roles:', error);
      }
    };

    // Llama a la función para inicializar los roles
    initRoles();
  })
  .catch(error => {
    console.error('Error al sincronizar el modelo de roles:', error);
  });

// Exportar el modelo
module.exports = Rol;
