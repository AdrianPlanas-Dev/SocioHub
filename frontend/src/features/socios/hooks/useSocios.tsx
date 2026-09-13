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

        const estadosPorSocio = new Map<
          number,
          {
            numero: number;
            estado: "Pagado" | "Pendiente";
            mesesPendientes: {
              anio: number;
              mes: number;
              nombreMes: string;
            }[];
          }
        >(
          estados.map(
            (estado: {
              numero: number;
              estado: "Pagado" | "Pendiente";
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
          const numero =
            String(socio.numero ?? "").toLowerCase();

          const nombre =
            String(socio.nombre ?? "").toLowerCase();

          const apellidos =
            String(socio.apellidos ?? "").toLowerCase();

          const telefono =
            String(socio.telefono ?? "").toLowerCase();

          const estado =
            String(socio.estadoCuotas ?? "").toLowerCase();

          switch (campoBusqueda) {

            // =========================
            // NÚMERO
            // =========================

            case "numero":
              return numero.includes(texto);

            // =========================
            // NOMBRE
            // =========================

            case "nombre":
              return nombre.includes(texto);

            // =========================
            // APELLIDOS
            // =========================

            case "apellidos":
              return apellidos.includes(texto);

            // =========================
            // TELÉFONO
            // =========================

            case "telefono":
              return telefono.includes(texto);

            // =========================
            // ESTADO
            // =========================

            case "estado":
              return estado.includes(texto);

            // =========================
            // TODOS
            // =========================

            default:
              return (
                numero.includes(texto) ||
                nombre.includes(texto) ||
                apellidos.includes(texto) ||
                telefono.includes(texto) ||
                estado.includes(texto)
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