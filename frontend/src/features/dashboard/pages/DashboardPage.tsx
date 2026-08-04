import { Grid, Typography } from "@mui/material";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EuroRoundedIcon from "@mui/icons-material/EuroRounded";

import PageContainer from "../../../shared/components/PageContainer";
import StatCard from "../../../shared/components/StatCard";
import { dashboardData } from "../data/dashboardData";
import { dashboardStats } from "../constants/dashboardStats";

export default function DashboardPage() {
  return (
<PageContainer
  title="Inicio"
  subtitle="Resumen general de la peña."
>
      <Typography
        variant="h6"
        mb={4}
      >
        Bienvenido a SocioHub 👋
      </Typography>

      <Grid container spacing={3}>
  {dashboardStats.map((stat) => (
    <Grid
      key={stat.title}
      size={{ xs: 12, md: 6, lg: 3 }}
    >
      <StatCard
        title={stat.title}
        value={stat.value}
        icon={stat.icon}
      />
    </Grid>
  ))}
</Grid>
    </PageContainer>
  );
}