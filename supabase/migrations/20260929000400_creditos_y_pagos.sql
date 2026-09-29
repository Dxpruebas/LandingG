-- =====================================================================
-- Créditos, planes, pagos y cola de generaciones.
--
-- Regla de oro: el saldo NUNCA se edita. Cada entrada o salida de
-- créditos es una fila en movimientos_creditos y el saldo es la suma.
-- Los créditos pertenecen a la cuenta (usuario dueño); cada movimiento
-- guarda además la marca y la persona que lo originó.
-- Las operaciones de reservar / confirmar / reembolsar se crean como
-- funciones atómicas en la fase 4.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Configuración editable desde el panel de administrador
-- ---------------------------------------------------------------------
create table public.precios_acciones (
  accion text primary key check (accion ~ '^[a-z0-9_]+$'),
  nombre text not null,
  creditos integer not null check (creditos >= 0),
  activo boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.planes (
  id text primary key check (id ~ '^[a-z0-9_]+$'),
  nombre text not null,
  precio_mensual_usd numeric(10, 2) not null check (precio_mensual_usd >= 0),
  precio_anual_usd numeric(10, 2) not null check (precio_anual_usd >= 0),
  creditos_mes integer not null check (creditos_mes > 0),
  etiqueta text check (etiqueta in ('mas_popular', 'mejor_valor')),
  orden smallint not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.packs (
  id text primary key check (id ~ '^[a-z0-9_]+$'),
  nombre text not null,
  precio_usd numeric(10, 2) not null check (precio_usd >= 0),
  creditos integer not null check (creditos > 0),
  orden smallint not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- suscripciones y pagos (la pasarela llega en la fase 13)
-- ---------------------------------------------------------------------
create table public.suscripciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  plan_id text not null references public.planes (id),
  -- Plan al que baja en la próxima renovación (bajar de plan).
  plan_siguiente_id text references public.planes (id),
  ciclo text not null check (ciclo in ('mensual', 'anual')),
  estado text not null check (estado in ('pendiente', 'activa', 'cancelada', 'vencida')),
  periodo_inicio timestamptz not null,
  periodo_fin timestamptz not null,
  cancelar_al_final boolean not null default false,
  proveedor text,
  id_externo text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (periodo_fin > periodo_inicio)
);

-- Una sola suscripción activa por cuenta.
create unique index suscripciones_una_activa_idx
  on public.suscripciones (usuario_id) where estado = 'activa';

create table public.pagos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  concepto text not null check (concepto in ('plan', 'pack')),
  plan_id text references public.planes (id),
  pack_id text references public.packs (id),
  monto_usd numeric(10, 2) not null check (monto_usd >= 0),
  estado text not null check (estado in ('pendiente', 'aprobado', 'rechazado', 'reembolsado')),
  proveedor text not null,
  -- id del pago en la pasarela: evita procesar dos veces el mismo aviso.
  id_externo text not null,
  datos jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (proveedor, id_externo),
  check ((concepto = 'plan' and plan_id is not null) or (concepto = 'pack' and pack_id is not null))
);

create index pagos_usuario_idx on public.pagos (usuario_id, created_at desc);

-- ---------------------------------------------------------------------
-- cupones
-- ---------------------------------------------------------------------
create table public.cupones (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique check (codigo ~ '^[A-Z0-9_-]{3,30}$'),
  tipo text not null check (tipo in ('porcentaje', 'creditos')),
  valor integer not null check (valor > 0),
  vence_en timestamptz,
  usos_maximos integer check (usos_maximos > 0),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  check (tipo <> 'porcentaje' or valor <= 100)
);

create table public.cupones_usos (
  cupon_id uuid not null references public.cupones (id) on delete cascade,
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (cupon_id, usuario_id)
);

-- ---------------------------------------------------------------------
-- generaciones: cola de trabajos de IA, con su costo real.
-- ---------------------------------------------------------------------
create table public.generaciones (
  id uuid primary key default gen_random_uuid(),
  -- Cuenta a la que se cobran los créditos.
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  -- Persona que la pidió (en equipos puede ser distinta del dueño).
  realizado_por uuid references public.usuarios (id) on delete set null,
  marca_id uuid not null references public.marcas (id) on delete cascade,
  producto_id uuid references public.productos (id) on delete set null,
  accion text not null references public.precios_acciones (accion),
  origen text not null default 'app' check (origen in ('app', 'api', 'mcp')),
  estado text not null default 'pendiente' check (estado in (
    'pendiente', 'procesando', 'completada', 'fallida', 'reembolsada'
  )),
  creditos integer not null check (creditos >= 0),
  costo_ia_usd numeric(10, 4) not null default 0 check (costo_ia_usd >= 0),
  entrada jsonb not null default '{}',
  resultado jsonb,
  error text,
  intentos smallint not null default 0,
  iniciada_en timestamptz,
  finalizada_en timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index generaciones_cola_idx on public.generaciones (estado, created_at)
  where estado in ('pendiente', 'procesando');
create index generaciones_usuario_idx on public.generaciones (usuario_id, created_at desc);
create index generaciones_marca_idx on public.generaciones (marca_id, created_at desc);

-- ---------------------------------------------------------------------
-- movimientos_creditos: el libro de créditos (solo se agregan filas).
-- cantidad > 0 entra, cantidad < 0 sale.
-- ---------------------------------------------------------------------
create table public.movimientos_creditos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  bolsillo text not null check (bolsillo in ('plan', 'pack')),
  tipo text not null check (tipo in (
    'bienvenida', 'recarga_plan', 'compra_pack', 'regalo_admin', 'cupon',
    'reserva', 'reembolso', 'vencimiento', 'ajuste'
  )),
  cantidad integer not null check (cantidad <> 0),
  marca_id uuid references public.marcas (id) on delete set null,
  realizado_por uuid references public.usuarios (id) on delete set null,
  generacion_id uuid references public.generaciones (id) on delete set null,
  pago_id uuid references public.pagos (id) on delete set null,
  motivo text,
  -- Créditos del plan: hasta cuándo se pueden usar (acumulan máximo 1 mes).
  vence_en timestamptz,
  created_at timestamptz not null default now(),
  check (tipo not in ('regalo_admin', 'ajuste') or motivo is not null),
  check (tipo <> 'reserva' or (cantidad < 0 and generacion_id is not null)),
  check (tipo <> 'reembolso' or (cantidad > 0 and generacion_id is not null))
);

create index movimientos_usuario_idx on public.movimientos_creditos (usuario_id, created_at desc);
create index movimientos_generacion_idx on public.movimientos_creditos (generacion_id)
  where generacion_id is not null;

-- Un reembolso por generación y bolsillo (evita devolver dos veces).
create unique index movimientos_un_reembolso_idx
  on public.movimientos_creditos (generacion_id, bolsillo) where tipo = 'reembolso';

-- Saldo por cuenta (respeta las reglas RLS de quien consulta).
create view public.saldos_creditos
with (security_invoker = true) as
select
  usuario_id,
  coalesce(sum(cantidad) filter (where bolsillo = 'plan'), 0)::integer as saldo_plan,
  coalesce(sum(cantidad) filter (where bolsillo = 'pack'), 0)::integer as saldo_pack,
  coalesce(sum(cantidad), 0)::integer as saldo_total
from public.movimientos_creditos
group by usuario_id;

-- ---------------------------------------------------------------------
-- claves_api: para la API y el servidor MCP. Se guarda solo la huella
-- (hash) de la clave, nunca la clave completa.
-- ---------------------------------------------------------------------
create table public.claves_api (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 60),
  -- Primeros caracteres visibles para reconocerla (ej. "vk_live_ab12").
  prefijo text not null,
  hash text not null unique,
  ultimo_uso_en timestamptz,
  revocada_en timestamptz,
  created_at timestamptz not null default now()
);

create index claves_api_usuario_idx on public.claves_api (usuario_id);

-- ---------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'precios_acciones', 'planes', 'packs', 'suscripciones', 'pagos', 'generaciones'
  ] loop
    execute format(
      'create trigger %1$I_updated_at before update on public.%1$I
         for each row execute function privado.poner_updated_at()', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Seguridad (RLS)
-- Escrituras de dinero y créditos: solo desde el servidor o funciones
-- atómicas (fase 4). El navegador únicamente lee lo suyo.
-- ---------------------------------------------------------------------
alter table public.precios_acciones enable row level security;
alter table public.planes enable row level security;
alter table public.packs enable row level security;
alter table public.suscripciones enable row level security;
alter table public.pagos enable row level security;
alter table public.cupones enable row level security;
alter table public.cupones_usos enable row level security;
alter table public.generaciones enable row level security;
alter table public.movimientos_creditos enable row level security;
alter table public.claves_api enable row level security;

-- Precios, planes y packs: públicos (se muestran en la página de precios).
create policy "precios_acciones: lectura pública"
  on public.precios_acciones for select to anon, authenticated using (true);
create policy "planes: lectura pública"
  on public.planes for select to anon, authenticated using (activo);
create policy "packs: lectura pública"
  on public.packs for select to anon, authenticated using (activo);

create policy "suscripciones: ver las propias"
  on public.suscripciones for select to authenticated
  using (usuario_id = (select auth.uid()));

create policy "pagos: ver los propios"
  on public.pagos for select to authenticated
  using (usuario_id = (select auth.uid()));

create policy "cupones_usos: ver los propios"
  on public.cupones_usos for select to authenticated
  using (usuario_id = (select auth.uid()));

create policy "generaciones: ver las de mis marcas"
  on public.generaciones for select to authenticated
  using (usuario_id = (select auth.uid()) or privado.es_miembro(marca_id));

create policy "movimientos: ver los propios"
  on public.movimientos_creditos for select to authenticated
  using (usuario_id = (select auth.uid()));

create policy "claves_api: ver las propias"
  on public.claves_api for select to authenticated
  using (usuario_id = (select auth.uid()));

create policy "claves_api: crear propias"
  on public.claves_api for insert to authenticated
  with check (usuario_id = (select auth.uid()));

create policy "claves_api: revocar propias"
  on public.claves_api for update to authenticated
  using (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));

revoke update on public.claves_api from anon, authenticated;
grant update (nombre, revocada_en) on public.claves_api to authenticated;

-- Defensa extra: el navegador no puede escribir en estas tablas aunque
-- alguien agregue una regla por error.
revoke insert, update, delete on
  public.precios_acciones, public.planes, public.packs, public.suscripciones,
  public.pagos, public.cupones, public.cupones_usos, public.generaciones,
  public.movimientos_creditos
from anon, authenticated;

-- Los compradores anónimos no leen nada más que lo público.
revoke select on public.cupones from anon, authenticated;
