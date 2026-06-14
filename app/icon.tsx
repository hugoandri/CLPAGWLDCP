import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon generado: "DG" sobre degradado verde→azul.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0BA14A 0%, #0C1E33 100%)",
          color: "white",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: -1,
          borderRadius: 7,
        }}
      >
        DG
      </div>
    ),
    { ...size },
  );
}
