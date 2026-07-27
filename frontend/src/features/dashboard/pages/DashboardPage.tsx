import { Grid, Typography } from "@mui/material";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EuroRoundedIcon from "@mui/icons-material/EuroRounded";

import PageContainer from "../../../shared/components/PageContainer";
import StatCard from "../../../shared/components/StatCard";

export default function DashboardPage() {
  return (
    <PageContainer title="Inicio">
      <Typography
        variant="h6"
        mb={4}
      >
        Bienvenido a SocioHub 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Socios"
            value={227}
            icon={<GroupsRoundedIcon color="primary" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Pagados"
            value={198}
            icon={<PaidRoundedIcon color="success" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Pendientes"
            value={29}
            icon={<WarningAmberRoundedIcon color="warning" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Recaudado"
            value="2.270 €"
            icon={<EuroRoundedIcon color="primary" />}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
}