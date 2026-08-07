const API_URL = "http://localhost:3000";

export async function getSocios() {
  const response = await fetch(`${API_URL}/socios`);

  if (!response.ok) {
    throw new Error("Error obteniendo socios");
  }

  return response.json();
}