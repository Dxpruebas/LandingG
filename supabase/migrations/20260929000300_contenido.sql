-- =====================================================================
-- Contenido de cada marca: productos, ángulos, landings, creativos,
-- videos, pruebas, campañas, pedidos, estadísticas e integraciones.
--
-- Todas estas tablas tienen marca_id. Las tablas "hijas" repiten el
-- marca_id del padre y una llave compuesta (padre_id, marca_id) garantiza
-- que siempre coincidan; así las reglas RLS son simples y rápidas.
-- =====================================================================

-- ---------------------------------------------------------------------
-- productos
-- ---------------------------------------------------------------------
create table public.productos (
  id uuid primary key default gen_random_uuid(),
  marca_id uuid not null references public.marcas (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 150),
  -- Parte final de la URL pública: /{marca}/{producto}
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  descripcion_corta text,
  publico_objetivo text,
  precio numeric(12, 2) check (precio >= 0),
  precio_tachado numeric(12, 2) check (precio_tachado >= 0),
  moneda text not null default 'COP' check (moneda ~ '^[A-Z]{3}$'),
  origen text not null check (origen in ('foto', 'link', 'dropi', 'manual')),
  url_origen text,
  dropi_producto_id text,
  -- Resultado del análisis de la IA (características, beneficios, etc.).
  analisis jsonb,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado', 'archivado')),
  creado_por uuid references public.usuarios (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (marca_id, slug),
  unique (id, marca_id)
);

create index productos_marca_idx on public.productos (marca_id, created_at desc);

-- ---------------------------------------------------------------------
-- imagenes_producto: fotos originales (máx. 5 por producto, se valida en la app).
-- ---------------------------------------------------------------------
create table public.imagenes_producto (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null,
  marca_id uuid not null,
  ruta_storage text not null,
  orden smallint not null default 0,
  es_principal boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (producto_id, marca_id) references public.productos (id, marca_id) on delete cascade
);

create index imagenes_producto_producto_idx on public.imagenes_producto (producto_id, orden);

-- ---------------------------------------------------------------------
-- angulos: ángulos de venta generados por la IA.
-- ---------------------------------------------------------------------
create table public.angulos (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null,
  marca_id uuid not null,
  titular text not null,
  dolor text,
  promesa text,
  publico text,
  gancho text,
  etiquetas text[] not null default '{}',
  elegido boolean not null default false,
  orden smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (producto_id, marca_id) references public.productos (id, marca_id) on delete cascade
);

create index angulos_producto_idx on public.angulos (producto_id, orden);

-- ---------------------------------------------------------------------
-- landings: una por variante (A/B) de cada producto.
-- config: estilo, color, secciones activas, oferta (combos), campos del
-- formulario, texto del botón, pixeles, WhatsApp.
-- ---------------------------------------------------------------------
create table public.landings (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null,
  marca_id uuid not null,
  angulo_id uuid references public.angulos (id) on delete set null,
  variante text not null default 'A' check (variante in ('A', 'B')),
  estilo text,
  config jsonb not null default '{}',
  estado text not null default 'borrador'
    check (estado in ('borrador', 'generando', 'lista', 'publicada', 'error')),
  version_actual integer not null default 0,
  publicada_en timestamptz,
  dominio_propio text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (producto_id, marca_id) references public.productos (id, marca_id) on delete cascade,
  unique (producto_id, variante),
  unique (id, marca_id)
);

create index landings_marca_idx on public.landings (marca_id);

-- ---------------------------------------------------------------------
-- secciones_landing: bloques editables de cada landing.
-- ---------------------------------------------------------------------
create table public.secciones_landing (
  id uuid primary key default gen_random_uuid(),
  landing_id uuid not null,
  marca_id uuid not null,
  tipo text not null check (tipo in (
    'hero', 'beneficios', 'prueba_social', 'antes_despues',
    'como_se_usa', 'garantia', 'faq', 'oferta'
  )),
  orden smallint not null default 0,
  contenido jsonb not null default '{}',
  imagen_ruta text,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (landing_id, marca_id) references public.landings (id, marca_id) on delete cascade
);

create index secciones_landing_landing_idx on public.secciones_landing (landing_id, orden);

-- ---------------------------------------------------------------------
-- versiones_landing: copias guardadas para "Restaurar".
-- ---------------------------------------------------------------------
create table public.versiones_landing (
  id uuid primary key default gen_random_uuid(),
  landing_id uuid not null,
  marca_id uuid not null,
  numero integer not null,
  contenido jsonb not null,
  creada_por uuid references public.usuarios (id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (landing_id, marca_id) references public.landings (id, marca_id) on delete cascade,
  unique (landing_id, numero)
);

-- ---------------------------------------------------------------------
-- lotes_prueba: pruebas de creativos.
-- ---------------------------------------------------------------------
create table public.lotes_prueba (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null,
  marca_id uuid not null,
  nombre text not null,
  config jsonb not null default '{}',
  estado text not null default 'borrador' check (estado in ('borrador', 'en_curso', 'finalizado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (producto_id, marca_id) references public.productos (id, marca_id) on delete cascade
);

-- ---------------------------------------------------------------------
-- creativos: imágenes para anuncios.
-- resultados: gasto, clics, CTR, costo por compra, ROAS (desde Meta/TikTok).
-- ---------------------------------------------------------------------
create table public.creativos (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null,
  marca_id uuid not null,
  angulo_id uuid references public.angulos (id) on delete set null,
  lote_id uuid references public.lotes_prueba (id) on delete set null,
  nombre text,
  formato text not null check (formato in ('1:1', '4:5', '9:16')),
  imagen_ruta text,
  textos jsonb not null default '{}',
  favorito boolean not null default false,
  resultados jsonb,
  veredicto text check (veredicto in ('ganador', 'perdedor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (producto_id, marca_id) references public.productos (id, marca_id) on delete cascade
);

create index creativos_producto_idx on public.creativos (producto_id, created_at desc);
create index creativos_lote_idx on public.creativos (lote_id) where lote_id is not null;

-- ---------------------------------------------------------------------
-- videos
-- config: avatar, voz, acento, subtítulos, música, gancho inicial.
-- ---------------------------------------------------------------------
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null,
  marca_id uuid not null,
  angulo_id uuid references public.angulos (id) on delete set null,
  tipo text not null check (tipo in ('ugc', 'resena', 'demostracion', 'ai_short')),
  duracion_segundos smallint not null check (duracion_segundos in (8, 15, 30, 60)),
  formato text not null check (formato in ('9:16', '1:1', '16:9')),
  guion text,
  config jsonb not null default '{}',
  video_ruta text,
  estado text not null default 'borrador' check (estado in ('borrador', 'generando', 'listo', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (producto_id, marca_id) references public.productos (id, marca_id) on delete cascade
);

create index videos_producto_idx on public.videos (producto_id, created_at desc);

-- ---------------------------------------------------------------------
-- campanas: campañas de Meta y TikTok.
-- ---------------------------------------------------------------------
create table public.campanas (
  id uuid primary key default gen_random_uuid(),
  marca_id uuid not null references public.marcas (id) on delete cascade,
  producto_id uuid references public.productos (id) on delete set null,
  plataforma text not null check (plataforma in ('meta', 'tiktok')),
  nombre text not null,
  objetivo text,
  presupuesto_diario numeric(12, 2) check (presupuesto_diario >= 0),
  moneda text not null default 'COP' check (moneda ~ '^[A-Z]{3}$'),
  segmentacion jsonb not null default '{}',
  anuncio jsonb not null default '{}',
  creativo_ids uuid[] not null default '{}',
  link_destino text,
  estado text not null default 'borrador' check (estado in (
    'borrador', 'en_revision', 'activa', 'pausada', 'rechazada', 'finalizada'
  )),
  id_externo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index campanas_marca_idx on public.campanas (marca_id, created_at desc);

-- ---------------------------------------------------------------------
-- pedidos: pedidos contra entrega que llegan de las landings.
-- Los datos del producto se copian al momento del pedido para que el
-- historial no cambie si luego se edita o borra el producto.
-- Los compradores NO escriben directo aquí: el servidor valida
-- (anti-spam, límites) y guarda el pedido.
-- ---------------------------------------------------------------------
create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero bigint generated always as identity unique,
  marca_id uuid not null references public.marcas (id) on delete cascade,
  producto_id uuid references public.productos (id) on delete set null,
  landing_id uuid references public.landings (id) on delete set null,
  producto_nombre text not null,
  cliente_nombre text not null,
  telefono text not null check (telefono ~ '^[0-9]{10}$'),
  departamento text not null,
  ciudad text not null,
  direccion text not null,
  barrio text,
  notas text,
  cantidad integer not null check (cantidad > 0),
  total numeric(12, 2) not null check (total >= 0),
  moneda text not null default 'COP' check (moneda ~ '^[A-Z]{3}$'),
  estado text not null default 'nuevo' check (estado in (
    'nuevo', 'confirmado', 'enviado_dropi', 'entregado', 'devuelto', 'cancelado'
  )),
  dropi_pedido_id text,
  acepto_tratamiento_datos boolean not null check (acepto_tratamiento_datos),
  -- Huella de la IP (no la IP) para el límite anti-spam.
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pedidos_marca_idx on public.pedidos (marca_id, created_at desc);
create index pedidos_marca_estado_idx on public.pedidos (marca_id, estado);
create index pedidos_telefono_idx on public.pedidos (telefono, created_at desc);

-- ---------------------------------------------------------------------
-- eventos_landing: visitas y conversiones (los escribe el servidor).
-- ---------------------------------------------------------------------
create table public.eventos_landing (
  id bigint generated always as identity primary key,
  landing_id uuid not null,
  marca_id uuid not null,
  tipo text not null check (tipo in ('visita', 'inicio_checkout', 'compra')),
  visitante_id text,
  referer text,
  utm jsonb,
  created_at timestamptz not null default now(),
  foreign key (landing_id, marca_id) references public.landings (id, marca_id) on delete cascade
);

create index eventos_landing_landing_idx on public.eventos_landing (landing_id, created_at);
create index eventos_landing_marca_idx on public.eventos_landing (marca_id, created_at);

-- ---------------------------------------------------------------------
-- integraciones: estado y datos NO secretos (pixel ID, número de
-- WhatsApp, país de Dropi, dominio de Shopify...).
-- ---------------------------------------------------------------------
create table public.integraciones (
  id uuid primary key default gen_random_uuid(),
  marca_id uuid not null references public.marcas (id) on delete cascade,
  tipo text not null check (tipo in (
    'dropi', 'shopify', 'meta', 'tiktok', 'meta_pixel', 'tiktok_pixel', 'whatsapp'
  )),
  estado text not null default 'desconectada' check (estado in ('conectada', 'desconectada', 'error')),
  config jsonb not null default '{}',
  conectada_en timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (marca_id, tipo)
);

-- ---------------------------------------------------------------------
-- integraciones_secretos: tokens de Dropi, Shopify, Meta, TikTok.
-- Sin reglas de acceso: solo el servidor (clave secreta) puede leerla.
-- ---------------------------------------------------------------------
create table public.integraciones_secretos (
  integracion_id uuid primary key references public.integraciones (id) on delete cascade,
  credenciales jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'productos', 'angulos', 'landings', 'secciones_landing', 'lotes_prueba',
    'creativos', 'videos', 'campanas', 'pedidos', 'integraciones', 'integraciones_secretos'
  ] loop
    execute format(
      'create trigger %1$I_updated_at before update on public.%1$I
         for each row execute function privado.poner_updated_at()', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Seguridad (RLS)
-- Miembros de la marca: ven. Dueños y editores: crean, editan y borran.
-- ---------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'productos', 'imagenes_producto', 'angulos', 'landings', 'secciones_landing',
    'versiones_landing', 'lotes_prueba', 'creativos', 'videos', 'campanas', 'integraciones'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "%1$s: ver si es miembro" on public.%1$I for select to authenticated
         using (privado.es_miembro(marca_id))', t);
    execute format(
      'create policy "%1$s: crear si puede editar" on public.%1$I for insert to authenticated
         with check (privado.puede_editar(marca_id))', t);
    execute format(
      'create policy "%1$s: editar si puede editar" on public.%1$I for update to authenticated
         using (privado.puede_editar(marca_id)) with check (privado.puede_editar(marca_id))', t);
    execute format(
      'create policy "%1$s: borrar si puede editar" on public.%1$I for delete to authenticated
         using (privado.puede_editar(marca_id))', t);
  end loop;
end;
$$;

-- pedidos: se ven y se gestionan, pero no se borran (se cancelan).
alter table public.pedidos enable row level security;

create policy "pedidos: ver si es miembro"
  on public.pedidos for select to authenticated
  using (privado.es_miembro(marca_id));

create policy "pedidos: crear si puede editar"
  on public.pedidos for insert to authenticated
  with check (privado.puede_editar(marca_id));

create policy "pedidos: editar si puede editar"
  on public.pedidos for update to authenticated
  using (privado.puede_editar(marca_id))
  with check (privado.puede_editar(marca_id));

-- eventos_landing: solo lectura para los miembros; los escribe el servidor.
alter table public.eventos_landing enable row level security;

create policy "eventos_landing: ver si es miembro"
  on public.eventos_landing for select to authenticated
  using (privado.es_miembro(marca_id));

-- integraciones_secretos: RLS activo y sin reglas = nadie desde el navegador.
alter table public.integraciones_secretos enable row level security;
revoke all on public.integraciones_secretos from anon, authenticated;
