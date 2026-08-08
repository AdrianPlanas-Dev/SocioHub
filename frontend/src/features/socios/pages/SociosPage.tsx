
import { useState } from "react";

import { Box } from "@mui/material";

import PageContainer from "../../../shared/components/PageContainer";

import SociosToolbar from "../components/SociosToolbar";
import SociosTable from "../components/SociosTable";
import SocioPanel from "../components/SocioPanel";
import SocioFormDialog from "../components/SocioFormDialog";

import type { Socio } from "../types/Socio";
import { crearSocio } from "../../../services/api";
import { useSocios } from "../hooks/useSocios";

export default function SociosPage() {
  const [selectedSocio, setSelectedSocio] =
    useState<Socio | null>(null);

  const [dialogAbierto, setDialogAbierto] =
    useState(false);

  const {
    socios,
    busqueda,
    setBusqueda,
    campoBusqueda,
    setCampoBusqueda,
    recargarSocios,
  } = useSocios();

  async function handleCrearSocio(datos: {
    nombre: string;
    apellidos: string;
    telefono: string;
    estado: "Pagado" | "Pendiente";
  }) {
    try {
      await crearSocio(datos);

      await recargarSocios();

      setDialogAbierto(false);
    } catch (error) {
      console.error("Error creando socio:", error);
    }
  }

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
        onNuevoSocio={() => setDialogAbierto(true)}
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
            onEdit={(socio) =>
              setSelectedSocio(socio)
            }
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <SocioPanel
            socio={selectedSocio}
          />
        </Box>
      </Box>

      <SocioFormDialog
        open={dialogAbierto}
        onClose={() => setDialogAbierto(false)}
        onSave={handleCrearSocio}
      />
    </PageContainer>
  );
}

