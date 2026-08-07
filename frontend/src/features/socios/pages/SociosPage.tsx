import { useState } from "react";

import { Box } from "@mui/material";

import PageContainer from "../../../shared/components/PageContainer";

import SociosToolbar from "../components/SociosToolbar";
import SociosTable from "../components/SociosTable";
import SocioPanel from "../components/SocioPanel.tsx";

import type { Socio } from "../types/Socio";
import { useSocios } from "../hooks/useSocios";

export default function SociosPage() {

const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);
const {
  socios,
  busqueda,
  setBusqueda,
  campoBusqueda,
  setCampoBusqueda,
} = useSocios();

    return (
    <PageContainer
      title="Socios"
      subtitle="Gestiona todos los socios de la peña."
    >
      <SociosToolbar
        busqueda={busqueda}
        campoBusqueda={campoBusqueda}
        onBusquedaChange={setBusqueda}
        onCampoBusquedaChange={setCampoBusqueda}
      />

      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 2 }}>
          <SociosTable
            socios={socios}
            onEdit={(socio) => setSelectedSocio(socio)}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <SocioPanel socio={selectedSocio} />
        </Box>
      </Box>
    </PageContainer>
  );
}