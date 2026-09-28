"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Ellipsis, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { appNav, bottomNavKeys, isActivePath, type NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

const shortLabels: Partial<Record<NavItem["key"], "productsShort" | "newShort">> = {
  products: "productsShort",
  newProduct: "newShort",
};

// Barra inferior (solo celular): lo más usado a un toque, el resto en "Más".
export function BottomNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainItems = bottomNavKeys.map((key) => appNav.find((item) => item.key === key)!);
  const moreItems = appNav.filter((item) => !bottomNavKeys.includes(item.key));
  const isMoreActive = moreItems.some((item) => isActivePath(pathname, item.href));

  return (
    <nav
      aria-label={t("main")}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur",
        className,
      )}
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-5">
        {mainItems.map(({ key, href, icon: Icon }) => {
          const isActive = isActivePath(pathname, href);
          const label = t(shortLabels[key] ?? key);

          if (key === "newProduct") {
            return (
              <li key={key} className="grid place-items-center">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className="flex flex-col items-center gap-1 text-xs font-semibold text-primary"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-150 active:scale-95">
                    <Plus className="size-5" aria-hidden />
                  </span>
                  <span className="sr-only">{t("newProduct")}</span>
                </Link>
              </li>
            );
          }

          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors duration-150",
                  isActive && "text-primary",
                )}
              >
                <Icon className="size-[22px]" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            aria-haspopup="dialog"
            className={cn(
              "flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors duration-150",
              isMoreActive && "text-primary",
            )}
          >
            <Ellipsis className="size-[22px]" aria-hidden />
            {t("more")}
          </button>
        </li>
      </ul>

      <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <SheetHeader>
            <SheetTitle>{t("moreTitle")}</SheetTitle>
          </SheetHeader>
          <ul className="grid grid-cols-3 gap-2 px-4">
            {moreItems.map(({ key, href, icon: Icon }) => {
              const isActive = isActivePath(pathname, href);
              return (
                <li key={key}>
                  <Link
                    href={href}
                    onClick={() => setIsMoreOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border bg-card p-3 text-center text-xs font-medium transition-colors duration-150 active:bg-muted",
                      isActive && "border-primary/40 bg-accent text-accent-foreground",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                    {t(key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
