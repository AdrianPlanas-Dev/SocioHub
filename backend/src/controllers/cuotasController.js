import {
  obtenerAniosCuotas,
  obtenerCuotasAnio,
  obtenerEstadosSocios,
  obtenerEstadoSocio,
  registrarPago,
} from "../services/cuotasService.js";

// =========================
// OBTENER CUOTAS DE UN AÑO
// =========================

export async function obtenerCuotas(req, res) {
  try {
    const { anio } = req.params;

    const cuotas = await obtenerCuotasAnio(
      Number(anio)
    );

    res.json(cuotas);
  } catch (error) {
    console.error(
      "Error obteniendo cuotas:",
      error
    );

    res.status(500).json({
      error: "Error obteniendo las cuotas",
    });
  }
}

// =========================
// OBTENER AÑOS DE CUOTAS
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
        "Error obteniendo los años de las cuotas",
    });
  }
}

// =========================
// OBTENER ESTADO DE TODOS
// LOS SOCIOS
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

    // =========================
    // VALIDACIONES
    // =========================

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

    const numeroSocio =
      Number(numero);

    const anioNumero =
      Number(anio);

    const mesNumero =
      Number(mes);

    const cantidadNumero =
      Number(
        String(cantidad).replace(",", ".")
      );

    if (
      Number.isNaN(numeroSocio) ||
      numeroSocio <= 0
    ) {
      return res.status(400).json({
        error: "Número de socio no válido",
      });
    }

    if (
      Number.isNaN(anioNumero) ||
      anioNumero < 2000
    ) {
      return res.status(400).json({
        error: "Año no válido",
      });
    }

    if (
      Number.isNaN(mesNumero) ||
      mesNumero < 1 ||
      mesNumero > 12
    ) {
      return res.status(400).json({
        error: "Mes no válido",
      });
    }

    if (
      Number.isNaN(cantidadNumero) ||
      cantidadNumero <= 0
    ) {
      return res.status(400).json({
        error:
          "La cantidad debe ser mayor que 0",
      });
    }

    // =========================
    // REGISTRAR EN GOOGLE SHEETS
    // =========================

    const resultado =
      await registrarPago(
        numeroSocio,
        anioNumero,
        mesNumero,
        cantidadNumero
      );

    res.json(resultado);
  } catch (error) {
    console.error(
      "Error registrando pago:",
      error
    );

    res.status(500).json({
      error:
        error.message ||
        "Error registrando el pago",
    });
  }
}
