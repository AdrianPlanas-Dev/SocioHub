export interface Pago {
  id: number;

  socioId: number;

  anio: number;

  pagado: boolean;

  fechaPago?: string;

  importe: number;

  observaciones?: string;
}