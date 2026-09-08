import { useNavigate } from "react-router-dom";
import PageContainer from "../../../shared/components/PageContainer";
import ConfiguracionCard from "../components/ConfiguracionCard";

export default function ConfiguracionPage() {
  const navigate = useNavigate();
  return (
    <PageContainer title="Configuración">
      <div
        style={{
          maxWidth: 950,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 30 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#6b7280",
              marginBottom: 8,
            }}
          >
            CONFIGURACIÓN
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Configuración
          </h1>

          <p
            style={{
              marginTop: 8,
              color: "#6b7280",
              fontSize: 15,
            }}
          >
            Gestiona las opciones generales de SocioHub.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          <ConfiguracionCard
            icono="📅"
            titulo="Años de cuotas"
            descripcion="Gestiona los ejercicios y hojas de cuotas."
            onClick={() => navigate("/configuracion/anios-cuotas")}
          />

          <ConfiguracionCard
            icono="👥"
            titulo="Socios"
            descripcion="Configura las opciones relacionadas con los socios."
          />

          <ConfiguracionCard
            icono="💶"
            titulo="Cuotas"
            descripcion="Configura importes y opciones de las cuotas."
          />

          <ConfiguracionCard
            icono="🏢"
            titulo="Asociación"
            descripcion="Gestiona los datos generales de la asociación."
          />

          <ConfiguracionCard
            icono="🔐"
            titulo="Usuarios y permisos"
            descripcion="Gestiona usuarios y permisos de acceso."
          />
        </div>
      </div>
    </PageContainer>
  );
}