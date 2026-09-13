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
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";

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
  const theme = useTheme();

  const esMovil = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  if (esMovil) {
    return (
      <Box>
        {socios.length === 0 ? (
          <Paper
            sx={{
              borderRadius: 3,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              No se encontraron socios.
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
            }}
          >
            {socios.map((socio) => (
              <Paper
                key={socio.id}
                onClick={() =>
                  onSelect(socio)
                }
                sx={{
                  borderRadius: 2.5,
                  p: 1.5,
                  cursor: "pointer",

                  transition:
                    "transform 0.15s, box-shadow 0.15s",

                  "&:active": {
                    transform: "scale(0.99)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent:
                      "space-between",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      Nº {socio.numero}
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.98rem",
                        lineHeight: 1.3,
                        mt: 0.25,
                        wordBreak: "break-word",
                      }}
                    >
                      {socio.nombre}{" "}
                      {socio.apellidos}
                    </Typography>

                    {socio.telefono && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.75,
                        }}
                      >
                        <PhoneRoundedIcon
                          sx={{
                            fontSize: 16,
                            color:
                              "text.secondary",
                          }}
                        />

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {socio.telefono}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Chip
                    label={
                      socio.estadoCuotas ??
                      "Pendiente"
                    }
                    color={
                      socio.estadoCuotas ===
                      "Pagado"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                    sx={{
                      flexShrink: 0,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "flex-end",
                    gap: 0.5,
                    mt: 0.75,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(socio);
                    }}
                    aria-label="Editar socio"
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(socio);
                    }}
                    aria-label="Eliminar socio"
                  >
                    <DeleteRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // =========================
  // VISTA ESCRITORIO
  // =========================

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
                      label={
                        socio.estadoCuotas ??
                        "Pendiente"
                      }
                      color={
                        socio.estadoCuotas ===
                        "Pagado"
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