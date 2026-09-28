import type messages from "../messages/es.json";

// Hace que TypeScript avise si se usa una traducción que no existe.
declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
  }
}
