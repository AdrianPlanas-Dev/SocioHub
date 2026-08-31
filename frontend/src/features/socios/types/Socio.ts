export interface Socio {
  id: number;
  numero: number;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  estado: "Pagado" | "Pendiente";

  // Estado calculado mediante las cuotas
  estadoCuotas?: "Pagado" | "Pendiente";

  // Meses que todavía debe
  mesesPendientes?: {
    anio: number;
    mes: number;
    nombreMes: string;
  }[];
}