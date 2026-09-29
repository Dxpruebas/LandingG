-- =====================================================================
-- Almacenamiento de archivos (Supabase Storage).
--
-- Dos carpetas ("buckets"):
--   archivos → privado: fotos de productos, creativos y videos.
--   publico  → público: imágenes de las landings publicadas (las ven los
--              compradores sin iniciar sesión).
-- Dentro de cada bucket, la primera carpeta es el id de la marca:
--   {marca_id}/productos/{producto_id}/foto-1.webp
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('archivos', 'archivos', false, 104857600,
    array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'application/zip']),
  ('publico', 'publico', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

-- Extrae el id de la marca de la ruta del archivo (null si no es válido).
create or replace function privado.marca_de_ruta(p_nombre text)
returns uuid
language sql
stable
set search_path = ''
as $$
  select case
    when (storage.foldername(p_nombre))[1]
      ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then ((storage.foldername(p_nombre))[1])::uuid
  end;
$$;

grant execute on function privado.marca_de_ruta(text) to authenticated, service_role;

create policy "archivos: miembros ven los de su marca"
  on storage.objects for select to authenticated
  using (
    bucket_id in ('archivos', 'publico')
    and privado.es_miembro(privado.marca_de_ruta(name))
  );

create policy "archivos: editores suben a su marca"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('archivos', 'publico')
    and privado.puede_editar(privado.marca_de_ruta(name))
  );

create policy "archivos: editores reemplazan en su marca"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('archivos', 'publico')
    and privado.puede_editar(privado.marca_de_ruta(name))
  )
  with check (
    bucket_id in ('archivos', 'publico')
    and privado.puede_editar(privado.marca_de_ruta(name))
  );

create policy "archivos: editores borran en su marca"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('archivos', 'publico')
    and privado.puede_editar(privado.marca_de_ruta(name))
  );
