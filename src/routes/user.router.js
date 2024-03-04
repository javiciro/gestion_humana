import * as ctrUser from "../controllers/user.controller.js";

import { Router } from "express";

const routerUser = Router ();

routerUser.post("/crear-usuario", ctrUser.crearCuenta);

export default routerUser;