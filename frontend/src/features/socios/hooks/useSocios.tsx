import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getSocios,
  obtenerEstadosSocios,
} from "../../../services/api";

import type { Socio } from "../types/Socio";

export function useSocios() {
  const [socios, setSocios] = useState<Socio[]>([]);

  const [busqueda, setBusqueda] = useState("");

  const [campoBusqueda, setCampoBusqueda] =
    useState("todos");

  // =========================
  // ELIMINAR SOCIOS DUPLICADOS
  // =========================
  //
  // Cada número de socio debe ser único.
  //
  // Si la API devuelve accidentalmente
  // el mismo socio varias veces, aquí
  // nos aseguramos de que solamente
  // aparezca una vez en la aplicación.
  //

  function eliminarDuplicados(
    lista: Socio[]
  ): Socio[] {
    const sociosPorNumero = new Map<
      number,
      Socio
    >();

    for (const socio of lista) {
      if (!sociosPorNumero.has(socio.numero)) {
        sociosPorNumero.set(
          socio.numero,
          socio
        );
      }
    }

    return Array.from(
      sociosPorNumero.values()
    );
  }

  // =========================
  // CARGAR SOCIOS
  // =========================
  async function cargarSocios() {
    try {
      const data = await getSocios();

      console.log(
        "SOCIOS RECIBIDOS:",
        data
      );

      console.log(
        "NÚMEROS RECIBIDOS:",
        data.map(
          (socio: Socio) => socio.numero
        )
      );

      const sociosUnicos =
        eliminarDuplicados(data);

      console.log(
        "SOCIOS ÚNICOS:",
        sociosUnicos
      );

      setSocios(sociosUnicos);

      try {
        const estados =
          await obtenerEstadosSocios();

        const estadosPorSocio =
          new Map(
            estados.map(
              (estado: {
                numero: number;
                estado:
                | "Pagado"
                | "Pendiente";
                mesesPendientes: {
                  anio: number;
                  mes: number;
                  nombreMes: string;
                }[];
              }) => [
                  estado.numero,
                  estado,
                ]
            )
          );

        const sociosConEstado =
          sociosUnicos.map(
            (socio: Socio) => {
              const estado =
                estadosPorSocio.get(
                  socio.numero
                );

              return {
                ...socio,

                estadoCuotas:
                  estado?.estado ??
                  "Pendiente",

                mesesPendientes:
                  estado?.mesesPendientes ??
                  [],
              };
            }
          );

        setSocios(sociosConEstado);

        return sociosConEstado;

      } catch (error) {
        console.error(
          "Error obteniendo estados de cuotas:",
          error
        );

        const sociosPendientes =
          sociosUnicos.map(
            (socio: Socio) => ({
              ...socio,
              estadoCuotas:
                "Pendiente" as const,
              mesesPendientes: [],
            })
          );

        setSocios(sociosPendientes);

        return sociosPendientes;
      }

    } catch (error) {
      console.error(
        "Error cargando socios:",
        error
      );

      return [];
    }
  }

  // =========================
  // CARGAR AL ENTRAR
  // =========================

  useEffect(() => {
    cargarSocios();
  }, []);

  // =========================
  // FILTROS
  // =========================

  const sociosFiltrados =
    useMemo(() => {
      if (!busqueda.trim()) {
        return socios;
      }

      const texto =
        busqueda.toLowerCase().trim();

      return socios.filter(
        (socio) => {
          switch (campoBusqueda) {

            // =========================
            // NÚMERO
            // =========================

            case "numero":
              return socio.numero
                .toString()
                .includes(texto);

            // =========================
            // NOMBRE
            // =========================

            case "nombre":
              return socio.nombre
                .toLowerCase()
                .includes(texto);

            // =========================
            // APELLIDOS
            // =========================

            case "apellidos":
              return socio.apellidos
                .toLowerCase()
                .includes(texto);

            // =========================
            // TELÉFONO
            // =========================

            case "telefono":
              return socio.telefono
                .toLowerCase()
                .includes(texto);

            // =========================
            // ESTADO
            // =========================

            case "estado":
              return (
                socio.estadoCuotas
                  ?.toLowerCase()
                  .includes(texto) ??
                false
              );

            // =========================
            // TODOS
            // =========================

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

                socio.estadoCuotas
                  ?.toLowerCase()
                  .includes(texto) ||

                false
              );
          }
        }
      );
    }, [
      socios,
      busqueda,
      campoBusqueda,
    ]);

  // =========================
  // RESULTADO
  // =========================

  return {
    socios: sociosFiltrados,

    busqueda,
    setBusqueda,

    campoBusqueda,
    setCampoBusqueda,

    recargarSocios:
      cargarSocios,
  };
}