
import { Router } from "express";

import {
  obtenerSocios,
  crearSocioController,
  editarSocio,
  borrarSocio,
} from "../controllers/sociosController.js";

const router = Router();

router.get("/", obtenerSocios);

router.post("/", crearSocioController);

router.put("/:numero", editarSocio);

router.delete("/:numero", borrarSocio);

export default router;

