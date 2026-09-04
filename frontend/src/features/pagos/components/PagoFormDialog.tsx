import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import type { Socio } from "../../socios/types/Socio";

interface Props {
  open: boolean;
  socios: Socio[];
  anios: number[];
  onClose: () => void;
  onSave: (
    numero: number,
    anio: number,
    mes: number,
    cantidad: number
  ) => Promise<void>;
}

const meses = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export default function PagoFormDialog({
  open,
  socios,
  anios,
  onClose,
  onSave,
}: Props) {
  const [numero, setNumero] =
    useState<number | "">("");

  const [anio, setAnio] =
    useState<number | "">("");

  const [mes, setMes] =
    useState<number | "">("");

  const [cantidad, setCantidad] =
    useState("");

  const [guardando, setGuardando] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setNumero("");
    setMes("");
    setCantidad("");

    if (anios.length > 0) {
      setAnio(anios[0]);
    } else {
      setAnio("");
    }
  }, [open, anios]);

  async function handleGuardar() {
    if (
      numero === "" ||
      anio === "" ||
      mes === "" ||
      cantidad.trim() === ""
    ) {
      return;
    }

    const importe = Number(
      cantidad.replace(",", ".")
    );

    if (
      Number.isNaN(importe) ||
      importe <= 0
    ) {
      return;
    }

    try {
      setGuardando(true);

      await onSave(
        numero,
        anio,
        mes,
        importe
      );

      onClose();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={
        guardando
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Registrar pago
      </DialogTitle>

      <DialogContent>
        <FormControl
          fullWidth
          margin="normal"
        >
          <InputLabel>
            Socio
          </InputLabel>

          <Select
            value={numero}
            label="Socio"
            onChange={(e) =>
              setNumero(
                e.target.value === ""
                  ? ""
                  : Number(
                      e.target.value
                    )
              )
            }
          >
            {socios.map((socio) => (
              <MenuItem
                key={socio.numero}
                value={socio.numero}
              >
                Nº {socio.numero} —{" "}
                {socio.nombre}{" "}
                {socio.apellidos}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
        >
          <InputLabel>
            Año
          </InputLabel>

          <Select
            value={anio}
            label="Año"
            onChange={(e) =>
              setAnio(
                Number(e.target.value)
              )
            }
          >
            {anios.map((valor) => (
              <MenuItem
                key={valor}
                value={valor}
              >
                {valor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
        >
          <InputLabel>
            Mes
          </InputLabel>

          <Select
            value={mes}
            label="Mes"
            onChange={(e) =>
              setMes(
                Number(e.target.value)
              )
            }
          >
            {meses.map((mesItem) => (
              <MenuItem
                key={mesItem.value}
                value={mesItem.value}
              >
                {mesItem.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Importe"
          type="text"
          value={cantidad}
          onChange={(e) =>
            setCantidad(
              e.target.value
            )
          }
          slotProps={{
            input: {
              endAdornment: "€",
            },
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={guardando}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleGuardar}
          disabled={
            guardando ||
            numero === "" ||
            anio === "" ||
            mes === "" ||
            cantidad.trim() === ""
          }
        >
          {guardando
            ? "Guardando..."
            : "Registrar pago"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}