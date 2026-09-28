import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";

// Barra superior: saldo de créditos, "Recargar" y menú de la cuenta.
// `credits` es null mientras no exista el sistema de créditos (fase 4).
export async function AppTopbar({ credits, initials }: { credits: number | null; initials: string }) {
  const t = await getTranslations("topbar");
  const locale = await getLocale();
  const creditsText = credits === null ? "—" : formatNumber(credits, locale);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur lg:px-8">
      <Logo href="/app" className="lg:hidden" />
      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/app/creditos"
          aria-label={t("creditsLabel", { amount: creditsText })}
          className="flex h-10 items-center gap-2 rounded-full border bg-background px-3 text-sm font-semibold tabular-nums transition-colors duration-150 hover:bg-muted"
        >
          <Coins className="size-4 text-primary" aria-hidden />
          {creditsText}
        </Link>
        <Button render={<Link href="/app/creditos" />} nativeButton={false} className="hidden sm:inline-flex">
          {t("recharge")}
        </Button>
        <UserMenu initials={initials} />
      </div>
    </header>
  );
}
