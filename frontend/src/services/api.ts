
const API_URL = "http://localhost:3000";

export async function getSocios() {
  const response = await fetch(`${API_URL}/socios`);

  if (!response.ok) {
    throw new Error("Error obteniendo socios");
  }

  return response.json();
}

export async function crearSocio(datos: {
  nombre: string;
  apellidos: string;
  telefono: string;
  estado: "Pagado" | "Pendiente";
}) {
  const response = await fetch(`${API_URL}/socios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error("Error creando socio");
  }

  return response.json();
}

export async function actualizarSocio(
  numero: number,
  datos: {
    nombre: string;
    apellidos: string;
    telefono: string;
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
    throw new Error("Error actualizando socio");
  }

  return response.json();
}

