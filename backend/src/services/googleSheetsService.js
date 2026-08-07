import { sheets } from "../config/google.js";

export async function getSocios() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Socios!A:E",
  });

  const rows = response.data.values ?? [];

  if (rows.length <= 1) return [];

  const [, ...data] = rows;

  return data.map((row) => ({
    id: Number(row[0]),
    numero: Number(row[0]),
    nombre: `${row[1] ?? ""} ${row[2] ?? ""}`.trim(),
    telefono: row[3] ?? "",
    estado: row[4] ?? "Pendiente",
  }));
}