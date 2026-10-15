import { ImageResponse } from "next/og";
import { profile } from "@/lib/profile";

export const alt = "Nirmal Saravanan — Robotics, Embedded & Full Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGS = ["ROS 2", "SLAM", "Unitree", "Raspberry Pi", "STM32", "Next.js", "TypeScript"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(circle at 15% 20%, #4a0a12 0%, #080609 55%), #080609",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#00f0ff", fontSize: 24, letterSpacing: 4 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#00f0ff", boxShadow: "0 0 24px #00f0ff" }} />
          OPEN TO OPPORTUNITIES · CHENNAI, INDIA
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2, color: "#ffffff" }}>{profile.name}</div>
          <div style={{ fontSize: 40, fontWeight: 600, color: "#fbbf24", marginTop: 8 }}>{profile.title}</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {TAGS.map((t) => (
            <div
              key={t}
              style={{
                padding: "10px 22px",
                borderRadius: 10,
                border: "2px solid rgba(251,191,36,0.5)",
                background: "rgba(220,38,38,0.18)",
                color: "#fde68a",
                fontSize: 26,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
