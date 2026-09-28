import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseConfig } from "./config";

// Cliente de Supabase para componentes que corren en el navegador.
export function createClient() {
  const { url, key } = requireSupabaseConfig();
  return createBrowserClient(url, key);
}
