import { useEffect, useState } from "react";
import PageContainer from "../../../shared/components/PageContainer";
import {
    obtenerAniosCuotas,
    crearCuotasAnio,
    eliminarCuotasAnio,
} from "../../../services/api";

export default function AniosCuotasPage() {
    const [anios, setAnios] = useState<number[]>([]);
    const [nuevoAnio, setNuevoAnio] = useState("");
    const [cargando, setCargando] = useState(true);
    const [creando, setCreando] = useState(false);
    const [eliminando, setEliminando] = useState<number | null>(null);
    const [error, setError] = useState("");

    async function cargarAnios() {
        try {
            setCargando(true);
            setError("");

            const datos = await obtenerAniosCuotas();
            setAnios(datos);
        } catch (error) {
            console.error(error);
            setError("No se han podido cargar los años de cuotas.");
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarAnios();
    }, []);

    async function handleCrearAnio() {
        const anio = Number(nuevoAnio);

        if (!anio || anio < 2000 || anio > 2100) {
            setError("Introduce un año válido entre 2000 y 2100.");
            return;
        }

        if (anios.includes(anio)) {
            setError(`El año ${anio} ya existe.`);
            return;
        }

        try {
            setCreando(true);
            setError("");

            await crearCuotasAnio(anio);

            setNuevoAnio("");
            await cargarAnios();
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "No se ha podido crear el año."
            );
        } finally {
            setCreando(false);
        }
    }

    async function handleEliminarAnio(anio: number) {
        if (anios.length <= 1) {
            setError("No puedes eliminar el último año de cuotas.");
            return;
        }

        const confirmado = window.confirm(
            `¿Seguro que quieres eliminar el año ${anio}?\n\nSe eliminará la hoja "Cuotas ${anio}" de Google Sheets. Esta acción no se puede deshacer.`
        );

        if (!confirmado) {
            return;
        }

        try {
            setEliminando(anio);
            setError("");

            await eliminarCuotasAnio(anio);

            await cargarAnios();
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "No se ha podido eliminar el año."
            );
        } finally {
            setEliminando(null);
        }
    }

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
                        Años de cuotas
                    </h1>

                    <p
                        style={{
                            marginTop: 8,
                            color: "#6b7280",
                            fontSize: 15,
                        }}
                    >
                        Gestiona los ejercicios y las hojas de cuotas de la asociación.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 20,
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 16,
                            padding: 24,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: "#111827",
                                marginBottom: 6,
                            }}
                        >
                            Crear nuevo año
                        </div>

                        <div
                            style={{
                                fontSize: 14,
                                color: "#6b7280",
                                marginBottom: 20,
                            }}
                        >
                            Crea una nueva hoja de cuotas para un ejercicio.
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                            }}
                        >
                            <input
                                type="number"
                                value={nuevoAnio}
                                onChange={(e) => setNuevoAnio(e.target.value)}
                                placeholder="Ej. 2028"
                                min={2000}
                                max={2100}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding: "11px 12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: 10,
                                    fontSize: 14,
                                    outline: "none",
                                }}
                            />

                            <button
                                type="button"
                                onClick={handleCrearAnio}
                                disabled={creando}
                                style={{
                                    border: "none",
                                    borderRadius: 10,
                                    padding: "0 16px",
                                    background: creando ? "#c7d2fe" : "#4f46e5",
                                    color: "#ffffff",
                                    fontWeight: 600,
                                    cursor: creando ? "default" : "pointer",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {creando ? "Creando..." : "＋ Crear año"}
                            </button>
                        </div>

                        {error && (
                            <div
                                style={{
                                    marginTop: 16,
                                    padding: 12,
                                    borderRadius: 10,
                                    background: "#fef2f2",
                                    color: "#b91c1c",
                                    fontSize: 14,
                                }}
                            >
                                {error}
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 16,
                            padding: 24,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 6,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "#111827",
                                }}
                            >
                                Años disponibles
                            </div>

                            <button
                                type="button"
                                onClick={cargarAnios}
                                disabled={cargando}
                                style={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 9,
                                    background: "#ffffff",
                                    padding: "7px 10px",
                                    cursor: cargando ? "default" : "pointer",
                                    fontSize: 16,
                                }}
                                title="Actualizar"
                            >
                                ↻
                            </button>
                        </div>

                        <div
                            style={{
                                fontSize: 14,
                                color: "#6b7280",
                            }}
                        >
                            {cargando
                                ? "Cargando..."
                                : `${anios.length} ${anios.length === 1 ? "ejercicio disponible" : "ejercicios disponibles"
                                }`}
                        </div>
                    </div>
                </div>

                {!cargando && anios.length > 0 && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(220px, 1fr))",
                            gap: 16,
                        }}
                    >
                        {anios.map((anio) => (
                            <div
                                key={anio}
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 16,
                                    padding: 20,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: 12,
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 26,
                                                fontWeight: 700,
                                                color: "#111827",
                                                marginBottom: 5,
                                            }}
                                        >
                                            {anio}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: 14,
                                                color: "#6b7280",
                                            }}
                                        >
                                            Cuotas {anio}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleEliminarAnio(anio)}
                                        disabled={eliminando === anio || anios.length <= 1}
                                        title={
                                            anios.length <= 1
                                                ? "No puedes eliminar el último año"
                                                : `Eliminar ${anio}`
                                        }
                                        style={{
                                            border: "1px solid #fecaca",
                                            borderRadius: 9,
                                            background: "#fff",
                                            color: "#dc2626",
                                            padding: "7px 9px",
                                            cursor:
                                                eliminando === anio || anios.length <= 1
                                                    ? "default"
                                                    : "pointer",
                                            opacity:
                                                eliminando === anio || anios.length <= 1
                                                    ? 0.45
                                                    : 1,
                                            fontSize: 15,
                                        }}
                                    >
                                        {eliminando === anio ? "…" : "🗑️"}
                                    </button>
                                </div>

                                <div
                                    style={{
                                        fontSize: 14,
                                        color: "#6b7280",
                                    }}
                                >
                                    Cuotas {anio}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}