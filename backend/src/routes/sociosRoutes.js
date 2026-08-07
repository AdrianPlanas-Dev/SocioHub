import { Router } from "express";

import { obtenerSocios } from "../controllers/sociosController.js";

const router = Router();

router.get("/", obtenerSocios);

export default router;