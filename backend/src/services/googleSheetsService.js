
import { sheets } from "../config/google.js";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Socios";

export async function getSocios() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:E`,
  });

  const rows = response.data.values ?? [];

  if (rows.length <= 1) {
    return [];
  }

  const [, ...data] = rows;

  return data.map((row) => ({
    id: Number(row[0]),
    numero: Number(row[0]),
    nombre: row[1] ?? "",
    apellidos: row[2] ?? "",
    telefono: row[3] ?? "",
    estado: row[4] ?? "Pendiente",
  }));
}

export async function crearSocio({
  nombre,
  apellidos,
  telefono,
  estado,
}) {
  const socios = await getSocios();

  const ultimoNumero =
    socios.length > 0
      ? Math.max(...socios.map((socio) => socio.numero))
      : 0;

  const numero = ultimoNumero + 1;

  const nuevaFila = [
    numero,
    nombre,
    apellidos,
    telefono,
    estado,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:E`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [nuevaFila],
    },
  });

  return {
    id: numero,
    numero,
    nombre,
    apellidos,
    telefono,
    estado,
  };
}

export async function actualizarSocio(
  numero,
  {
    nombre,
    apellidos,
    telefono,
    estado,
  }
) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:E`,
  });

  const rows = response.data.values ?? [];

  if (rows.length <= 1) {
    throw new Error("No hay socios para actualizar");
  }

  const indice = rows.findIndex(
    (row, index) =>
      index > 0 &&
      Number(row[0]) === Number(numero)
  );

  if (indice === -1) {
    throw new Error(
      `No se encontró el socio número ${numero}`
    );
  }

  const numeroFila = indice + 1;

  const rango = `${SHEET_NAME}!A${numeroFila}:E${numeroFila}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: rango,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        numero,
        nombre,
        apellidos,
        telefono,
        estado,
      ]],
    },
  });

  return {
    id: Number(numero),
    numero: Number(numero),
    nombre,
    apellidos,
    telefono,
    estado,
  };
}

