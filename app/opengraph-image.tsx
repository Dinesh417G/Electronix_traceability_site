import { ImageResponse } from "next/og";

export const alt =
  "ElectronIx Trace — product traceability software for manufacturing plants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E1013",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: "#FF6B1A",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700 }}>
            <span style={{ color: "#F2F4F7" }}>Electron</span>
            <span style={{ color: "#FF6B1A" }}>Ix</span>
            <span style={{ color: "#9BA3AF", marginLeft: 12 }}>Trace</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              lineHeight: 1.1,
              color: "#F2F4F7",
              fontWeight: 700,
              letterSpacing: -1.5,
              maxWidth: 960,
              display: "flex",
            }}
          >
            Know exactly which units are affected. Then prove it.
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#9BA3AF",
              marginTop: 26,
              maxWidth: 900,
              display: "flex",
            }}
          >
            Per-unit traceability for manufacturing plants. On-premise, offline-first.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 20,
            color: "#838C99",
            borderTop: "1px solid #262B34",
            paddingTop: 26,
          }}
        >
          <span>Coimbatore, India</span>
          <span>·</span>
          <span>Rust and PostgreSQL</span>
          <span>·</span>
          <span>Quoted per plant</span>
        </div>
      </div>
    ),
    size,
  );
}
