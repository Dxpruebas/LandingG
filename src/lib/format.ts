// Formatos de números según el idioma (es: 2.000 · en: 2,000).
export function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US").format(value);
}
