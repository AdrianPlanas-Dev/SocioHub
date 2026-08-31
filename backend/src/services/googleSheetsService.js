import { sheets } from "../config/google.js";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Socios";

// =========================
// OBTENER SOCIOS
// =========================

export async function getSocios() {
  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`,
    });

  const rows = response.data.values ?? [];

  if (rows.length <= 1) {
    return [];
  }

  // Quitamos la fila de cabeceras
  const [, ...data] = rows;

  return data.map((row) => ({
    id: Number(row[0]),
    numero: Number(row[0]),

    nombre: row[1] ?? "",
    apellidos: row[2] ?? "",
    dni: row[3] ?? "",
    telefono: row[4] ?? "",
    direccion: row[5] ?? "",
    fechaNacimiento: row[6] ?? "",

    estado:
      row[7] === "Pagado"
        ? "Pagado"
        : "Pendiente",
  }));
}

// =========================
// CREAR SOCIO
// =========================

export async function crearSocio({
  nombre,
  apellidos,
  dni,
  telefono,
  direccion,
  fechaNacimiento,
  estado,
}) {
  const socios = await getSocios();

  const ultimoNumero =
    socios.length > 0
      ? Math.max(
          ...socios.map(
            (socio) => socio.numero
          )
        )
      : 0;

  const numero = ultimoNumero + 1;

  const nuevaFila = [
    numero,
    nombre,
    apellidos,
    dni,
    telefono,
    direccion,
    fechaNacimiento,
    estado,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:H`,
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
    dni,
    telefono,
    direccion,
    fechaNacimiento,
    estado,
  };
}

// =========================
// ACTUALIZAR SOCIO
// =========================

export async function actualizarSocio(
  numero,
  {
    nombre,
    apellidos,
    dni,
    telefono,
    direccion,
    fechaNacimiento,
    estado,
  }
) {
  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`,
    });

  const rows =
    response.data.values ?? [];

  if (rows.length <= 1) {
    throw new Error(
      "No hay socios para actualizar"
    );
  }

  // Buscamos el número de socio
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

  // La fila real de Google Sheets
  const numeroFila = indice + 1;

  const rango =
    `${SHEET_NAME}!A${numeroFila}:H${numeroFila}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: rango,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          numero,
          nombre,
          apellidos,
          dni,
          telefono,
          direccion,
          fechaNacimiento,
          estado,
        ],
      ],
    },
  });

  return {
    id: Number(numero),
    numero: Number(numero),
    nombre,
    apellidos,
    dni,
    telefono,
    direccion,
    fechaNacimiento,
    estado,
  };
}

// =========================
// ELIMINAR SOCIO
// =========================

export async function eliminarSocio(numero) {
  // 1. Leemos todas las columnas.
  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`,
    });

  const rows =
    response.data.values ?? [];

  if (rows.length <= 1) {
    throw new Error(
      "No hay socios para eliminar"
    );
  }

  // 2. Buscamos la fila del socio.
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

  // 3. Obtenemos las propiedades de las hojas.
  const spreadsheet =
    await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields:
        "sheets(properties(sheetId,title))",
    });

  const hojas =
    spreadsheet.data.sheets ?? [];

  // 4. Buscamos "Socios".
  const hoja = hojas.find(
    (hoja) =>
      String(
        hoja.properties?.title
      ) === String(SHEET_NAME)
  );

  if (!hoja) {
    throw new Error(
      `No se encontró la hoja "${SHEET_NAME}". ` +
        `Hojas disponibles: ${hojas
          .map(
            (h) =>
              `"${h.properties?.title}"`
          )
          .join(", ")}`
    );
  }

  const sheetId =
    hoja.properties?.sheetId;

  if (sheetId === undefined) {
    throw new Error(
      `La hoja "${SHEET_NAME}" no tiene sheetId`
    );
  }

  // 5. Eliminamos la fila completa.
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: Number(sheetId),
              dimension: "ROWS",
              startIndex: indice,
              endIndex: indice + 1,
            },
          },
        },
      ],
    },
  });

  console.log(
    `Socio ${numero} eliminado correctamente`
  );

  return {
    numero: Number(numero),
  };
}
