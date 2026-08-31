
import {
  getSocios,
  crearSocio,
  actualizarSocio,
  eliminarSocio,
} from "../services/googleSheetsService.js";


// =========================
// OBTENER SOCIOS
// =========================

export async function obtenerSocios(req, res) {
  try {
    const socios = await getSocios();

    res.json(socios);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error leyendo Google Sheets",
    });
  }
}


// =========================
// CREAR SOCIO
// =========================

export async function crearSocioController(req, res) {
  try {
    const {
      nombre,
      apellidos,
      dni,
      telefono,
      direccion,
      fechaNacimiento,
      estado,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({
        error: "El nombre es obligatorio",
      });
    }

    const socio = await crearSocio({
      nombre,
      apellidos: apellidos ?? "",
      dni: dni ?? "",
      telefono: telefono ?? "",
      direccion: direccion ?? "",
      fechaNacimiento: fechaNacimiento ?? "",
      estado: estado ?? "Pendiente",
    });

    res.status(201).json(socio);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error creando socio",
    });
  }
}


// =========================
// EDITAR SOCIO
// =========================

export async function editarSocio(req, res) {
  try {
    const { numero } = req.params;

    const {
      nombre,
      apellidos,
      dni,
      telefono,
      direccion,
      fechaNacimiento,
      estado,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({
        error: "El nombre es obligatorio",
      });
    }

    const socio = await actualizarSocio(
      numero,
      {
        nombre,
        apellidos: apellidos ?? "",
        dni: dni ?? "",
        telefono: telefono ?? "",
        direccion: direccion ?? "",
        fechaNacimiento: fechaNacimiento ?? "",
        estado: estado ?? "Pendiente",
      }
    );

    res.json(socio);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error actualizando el socio",
    });
  }
}


// =========================
// ELIMINAR SOCIO
// =========================

export async function borrarSocio(req, res) {
  try {
    const { numero } = req.params;

    const resultado = await eliminarSocio(numero);

    res.json({
      message: "Socio eliminado correctamente",
      ...resultado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error eliminando el socio",
    });
  }
}
