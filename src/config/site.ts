// Datos generales del producto. El nombre es temporal: cámbialo solo aquí.
export const siteConfig = {
  name: "Vendra",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  defaultLocale: "es",
  locales: ["es", "en"],
} as const;

export type Locale = (typeof siteConfig.locales)[number];
