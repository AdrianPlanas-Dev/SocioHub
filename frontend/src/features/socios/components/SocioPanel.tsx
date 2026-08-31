
import {
  useEffect,
  useState,
} from "react";

import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Chip,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";

import {
  registrarPago,
  obtenerAniosCuotas,
} from "../../../services/api";

import type { Socio } from "../types/Socio";

interface Props {
  socio: Socio | null;
  onEditar?: () => void;
  onPagoRegistrado?: () => void;
}

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

export default function SocioPanel({
  socio,
  onEditar,
  onPagoRegistrado,
}: Props) {

  // =========================
  // ESTADO DEL FORMULARIO
  // =========================

  const [mostrarPago, setMostrarPago] =
    useState(false);

  const [aniosDisponibles, setAniosDisponibles] =
    useState<number[]>([]);

  const [anioPago, setAnioPago] =
    useState<number | "">("");

  const [mesPago, setMesPago] =
    useState(new Date().getMonth() + 1);

  const [cantidad, setCantidad] =
    useState("");

  const [guardandoPago, setGuardandoPago] =
    useState(false);

  const [errorPago, setErrorPago] =
    useState("");

  // =========================
  // CARGAR AÑOS DISPONIBLES
  // =========================

  useEffect(() => {
    async function cargarAnios() {
      try {
        const anios =
          await obtenerAniosCuotas();

        const aniosNumeros = Array.isArray(anios)
          ? anios
              .map((anio) => Number(anio))
              .filter((anio) =>
                Number.isInteger(anio)
              )
          : [];

        setAniosDisponibles(
          aniosNumeros
        );

        // Seleccionamos automáticamente
        // el año actual si existe.
        const anioActual =
          new Date().getFullYear();

        if (
          aniosNumeros.includes(anioActual)
        ) {
          setAnioPago(anioActual);
        } else if (
          aniosNumeros.length > 0
        ) {
          setAnioPago(
            aniosNumeros[0]
          );
        }

      } catch (error) {
        console.error(
          "Error obteniendo años de cuotas:",
          error
        );

        setAniosDisponibles([]);
        setAnioPago("");
      }
    }

    cargarAnios();
  }, []);

  // =========================
  // SIN SOCIO SELECCIONADO
  // =========================

  if (!socio) {
    return (
      <Card
        elevation={1}
        sx={{
          borderRadius: 3,
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            align="center"
          >
            Selecciona un socio
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Selecciona un socio de la tabla
            para visualizar su ficha.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // =========================
  // ESTADO DE CUOTAS
  // =========================

  const estadoCuotas =
    socio.estadoCuotas ?? "Pendiente";

  const mesesPendientes =
    socio.mesesPendientes ?? [];

  const estaPagado =
    estadoCuotas === "Pagado";

  // =========================
  // REGISTRAR PAGO
  // =========================

  async function guardarPago() {
    setErrorPago("");

    if (anioPago === "") {
      setErrorPago(
        "Selecciona un año."
      );
      return;
    }

    const cantidadNumerica =
      Number(
        cantidad.replace(",", ".")
      );

    if (
      !cantidad.trim() ||
      Number.isNaN(cantidadNumerica) ||
      cantidadNumerica <= 0
    ) {
      setErrorPago(
        "Introduce una cantidad válida."
      );
      return;
    }

    try {
      setGuardandoPago(true);

      await registrarPago(
        socio.numero,
        anioPago,
        mesPago,
        cantidadNumerica
      );

      // Limpiamos el formulario
      setCantidad("");
      setMostrarPago(false);

      // Recargamos los datos del socio
      if (onPagoRegistrado) {
        onPagoRegistrado();
      }

    } catch (error) {
      console.error(
        "Error registrando pago:",
        error
      );

      setErrorPago(
        error instanceof Error
          ? error.message
          : "Error registrando el pago."
      );
    } finally {
      setGuardandoPago(false);
    }
  }

  // =========================
  // FICHA DEL SOCIO
  // =========================

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 3,
      }}
    >
      <CardContent>

        {/* =========================
            CABECERA
        ========================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
            >
              {socio.nombre}
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
            >
              {socio.apellidos}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Socio nº {socio.numero}
            </Typography>
          </Box>

          <Chip
            label={
              estaPagado
                ? "Pagado"
                : "Pendiente"
            }
            color={
              estaPagado
                ? "success"
                : "warning"
            }
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* =========================
            INFORMACIÓN PERSONAL
        ========================= */}

        <Typography
          variant="subtitle2"
          color="primary"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          INFORMACIÓN PERSONAL
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            DNI
          </Typography>

          <Typography>
            {socio.dni || "No indicado"}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            TELÉFONO
          </Typography>

          <Typography>
            {socio.telefono || "No indicado"}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            DIRECCIÓN
          </Typography>

          <Typography>
            {socio.direccion || "No indicada"}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            FECHA DE NACIMIENTO
          </Typography>

          <Typography>
            {socio.fechaNacimiento ||
              "No indicada"}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* =========================
            ESTADO DE CUOTAS
        ========================= */}

        <Typography
          variant="subtitle2"
          color="primary"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          ESTADO DE CUOTAS
        </Typography>

        {estaPagado ? (
          <Box>
            <Chip
              label="TODAS LAS CUOTAS PAGADAS"
              color="success"
              sx={{
                fontWeight: "bold",
              }}
            />

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              El socio está al corriente de
              sus cuotas hasta el mes actual.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Chip
              label="CUOTAS PENDIENTES"
              color="warning"
              sx={{
                fontWeight: "bold",
              }}
            />

            {mesesPendientes.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Meses pendientes:
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  {mesesPendientes.map(
                    (pendiente, index) => (
                      <Typography
                        key={`${pendiente.anio}-${pendiente.mes}-${index}`}
                        color="text.secondary"
                      >
                        •{" "}
                        {pendiente.nombreMes
                          ? pendiente.nombreMes
                              .charAt(0)
                              .toUpperCase() +
                            pendiente.nombreMes.slice(
                              1
                            )
                          : "Mes desconocido"}{" "}
                        {pendiente.anio}
                      </Typography>
                    )
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* =========================
            REGISTRAR PAGO
        ========================= */}

        {!mostrarPago ? (
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={
              <PaymentsRoundedIcon />
            }
            onClick={() => {
              setErrorPago("");
              setMostrarPago(true);
            }}
          >
            Registrar pago
          </Button>
        ) : (
          <Box>

            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              REGISTRAR PAGO
            </Typography>

            <TextField
              select
              fullWidth
              label="Año"
              value={anioPago}
              onChange={(event) =>
                setAnioPago(
                  Number(event.target.value)
                )
              }
              sx={{ mb: 2 }}
            >
              {aniosDisponibles.length > 0 ? (
                aniosDisponibles.map(
                  (anio) => (
                    <MenuItem
                      key={anio}
                      value={anio}
                    >
                      {anio}
                    </MenuItem>
                  )
                )
              ) : (
                <MenuItem
                  value=""
                  disabled
                >
                  No hay años disponibles
                </MenuItem>
              )}
            </TextField>

            <TextField
              select
              fullWidth
              label="Mes"
              value={mesPago}
              onChange={(event) =>
                setMesPago(
                  Number(event.target.value)
                )
              }
              sx={{ mb: 2 }}
            >
              {MESES.map(
                (nombre, index) => (
                  <MenuItem
                    key={index}
                    value={index + 1}
                  >
                    {nombre
                      .charAt(0)
                      .toUpperCase() +
                      nombre.slice(1)}
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              fullWidth
              label="Cantidad pagada"
              placeholder="Ej. 20"
              value={cantidad}
              onChange={(event) =>
                setCantidad(
                  event.target.value
                )
              }
              type="text"
              inputMode="decimal"
              helperText="Puedes introducir cualquier cantidad."
              sx={{ mb: 2 }}
            />

            {errorPago && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mb: 2 }}
              >
                {errorPago}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setMostrarPago(false);
                  setErrorPago("");
                }}
                disabled={guardandoPago}
              >
                Cancelar
              </Button>

              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={guardarPago}
                disabled={
                  guardandoPago ||
                  anioPago === "" ||
                  aniosDisponibles.length === 0
                }
              >
                {guardandoPago
                  ? "Guardando..."
                  : "Guardar pago"}
              </Button>
            </Box>

          </Box>
        )}

        {/* =========================
            BOTÓN EDITAR
        ========================= */}

        {onEditar && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <EditRoundedIcon />
            }
            onClick={onEditar}
            sx={{ mt: 2 }}
          >
            Editar socio
          </Button>
        )}

      </CardContent>
    </Card>
  );
}
