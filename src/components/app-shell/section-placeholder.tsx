import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import type { NavItem } from "@/config/navigation";

type SectionKey = Exclude<NavItem["key"], "home">;

// Página provisional para las secciones que se construyen en fases siguientes.
export async function SectionPlaceholder({ section, phase }: { section: SectionKey; phase: number }) {
  const tNav = await getTranslations("nav");
  const tSections = await getTranslations("sections");
  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={tNav(section)} description={tSections(section)} />
      <EmptyState
        icon={Construction}
        title={t("placeholder.comingInPhase", { phase })}
        action={
          <Button variant="outline" render={<Link href="/app" />} nativeButton={false}>
            {t("common.backHome")}
          </Button>
        }
      />
    </div>
  );
}

export async function sectionMetadata(section: SectionKey) {
  const tNav = await getTranslations("nav");
  return { title: tNav(section) };
}
