import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { AppTopbar } from "@/components/app-shell/app-topbar";
import { BottomNav } from "@/components/app-shell/bottom-nav";

// Marco de la app del usuario. Los datos reales (créditos, usuario) llegan
// en las fases 3 y 4.
export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="min-h-dvh bg-background">
      <AppSidebar className="fixed inset-y-0 left-0 hidden w-64 lg:flex" />
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <AppTopbar credits={null} initials="—" />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>
      <BottomNav className="lg:hidden" />
    </div>
  );
}
