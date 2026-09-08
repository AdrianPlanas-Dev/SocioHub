const API_URL = "http://localhost:3000";

// =========================
// OBTENER SOCIOS
// =========================

export async function getSocios() {
  const response = await fetch(
    `${API_URL}/socios`
  );

  if (!response.ok) {
    throw new Error(
      "Error obteniendo socios"
    );
  }

  return response.json();
}

// =========================
// CREAR SOCIO
// =========================

export async function crearSocio(datos: {
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  estado: "Pagado" | "Pendiente";
}) {
  const response = await fetch(
    `${API_URL}/socios`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Error creando socio"
    );
  }

  return response.json();
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
    estado: "Pagado" | "Pendiente";
  }
) {
  const response = await fetch(
    `${API_URL}/socios/${numero}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Error actualizando socio"
    );
  }

  return response.json();
}

// =========================
// ELIMINAR SOCIO
// =========================

export async function eliminarSocio(
  numero: number
) {
  const response = await fetch(
    `${API_URL}/socios/${numero}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Error eliminando socio"
    );
  }

  return response.json();
}

// =========================
// OBTENER ESTADO DE CUOTAS
// DE UN SOCIO
// =========================

export async function obtenerEstadoSocio(
  numero: number
) {
  const response = await fetch(
    `${API_URL}/cuotas/estado/${numero}`
  );

  if (!response.ok) {
    throw new Error(
      "Error obteniendo el estado del socio"
    );
  }

  return response.json();
}

// =========================
// OBTENER CUOTAS DE UN AÑO
// =========================

export async function obtenerCuotasAnio(
  anio: number
) {
  const response = await fetch(
    `${API_URL}/cuotas/${anio}`
  );

  if (!response.ok) {
    throw new Error(
      `Error obteniendo cuotas de ${anio}`
    );
  }

  return response.json();
}

// =========================
// OBTENER ESTADOS DE TODOS
// LOS SOCIOS
// =========================

export async function obtenerEstadosSocios() {
  const response = await fetch(
    `${API_URL}/cuotas/estados`
  );

  if (!response.ok) {
    throw new Error(
      "Error obteniendo estados de los socios"
    );
  }

  return response.json();
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
  const response = await fetch(
    `${API_URL}/cuotas/pago/${numero}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anio,
        mes,
        cantidad,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
      "Error registrando el pago"
    );
  }

  return data;
}

// =========================
// OBTENER AÑOS DISPONIBLES
// DE CUOTAS
// =========================

export async function obtenerAniosCuotas() {
  const response = await fetch(
    `${API_URL}/cuotas/anios`
  );

  if (!response.ok) {
    throw new Error(
      "Error obteniendo los años de cuotas"
    );
  }

  return response.json();
}

// =========================
// OBTENER TODOS LOS PAGOS
// =========================

export async function obtenerPagos() {
  const response = await fetch(
    `${API_URL}/cuotas/pagos`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
      "Error obteniendo los pagos"
    );
  }

  return data;
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
  const response = await fetch(
    `${API_URL}/cuotas/pago/${numero}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anio,
        mes,
        nuevoAnio,
        nuevoMes,
        nuevaCantidad,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
      "Error modificando el pago"
    );
  }

  return data;
}

// =========================
// ANULAR PAGO
// =========================

export async function anularPago(
  numero: number,
  anio: number,
  mes: number
) {
  const response = await fetch(
    `${API_URL}/cuotas/pago/${numero}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anio,
        mes,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
      "Error anulando el pago"
    );
  }

  return data;
}
// =========================
// CREAR AÑO DE CUOTAS
// =========================

export async function crearCuotasAnio(
  anio: number
) {
  const response = await fetch(
    `${API_URL}/cuotas/anio`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anio,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
      "Error creando el año de cuotas"
    );
  }

  return data;
}


// =========================
// ELIMINAR AÑO DE CUOTAS
// =========================

export async function eliminarCuotasAnio(
  anio: number
) {
  const response = await fetch(
    `${API_URL}/cuotas/anio/${anio}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
      "Error eliminando el año de cuotas"
    );
  }

  return data;
}