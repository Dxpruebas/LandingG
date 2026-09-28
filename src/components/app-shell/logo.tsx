import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 rounded-lg font-heading text-lg font-bold tracking-tight", className)}
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-lg bg-primary text-base font-extrabold text-primary-foreground"
      >
        {siteConfig.name.charAt(0)}
      </span>
      {siteConfig.name}
    </Link>
  );
}
