import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import type { Socio } from "../types/Socio";
import Divider from "@mui/material/Divider";

interface Props {
  socio: Socio | null;
}

export default function SocioPanel({ socio }: Props) {

if (!socio) {
  return (
    <Card
      elevation={1}
      sx={{
        height: 400,
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
          Pulsa el botón editar para visualizar su ficha.
        </Typography>

      </CardContent>
    </Card>
  );
}

  return (
        <Card elevation={3}>

    <CardContent>

        <Typography
        variant="h5"
        fontWeight="bold"
        >
        {socio.nombre}
        </Typography>

        <Typography
        color="text.secondary"
        gutterBottom
        >
        Socio nº {socio.numero}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography
        variant="subtitle2"
        color="primary"
        gutterBottom
        >
        INFORMACIÓN PERSONAL
        </Typography>

        <Typography sx={{ mt: 2 }}>
        📞 {socio.telefono}
        </Typography>

        <Typography sx={{ mt: 1 }}>
        Estado: {socio.estado}
        </Typography>

    </CardContent>

    </Card>
  );
}