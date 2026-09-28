import { getTranslations } from "next-intl/server";
import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Logo } from "@/components/app-shell/logo";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("title"), robots: { index: false } };
}

// Panel de administrador (solo el dueño). Se construye y protege en la fase 4.
export default async function AdminPage() {
  const t = await getTranslations();

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex h-16 items-center border-b bg-card px-4 lg:px-8">
        <Logo href="/admin" />
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:px-8">
        <PageHeader title={t("admin.title")} description={t("admin.subtitle")} />
        <EmptyState icon={ShieldCheck} title={t("placeholder.comingInPhase", { phase: 4 })} />
      </main>
    </div>
  );
}
