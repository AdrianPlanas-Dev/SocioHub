import { useMemo, useState } from "react";

import { sociosMock } from "../data/sociosMock";

export function useSocios() {
  const [socios] = useState(sociosMock);
  const [busqueda, setBusqueda] = useState("");
  const [campoBusqueda, setCampoBusqueda] = useState("todos");

const sociosFiltrados = useMemo(() => {
  if (!busqueda.trim()) return socios;

  const texto = busqueda.toLowerCase();

  return socios.filter((socio) => {
    switch (campoBusqueda) {
      case "numero":
        return socio.numero.toString().includes(texto);

      case "nombre":
        return socio.nombre.toLowerCase().includes(texto);

      case "apellidos":
        return socio.apellidos.toLowerCase().includes(texto);

      case "telefono":
        return socio.telefono.includes(texto);

      case "estado":
        return socio.estado.toLowerCase().includes(texto);

      case "todos":
      default:
        return (
          socio.numero.toString().includes(texto) ||
          socio.nombre.toLowerCase().includes(texto) ||
          socio.apellidos.toLowerCase().includes(texto) ||
          socio.telefono.includes(texto) ||
          socio.estado.toLowerCase().includes(texto)
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
  };
}