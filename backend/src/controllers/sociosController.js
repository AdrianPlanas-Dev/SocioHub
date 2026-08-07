import { getSocios } from "../services/googleSheetsService.js";

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