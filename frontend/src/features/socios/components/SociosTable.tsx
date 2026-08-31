import {
  Paper,
  Table,
  TableContainer,
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
  onSelect: (socio: Socio) => void;
  onEdit: (socio: Socio) => void;
  onDelete: (socio: Socio) => void;
}

export default function SociosTable({
  socios,
  onSelect,
  onEdit,
  onDelete,
}: SociosTableProps) {
  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          height: 520,
          overflowY: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nº</TableCell>

              <TableCell>
                Nombre
              </TableCell>

              <TableCell>
                Teléfono
              </TableCell>

              <TableCell>
                Estado
              </TableCell>

              <TableCell align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {socios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    py: 6,
                    color: "text.secondary",
                  }}
                >
                  No se encontraron socios.
                </TableCell>
              </TableRow>
            ) : (
              socios.map((socio) => (
                <TableRow
                  key={socio.id}
                  hover
                  onClick={() =>
                    onSelect(socio)
                  }
                  sx={{
                    cursor: "pointer",
                    transition: "0.2s",

                    "&:hover": {
                      backgroundColor:
                        "#F5F7FA",
                    },
                  }}
                >
                  <TableCell>
                    {socio.numero}
                  </TableCell>

                  <TableCell>
                    {socio.nombre}{" "}
                    {socio.apellidos}
                  </TableCell>

                  <TableCell>
                    {socio.telefono}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={socio.estadoCuotas ?? "Pendiente"}
                      color={
                        socio.estadoCuotas === "Pagado"
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
                        onEdit(socio);
                      }}
                    >
                      <EditRoundedIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(socio);
                      }}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
