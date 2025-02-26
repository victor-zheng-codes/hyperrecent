import type { Metadata } from "next";

export function generateMetaObj(data: {
  title?: string;
  description?: string;
  image?: string;
}): Metadata {
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      ...(data.image && { images: data.image }),
    },
    twitter: {
      title: data.title,
      description: data.description,
      ...(data.image && { images: data.image }),
      creator: process.env.xHandle,
      site: process.env.xSite,
    },
  };
}
