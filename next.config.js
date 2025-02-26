/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    siteTitle: "Hyper Recent",
    siteDescription: ``,
    xHandle: "@",
    contactEmail: "",
    themeColor: "#fff",
    backgroundColor: "#fff",
    dbUrl: process.env.backend || "http://localhost:3000",
    frontendUrl: process.env.frontend || "http://localhost:3000",
  },
  images: {
    domains: ["146.190.249.127, localhost", "backend"],
  },
};

module.exports = nextConfig;
