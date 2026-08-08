
import { Router } from "express";

import {
  obtenerSocios,
  crearNuevoSocio,
  editarSocio,
} from "../controllers/sociosController.js";

const router = Router();

router.get("/", obtenerSocios);

router.post("/", crearNuevoSocio);

router.put("/:numero", editarSocio);

export default router;

