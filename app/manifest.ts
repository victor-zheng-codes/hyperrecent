import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.siteTitle || "",
    short_name: process.env.siteTitle || "",
    description: process.env.siteDescription || "",
    start_url: "/",
    display: "standalone",
    background_color: process.env.backgroundColor || "#fff",
    theme_color: process.env.themeColor || "#fff",
  };
}
