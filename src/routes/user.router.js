// routes/user.routes.js
import express from 'express';
import * as ctrUser from '../controllers/user.controller.js';

const router = express.Router();

router.post('/crear-usuario', ctrUser.crearCuenta);

export default router;
