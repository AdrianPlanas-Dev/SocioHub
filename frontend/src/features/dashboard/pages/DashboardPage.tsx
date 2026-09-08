import { useEffect, useState } from "react";

import {
  Alert,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EuroRoundedIcon from "@mui/icons-material/EuroRounded";

import PageContainer from "../../../shared/components/PageContainer";
import StatCard from "../../../shared/components/StatCard";

import {
  getSocios,
  obtenerEstadosSocios,
  obtenerPagos,
} from "../../../services/api";

export default function DashboardPage() {
  // =========================
  // ESTADÍSTICAS
  // =========================

  const [totalSocios, setTotalSocios] =
    useState(0);

  const [totalPagados, setTotalPagados] =
    useState(0);

  const [totalPendientes, setTotalPendientes] =
    useState(0);

  const [totalRecaudado, setTotalRecaudado] =
    useState(0);

  // =========================
  // ESTADO DE CARGA
  // =========================

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // CARGAR DATOS
  // =========================

  useEffect(() => {
    async function cargarDashboard() {
      try {
        setCargando(true);
        setError("");

        // Cargamos todo en paralelo
        const [
          socios,
          estados,
          pagos,
        ] = await Promise.all([
          getSocios(),
          obtenerEstadosSocios(),
          obtenerPagos(),
        ]);

        // =========================
        // TOTAL SOCIOS
        // =========================

        setTotalSocios(
          Array.isArray(socios)
            ? socios.length
            : 0
        );

        // =========================
        // PAGADOS / PENDIENTES
        // =========================

        if (Array.isArray(estados)) {
          const pagados =
            estados.filter(
              (socio) =>
                socio.estado === "Pagado"
            ).length;

          const pendientes =
            estados.filter(
              (socio) =>
                socio.estado === "Pendiente"
            ).length;

          setTotalPagados(pagados);
          setTotalPendientes(pendientes);
        } else {
          setTotalPagados(0);
          setTotalPendientes(0);
        }

        // =========================
        // DINERO RECAUDADO
        // =========================

        if (Array.isArray(pagos)) {
          const recaudado =
            pagos.reduce(
              (total, pago) =>
                total +
                Number(pago.cantidad || 0),
              0
            );

          setTotalRecaudado(recaudado);
        } else {
          setTotalRecaudado(0);
        }

      } catch (error) {
        console.error(
          "Error cargando dashboard:",
          error
        );

        setError(
          "No se pudieron cargar las estadísticas."
        );
      } finally {
        setCargando(false);
      }
    }

    cargarDashboard();
  }, []);

  // =========================
  // ESTADÍSTICAS PARA MOSTRAR
  // =========================

  const estadisticas = [
    {
      title: "Socios",
      value: cargando
        ? "..."
        : totalSocios,
      icon: (
        <GroupsRoundedIcon color="primary" />
      ),
    },
    {
      title: "Pagados",
      value: cargando
        ? "..."
        : totalPagados,
      icon: (
        <PaidRoundedIcon color="success" />
      ),
    },
    {
      title: "Pendientes",
      value: cargando
        ? "..."
        : totalPendientes,
      icon: (
        <WarningAmberRoundedIcon color="warning" />
      ),
    },
    {
      title: "Recaudado",
      value: cargando
        ? "..."
        : `${totalRecaudado.toFixed(2)} €`,
      icon: (
        <EuroRoundedIcon color="primary" />
      ),
    },
  ];

  // =========================
  // RENDER
  // =========================

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

      <Grid
        container
        spacing={3}
      >
        {estadisticas.map((stat) => (
          <Grid
            key={stat.title}
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          </Grid>
        ))}
      </Grid>

      {/* =========================
          AVISO DE ERROR
      ========================= */}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}