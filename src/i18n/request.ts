import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { siteConfig, type Locale } from "@/config/site";

export const LOCALE_COOKIE = "NEXT_LOCALE";

function isLocale(value: string | undefined): value is Locale {
  return siteConfig.locales.includes(value as Locale);
}

// El idioma se lee de una cookie (más adelante, de los ajustes del usuario).
export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : siteConfig.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
