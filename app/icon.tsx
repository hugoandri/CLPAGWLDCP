import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: icono de DataGoal (balón verde con trayectoria ámbar).
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
          borderRadius: 7,
        }}
      >
        <svg viewBox="0 0 64 64" width="28" height="28" fill="none">
          <path d="M16 49 Q39 43 51 15" stroke="#F5A623" strokeWidth="3.6" strokeLinecap="round" strokeDasharray="0.1 7.5" />
          <circle cx="51" cy="14" r="4" fill="#F5A623" />
          <circle cx="18" cy="46" r="12" fill="#2FB85C" />
          <polygon points="18,40 23.5,44 21.5,50.5 14.5,50.5 12.5,44" fill="#0A0F14" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
