import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";

interface SocioFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (datos: {
    nombre: string;
    apellidos: string;
    telefono: string;
    estado: "Pagado" | "Pendiente";
  }) => void;
}

export default function SocioFormDialog({
  open,
  onClose,
  onSave,
}: SocioFormDialogProps) {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estado, setEstado] = useState<
    "Pagado" | "Pendiente"
  >("Pendiente");

  const handleClose = () => {
    setNombre("");
    setApellidos("");
    setTelefono("");
    setEstado("Pendiente");
    onClose();
  };

  const handleSubmit = () => {
    if (!nombre.trim()) return;

    onSave({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      telefono: telefono.trim(),
      estado,
    });

    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Añadir socio
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Nombre"
          fullWidth
          required
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <TextField
          label="Apellidos"
          fullWidth
          margin="normal"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />

        <TextField
          label="Teléfono"
          fullWidth
          margin="normal"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <TextField
          select
          label="Estado"
          fullWidth
          margin="normal"
          value={estado}
          onChange={(e) =>
            setEstado(
              e.target.value as "Pagado" | "Pendiente"
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
          Guardar socio
        </Button>
      </DialogActions>
    </Dialog>
  );
}
