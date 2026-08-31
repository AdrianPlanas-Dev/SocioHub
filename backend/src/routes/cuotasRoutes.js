import express from "express";

import {
  obtenerAnios,
  obtenerCuotas,
  obtenerEstado,
  obtenerEstados,
  registrarPagoController,
} from "../controllers/cuotasController.js";

const router = express.Router();

// =========================
// AÑOS
// =========================

router.get(
  "/anios",
  obtenerAnios
);

// =========================
// ESTADO DE TODOS LOS SOCIOS
// =========================

router.get(
  "/estados",
  obtenerEstados
);

// =========================
// ESTADO DE UN SOCIO
// =========================

router.get(
  "/estado/:numero",
  obtenerEstado
);

// =========================
// REGISTRAR PAGO
// =========================

router.post(
  "/pago/:numero",
  registrarPagoController
);

// =========================
// CUOTAS DE UN AÑO
// =========================

router.get(
  "/:anio",
  obtenerCuotas
);

export default router;
