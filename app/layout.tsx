import "./_styles/main.scss";

import clsx from "clsx";
import { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { PostsProvider } from "./context";
import NextTopLoader from "nextjs-toploader";
import fs from "fs";
import path from "path";

const title = process.env.siteTitle;
const description = process.env.siteDescription;
const xHandle = process.env.xHandle;

// Read build info from the generated file (build-info.json)
let buildInfo: BuildInfo = { commitHash: "", buildTime: "" };
try {
  const buildInfoFilePath = path.resolve("./public/build-info.json");
  if (fs.existsSync(buildInfoFilePath)) {
    buildInfo = JSON.parse(fs.readFileSync(buildInfoFilePath, "utf8"));
  }
} catch (error) {
  console.error("Error reading build info:", error);
}

// Define the structure of the buildInfo object
interface BuildInfo {
  commitHash: string;
  buildTime: string;
}

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: title,
    type: "website",
  },
  twitter: {
    title,
    site: xHandle,
    creator: xHandle,
    description,
    card: "summary_large_image",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={clsx(inter.variable)}>
      <head>
        {/* Inject build information as meta tags */}
        {buildInfo.commitHash && (
          <meta name="commit-hash" content={buildInfo.commitHash} />
        )}
        {buildInfo.buildTime && (
          <meta name="build-time" content={buildInfo.buildTime} />
        )}
      </head>
      <body
        className="flex flex-col"
        style={{
          minHeight: "100vh",
        }}
      >
        <NextTopLoader />

        <PostsProvider>
          <Header />

          <main className="relative flex w-full grow flex-col overflow-hidden">
            {children}
          </main>

          <Footer />
        </PostsProvider>
      </body>
    </html>
  );
}
