import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Package, Plug, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata() {
  const t = await getTranslations("home");
  return { title: t("title") };
}

// Inicio de la app. Las cifras muestran "—" hasta tener datos reales.
export default async function AppHomePage() {
  const t = await getTranslations("home");

  const stats = [
    { label: t("stats.landings"), value: "—" },
    { label: t("stats.ordersMonth"), value: "—" },
    { label: t("stats.credits"), value: "—" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Button size="lg" render={<Link href="/app/nuevo-producto" />} nativeButton={false}>
            <Plus aria-hidden />
            {t("newProduct")}
          </Button>
        }
      />

      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((stat) => (
          <li key={stat.label} className="min-w-0">
            <Card className="h-full">
              <CardContent className="px-3 sm:px-4">
                <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                <p className="mt-1 font-heading text-2xl font-bold tabular-nums sm:text-3xl">{stat.value}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-accent p-5 sm:flex-row sm:items-center">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-card text-primary">
          <Plug className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading font-semibold text-accent-foreground">{t("dropiTitle")}</h2>
          <p className="text-sm text-pretty text-accent-foreground/80">{t("dropiText")}</p>
        </div>
        <Button variant="outline" render={<Link href="/app/integraciones" />} nativeButton={false}>
          {t("dropiAction")}
        </Button>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">{t("recentTitle")}</h2>
        <EmptyState
          icon={Package}
          title={t("recentEmptyTitle")}
          description={t("recentEmptyText")}
          action={
            <Button render={<Link href="/app/nuevo-producto" />} nativeButton={false}>
              <Plus aria-hidden />
              {t("newProduct")}
            </Button>
          }
        />
      </section>
    </div>
  );
}
