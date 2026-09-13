declare global {
  interface Window {
    google?: {
      script?: {
        run: GoogleScriptRun;
      };
    };
  }
}

interface GoogleScriptRun {
  withSuccessHandler(
    handler: (resultado: unknown) => void
  ): GoogleScriptRun;

  withFailureHandler(
    handler: (error: Error) => void
  ): GoogleScriptRun;

  getSocios(): void;

  obtenerEstadoSocio(
    numero: number
  ): void;

  obtenerCuotasAnio(
    anio: number
  ): void;

  obtenerEstadosSocios(): void;

  obtenerAniosCuotas(): void;

  obtenerPagos(): void;

  crearSocio(
    datos: unknown
  ): void;

  actualizarSocio(
    numero: number,
    datos: unknown
  ): void;

  eliminarSocio(
    numero: number
  ): void;

  registrarPago(
    numero: number,
    anio: number,
    mes: number,
    cantidad: number
  ): void;

  modificarPago(
    numero: number,
    anio: number,
    mes: number,
    nuevoAnio: number,
    nuevoMes: number,
    cantidad: number
  ): void;

  anularPago(
    numero: number,
    anio: number,
    mes: number
  ): void;

  crearCuotasAnio(
    anio: number
  ): void;

  eliminarCuotasAnio(
    anio: number
  ): void;
}

const API_URL =
  "https://script.google.com/macros/s/AKfycby2V1s-sCtP5tVdM5PEy2gAhvZV9-DarVUKp_I4xYRmaJLbvwqgrfGqTlRK0LKaZnbs/exec";

console.log("API SocioHub:", API_URL);

// =========================
// HELPERS
// =========================

async function getApi(
  action: string,
  params: Record<string, string | number> = {}
) {
  // Dentro de Apps Script usamos google.script.run
  if (window.google?.script?.run) {
    return new Promise((resolve, reject) => {
      const run = window.google!.script!.run
        .withSuccessHandler((resultado: unknown) => {
          resolve(resultado);
        })
        .withFailureHandler((error: Error) => {
          reject(error);
        });

      switch (action) {
        case "estado-socio":
          run.obtenerEstadoSocio(
            Number(params.numero)
          );
          break;

        case "cuotas":
          run.obtenerCuotasAnio(
            Number(params.anio)
          );
          break;

        case "estados-socios":
          run.obtenerEstadosSocios();
          break;

        case "anios-cuotas":
          run.obtenerAniosCuotas();
          break;

        case "pagos":
          run.obtenerPagos();
          break;

        default:
          reject(
            new Error(
              `Acción GET no soportada: ${action}`
            )
          );
      }
    });
  }

  // En desarrollo local seguimos usando la API HTTP.
  const url = new URL(API_URL);

  url.searchParams.set("action", action);

  Object.entries(params).forEach(
    ([key, value]) => {
      url.searchParams.set(
        key,
        String(value)
      );
    }
  );

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.error ?? "Error en la API"
    );
  }

  return data.data;
}

async function postApi(
  body: Record<string, unknown>
) {
  // Dentro de Apps Script usamos google.script.run
  if (window.google?.script?.run) {
    return new Promise((resolve, reject) => {
      const action = String(
        body.action ?? ""
      );

      const run = window.google!.script!.run
        .withSuccessHandler((resultado: unknown) => {
          resolve(resultado);
        })
        .withFailureHandler((error: Error) => {
          reject(error);
        });

      switch (action) {
        case "crear-socio":
          run.crearSocio(body.datos);
          break;

        case "actualizar-socio":
          run.actualizarSocio(
            Number(body.numero),
            body.datos
          );
          break;

        case "eliminar-socio":
          run.eliminarSocio(
            Number(body.numero)
          );
          break;

        case "registrar-pago":
          run.registrarPago(
            Number(body.numero),
            Number(body.anio),
            Number(body.mes),
            Number(body.cantidad)
          );
          break;

        case "modificar-pago":
          run.modificarPago(
            Number(body.numero),
            Number(body.anio),
            Number(body.mes),
            Number(body.nuevoAnio),
            Number(body.nuevoMes),
            Number(body.cantidad)
          );
          break;

        case "anular-pago":
          run.anularPago(
            Number(body.numero),
            Number(body.anio),
            Number(body.mes)
          );
          break;

        case "crear-anio":
          run.crearCuotasAnio(
            Number(body.anio)
          );
          break;

        case "eliminar-anio":
          run.eliminarCuotasAnio(
            Number(body.anio)
          );
          break;

        default:
          reject(
            new Error(
              `Acción POST no soportada: ${action}`
            )
          );
      }
    });
  }

  // En desarrollo local seguimos usando la API HTTP.
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type":
        "text/plain;charset=utf-8",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.error ?? "Error en la API"
    );
  }

  return data.data;
}

// =========================
// OBTENER SOCIOS
// =========================

export async function getSocios() {
  console.log("Solicitando socios...");

  // Dentro de Apps Script usamos google.script.run.
  if (window.google?.script?.run) {
    return new Promise((resolve, reject) => {
      window.google!.script!.run
        .withSuccessHandler(
          (resultado: unknown) => {
            resolve(resultado);
          }
        )
        .withFailureHandler(
          (error: Error) => {
            reject(error);
          }
        )
        .getSocios();
    });
  }

  // En desarrollo local seguimos usando la API HTTP.
  const url =
    `${API_URL}?action=socios`;

  console.log("URL:", url);

  const response = await fetch(url);

  console.log(
    "Respuesta HTTP:",
    response.status
  );

  const data = await response.json();

  console.log(
    "Datos recibidos:",
    data
  );

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.error ??
        "Error obteniendo socios"
    );
  }

  return data.data;
}

// =========================
// CREAR SOCIO
// =========================

export async function crearSocio(
  datos: {
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: string;
    estado:
      | "Pagado"
      | "Pendiente";
  }
) {
  return postApi({
    action: "crear-socio",
    datos,
  });
}

// =========================
// ACTUALIZAR SOCIO
// =========================

export async function actualizarSocio(
  numero: number,
  datos: {
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: string;
    estado:
      | "Pagado"
      | "Pendiente";
  }
) {
  return postApi({
    action: "actualizar-socio",
    numero,
    datos,
  });
}

// =========================
// ELIMINAR SOCIO
// =========================

export async function eliminarSocio(
  numero: number
) {
  return postApi({
    action: "eliminar-socio",
    numero,
  });
}

// =========================
// OBTENER ESTADO DE CUOTAS
// DE UN SOCIO
// =========================

export async function obtenerEstadoSocio(
  numero: number
) {
  return getApi("estado-socio", {
    numero,
  });
}

// =========================
// OBTENER CUOTAS DE UN AÑO
// =========================

export async function obtenerCuotasAnio(
  anio: number
) {
  return getApi("cuotas", {
    anio,
  });
}

// =========================
// OBTENER ESTADOS DE TODOS
// LOS SOCIOS
// =========================

export async function obtenerEstadosSocios() {
  return getApi("estados-socios");
}

// =========================
// REGISTRAR PAGO
// =========================

export async function registrarPago(
  numero: number,
  anio: number,
  mes: number,
  cantidad: number
) {
  return postApi({
    action: "registrar-pago",
    numero,
    anio,
    mes,
    cantidad,
  });
}

// =========================
// OBTENER AÑOS DISPONIBLES
// DE CUOTAS
// =========================

export async function obtenerAniosCuotas() {
  return getApi("anios-cuotas");
}

// =========================
// OBTENER TODOS LOS PAGOS
// =========================

export async function obtenerPagos() {
  return getApi("pagos");
}

// =========================
// MODIFICAR PAGO
// =========================

export async function modificarPago(
  numero: number,
  anio: number,
  mes: number,
  nuevoAnio: number,
  nuevoMes: number,
  nuevaCantidad: number
) {
  return postApi({
    action: "modificar-pago",
    numero,
    anio,
    mes,
    nuevoAnio,
    nuevoMes,
    cantidad: nuevaCantidad,
  });
}

// =========================
// ANULAR PAGO
// =========================

export async function anularPago(
  numero: number,
  anio: number,
  mes: number
) {
  return postApi({
    action: "anular-pago",
    numero,
    anio,
    mes,
  });
}

// =========================
// CREAR AÑO DE CUOTAS
// =========================

export async function crearCuotasAnio(
  anio: number
) {
  return postApi({
    action: "crear-anio",
    anio,
  });
}

// =========================
// ELIMINAR AÑO DE CUOTAS
// =========================

export async function eliminarCuotasAnio(
  anio: number
) {
  return postApi({
    action: "eliminar-anio",
    anio,
  });
}