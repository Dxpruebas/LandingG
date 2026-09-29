-- =====================================================================
-- Cuentas y marcas: usuarios, marcas y miembros de cada marca.
-- Regla general: cada usuario solo ve los datos de las marcas de las que
-- es miembro. Una cuenta nueva recibe automáticamente su primera marca.
-- =====================================================================

-- ---------------------------------------------------------------------
-- usuarios: perfil de cada cuenta (1 a 1 con auth.users).
-- ---------------------------------------------------------------------
create table public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  nombre text,
  avatar_url text,
  pais text not null default 'CO' check (pais ~ '^[A-Z]{2}$'),
  tipo_negocio text check (tipo_negocio in ('dropi', 'marca_propia', 'ambos')),
  idioma text not null default 'es' check (idioma in ('es', 'en')),
  onboarding_completado boolean not null default false,
  acepto_terminos_en timestamptz,
  es_admin boolean not null default false,
  bloqueado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.usuarios is 'Perfil de cada cuenta. es_admin y bloqueado solo los cambia el servidor.';

create trigger usuarios_updated_at
  before update on public.usuarios
  for each row execute function privado.poner_updated_at();

-- ---------------------------------------------------------------------
-- marcas: cada tienda/marca del usuario. El slug forma la URL pública
-- de las landings: /{marca}/{producto}.
-- ---------------------------------------------------------------------
create table public.marcas (
  id uuid primary key default gen_random_uuid(),
  propietario_id uuid not null references public.usuarios (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 80),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 40)
    check (slug not in (
      'app', 'admin', 'api', 'auth', 'login', 'registro', 'onboarding', 'install',
      'privacidad', 'terminos', 'reembolsos', 'contacto', 'precios', 'ayuda', 'blog'
    )),
  logo_url text,
  color_primario text check (color_primario ~ '^#[0-9a-fA-F]{6}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index marcas_propietario_idx on public.marcas (propietario_id);

create trigger marcas_updated_at
  before update on public.marcas
  for each row execute function privado.poner_updated_at();

-- ---------------------------------------------------------------------
-- miembros_marca: quién tiene acceso a cada marca y con qué rol.
-- ---------------------------------------------------------------------
create table public.miembros_marca (
  marca_id uuid not null references public.marcas (id) on delete cascade,
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  rol text not null check (rol in ('dueno', 'editor', 'lectura')),
  created_at timestamptz not null default now(),
  primary key (marca_id, usuario_id)
);

create index miembros_marca_usuario_idx on public.miembros_marca (usuario_id);

-- ---------------------------------------------------------------------
-- Funciones de permisos (usadas por las reglas RLS).
-- security definer: consultan miembros_marca sin quedar atrapadas en sus
-- propias reglas.
-- ---------------------------------------------------------------------
create or replace function privado.es_miembro(p_marca_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.miembros_marca
    where marca_id = p_marca_id and usuario_id = (select auth.uid())
  );
$$;

create or replace function privado.puede_editar(p_marca_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.miembros_marca
    where marca_id = p_marca_id
      and usuario_id = (select auth.uid())
      and rol in ('dueno', 'editor')
  );
$$;

create or replace function privado.es_dueno(p_marca_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.miembros_marca
    where marca_id = p_marca_id
      and usuario_id = (select auth.uid())
      and rol = 'dueno'
  );
$$;

revoke all on function privado.es_miembro(uuid), privado.puede_editar(uuid), privado.es_dueno(uuid) from public;
grant execute on function privado.es_miembro(uuid), privado.puede_editar(uuid), privado.es_dueno(uuid)
  to authenticated, service_role;

-- ---------------------------------------------------------------------
-- Automatismos
-- ---------------------------------------------------------------------

-- Quien crea una marca queda como dueño.
create or replace function privado.agregar_dueno_marca()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.miembros_marca (marca_id, usuario_id, rol)
  values (new.id, new.propietario_id, 'dueno');
  return new;
end;
$$;

create trigger marcas_agregar_dueno
  after insert on public.marcas
  for each row execute function privado.agregar_dueno_marca();

-- Cuenta nueva en Auth → perfil + primera marca ("Mi marca").
create or replace function privado.crear_cuenta_nueva()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.usuarios (id, email, nombre, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.marcas (propietario_id, nombre, slug)
  values (new.id, 'Mi marca', 'marca-' || substr(replace(new.id::text, '-', ''), 1, 10));

  return new;
end;
$$;

create trigger auth_crear_cuenta_nueva
  after insert on auth.users
  for each row execute function privado.crear_cuenta_nueva();

-- ---------------------------------------------------------------------
-- Seguridad (RLS)
-- ---------------------------------------------------------------------
alter table public.usuarios enable row level security;
alter table public.marcas enable row level security;
alter table public.miembros_marca enable row level security;

-- usuarios: cada uno ve y edita solo su perfil. Los perfiles de los
-- compañeros de marca se consultarán desde el servidor (fase 11).
create policy "usuarios: ver el propio"
  on public.usuarios for select to authenticated
  using (id = (select auth.uid()));

create policy "usuarios: editar el propio"
  on public.usuarios for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- El usuario solo puede cambiar estas columnas (no es_admin, bloqueado ni email).
revoke insert, update, delete on public.usuarios from anon, authenticated;
grant update (nombre, avatar_url, pais, tipo_negocio, idioma, onboarding_completado, acepto_terminos_en)
  on public.usuarios to authenticated;

-- marcas
create policy "marcas: ver si es miembro"
  on public.marcas for select to authenticated
  using (propietario_id = (select auth.uid()) or privado.es_miembro(id));

create policy "marcas: crear propias"
  on public.marcas for insert to authenticated
  with check (propietario_id = (select auth.uid()));

create policy "marcas: editar si es editor o dueño"
  on public.marcas for update to authenticated
  using (privado.puede_editar(id))
  with check (privado.puede_editar(id));

create policy "marcas: borrar si es dueño"
  on public.marcas for delete to authenticated
  using (privado.es_dueno(id));

-- El propietario de una marca no se puede cambiar desde el navegador.
revoke update on public.marcas from anon, authenticated;
grant update (nombre, slug, logo_url, color_primario) on public.marcas to authenticated;

-- miembros_marca: ver a los compañeros; solo el dueño gestiona el equipo.
create policy "miembros: ver los de mis marcas"
  on public.miembros_marca for select to authenticated
  using (privado.es_miembro(marca_id));

create policy "miembros: el dueño agrega"
  on public.miembros_marca for insert to authenticated
  with check (privado.es_dueno(marca_id));

create policy "miembros: el dueño cambia roles"
  on public.miembros_marca for update to authenticated
  using (privado.es_dueno(marca_id))
  with check (privado.es_dueno(marca_id));

create policy "miembros: el dueño quita"
  on public.miembros_marca for delete to authenticated
  using (privado.es_dueno(marca_id) and usuario_id <> (select auth.uid()));
