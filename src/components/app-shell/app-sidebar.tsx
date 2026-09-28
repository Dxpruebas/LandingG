"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { appNav, isActivePath } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

// Menú lateral (solo escritorio).
export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <aside className={cn("flex-col border-r bg-sidebar", className)}>
      <div className="flex h-16 items-center px-5">
        <Logo href="/app" />
      </div>
      <nav aria-label={t("main")} className="flex-1 overflow-y-auto px-3 pb-6">
        <ul className="flex flex-col gap-0.5">
          {appNav.map(({ key, href, icon: Icon }) => {
            const isActive = isActivePath(pathname, href);
            return (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground",
                    isActive && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-[18px] shrink-0" aria-hidden />
                  {t(key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
