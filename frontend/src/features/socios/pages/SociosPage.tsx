import { useState } from "react";

import {
  Alert,
  Box,
  Snackbar,
} from "@mui/material";

import PageContainer from "../../../shared/components/PageContainer";

import SociosToolbar from "../components/SociosToolbar";
import SociosTable from "../components/SociosTable";
import SocioPanel from "../components/SocioPanel";
import SocioFormDialog from "../components/SocioFormDialog";

import type { Socio } from "../types/Socio";

import {
  crearSocio,
  actualizarSocio,
  eliminarSocio,
} from "../../../services/api";

import { useSocios } from "../hooks/useSocios";

export default function SociosPage() {
  const [selectedSocio, setSelectedSocio] =
    useState<Socio | null>(null);

  const [socioEditando, setSocioEditando] =
    useState<Socio | null>(null);

  const [dialogAbierto, setDialogAbierto] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [tipoMensaje, setTipoMensaje] =
    useState<"success" | "error">("success");

  const [snackbarAbierto, setSnackbarAbierto] =
    useState(false);

  const {
    socios,
    busqueda,
    setBusqueda,
    campoBusqueda,
    setCampoBusqueda,
    recargarSocios,
  } = useSocios();

  // =========================
  // MOSTRAR MENSAJE
  // =========================

  function mostrarMensaje(
    texto: string,
    tipo: "success" | "error" = "success"
  ) {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setSnackbarAbierto(true);
  }

  function cerrarMensaje() {
    setSnackbarAbierto(false);
  }

  // =========================
  // NUEVO SOCIO
  // =========================

  function abrirNuevoSocio() {
    setSocioEditando(null);
    setDialogAbierto(true);
  }

  // =========================
  // VER SOCIO
  // =========================

  function seleccionarSocio(socio: Socio) {
    setSelectedSocio(socio);
  }

  // =========================
  // EDITAR SOCIO
  // =========================

  function abrirEditarSocio(socio: Socio) {
    setSocioEditando(socio);
    setDialogAbierto(true);
  }

  // =========================
  // ACTUALIZAR DATOS
  // =========================
  //
  // Recarga socios + cuotas y
  // actualiza también la ficha
  // que esté abierta.
  //

  async function handleActualizar() {
    try {
      const sociosActualizados =
        await recargarSocios();

      if (selectedSocio) {
        const socioActualizado =
          sociosActualizados.find(
            (socio: Socio) =>
              socio.numero ===
              selectedSocio.numero
          );

        if (socioActualizado) {
          setSelectedSocio(
            socioActualizado
          );
        } else {
          setSelectedSocio(null);
        }
      }

      mostrarMensaje(
        "Datos actualizados correctamente"
      );

    } catch (error) {
      console.error(
        "Error actualizando socios:",
        error
      );

      mostrarMensaje(
        "No se pudieron actualizar los datos",
        "error"
      );
    }
  }

  // =========================
  // GUARDAR SOCIO
  // =========================

  async function handleGuardarSocio(datos: {
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: string;
    estado: "Pagado" | "Pendiente";
  }) {
    try {
      if (socioEditando) {
        const socioActualizado =
          await actualizarSocio(
            socioEditando.numero,
            datos
          );

        setSelectedSocio(
          (socioActual) => {
            if (
              !socioActual ||
              socioActual.numero !==
                socioEditando.numero
            ) {
              return socioActual;
            }

            return {
              ...socioActual,
              ...socioActualizado,
            };
          }
        );

        await recargarSocios();

        setDialogAbierto(false);
        setSocioEditando(null);

        mostrarMensaje(
          "Socio actualizado correctamente"
        );

      } else {
        const nuevoSocio =
          await crearSocio(datos);

        await recargarSocios();

        setDialogAbierto(false);
        setSocioEditando(null);

        setSelectedSocio(nuevoSocio);

        mostrarMensaje(
          "Socio creado correctamente"
        );
      }

    } catch (error) {
      console.error(
        "Error guardando socio:",
        error
      );

      mostrarMensaje(
        "No se pudo guardar el socio",
        "error"
      );
    }
  }

  // =========================
  // CERRAR DIALOGO
  // =========================

  function cerrarDialogo() {
    setDialogAbierto(false);
    setSocioEditando(null);
  }

  // =========================
  // ELIMINAR SOCIO
  // =========================

  async function handleEliminarSocio(
    socio: Socio
  ) {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar a ${socio.nombre} ${socio.apellidos}?`
    );

    if (!confirmado) {
      return;
    }

    try {
      await eliminarSocio(
        socio.numero
      );

      await recargarSocios();

      if (
        selectedSocio?.numero ===
        socio.numero
      ) {
        setSelectedSocio(null);
      }

      mostrarMensaje(
        "Socio borrado correctamente"
      );

    } catch (error) {
      console.error(
        "Error eliminando socio:",
        error
      );

      mostrarMensaje(
        "No se pudo borrar el socio",
        "error"
      );
    }
  }

  return (
    <PageContainer
      title="Socios"
      subtitle="Gestiona todos los socios de la peña."
    >

      {/* =========================
          BARRA DE HERRAMIENTAS
          ========================= */}

      <SociosToolbar
        busqueda={busqueda}
        campoBusqueda={campoBusqueda}
        onBusquedaChange={setBusqueda}
        onCampoBusquedaChange={
          setCampoBusqueda
        }
        onNuevoSocio={abrirNuevoSocio}
        onActualizar={handleActualizar}
      />

      {/* =========================
          ZONA DE TRABAJO
          ========================= */}

      <Box
        sx={{
          display: "flex",
          gap: 3,
          height: "calc(100vh - 300px)",
          minHeight: 450,
          alignItems: "stretch",
        }}
      >

        {/* =========================
            TABLA
            ========================= */}

        <Box
          sx={{
            flex: 2,
            minWidth: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SociosTable
            socios={socios}
            onSelect={seleccionarSocio}
            onEdit={abrirEditarSocio}
            onDelete={handleEliminarSocio}
          />
        </Box>

        {/* =========================
            FICHA DEL SOCIO
            ========================= */}

        <Box
          sx={{
            flex: 1,
            minWidth: 300,
            overflow: "auto",
            height: "100%",
          }}
        >
          <SocioPanel
            socio={selectedSocio}
            onEditar={() => {
              if (selectedSocio) {
                abrirEditarSocio(
                  selectedSocio
                );
              }
            }}
            onPagoRegistrado={
              handleActualizar
            }
          />
        </Box>

      </Box>

      {/* =========================
          DIALOG CREAR / EDITAR
          ========================= */}

      <SocioFormDialog
        open={dialogAbierto}
        socio={socioEditando}
        onClose={cerrarDialogo}
        onSave={handleGuardarSocio}
      />

      {/* =========================
          AVISOS
          ========================= */}

      <Snackbar
        open={snackbarAbierto}
        autoHideDuration={3500}
        onClose={cerrarMensaje}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={cerrarMensaje}
          severity={tipoMensaje}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {mensaje}
        </Alert>
      </Snackbar>

    </PageContainer>
  );
}