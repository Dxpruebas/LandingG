import {
  Coins,
  FlaskConical,
  House,
  LifeBuoy,
  Megaphone,
  Package,
  Plug,
  Settings,
  ShoppingBag,
  SquarePlus,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  key:
    | "home"
    | "newProduct"
    | "products"
    | "orders"
    | "creativeTests"
    | "campaigns"
    | "integrations"
    | "credits"
    | "settings"
    | "help";
  href: string;
  icon: LucideIcon;
}

// Menú de la app, en el orden del menú lateral.
export const appNav: NavItem[] = [
  { key: "home", href: "/app", icon: House },
  { key: "newProduct", href: "/app/nuevo-producto", icon: SquarePlus },
  { key: "products", href: "/app/productos", icon: Package },
  { key: "orders", href: "/app/pedidos", icon: ShoppingBag },
  { key: "creativeTests", href: "/app/pruebas", icon: FlaskConical },
  { key: "campaigns", href: "/app/campanas", icon: Megaphone },
  { key: "integrations", href: "/app/integraciones", icon: Plug },
  { key: "credits", href: "/app/creditos", icon: Coins },
  { key: "settings", href: "/app/ajustes", icon: Settings },
  { key: "help", href: "/app/ayuda", icon: LifeBuoy },
];

// Secciones que van en la barra inferior del celular; el resto va en "Más".
export const bottomNavKeys: NavItem["key"][] = ["home", "products", "newProduct", "orders"];

export function isActivePath(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}
