-- =====================================================================
-- Datos iniciales: precios por acción, planes y packs (CLAUDE.md §9).
-- Se pueden cambiar después desde el panel de administrador.
-- Plan anual = paga 10 meses.
-- =====================================================================

insert into public.precios_acciones (accion, nombre, creditos) values
  ('analizar_producto', 'Analizar producto + 3 ángulos', 100),
  ('angulos_extra', '3 ángulos más', 50),
  ('landing', 'Landing completa', 1500),
  ('regenerar_seccion', 'Regenerar sección', 200),
  ('editar_textos', 'Editar textos', 0),
  ('creativo', 'Creativo (imagen)', 250),
  ('video_8', 'Video 8 s', 2000),
  ('video_15', 'Video 15 s', 3500),
  ('video_30', 'Video 30 s', 6000),
  ('ai_short', 'AI Short', 2500),
  ('publicar', 'Publicar / pedidos / Dropi', 0)
on conflict (accion) do nothing;

insert into public.planes (id, nombre, precio_mensual_usd, precio_anual_usd, creditos_mes, etiqueta, orden) values
  ('starter', 'Starter', 19, 190, 20000, null, 1),
  ('growth', 'Growth', 39, 390, 48000, 'mas_popular', 2),
  ('scale', 'Scale', 79, 790, 105000, null, 3),
  ('agency', 'Agency', 179, 1790, 250000, 'mejor_valor', 4)
on conflict (id) do nothing;

insert into public.packs (id, nombre, precio_usd, creditos, orden) values
  ('basico', 'Básico', 15, 13000, 1),
  ('medio', 'Medio', 35, 32000, 2),
  ('grande', 'Grande', 75, 70000, 3)
on conflict (id) do nothing;
