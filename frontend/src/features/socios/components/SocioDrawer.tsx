import {
  Drawer,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";

import type { Socio } from "../types/Socio";

interface SocioDrawerProps {
  socio: Socio | null;
  open: boolean;
  onClose: () => void;
}

export default function SocioDrawer({
  socio,
  open,
  onClose,
}: SocioDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          mt: "64px",
          height: "calc(100% - 64px)",
        },
      }}
    >
        <Box
        sx={{
            p: 3,
            pt: 10,
        }}
        >
        {/* Cabecera */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <PersonRoundedIcon color="primary" />

          <Typography
            variant="h5"
            fontWeight="bold"
          >
            {socio
              ? `${socio.nombre} ${socio.apellidos}`
              : "Selecciona un socio"}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
        >
          Socio nº {socio?.numero ?? "-"}
          
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Información personal */}

        <Card elevation={2}>
          <CardContent>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
            >
              INFORMACIÓN PERSONAL
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              <PhoneRoundedIcon color="action" />

              <Typography>
                {socio?.telefono ?? "Sin teléfono"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );
}