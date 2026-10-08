import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse at center, #18181b 0%, #09090b 70%)",
      }}
    >
      {/* Name */}
      <div
        style={{
          fontSize: 72,
          fontStyle: "normal",
          fontWeight: 700,
          color: "#fafafa",
          letterSpacing: "-0.02em",
          marginBottom: 8,
        }}
      >
        Chau Gia Bao
      </div>

      {/* Role */}
      <div
        style={{
          fontSize: 32,
          fontStyle: "normal",
          fontWeight: 500,
          color: "#06b6d4",
          letterSpacing: "0.02em",
          marginBottom: 48,
        }}
      >
        Software Engineer
      </div>

      {/* Divider */}
      <div
        style={{
          width: 200,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #06b6d4, transparent)",
          marginBottom: 48,
        }}
      />

      {/* Stats Row */}
      <div
        style={{
          display: "flex",
          gap: 64,
          alignItems: "center",
        }}
      >
        <Stat label="Experience" value="5+ Years" />
        <Stat label="Latency" value="<50ms" />
        <Stat label="Scale" value="10K+ SKUs" />
      </div>

      {/* Domain Tags */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 40,
        }}
      >
        <Tag>B2B SaaS</Tag>
        <Tag>E-Commerce</Tag>
        <Tag>FinTech</Tag>
      </div>

      {/* URL */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          fontSize: 18,
          color: "#71717a",
          letterSpacing: "0.05em",
        }}
      >
        giabao.dev
      </div>
    </div>,
    {
      ...size,
    },
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontStyle: "normal",
          fontWeight: 700,
          color: "#fafafa",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 16,
          fontStyle: "normal",
          fontWeight: 500,
          color: "#a1a1aa",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "8px 16px",
        borderRadius: 8,
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        border: "1px solid #06b6d4",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: 500,
        color: "#06b6d4",
        letterSpacing: "0.05em",
      }}
    >
      {children}
    </div>
  );
}
