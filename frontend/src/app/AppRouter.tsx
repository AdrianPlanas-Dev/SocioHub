import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import SociosPage from "../features/socios/pages/SociosPage";
import PagosPage from "../features/pagos/pages/PagosPage";
import EstadisticasPage from "../features/estadisticas/pages/EstadisticasPage";
import ConfiguracionPage from "../features/configuracion/pages/ConfiguracionPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/socios" element={<SociosPage />} />
          <Route path="/pagos" element={<PagosPage />} />
          <Route path="/estadisticas" element={<EstadisticasPage />} />
          <Route path="/configuracion" element={<ConfiguracionPage />} />
        </Route>

        <Route path="/inicio" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}