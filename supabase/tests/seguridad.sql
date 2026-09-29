-- =====================================================================
-- Prueba de seguridad (RLS). Crea dos cuentas ficticias (A y B), intenta
-- accesos permitidos y prohibidos, y al final DESHACE TODO lanzando un
-- error con los resultados (no deja datos en la base).
--
-- Ejecutar:  npx supabase db query --linked -f supabase/tests/seguridad.sql
-- Cada línea del resultado debe decir "OK".
-- =====================================================================
do $$
declare
  a uuid := gen_random_uuid();
  b uuid := gen_random_uuid();
  marca_a uuid;
  marca_b uuid;
  producto_a uuid;
  n integer;
  r text[] := '{}';

  procedure_ok boolean;
begin
  -- Cuentas nuevas → el disparador crea perfil, marca y membresía.
  insert into auth.users (id, email, aud, role, raw_user_meta_data)
  values
    (a, 'prueba-a@ejemplo.test', 'authenticated', 'authenticated', '{"full_name":"Cuenta A"}'),
    (b, 'prueba-b@ejemplo.test', 'authenticated', 'authenticated', '{"full_name":"Cuenta B"}');

  select id into marca_a from public.marcas where propietario_id = a;
  select id into marca_b from public.marcas where propietario_id = b;
  select count(*) into n from public.miembros_marca where usuario_id in (a, b) and rol = 'dueno';
  r := r || (case when marca_a is not null and marca_b is not null and n = 2
    then 'OK  cuenta nueva crea perfil, marca y dueño' else 'FALLA  cuenta nueva' end);

  -- ---------- Actuar como la cuenta A ----------
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);

  insert into public.productos (marca_id, nombre, slug, origen)
  values (marca_a, 'Producto de A', 'producto-a', 'manual')
  returning id into producto_a;
  r := r || 'OK  A crea un producto en su marca'::text;

  begin
    insert into public.productos (marca_id, nombre, slug, origen)
    values (marca_b, 'Intruso', 'intruso', 'manual');
    r := r || 'FALLA  A pudo crear un producto en la marca de B'::text;
  exception when others then
    r := r || 'OK  A no puede crear productos en la marca de B'::text;
  end;

  select count(*) into n from public.marcas;
  r := r || (case when n = 1 then 'OK  A solo ve su marca' else 'FALLA  A ve ' || n || ' marcas' end);

  begin
    update public.usuarios set es_admin = true where id = a;
    r := r || 'FALLA  A pudo volverse administrador'::text;
  exception when others then
    r := r || 'OK  A no puede volverse administrador'::text;
  end;

  update public.usuarios set nombre = 'Nuevo nombre' where id = a;
  get diagnostics n = row_count;
  r := r || (case when n = 1 then 'OK  A puede editar su nombre' else 'FALLA  A no pudo editar su nombre' end);

  begin
    insert into public.movimientos_creditos (usuario_id, bolsillo, tipo, cantidad, motivo)
    values (a, 'pack', 'ajuste', 1000000, 'regalo a mí mismo');
    r := r || 'FALLA  A pudo regalarse créditos'::text;
  exception when others then
    r := r || 'OK  A no puede regalarse créditos'::text;
  end;

  begin
    perform 1 from public.integraciones_secretos;
    r := r || 'FALLA  A pudo leer tokens de integraciones'::text;
  exception when others then
    r := r || 'OK  A no puede leer tokens de integraciones'::text;
  end;

  begin
    update public.marcas set propietario_id = b where id = marca_a;
    r := r || 'FALLA  A pudo cambiar el propietario de la marca'::text;
  exception when others then
    r := r || 'OK  A no puede cambiar el propietario de la marca'::text;
  end;

  -- ---------- Actuar como la cuenta B ----------
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);

  select count(*) into n from public.productos where id = producto_a;
  r := r || (case when n = 0 then 'OK  B no ve los productos de A' else 'FALLA  B ve productos de A' end);

  update public.productos set nombre = 'Hackeado' where id = producto_a;
  get diagnostics n = row_count;
  r := r || (case when n = 0 then 'OK  B no puede editar productos de A' else 'FALLA  B editó un producto de A' end);

  delete from public.productos where id = producto_a;
  get diagnostics n = row_count;
  r := r || (case when n = 0 then 'OK  B no puede borrar productos de A' else 'FALLA  B borró un producto de A' end);

  begin
    insert into public.miembros_marca (marca_id, usuario_id, rol) values (marca_a, b, 'dueno');
    r := r || 'FALLA  B pudo meterse al equipo de A'::text;
  exception when others then
    r := r || 'OK  B no puede meterse al equipo de A'::text;
  end;

  -- ---------- Visitante sin sesión ----------
  execute 'set local role anon';
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);

  select count(*) into n from public.planes;
  r := r || (case when n = 4 then 'OK  visitante ve los 4 planes' else 'FALLA  visitante ve ' || n || ' planes' end);

  select count(*) into n from public.productos;
  r := r || (case when n = 0 then 'OK  visitante no ve productos' else 'FALLA  visitante ve productos' end);

  begin
    select count(*) into n from public.pedidos;
    r := r || (case when n = 0 then 'OK  visitante no ve pedidos' else 'FALLA  visitante ve pedidos' end);
  exception when others then
    r := r || 'OK  visitante no ve pedidos'::text;
  end;

  -- Deshacer todo y mostrar resultados.
  raise exception E'RESULTADOS\n%', array_to_string(r, E'\n');
end;
$$;
