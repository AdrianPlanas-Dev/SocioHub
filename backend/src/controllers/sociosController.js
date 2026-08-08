
import {
  getSocios,
  crearSocio,
  actualizarSocio,
} from "../services/googleSheetsService.js";

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

export async function crearNuevoSocio(req, res) {
  try {
    const {
      nombre,
      apellidos,
      telefono,
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
      telefono: telefono ?? "",
      estado: estado ?? "Pendiente",
    });

    res.status(201).json(socio);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error creando el socio",
    });
  }
}

export async function editarSocio(req, res) {
  try {
    const { numero } = req.params;

    const {
      nombre,
      apellidos,
      telefono,
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
        telefono: telefono ?? "",
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

