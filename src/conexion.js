import Sequelize from 'sequelize';


// Configuración de la conexión a la base de datos
const sequelize = new Sequelize('recursos_humanos', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // Especifica el dialecto de la base de datos que estás utilizando
  // Otros opciones de configuración aquí
});

// Manejar eventos de la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos.');
  })
  .catch(err => {
    console.error('Error de conexión a la base de datos:', err);
  });

export default sequelize;
