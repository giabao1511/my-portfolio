import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export default async function Image(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name") || "Chau Gia Bao";
  const title = searchParams.get("title") || "Software Engineer";
  const tags = searchParams.get("tags")?.split(",") || ["Next.js", "TypeScript", "Microservices"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow effects */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "20%",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {/* Logo/Initials */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              border: "2px solid #06b6d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "32px",
              boxShadow: "0 0 30px rgba(6, 182, 212, 0.3)",
            }}
          >
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#06b6d4",
              }}
            >
              GB
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#fafafa",
              marginBottom: "8px",
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </h1>

          {/* Title */}
          <p
            style={{
              fontSize: "28px",
              color: "#06b6d4",
              marginBottom: "32px",
              fontWeight: 500,
            }}
          >
            {title}
          </p>

          {/* Tech tags */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "600px",
            }}
          >
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(39, 39, 42, 0.8)",
                  border: "1px solid #3f3f46",
                  color: "#a1a1aa",
                  fontSize: "18px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
