
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Edit,
  Delete,
} from "@mui/icons-material";

import {
  useMemo,
  useState,
} from "react";

import PageContainer from "../../../shared/components/PageContainer";

import {
  anularPago,
  modificarPago,
} from "../../../services/api";

import { usePagos } from "../hooks/usePagos";

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

type CampoOrden =
  | "numero"
  | "nombre"
  | "anio"
  | "mes"
  | "cantidad";

type DireccionOrden =
  | "asc"
  | "desc";

export default function PagosPage() {
  const {
    pagos,
    cargando,
    error,
    recargarPagos,
  } = usePagos();

  const [busqueda, setBusqueda] =
    useState("");

  const [anioFiltro, setAnioFiltro] =
    useState<string>("todos");

  const [mesFiltro, setMesFiltro] =
    useState<string>("todos");

  const [campoOrden, setCampoOrden] =
    useState<CampoOrden>("anio");

  const [direccionOrden, setDireccionOrden] =
    useState<DireccionOrden>("desc");

  // =========================
  // MODIFICAR PAGO
  // =========================

  const [pagoEditar, setPagoEditar] =
    useState<typeof pagos[number] | null>(null);

  const [nuevoAnio, setNuevoAnio] =
    useState("");

  const [nuevoMes, setNuevoMes] =
    useState("");

  const [nuevaCantidad, setNuevaCantidad] =
    useState("");

  const [guardando, setGuardando] =
    useState(false);

  const [errorAccion, setErrorAccion] =
    useState<string | null>(null);

  // =========================
  // AÑOS DISPONIBLES
  // =========================

  const anios = useMemo(() => {
    return Array.from(
      new Set(
        pagos.map(
          (pago) => pago.anio
        )
      )
    ).sort(
      (a, b) => b - a
    );
  }, [pagos]);

  // =========================
  // ORDENACIÓN
  // =========================

  function cambiarOrden(
    campo: CampoOrden
  ) {
    if (campoOrden === campo) {
      setDireccionOrden(
        direccionOrden === "asc"
          ? "desc"
          : "asc"
      );
      return;
    }

    setCampoOrden(campo);
    setDireccionOrden("asc");
  }

  function iconoOrden(
    campo: CampoOrden
  ) {
    if (campoOrden !== campo) {
      return "↕";
    }

    return direccionOrden === "asc"
      ? "↑"
      : "↓";
  }

  // =========================
  // FILTRAR Y ORDENAR
  // =========================

  const pagosMostrados = useMemo(() => {
    const texto =
      busqueda
        .trim()
        .toLowerCase();

    const resultado =
      pagos.filter((pago) => {
        if (texto) {
          const coincideNumero =
            String(pago.numero)
              .includes(texto);

          const coincideNombre =
            pago.nombre
              .toLowerCase()
              .includes(texto);

          if (
            !coincideNumero &&
            !coincideNombre
          ) {
            return false;
          }
        }

        if (
          anioFiltro !== "todos" &&
          pago.anio !==
            Number(anioFiltro)
        ) {
          return false;
        }

        if (
          mesFiltro !== "todos" &&
          pago.mes !==
            Number(mesFiltro)
        ) {
          return false;
        }

        return true;
      });

    resultado.sort((a, b) => {
      let comparacion = 0;

      switch (campoOrden) {
        case "numero":
          comparacion =
            a.numero - b.numero;
          break;

        case "nombre":
          comparacion =
            a.nombre.localeCompare(
              b.nombre,
              "es",
              {
                sensitivity: "base",
              }
            );
          break;

        case "anio":
          comparacion =
            a.anio - b.anio;
          break;

        case "mes":
          comparacion =
            a.mes - b.mes;
          break;

        case "cantidad":
          comparacion =
            a.cantidad - b.cantidad;
          break;
      }

      return direccionOrden === "asc"
        ? comparacion
        : -comparacion;
    });

    return resultado;
  }, [
    pagos,
    busqueda,
    anioFiltro,
    mesFiltro,
    campoOrden,
    direccionOrden,
  ]);

  // =========================
  // ABRIR MODIFICACIÓN
  // =========================

  function abrirModificar(
    pago: typeof pagos[number]
  ) {
    setPagoEditar(pago);
    setNuevoAnio(String(pago.anio));
    setNuevoMes(String(pago.mes));
    setNuevaCantidad(
      String(pago.cantidad)
    );
    setErrorAccion(null);
  }

  function cerrarModificar() {
    if (guardando) return;

    setPagoEditar(null);
    setErrorAccion(null);
  }

  // =========================
  // GUARDAR MODIFICACIÓN
  // =========================

  async function guardarModificar() {
    if (!pagoEditar) return;

    const cantidad = Number(
      nuevaCantidad.replace(",", ".")
    );

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setErrorAccion(
        "Introduce un importe válido mayor que 0."
      );
      return;
    }

    if (!nuevoAnio || !nuevoMes) {
      setErrorAccion(
        "Selecciona el año y el mes."
      );
      return;
    }

    try {
      setGuardando(true);
      setErrorAccion(null);

      await modificarPago(
        pagoEditar.numero,
        pagoEditar.anio,
        pagoEditar.mes,
        Number(nuevoAnio),
        Number(nuevoMes),
        cantidad
      );

      await recargarPagos();

      setPagoEditar(null);
    } catch (error) {
      console.error(
        "Error modificando pago:",
        error
      );

      setErrorAccion(
        error instanceof Error
          ? error.message
          : "No se pudo modificar el pago."
      );
    } finally {
      setGuardando(false);
    }
  }

  // =========================
  // ANULAR PAGO
  // =========================

  async function manejarAnular(
    pago: typeof pagos[number]
  ) {
    const confirmar = window.confirm(
      `¿Seguro que quieres anular el pago de ${pago.cantidad.toFixed(
        2
      )} € de ${pago.nombre}, correspondiente a ${pago.nombreMes} de ${pago.anio}?`
    );

    if (!confirmar) return;

    try {
      setErrorAccion(null);

      await anularPago(
        pago.numero,
        pago.anio,
        pago.mes
      );

      await recargarPagos();
    } catch (error) {
      console.error(
        "Error anulando pago:",
        error
      );

      setErrorAccion(
        error instanceof Error
          ? error.message
          : "No se pudo anular el pago."
      );
    }
  }

  return (
    <PageContainer
      title="Pagos"
      subtitle="Gestiona los pagos y cuotas de los socios."
    >
      {cargando && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!cargando && error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {!cargando && !error && (
        <>
          {errorAccion && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() =>
                setErrorAccion(null)
              }
            >
              {errorAccion}
            </Alert>
          )}

          {/* FILTROS */}

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <TextField
                label="Buscar socio"
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(
                    event.target.value
                  )
                }
                placeholder="Nº o nombre"
                size="small"
                sx={{
                  minWidth: 220,
                  flex: 1,
                }}
              />

              <FormControl
                size="small"
                sx={{ minWidth: 150 }}
              >
                <InputLabel>
                  Año
                </InputLabel>

                <Select
                  value={anioFiltro}
                  label="Año"
                  onChange={(event) =>
                    setAnioFiltro(
                      event.target.value
                    )
                  }
                >
                  <MenuItem value="todos">
                    Todos los años
                  </MenuItem>

                  {anios.map((anio) => (
                    <MenuItem
                      key={anio}
                      value={String(anio)}
                    >
                      {anio}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{ minWidth: 170 }}
              >
                <InputLabel>
                  Mes
                </InputLabel>

                <Select
                  value={mesFiltro}
                  label="Mes"
                  onChange={(event) =>
                    setMesFiltro(
                      event.target.value
                    )
                  }
                >
                  <MenuItem value="todos">
                    Todos los meses
                  </MenuItem>

                  {MESES.map(
                    (nombreMes, indice) => (
                      <MenuItem
                        key={nombreMes}
                        value={String(
                          indice + 1
                        )}
                      >
                        {nombreMes
                          .charAt(0)
                          .toUpperCase() +
                          nombreMes.slice(1)}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* TABLA */}

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() =>
                        cambiarOrden("numero")
                      }
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <strong>
                        Nº socio{" "}
                        {iconoOrden("numero")}
                      </strong>
                    </TableCell>

                    <TableCell
                      onClick={() =>
                        cambiarOrden("nombre")
                      }
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <strong>
                        Socio{" "}
                        {iconoOrden("nombre")}
                      </strong>
                    </TableCell>

                    <TableCell
                      onClick={() =>
                        cambiarOrden("anio")
                      }
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <strong>
                        Año{" "}
                        {iconoOrden("anio")}
                      </strong>
                    </TableCell>

                    <TableCell
                      onClick={() =>
                        cambiarOrden("mes")
                      }
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <strong>
                        Mes{" "}
                        {iconoOrden("mes")}
                      </strong>
                    </TableCell>

                    <TableCell
                      align="right"
                      onClick={() =>
                        cambiarOrden("cantidad")
                      }
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <strong>
                        Importe{" "}
                        {iconoOrden("cantidad")}
                      </strong>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      <strong>
                        Acciones
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pagosMostrados.map(
                    (pago) => (
                      <TableRow
                        key={`${pago.numero}-${pago.anio}-${pago.mes}`}
                        hover
                      >
                        <TableCell>
                          {pago.numero}
                        </TableCell>

                        <TableCell>
                          {pago.nombre}
                        </TableCell>

                        <TableCell>
                          {pago.anio}
                        </TableCell>

                        <TableCell
                          sx={{
                            textTransform:
                              "capitalize",
                          }}
                        >
                          {pago.nombreMes}
                        </TableCell>

                        <TableCell align="right">
                          {pago.cantidad.toFixed(
                            2
                          )}{" "}
                          €
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="Modificar">
                            <IconButton
                              size="small"
                              onClick={() =>
                                abrirModificar(
                                  pago
                                )
                              }
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Anular pago">
                            <IconButton
                              size="small"
                              onClick={() =>
                                manejarAnular(
                                  pago
                                )
                              }
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  )}

                  {pagosMostrados.length ===
                    0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                      >
                        <Typography
                          color="text.secondary"
                          sx={{ py: 4 }}
                        >
                          No hay pagos que
                          coincidan con los
                          filtros.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Mostrando{" "}
                <strong>
                  {pagosMostrados.length}
                </strong>{" "}
                de{" "}
                <strong>
                  {pagos.length}
                </strong>{" "}
                pagos
              </Typography>
            </Box>
          </Paper>

          {/* DIÁLOGO MODIFICAR */}

          <Dialog
            open={Boolean(pagoEditar)}
            onClose={cerrarModificar}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>
              Modificar pago
            </DialogTitle>

            <DialogContent>
              {pagoEditar && (
                <Box
                  sx={{
                    pt: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Socio"
                    value={`${pagoEditar.numero} - ${pagoEditar.nombre}`}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />

                  <FormControl fullWidth size="small">
                    <InputLabel>
                      Año
                    </InputLabel>

                    <Select
                      value={nuevoAnio}
                      label="Año"
                      onChange={(event) =>
                        setNuevoAnio(
                          event.target.value
                        )
                      }
                    >
                      {anios.map((anio) => (
                        <MenuItem
                          key={anio}
                          value={String(anio)}
                        >
                          {anio}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>
                      Mes
                    </InputLabel>

                    <Select
                      value={nuevoMes}
                      label="Mes"
                      onChange={(event) =>
                        setNuevoMes(
                          event.target.value
                        )
                      }
                    >
                      {MESES.map(
                        (nombreMes, indice) => (
                          <MenuItem
                            key={nombreMes}
                            value={String(
                              indice + 1
                            )}
                          >
                            {nombreMes
                              .charAt(0)
                              .toUpperCase() +
                              nombreMes.slice(1)}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Importe"
                    type="number"
                    value={nuevaCantidad}
                    onChange={(event) =>
                      setNuevaCantidad(
                        event.target.value
                      )
                    }
                    fullWidth
                    size="small"
                    slotProps={{
                      htmlInput: {
                        min: 0.01,
                        step: 0.01,
                      },
                    }}
                  />
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <Button
                onClick={cerrarModificar}
                disabled={guardando}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                onClick={guardarModificar}
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : "Guardar"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </PageContainer>
  );
}
