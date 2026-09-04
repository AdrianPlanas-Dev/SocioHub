import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Pago } from "../types/Pago";

const API_URL = "http://localhost:3000";

export function usePagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  const cargarPagos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/cuotas/pagos`
      );

      if (!response.ok) {
        throw new Error(
          "No se pudieron obtener los pagos"
        );
      }

      const data: Pago[] =
        await response.json();

      setPagos(data);
    } catch (error) {
      console.error(
        "Error cargando pagos:",
        error
      );

      setError(
        "No se pudieron cargar los pagos"
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPagos();
  }, [cargarPagos]);

  const pagosOrdenados = useMemo(() => {
    return [...pagos].sort((a, b) => {
      if (a.anio !== b.anio) {
        return b.anio - a.anio;
      }

      if (a.mes !== b.mes) {
        return b.mes - a.mes;
      }

      return a.numero - b.numero;
    });
  }, [pagos]);

  return {
    pagos: pagosOrdenados,
    cargando,
    error,
    recargarPagos: cargarPagos,
  };
}