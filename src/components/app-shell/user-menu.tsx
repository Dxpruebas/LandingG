"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { CreditCard, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menú del avatar. "Cerrar sesión" se conecta en la fase 3 (login).
export function UserMenu({ initials }: { initials: string }) {
  const t = useTranslations("topbar");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("accountMenu")}
        className="grid size-10 place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem className="py-2.5" render={<Link href="/app/ajustes" />}>
          <UserRound aria-hidden />
          {t("profile")}
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2.5" render={<Link href="/app/creditos" />}>
          <CreditCard aria-hidden />
          {t("billing")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-2.5" disabled>
          <LogOut aria-hidden />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
