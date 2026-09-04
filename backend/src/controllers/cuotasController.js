import {
  obtenerAniosCuotas,
  obtenerCuotasAnio,
  obtenerEstadosSocios,
  obtenerEstadoSocio,
  obtenerPagos,
  registrarPago,
  modificarPago,
  anularPago,
} from "../services/cuotasService.js";

// =========================
// OBTENER CUOTAS DE UN AÑO
// =========================

export async function obtenerCuotas(req, res) {
  try {
    const { anio } = req.params;

    const cuotas =
      await obtenerCuotasAnio(
        Number(anio)
      );

    res.json(cuotas);
  } catch (error) {
    console.error(
      "Error obteniendo cuotas:",
      error
    );

    res.status(500).json({
      error:
        error.message ??
        "Error obteniendo las cuotas",
    });
  }
}

// =========================
// OBTENER AÑOS
// =========================

export async function obtenerAnios(req, res) {
  try {
    const anios =
      await obtenerAniosCuotas();

    res.json(anios);
  } catch (error) {
    console.error(
      "Error obteniendo años de cuotas:",
      error
    );

    res.status(500).json({
      error:
        error.message ??
        "Error obteniendo los años de las cuotas",
    });
  }
}

// =========================
// OBTENER PAGOS
// =========================

export async function obtenerPagosController(
  req,
  res
) {
  try {
    const pagos =
      await obtenerPagos();

    res.json(pagos);
  } catch (error) {
    console.error(
      "Error obteniendo pagos:",
      error
    );

    res.status(500).json({
      error:
        error.message ??
        "Error obteniendo los pagos",
    });
  }
}

// =========================
// OBTENER ESTADOS DE TODOS
// =========================

export async function obtenerEstados(req, res) {
  try {
    const estados =
      await obtenerEstadosSocios();

    res.json(estados);
  } catch (error) {
    console.error(
      "Error obteniendo estados de socios:",
      error
    );

    res.status(500).json({
      error:
        error.message ??
        "Error obteniendo los estados de los socios",
    });
  }
}

// =========================
// OBTENER ESTADO DE UN SOCIO
// =========================

export async function obtenerEstado(req, res) {
  try {
    const { numero } = req.params;

    const resultado =
      await obtenerEstadoSocio(
        Number(numero)
      );

    res.json(resultado);
  } catch (error) {
    console.error(
      "Error obteniendo estado del socio:",
      error
    );

    res.status(500).json({
      error:
        error.message ??
        "Error obteniendo el estado del socio",
    });
  }
}

// =========================
// REGISTRAR PAGO
// =========================

export async function registrarPagoController(
  req,
  res
) {
  try {
    const { numero } = req.params;

    const {
      anio,
      mes,
      cantidad,
    } = req.body;

    if (
      anio === undefined ||
      mes === undefined ||
      cantidad === undefined
    ) {
      return res.status(400).json({
        error:
          "Año, mes y cantidad son obligatorios",
      });
    }

    const resultado =
      await registrarPago(
        numero,
        anio,
        mes,
        cantidad
      );

    res.json(resultado);
  } catch (error) {
    console.error(
      "Error registrando pago:",
      error
    );

    res.status(400).json({
      error:
        error.message ??
        "Error registrando el pago",
    });
  }
}

// =========================
// MODIFICAR PAGO
// =========================

export async function modificarPagoController(
  req,
  res
) {
  try {
    const { numero } = req.params;

    const {
      anio,
      mes,
      nuevoAnio,
      nuevoMes,
      nuevaCantidad,
    } = req.body;

    if (
      anio === undefined ||
      mes === undefined ||
      nuevoAnio === undefined ||
      nuevoMes === undefined ||
      nuevaCantidad === undefined
    ) {
      return res.status(400).json({
        error:
          "Año, mes, nuevo año, nuevo mes y nueva cantidad son obligatorios",
      });
    }

    const resultado =
      await modificarPago(
        numero,
        anio,
        mes,
        nuevoAnio,
        nuevoMes,
        nuevaCantidad
      );

    res.json(resultado);
  } catch (error) {
    console.error(
      "Error modificando pago:",
      error
    );

    res.status(400).json({
      error:
        error.message ??
        "Error modificando el pago",
    });
  }
}

// =========================
// ANULAR PAGO
// =========================

export async function anularPagoController(
  req,
  res
) {
  try {
    const { numero } = req.params;

    const {
      anio,
      mes,
    } = req.body;

    if (
      anio === undefined ||
      mes === undefined
    ) {
      return res.status(400).json({
        error:
          "Año y mes son obligatorios",
      });
    }

    const resultado =
      await anularPago(
        numero,
        anio,
        mes
      );

    res.json(resultado);
  } catch (error) {
    console.error(
      "Error anulando pago:",
      error
    );

    res.status(400).json({
      error:
        error.message ??
        "Error anulando el pago",
    });
  }
}
