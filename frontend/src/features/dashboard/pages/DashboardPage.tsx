import { Grid, Typography } from "@mui/material";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EuroRoundedIcon from "@mui/icons-material/EuroRounded";

import PageContainer from "../../../shared/components/PageContainer";
import StatCard from "../../../shared/components/StatCard";
import { dashboardData } from "../data/dashboardData";

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
            value={dashboardData.socios}
            icon={<GroupsRoundedIcon color="primary" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Pagados"
            value={dashboardData.pagados}
            icon={<PaidRoundedIcon color="success" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Pendientes"
            value={dashboardData.pendientes}
            icon={<WarningAmberRoundedIcon color="warning" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="Recaudado"
            value={`${dashboardData.recaudado} €`}
            icon={<EuroRoundedIcon color="primary" />}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
}