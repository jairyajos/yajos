import type { MetadataRoute } from "next";
import { ES_PRODUCCION, URL_SITIO } from "@/lib/sitio";

// En producción se declara explícitamente el acceso de los rastreadores de IA (AWD, capa b).
const RASTREADORES_IA = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  if (!ES_PRODUCCION) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...RASTREADORES_IA.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
