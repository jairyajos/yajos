// Mientras SITE_ENV no sea "production", todo el sitio es staging: noindex y robots cerrado
// (protocolo de 04-baseline-antes-despues.md). El default seguro es staging.
export const ES_PRODUCCION = process.env.SITE_ENV === "production";
export const URL_SITIO = process.env.SITE_URL ?? "https://yajos.com.mx";
