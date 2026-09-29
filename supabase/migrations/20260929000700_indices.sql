-- =====================================================================
-- Índices para todas las llaves foráneas (recomendación del revisor de
-- Supabase). Aceleran los borrados en cascada y las consultas por padre.
-- Los índices por producto/landing se rehacen para cubrir también marca_id.
-- =====================================================================

-- Hijas con llave compuesta (padre_id, marca_id)
drop index public.imagenes_producto_producto_idx;
create index imagenes_producto_producto_idx on public.imagenes_producto (producto_id, marca_id, orden);

drop index public.angulos_producto_idx;
create index angulos_producto_idx on public.angulos (producto_id, marca_id, orden);

drop index public.secciones_landing_landing_idx;
create index secciones_landing_landing_idx on public.secciones_landing (landing_id, marca_id, orden);

drop index public.creativos_producto_idx;
create index creativos_producto_idx on public.creativos (producto_id, marca_id, created_at desc);

drop index public.videos_producto_idx;
create index videos_producto_idx on public.videos (producto_id, marca_id, created_at desc);

drop index public.eventos_landing_landing_idx;
create index eventos_landing_landing_idx on public.eventos_landing (landing_id, marca_id, created_at);

create index landings_producto_idx on public.landings (producto_id, marca_id);
create index lotes_prueba_producto_idx on public.lotes_prueba (producto_id, marca_id);
create index versiones_landing_landing_idx on public.versiones_landing (landing_id, marca_id);

-- Llaves simples
create index campanas_producto_idx on public.campanas (producto_id);
create index creativos_angulo_idx on public.creativos (angulo_id);
create index landings_angulo_idx on public.landings (angulo_id);
create index videos_angulo_idx on public.videos (angulo_id);
create index pedidos_producto_idx on public.pedidos (producto_id);
create index pedidos_landing_idx on public.pedidos (landing_id);
create index productos_creado_por_idx on public.productos (creado_por);
create index versiones_landing_creada_por_idx on public.versiones_landing (creada_por);
create index cupones_usos_usuario_idx on public.cupones_usos (usuario_id);
create index generaciones_accion_idx on public.generaciones (accion);
create index generaciones_producto_idx on public.generaciones (producto_id);
create index generaciones_realizado_por_idx on public.generaciones (realizado_por);
create index movimientos_marca_idx on public.movimientos_creditos (marca_id);
create index movimientos_pago_idx on public.movimientos_creditos (pago_id);
create index movimientos_realizado_por_idx on public.movimientos_creditos (realizado_por);
create index pagos_plan_idx on public.pagos (plan_id);
create index pagos_pack_idx on public.pagos (pack_id);
create index suscripciones_plan_idx on public.suscripciones (plan_id);
create index suscripciones_plan_siguiente_idx on public.suscripciones (plan_siguiente_id);
