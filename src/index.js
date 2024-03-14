const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { crearCuenta } = require('./controllers/user.controller.js');
const { iniciarSesion } = require('./controllers/login.controller.js');
const { asignarRol } = require('./controllers/role.controller.js');
const { solicitarPermiso } = require('./controllers/permiso.trabajadoresController.js');
const {
  gestionarPermisoPorLider,
  gestionarPermisoPorRecursosHumanos,
} = require('./controllers/estado.permiso.controller.js');
const path = require('path');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3500;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Rutas para iniciar sesión, registro de usuarios, asignación de roles y solicitud de permisos
app.post('/login', iniciarSesion);
app.post('/registro', crearCuenta);
app.post('/asignar-rol', asignarRol);
app.post('/solicitar-permiso', solicitarPermiso);

// Rutas para aprobar o rechazar permisos
app.post('/permisos/aprobar/lider', gestionarPermisoPorLider);
app.post('/permisos/rechazar/lider', gestionarPermisoPorLider);
app.post('/permisos/aprobar/recursos-humanos', gestionarPermisoPorRecursosHumanos);
app.post('/permisos/rechazar/recursos-humanos', gestionarPermisoPorRecursosHumanos);

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
