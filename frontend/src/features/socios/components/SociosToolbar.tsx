
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface Props {
  busqueda: string;
  campoBusqueda: string;
  onBusquedaChange: (value: string) => void;
  onCampoBusquedaChange: (value: string) => void;
  onNuevoSocio: () => void;
}

const camposBusqueda = [
  { value: "todos", label: "Todos los campos" },
  { value: "numero", label: "Nº de socio" },
  { value: "nombre", label: "Nombre" },
  { value: "apellidos", label: "Apellidos" },
  { value: "telefono", label: "Teléfono" },
  { value: "estado", label: "Estado" },
];

export default function SociosToolbar({
  busqueda,
  campoBusqueda,
  onBusquedaChange,
  onCampoBusquedaChange,
  onNuevoSocio,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mt: 2,
        mb: 3,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <FormControl size="small" sx={{ minWidth: 190 }}>
        <InputLabel>Buscar por</InputLabel>

        <Select
          value={campoBusqueda}
          label="Buscar por"
          onChange={(e) =>
            onCampoBusquedaChange(e.target.value)
          }
        >
          {camposBusqueda.map((campo) => (
            <MenuItem
              key={campo.value}
              value={campo.value}
            >
              {campo.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        placeholder="Buscar..."
        size="small"
        value={busqueda}
        onChange={(e) =>
          onBusquedaChange(e.target.value)
        }
        sx={{
          flex: 1,
          minWidth: 280,
        }}
      />

      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={onNuevoSocio}
      >
        Nuevo socio
      </Button>
    </Box>
  );
}

