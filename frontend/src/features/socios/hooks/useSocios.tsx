import { useEffect, useMemo, useState } from "react";

import {
  getSocios,
} from "../../../services/api";

import type { Socio } from "../types/Socio";

export function useSocios() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [campoBusqueda, setCampoBusqueda] = useState("todos");

  async function cargarSocios() {
    try {
      const data = await getSocios();

      setSocios(data);
    } catch (error) {
      console.error("Error cargando socios:", error);
    }
  }

  useEffect(() => {
    cargarSocios();
  }, []);

  const sociosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return socios;
    }

    const texto = busqueda.toLowerCase();

    return socios.filter((socio) => {
      switch (campoBusqueda) {
        case "numero":
          return socio.numero
            .toString()
            .includes(texto);

        case "nombre":
          return socio.nombre
            .toLowerCase()
            .includes(texto);

        case "apellidos":
          return socio.apellidos
            .toLowerCase()
            .includes(texto);

        case "telefono":
          return socio.telefono
            .toLowerCase()
            .includes(texto);

        case "estado":
          return socio.estado
            .toLowerCase()
            .includes(texto);

        default:
          return (
            socio.numero
              .toString()
              .includes(texto) ||
            socio.nombre
              .toLowerCase()
              .includes(texto) ||
            socio.apellidos
              .toLowerCase()
              .includes(texto) ||
            socio.telefono
              .toLowerCase()
              .includes(texto) ||
            socio.estado
              .toLowerCase()
              .includes(texto)
          );
      }
    });
  }, [socios, busqueda, campoBusqueda]);

  return {
    socios: sociosFiltrados,
    busqueda,
    setBusqueda,
    campoBusqueda,
    setCampoBusqueda,
    recargarSocios: cargarSocios,
  };
}
