import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import type { Socio } from "../types/Socio";

interface SociosTableProps {
  socios: Socio[];
  onEdit: (socio: Socio) => void;
}

export default function SociosTable({
  socios,
  onEdit,
}: SociosTableProps) {
  return (
    <Paper sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nº</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {socios.map((socio) => (
            <TableRow
              key={socio.id}
              hover
              onClick={() => onEdit(socio)}
              sx={{
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "#F5F7FA",
                },
              }}
            >
              <TableCell>{socio.numero}</TableCell>

              <TableCell>{socio.nombre}</TableCell>

              <TableCell>{socio.telefono}</TableCell>

              <TableCell>
                <Chip
                  label={socio.estado}
                  color={
                    socio.estado === "Pagado"
                      ? "success"
                      : "warning"
                  }
                  size="small"
                />
              </TableCell>

              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Más adelante abrirá el modo edición
                  }}
                >
                  <EditRoundedIcon />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Más adelante eliminaremos el socio
                  }}
                >
                  <DeleteRoundedIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}