import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import type { Socio } from "../types/Socio";

interface SocioFormDialogProps {
  open: boolean;
  socio?: Socio | null;
  onClose: () => void;

  onSave: (datos: {
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: string;
    estado: "Pagado" | "Pendiente";
  }) => void;
}

export default function SocioFormDialog({
  open,
  socio,
  onClose,
  onSave,
}: SocioFormDialogProps) {

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] =
    useState("");

  const [estado, setEstado] =
    useState<"Pagado" | "Pendiente">(
      "Pendiente"
    );

  const editando = Boolean(socio);

  // =========================
  // CARGAR DATOS
  // =========================

  useEffect(() => {
    if (socio) {
      setNombre(socio.nombre ?? "");
      setApellidos(socio.apellidos ?? "");
      setDni(socio.dni ?? "");
      setTelefono(socio.telefono ?? "");
      setDireccion(socio.direccion ?? "");
      setFechaNacimiento(
        socio.fechaNacimiento ?? ""
      );
      setEstado(
        socio.estado ?? "Pendiente"
      );
    } else {
      setNombre("");
      setApellidos("");
      setDni("");
      setTelefono("");
      setDireccion("");
      setFechaNacimiento("");
      setEstado("Pendiente");
    }
  }, [socio, open]);

  // =========================
  // CERRAR
  // =========================

  const handleClose = () => {
    setNombre("");
    setApellidos("");
    setDni("");
    setTelefono("");
    setDireccion("");
    setFechaNacimiento("");
    setEstado("Pendiente");

    onClose();
  };

  // =========================
  // GUARDAR
  // =========================

  const handleSubmit = () => {
    if (!nombre.trim()) {
      return;
    }

    onSave({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      dni: dni.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      fechaNacimiento:
        fechaNacimiento.trim(),
      estado,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {editando
          ? "Editar socio"
          : "Añadir socio"}
      </DialogTitle>

      <DialogContent>

        {/* NOMBRE */}

        <TextField
          label="Nombre"
          fullWidth
          required
          margin="normal"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        {/* APELLIDOS */}

        <TextField
          label="Apellidos"
          fullWidth
          margin="normal"
          value={apellidos}
          onChange={(e) =>
            setApellidos(e.target.value)
          }
        />

        {/* DNI */}

        <TextField
          label="DNI"
          fullWidth
          margin="normal"
          value={dni}
          onChange={(e) =>
            setDni(e.target.value)
          }
          placeholder="12345678A"
        />

        {/* TELÉFONO */}

        <TextField
          label="Teléfono"
          fullWidth
          margin="normal"
          value={telefono}
          onChange={(e) =>
            setTelefono(e.target.value)
          }
          placeholder="976123456"
        />

        {/* DIRECCIÓN */}

        <TextField
          label="Dirección"
          fullWidth
          margin="normal"
          value={direccion}
          onChange={(e) =>
            setDireccion(e.target.value)
          }
          placeholder="C/ Ejemplo 12, 3ºA"
        />

        {/* FECHA DE NACIMIENTO */}

        <TextField
          label="Fecha de nacimiento"
          fullWidth
          margin="normal"
          value={fechaNacimiento}
          onChange={(e) =>
            setFechaNacimiento(
              e.target.value
            )
          }
          placeholder="31/07/1948"
          helperText="Formato: DD/MM/AAAA"
        />

        {/* ESTADO */}

        <TextField
          select
          label="Estado"
          fullWidth
          margin="normal"
          value={estado}
          onChange={(e) =>
            setEstado(
              e.target.value as
                | "Pagado"
                | "Pendiente"
            )
          }
        >
          <MenuItem value="Pendiente">
            Pendiente
          </MenuItem>

          <MenuItem value="Pagado">
            Pagado
          </MenuItem>
        </TextField>

      </DialogContent>

      <DialogActions sx={{ p: 2 }}>

        <Button onClick={handleClose}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!nombre.trim()}
        >
          {editando
            ? "Guardar cambios"
            : "Guardar socio"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}
