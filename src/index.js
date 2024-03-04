import express from 'express';
import bodyParser from 'body-parser';
import { crearCuenta } from './controllers/user.controller.js';
import { iniciarSesion } from './controllers/login.controller.js';
import { asignarRol } from './controllers/role.controller.js';
// Importar tu controlador de usuario

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Ruta para iniciar sesión
app.post('/login', iniciarSesion);

// Ruta para el registro de usuarios
app.post('/registro', crearCuenta);

// Ruta para asignar un nuevo rol a un usuario
app.post('/asignar-rol', asignarRol);


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
