import { sheets } from "../config/google.js";
import { getSocios } from "./googleSheetsService.js";

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
// COLUMNAS DE LOS MESES
// =========================

const COLUMNAS_MESES = [
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

  const anios =
    await obtenerAniosCuotas();

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
// BUSCAR FILA DE UN SOCIO
// =========================

async function obtenerFilaSocio(
  nombreHoja,
  numeroSocio
) {
  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId:
        SPREADSHEET_ID,
      range:
        `'${nombreHoja}'!A:O`,
    });

  const rows =
    response.data.values ?? [];

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
      return {
        fila: i + 1,
        row: rows[i],
      };
    }
  }

  return null;
}

// =========================
// VALIDAR IMPORTE
// =========================

function obtenerImporte(cantidad) {
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

  return importe;
}

// =========================
// VALIDAR DATOS DEL PAGO
// =========================

function validarDatosPago(
  numero,
  anio,
  mes
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
    ) ||
    anioNumero < 2000 ||
    anioNumero > 2100
  ) {
    throw new Error(
      "Año no válido"
    );
  }

  if (
    !Number.isInteger(
      mesNumero
    ) ||
    mesNumero < 1 ||
    mesNumero > 12
  ) {
    throw new Error(
      "Mes no válido"
    );
  }

  return {
    numeroSocio,
    anioNumero,
    mesNumero,
  };
}

// =========================
// COMPROBAR QUE EXISTE
// LA HOJA
// =========================

async function obtenerHojaCuotas(
  anio
) {
  const nombreHoja =
    `Cuotas ${anio}`;

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

  return nombreHoja;
}
// =========================
// OBTENER TODOS LOS PAGOS
// =========================

export async function obtenerPagos() {
  const anios = await obtenerAniosCuotas();

  if (anios.length === 0) {
    return [];
  }

  // Cargamos todas las hojas de cuotas en paralelo.
  // Antes se consultaban una detrás de otra.
  const resultados = await Promise.all(
    anios.map(async (anio) => {
      const cuotas = await obtenerCuotasAnio(anio);
      return { anio, cuotas };
    })
  );

  const pagos = [];

  for (const { anio, cuotas } of resultados) {
    for (const socio of cuotas) {
      for (let mes = 0; mes < 12; mes++) {
        const nombreMes = MESES[mes];
        const valor = socio[nombreMes];

        if (mesEstaPagado(valor)) {
          pagos.push({
            numero: socio.numero,
            nombre: socio.nombre,
            anio,
            mes: mes + 1,
            nombreMes,
            cantidad: Number(
              String(valor).replace(",", ".")
            ),
          });
        }
      }
    }
  }

  return pagos;
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
  const {
    numeroSocio,
    anioNumero,
    mesNumero,
  } = validarDatosPago(
    numero,
    anio,
    mes
  );

  const importe =
    obtenerImporte(
      cantidad
    );

  const nombreHoja =
    await obtenerHojaCuotas(
      anioNumero
    );

  const resultado =
    await obtenerFilaSocio(
      nombreHoja,
      numeroSocio
    );

  if (!resultado) {
    throw new Error(
      `No se encontró el socio ${numeroSocio}`
    );
  }

  const columna =
    COLUMNAS_MESES[
    mesNumero - 1
    ];

  const valorActual =
    resultado.row[
    mesNumero + 2
    ];

  if (
    mesEstaPagado(
      valorActual
    )
  ) {
    const importeActual =
      Number(
        String(valorActual)
          .replace(",", ".")
      );

    throw new Error(
      `El socio ya tiene registrado un pago de ${importeActual} € en ${MESES[mesNumero - 1]} de ${anioNumero}`
    );
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId:
      SPREADSHEET_ID,

    range:
      `'${nombreHoja}'!${columna}${resultado.fila}`,

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

// =========================
// MODIFICAR PAGO
// =========================

export async function modificarPago(
  numero,
  anio,
  mes,
  nuevoAnio,
  nuevoMes,
  nuevaCantidad
) {
  const datosActuales =
    validarDatosPago(
      numero,
      anio,
      mes
    );

  const datosNuevos =
    validarDatosPago(
      numero,
      nuevoAnio,
      nuevoMes
    );

  const importe =
    obtenerImporte(
      nuevaCantidad
    );

  const hojaActual =
    await obtenerHojaCuotas(
      datosActuales.anioNumero
    );

  const hojaNueva =
    await obtenerHojaCuotas(
      datosNuevos.anioNumero
    );

  const filaActual =
    await obtenerFilaSocio(
      hojaActual,
      datosActuales.numeroSocio
    );

  if (!filaActual) {
    throw new Error(
      `No se encontró el socio ${datosActuales.numeroSocio}`
    );
  }

  const filaNueva =
    await obtenerFilaSocio(
      hojaNueva,
      datosNuevos.numeroSocio
    );

  if (!filaNueva) {
    throw new Error(
      `No se encontró el socio ${datosNuevos.numeroSocio}`
    );
  }

  const columnaActual =
    COLUMNAS_MESES[
    datosActuales.mesNumero - 1
    ];

  const columnaNueva =
    COLUMNAS_MESES[
    datosNuevos.mesNumero - 1
    ];

  const valorActual =
    filaActual.row[
    datosActuales.mesNumero + 2
    ];

  if (
    !mesEstaPagado(
      valorActual
    )
  ) {
    throw new Error(
      "No existe un pago registrado en el mes indicado"
    );
  }

  // Si se está moviendo el pago
  // a otro mes, comprobamos que
  // el nuevo destino esté libre.
  if (
    datosActuales.anioNumero !==
    datosNuevos.anioNumero ||
    datosActuales.mesNumero !==
    datosNuevos.mesNumero
  ) {
    const valorDestino =
      filaNueva.row[
      datosNuevos.mesNumero + 2
      ];

    if (
      mesEstaPagado(
        valorDestino
      )
    ) {
      throw new Error(
        `Ya existe un pago registrado en ${MESES[datosNuevos.mesNumero - 1]} de ${datosNuevos.anioNumero}`
      );
    }

    // Primero vaciamos el pago anterior.
    await sheets.spreadsheets.values.clear({
      spreadsheetId:
        SPREADSHEET_ID,

      range:
        `'${hojaActual}'!${columnaActual}${filaActual.fila}`,
    });

    // Después escribimos el nuevo pago.
    await sheets.spreadsheets.values.update({
      spreadsheetId:
        SPREADSHEET_ID,

      range:
        `'${hojaNueva}'!${columnaNueva}${filaNueva.fila}`,

      valueInputOption:
        "USER_ENTERED",

      requestBody: {
        values: [
          [importe],
        ],
      },
    });
  } else {
    // Mismo mes: simplemente
    // modificamos el importe.
    await sheets.spreadsheets.values.update({
      spreadsheetId:
        SPREADSHEET_ID,

      range:
        `'${hojaActual}'!${columnaActual}${filaActual.fila}`,

      valueInputOption:
        "USER_ENTERED",

      requestBody: {
        values: [
          [importe],
        ],
      },
    });
  }

  return {
    numero:
      datosActuales.numeroSocio,

    anio:
      datosNuevos.anioNumero,

    mes:
      datosNuevos.mesNumero,

    cantidad:
      importe,
  };
}

// =========================
// ANULAR PAGO
// =========================

export async function anularPago(
  numero,
  anio,
  mes
) {
  const {
    numeroSocio,
    anioNumero,
    mesNumero,
  } = validarDatosPago(
    numero,
    anio,
    mes
  );

  const nombreHoja =
    await obtenerHojaCuotas(
      anioNumero
    );

  const resultado =
    await obtenerFilaSocio(
      nombreHoja,
      numeroSocio
    );

  if (!resultado) {
    throw new Error(
      `No se encontró el socio ${numeroSocio}`
    );
  }

  const valorActual =
    resultado.row[
    mesNumero + 2
    ];

  if (
    !mesEstaPagado(
      valorActual
    )
  ) {
    throw new Error(
      "No existe un pago registrado en el mes indicado"
    );
  }

  const columna =
    COLUMNAS_MESES[
    mesNumero - 1
    ];

  await sheets.spreadsheets.values.clear({
    spreadsheetId:
      SPREADSHEET_ID,

    range:
      `'${nombreHoja}'!${columna}${resultado.fila}`,
  });

  return {
    numero:
      numeroSocio,

    anio:
      anioNumero,

    mes:
      mesNumero,

    cantidadAnulada:
      Number(
        String(valorActual)
          .replace(",", ".")
      ),
  };
}
// =========================
// VALIDAR AÑO DE CUOTAS
// =========================

function validarAnioCuotas(anio) {
  const anioNumero = Number(anio);

  if (
    !Number.isInteger(anioNumero) ||
    anioNumero < 2000 ||
    anioNumero > 2100
  ) {
    throw new Error(
      `Año de cuotas no válido: ${anio}`
    );
  }

  return anioNumero;
}


// =========================
// CREAR NUEVA HOJA DE CUOTAS
// =========================

export async function crearCuotasAnio(anio) {
  const anioNumero =
    validarAnioCuotas(anio);

  const nombreNuevaHoja =
    `Cuotas ${anioNumero}`;

  // =========================
  // 1. OBTENER HOJAS
  // =========================

  const spreadsheet =
    await sheets.spreadsheets.get({
      spreadsheetId:
        SPREADSHEET_ID,
      fields:
        "sheets(properties(sheetId,title))",
    });

  const hojas =
    spreadsheet.data.sheets ?? [];

  // =========================
  // 2. COMPROBAR SI YA EXISTE
  // =========================

  const hojaExistente =
    hojas.find(
      (hoja) =>
        hoja.properties?.title ===
        nombreNuevaHoja
    );

  if (hojaExistente) {
    throw new Error(
      `La hoja "${nombreNuevaHoja}" ya existe`
    );
  }

  // =========================
  // 3. BUSCAR UNA HOJA DE
  //    CUOTAS COMO PLANTILLA
  // =========================

  const hojasCuotas =
    hojas
      .filter(
        (hoja) =>
          typeof hoja.properties?.title ===
            "string" &&
          /^Cuotas \d{4}$/.test(
            hoja.properties.title
          )
      )
      .sort(
        (a, b) => {
          const anioA =
            Number(
              a.properties.title.replace(
                "Cuotas ",
                ""
              )
            );

          const anioB =
            Number(
              b.properties.title.replace(
                "Cuotas ",
                ""
              )
            );

          return anioB - anioA;
        }
      );

  if (hojasCuotas.length === 0) {
    throw new Error(
      "No existe ninguna hoja de cuotas que pueda utilizarse como plantilla"
    );
  }

  const hojaPlantilla =
    hojasCuotas[0];

  const sheetIdPlantilla =
    hojaPlantilla.properties?.sheetId;

  if (
    sheetIdPlantilla === undefined
  ) {
    throw new Error(
      "La hoja de cuotas plantilla no tiene sheetId"
    );
  }

  // =========================
  // 4. OBTENER SOCIOS
  // =========================

  const socios =
    await getSocios();

  // =========================
  // 5. DUPLICAR LA HOJA
  // =========================

  const resultado =
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId:
        SPREADSHEET_ID,

      requestBody: {
        requests: [
          {
            duplicateSheet: {
              sourceSheetId:
                Number(
                  sheetIdPlantilla
                ),

              newSheetName:
                nombreNuevaHoja,
            },
          },
        ],
      },
    });

  const nuevaSheetId =
    resultado.data.replies?.[0]
      ?.duplicateSheet
      ?.properties
      ?.sheetId;

  if (
    nuevaSheetId === undefined
  ) {
    throw new Error(
      `No se pudo crear la hoja "${nombreNuevaHoja}"`
    );
  }

  // =========================
  // 6. LIMPIAR SOCIOS Y PAGOS
  // =========================
  //
  // Conservamos las filas 1 y 2
  // porque contienen la estructura
  // y cabeceras de la hoja.
  //
  // Limpiamos desde la fila 3.
  //

  await sheets.spreadsheets.values.clear({
    spreadsheetId:
      SPREADSHEET_ID,

    range:
      `'${nombreNuevaHoja}'!A3:O`,
  });

  // =========================
  // 7. PREPARAR SOCIOS
  // =========================

  const filasSocios =
    socios.map(
      (socio) => {
        let edad = "";

        if (
          socio.fechaNacimiento
        ) {
          const nacimiento =
            new Date(
              socio.fechaNacimiento
            );

          if (
            !Number.isNaN(
              nacimiento.getTime()
            )
          ) {
            const hoy =
              new Date();

            edad =
              hoy.getFullYear() -
              nacimiento.getFullYear();

            const diferenciaMes =
              hoy.getMonth() -
              nacimiento.getMonth();

            if (
              diferenciaMes < 0 ||
              (
                diferenciaMes === 0 &&
                hoy.getDate() <
                  nacimiento.getDate()
              )
            ) {
              edad--;
            }
          }
        }

        return [
          socio.numero,
          `${socio.nombre} ${socio.apellidos}`.trim(),
          edad,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ];
      }
    );

  // =========================
  // 8. INSERTAR SOCIOS
  // =========================

  if (filasSocios.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId:
        SPREADSHEET_ID,

      range:
        `'${nombreNuevaHoja}'!A3:O${filasSocios.length + 2}`,

      valueInputOption:
        "USER_ENTERED",

      requestBody: {
        values:
          filasSocios,
      },
    });
  }

  return {
    anio:
      anioNumero,

    nombreHoja:
      nombreNuevaHoja,

    socios:
      socios.length,
  };
}


// =========================
// ELIMINAR HOJA DE CUOTAS
// =========================

export async function eliminarCuotasAnio(
  anio
) {
  const anioNumero =
    validarAnioCuotas(anio);

  const nombreHoja =
    `Cuotas ${anioNumero}`;

  // =========================
  // 1. OBTENER HOJAS
  // =========================

  const spreadsheet =
    await sheets.spreadsheets.get({
      spreadsheetId:
        SPREADSHEET_ID,

      fields:
        "sheets(properties(sheetId,title))",
    });

  const hojas =
    spreadsheet.data.sheets ?? [];

  const hojasCuotas =
    hojas.filter(
      (hoja) =>
        typeof hoja.properties?.title ===
          "string" &&
        /^Cuotas \d{4}$/.test(
          hoja.properties.title
        )
    );

  // =========================
  // 2. PROTEGER LA ÚLTIMA HOJA
  // =========================

  if (
    hojasCuotas.length <= 1
  ) {
    throw new Error(
      "No se puede eliminar la última hoja de cuotas. Debe existir al menos una."
    );
  }

  // =========================
  // 3. BUSCAR LA HOJA
  // =========================

  const hoja =
    hojasCuotas.find(
      (hoja) =>
        hoja.properties?.title ===
        nombreHoja
    );

  if (!hoja) {
    throw new Error(
      `No existe la hoja "${nombreHoja}"`
    );
  }

  const sheetId =
    hoja.properties?.sheetId;

  if (
    sheetId === undefined
  ) {
    throw new Error(
      `La hoja "${nombreHoja}" no tiene sheetId`
    );
  }

  // =========================
  // 4. ELIMINAR HOJA
  // =========================

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId:
      SPREADSHEET_ID,

    requestBody: {
      requests: [
        {
          deleteSheet: {
            sheetId:
              Number(sheetId),
          },
        },
      ],
    },
  });

  return {
    anio:
      anioNumero,

    nombreHoja,
  };
}