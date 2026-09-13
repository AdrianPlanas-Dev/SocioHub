import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface Props {
  busqueda: string;
  campoBusqueda: string;
  onBusquedaChange: (
    value: string
  ) => void;
  onCampoBusquedaChange: (
    value: string
  ) => void;
  onNuevoSocio: () => void;
  onActualizar: () => void;
}

const camposBusqueda = [
  {
    value: "todos",
    label: "Todos los campos",
  },
  {
    value: "numero",
    label: "Nº de socio",
  },
  {
    value: "nombre",
    label: "Nombre",
  },
  {
    value: "apellidos",
    label: "Apellidos",
  },
  {
    value: "telefono",
    label: "Teléfono",
  },
  {
    value: "estado",
    label: "Estado",
  },
];

export default function SociosToolbar({
  busqueda,
  campoBusqueda,
  onBusquedaChange,
  onCampoBusquedaChange,
  onNuevoSocio,
  onActualizar,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: {
          xs: 1,
          sm: 2,
        },
        mt: {
          xs: 1,
          sm: 2,
        },
        mb: {
          xs: 2,
          sm: 3,
        },
        flexWrap: "wrap",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* =========================
BUSCAR POR
========================= */}

      <FormControl
        size="small"
        sx={{
          width: {
            xs: "100%",
            sm: "auto",
          },
          minWidth: {
            xs: 0,
            sm: 190,
          },
        }}
      >
        <InputLabel>
          Buscar por
        </InputLabel>

        <Select
          value={campoBusqueda}
          label="Buscar por"
          onChange={(e) =>
            onCampoBusquedaChange(
              e.target.value
            )
          }
        >
          {camposBusqueda.map(
            (campo) => (
              <MenuItem
                key={campo.value}
                value={campo.value}
              >
                {campo.label}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      {/* =========================
      BUSCADOR
  ========================= */}

      <TextField
        placeholder="Buscar..."
        size="small"
        value={busqueda}
        onChange={(e) =>
          onBusquedaChange(
            e.target.value
          )
        }
        sx={{
          flex: 1,
          width: {
            xs: "100%",
            sm: "auto",
          },
          minWidth: {
            xs: 0,
            sm: 280,
          },
        }}
      />

      {/* =========================
      NUEVO SOCIO
  ========================= */}

      <Button
        variant="contained"
        startIcon={
          <AddRoundedIcon />
        }
        onClick={onNuevoSocio}
        sx={{
          width: {
            xs: "100%",
            sm: "auto",
          },
        }}
      >
        Nuevo socio
      </Button>

      {/* =========================
      ACTUALIZAR
  ========================= */}

      <Button
        variant="outlined"
        startIcon={
          <RefreshRoundedIcon />
        }
        onClick={onActualizar}
        sx={{
          width: {
            xs: "100%",
            sm: "auto",
          },
        }}
      >
        Actualizar
      </Button>
    </Box>

  );
}
