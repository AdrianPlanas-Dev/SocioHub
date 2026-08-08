
import { useState } from "react";

import { Box } from "@mui/material";

import PageContainer from "../../../shared/components/PageContainer";

import SociosToolbar from "../components/SociosToolbar";
import SociosTable from "../components/SociosTable";
import SocioPanel from "../components/SocioPanel";
import SocioFormDialog from "../components/SocioFormDialog";

import type { Socio } from "../types/Socio";

import {
  crearSocio,
  actualizarSocio,
} from "../../../services/api";

import { useSocios } from "../hooks/useSocios";

export default function SociosPage() {
  const [selectedSocio, setSelectedSocio] =
    useState<Socio | null>(null);

  const [socioEditando, setSocioEditando] =
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

  function abrirNuevoSocio() {
    setSocioEditando(null);
    setDialogAbierto(true);
  }

  function abrirEditarSocio(socio: Socio) {
    setSocioEditando(socio);
    setDialogAbierto(true);
  }

  async function handleGuardarSocio(datos: {
    nombre: string;
    apellidos: string;
    telefono: string;
    estado: "Pagado" | "Pendiente";
  }) {
    try {
      if (socioEditando) {
        await actualizarSocio(
          socioEditando.numero,
          datos
        );
      } else {
        await crearSocio(datos);
      }

      await recargarSocios();

      setDialogAbierto(false);
      setSocioEditando(null);
    } catch (error) {
      console.error(
        "Error guardando socio:",
        error
      );
    }
  }

  function cerrarDialogo() {
    setDialogAbierto(false);
    setSocioEditando(null);
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
        onNuevoSocio={abrirNuevoSocio}
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
            onEdit={abrirEditarSocio}
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
        socio={socioEditando}
        onClose={cerrarDialogo}
        onSave={handleGuardarSocio}
      />
    </PageContainer>
  );
}
