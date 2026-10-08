import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://my-portfolio-ashen-nu-70.vercel.app/sitemap.xml",
  };
}
