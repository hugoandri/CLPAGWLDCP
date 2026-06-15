import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = "DataGoal Lab — El Mundial 2026 en datos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen Open Graph por defecto para compartir en redes.
// Nota: el renderizador (Satori) exige display:flex en todo div con >1 hijo.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 80% 0%, #0BA14A33, transparent 55%), linear-gradient(135deg, #0A1726 0%, #0C1E33 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #0BA14A, #067A37)",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            DG
          </div>
          <div style={{ display: "flex", gap: 10, fontSize: 30, fontWeight: 700 }}>
            <span>DataGoal Lab</span>
            <span style={{ color: "#F2B705" }}>2026</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            El Mundial 2026,
          </div>
          <div
            style={{
              fontSize: 66,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#3FBF6F",
            }}
          >
            explicado con datos.
          </div>
          <div style={{ marginTop: 18, fontSize: 30, color: "#9FB0C3" }}>
            Partidos · tablas · predicciones · calculadora
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#6B7E93" }}>
          {siteConfig.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
