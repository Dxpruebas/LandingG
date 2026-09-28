import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app-shell/logo";

// Home provisional. El sitio público completo se construye en la fase 12.
export default async function HomePage() {
  const t = await getTranslations("marketing");

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-16 items-center px-4 sm:px-8">
        <Logo />
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16 sm:px-8">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
          {t("tagline")}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">{t("description")}</p>
        <div className="mt-8">
          <Button size="lg" render={<Link href="/app" />} nativeButton={false}>
            {t("openApp")}
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </main>
      <footer className="px-4 py-6 text-sm text-muted-foreground sm:px-8">{t("notice")}</footer>
    </div>
  );
}
