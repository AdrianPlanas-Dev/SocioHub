
import { Router } from "express";

import {
  obtenerSocios,
  crearNuevoSocio,
} from "../controllers/sociosController.js";

const router = Router();

router.get("/", obtenerSocios);

router.post("/", crearNuevoSocio);

export default router;

