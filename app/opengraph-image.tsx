import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#0a090b",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(74,22,38,0.55), transparent 62%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(42,20,32,0.5), transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#e8c9ab",
            marginBottom: 28,
          }}
        >
          Montréal
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 500,
            color: "#f4efe8",
            letterSpacing: 2,
          }}
        >
          Elite One Spa
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "rgba(244,239,232,0.7)",
            marginTop: 30,
          }}
        >
          Expérience Sensuelle Haut de Gamme
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
