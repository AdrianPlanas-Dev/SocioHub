import express from "express";

import {
  obtenerAnios,
  obtenerCuotas,
  obtenerEstado,
  obtenerEstados,
  obtenerPagosController,
  registrarPagoController,
  modificarPagoController,
  anularPagoController,
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
// TODOS LOS PAGOS
// =========================

router.get(
  "/pagos",
  obtenerPagosController
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
// MODIFICAR PAGO
// =========================

router.put(
  "/pago/:numero",
  modificarPagoController
);

// =========================
// ANULAR PAGO
// =========================

router.delete(
  "/pago/:numero",
  anularPagoController
);

// =========================
// CUOTAS DE UN AÑO
// =========================

router.get(
  "/:anio",
  obtenerCuotas
);

export default router;