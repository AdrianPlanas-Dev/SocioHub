interface ConfiguracionCardProps {
  icono: string;
  titulo: string;
  descripcion: string;
  onClick?: () => void;
}

export default function ConfiguracionCard({
  icono,
  titulo,
  descripcion,
  onClick,
}: ConfiguracionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 20,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        gap: 16,
        textAlign: "left",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          minWidth: 48,
          borderRadius: 12,
          background: "#eef2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 23,
        }}
      >
        {icono}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 650,
            color: "#111827",
            marginBottom: 4,
          }}
        >
          {titulo}
        </div>

        <div
          style={{
            fontSize: 14,
            color: "#6b7280",
            lineHeight: 1.4,
          }}
        >
          {descripcion}
        </div>
      </div>

      {onClick && (
        <div
          style={{
            fontSize: 24,
            color: "#9ca3af",
          }}
        >
          ›
        </div>
      )}
    </button>
  );
}