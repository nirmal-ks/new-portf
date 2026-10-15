import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nirmal Saravanan — Robotics & Full Stack Engineer",
    short_name: "Nirmal.MK",
    description: "Portfolio of Nirmal Saravanan, Robotics, Embedded & Full Stack Engineer.",
    start_url: "/",
    display: "standalone",
    background_color: "#080609",
    theme_color: "#080609",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
