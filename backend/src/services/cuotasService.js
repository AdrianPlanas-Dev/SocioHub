
import { sheets } from "../config/google.js";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// =========================
// MESES
// =========================

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

// =========================
// COMPROBAR SI UNA CUOTA
// ESTÁ PAGADA
// =========================

function mesEstaPagado(valor) {
  if (
    valor === undefined ||
    valor === null
  ) {
    return false;
  }

  const texto =
    String(valor).trim();

  if (texto === "") {
    return false;
  }

  const numero = Number(
    texto.replace(",", ".")
  );

  return (
    !Number.isNaN(numero) &&
    numero > 0
  );
}

// =========================
// OBTENER AÑOS DE CUOTAS
// =========================

export async function obtenerAniosCuotas() {
  const spreadsheet =
    await sheets.spreadsheets.get({
      spreadsheetId:
        SPREADSHEET_ID,
      fields:
        "sheets(properties(title))",
    });

  const hojas =
    spreadsheet.data.sheets ?? [];

  return hojas
    .map(
      (hoja) =>
        hoja.properties?.title
    )
    .filter(
      (nombre) =>
        typeof nombre === "string" &&
        /^Cuotas \d{4}$/.test(nombre)
    )
    .map(
      (nombre) =>
        Number(
          nombre.replace(
            "Cuotas ",
            ""
          )
        )
    )
    .filter(
      (anio) =>
        Number.isInteger(anio)
    )
    .sort(
      (a, b) => b - a
    );
}

// =========================
// OBTENER CUOTAS DE UN AÑO
// =========================

export async function obtenerCuotasAnio(
  anio
) {
  // Protección contra NaN
  const anioNumero =
    Number(anio);

  if (
    !Number.isInteger(anioNumero) ||
    anioNumero < 2000 ||
    anioNumero > 2100
  ) {
    throw new Error(
      `Año de cuotas no válido: ${anio}`
    );
  }

  const nombreHoja =
    `Cuotas ${anioNumero}`;

  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId:
        SPREADSHEET_ID,
      range:
        `'${nombreHoja}'!A:O`,
    });

  const rows =
    response.data.values ?? [];

  if (rows.length <= 2) {
    return [];
  }

  // Fila 1 → encabezados
  // Fila 2 → meses
  // Desde fila 3 → socios
  const [
    ,
    ,
    ...data
  ] = rows;

  return data
    .filter(
      (row) =>
        row[0] !== undefined &&
        row[0] !== ""
    )
    .map(
      (row) => ({
        numero:
          Number(row[0]),

        nombre:
          row[1] ?? "",

        edad:
          row[2] ?? "",

        enero:
          row[3] ?? "",

        febrero:
          row[4] ?? "",

        marzo:
          row[5] ?? "",

        abril:
          row[6] ?? "",

        mayo:
          row[7] ?? "",

        junio:
          row[8] ?? "",

        julio:
          row[9] ?? "",

        agosto:
          row[10] ?? "",

        septiembre:
          row[11] ?? "",

        octubre:
          row[12] ?? "",

        noviembre:
          row[13] ?? "",

        diciembre:
          row[14] ?? "",
      })
    )
    .filter(
      (socio) =>
        !Number.isNaN(
          socio.numero
        )
    );
}

// =========================
// OBTENER ESTADO DE TODOS
// LOS SOCIOS
// =========================

export async function obtenerEstadosSocios() {
  const ahora =
    new Date();

  const anioActual =
    ahora.getFullYear();

  const mesActual =
    ahora.getMonth();

  // Comprobamos primero qué hojas existen
  const anios =
    await obtenerAniosCuotas();

  // Si no existe la hoja del año actual,
  // devolvemos un resultado vacío.
  if (
    !anios.includes(
      anioActual
    )
  ) {
    return [];
  }

  const cuotas =
    await obtenerCuotasAnio(
      anioActual
    );

  return cuotas.map(
    (socio) => {
      const mesesPendientes =
        [];

      for (
        let mes = 0;
        mes <= mesActual;
        mes++
      ) {
        const nombreMes =
          MESES[mes];

        const valor =
          socio[nombreMes];

        if (
          !mesEstaPagado(
            valor
          )
        ) {
          mesesPendientes.push({
            anio:
              anioActual,

            mes:
              mes + 1,

            nombreMes,
          });
        }
      }

      return {
        numero:
          socio.numero,

        estado:
          mesesPendientes.length === 0
            ? "Pagado"
            : "Pendiente",

        mesesPendientes,
      };
    }
  );
}

// =========================
// OBTENER ESTADO DE UN SOCIO
// =========================

export async function obtenerEstadoSocio(
  numero
) {
  const numeroSocio =
    Number(numero);

  if (
    !Number.isInteger(
      numeroSocio
    ) ||
    numeroSocio <= 0
  ) {
    throw new Error(
      `Número de socio no válido: ${numero}`
    );
  }

  const ahora =
    new Date();

  const anioActual =
    ahora.getFullYear();

  const mesActual =
    ahora.getMonth();

  const anios =
    await obtenerAniosCuotas();

  const aniosValidos =
    anios
      .filter(
        (anio) =>
          anio <= anioActual
      )
      .sort(
        (a, b) => a - b
      );

  if (
    aniosValidos.length === 0
  ) {
    return {
      estado:
        "Pendiente",

      mesesPendientes:
        [],

      motivo:
        "No hay hojas de cuotas",
    };
  }

  const mesesPendientes =
    [];

  for (
    const anio
    of aniosValidos
  ) {
    const cuotas =
      await obtenerCuotasAnio(
        anio
      );

    const socio =
      cuotas.find(
        (socio) =>
          Number(
            socio.numero
          ) === numeroSocio
      );

    if (!socio) {
      continue;
    }

    const ultimoMes =
      anio === anioActual
        ? mesActual
        : 11;

    for (
      let mes = 0;
      mes <= ultimoMes;
      mes++
    ) {
      const nombreMes =
        MESES[mes];

      const valor =
        socio[nombreMes];

      if (
        !mesEstaPagado(
          valor
        )
      ) {
        mesesPendientes.push({
          anio,

          mes:
            mes + 1,

          nombreMes,
        });
      }
    }
  }

  return {
    estado:
      mesesPendientes.length > 0
        ? "Pendiente"
        : "Pagado",

    mesesPendientes,
  };
}

// =========================
// REGISTRAR PAGO
// =========================

export async function registrarPago(
  numero,
  anio,
  mes,
  cantidad
) {
  const numeroSocio =
    Number(numero);

  const anioNumero =
    Number(anio);

  const mesNumero =
    Number(mes);

  if (
    !Number.isInteger(
      numeroSocio
    ) ||
    numeroSocio <= 0
  ) {
    throw new Error(
      "Número de socio no válido"
    );
  }

  if (
    !Number.isInteger(
      anioNumero
    )
  ) {
    throw new Error(
      "Año no válido"
    );
  }

  if (
    mesNumero < 1 ||
    mesNumero > 12
  ) {
    throw new Error(
      "Mes no válido"
    );
  }

  const importe =
    Number(
      String(cantidad)
        .replace(",", ".")
    );

  if (
    Number.isNaN(importe) ||
    importe <= 0
  ) {
    throw new Error(
      "La cantidad debe ser un número mayor que 0"
    );
  }

  const nombreHoja =
    `Cuotas ${anioNumero}`;

  const spreadsheet =
    await sheets.spreadsheets.get({
      spreadsheetId:
        SPREADSHEET_ID,
      fields:
        "sheets(properties(title,sheetId))",
    });

  const hoja =
    spreadsheet.data.sheets?.find(
      (hoja) =>
        hoja.properties?.title ===
        nombreHoja
    );

  if (!hoja) {
    throw new Error(
      `No existe la hoja "${nombreHoja}"`
    );
  }

  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId:
        SPREADSHEET_ID,
      range:
        `'${nombreHoja}'!A:O`,
    });

  const rows =
    response.data.values ?? [];

  if (rows.length < 3) {
    throw new Error(
      "La hoja de cuotas no contiene socios"
    );
  }

  let filaSocio = -1;

  for (
    let i = 2;
    i < rows.length;
    i++
  ) {
    const numeroFila =
      Number(
        rows[i]?.[0]
      );

    if (
      !Number.isNaN(
        numeroFila
      ) &&
      numeroFila ===
        numeroSocio
    ) {
      filaSocio =
        i + 1;

      break;
    }
  }

  if (
    filaSocio === -1
  ) {
    throw new Error(
      `No se encontró el socio ${numeroSocio}`
    );
  }

  const columnasMes = [
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
  ];

  const columna =
    columnasMes[
      mesNumero - 1
    ];

  await sheets.spreadsheets.values.update({
    spreadsheetId:
      SPREADSHEET_ID,

    range:
      `'${nombreHoja}'!${columna}${filaSocio}`,

    valueInputOption:
      "USER_ENTERED",

    requestBody: {
      values: [
        [importe],
      ],
    },
  });

  return {
    numero:
      numeroSocio,

    anio:
      anioNumero,

    mes:
      mesNumero,

    cantidad:
      importe,
  };
}
