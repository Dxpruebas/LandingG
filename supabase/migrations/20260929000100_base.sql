-- =====================================================================
-- Base: esquema privado y utilidades comunes.
-- El esquema "privado" no queda expuesto por la API de Supabase: ahí van
-- las funciones internas que usan las reglas de seguridad (RLS).
-- =====================================================================

create schema if not exists privado;
grant usage on schema privado to authenticated, anon, service_role;

-- Actualiza la columna updated_at en cada UPDATE.
create or replace function privado.poner_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
