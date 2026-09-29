# CLAUDE.md — SaaS de landings y creativos con IA integrado con Dropi

## 1. Visión del producto

SaaS para dropshippers y e-commerce de Latinoamérica (foco inicial: Colombia). El usuario sube la foto de un producto, pega un link o lo importa del catálogo de Dropi, y la IA genera:

- Ángulos de venta
- Landing de alta conversión con formulario de pago contra entrega
- Creativos (imágenes) para Meta Ads / TikTok
- Videos UGC, reseña, demostración y AI Shorts

Luego publica en 1 clic (landing propia, Shopify, Meta Ads, TikTok) y recibe los pedidos, que se envían a Dropi.

Referencia de mercado: productmaker.app (misma estructura de funciones y de créditos). **No copiar su marca, textos, diseño ni imágenes.** Todo debe ser original.

**Diferenciadores frente a la referencia:**
- Importar productos del catálogo de Dropi
- Landings con formulario de contraentrega (departamento → ciudad de Colombia)
- Panel de pedidos con envío automático a Dropi
- Confirmación de pedidos por WhatsApp
- Pensado para celular primero

## 2. Reglas de trabajo para Claude Code

- Trabajar **por fases** (sección 12). No avanzar a la siguiente fase sin que yo lo confirme.
- Al terminar cada fase: resumir qué se hizo, cómo probarlo y qué variables de entorno faltan.
- Explicar los pasos en español y de forma sencilla (no soy experto).
- Todo el texto de la interfaz en español, preparado para traducción (i18n ES/EN).
- Diseño mobile-first, limpio y moderno.
- Nunca poner claves ni secretos en el código: usar `.env.local` y documentarlas en `.env.example`.
- Proveedores de IA detrás de adaptadores (interfaces) para poder cambiar de modelo sin reescribir la app.
- La **pasarela de pagos se implementa al final**. Mientras tanto, los créditos se cargan desde el panel de administrador. Dejar una interfaz `PaymentProvider` preparada.

## 3. Stack técnico

- **Frontend y backend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Base de datos, login y archivos:** Supabase (Postgres, Auth, Storage, Row Level Security)
- **Hosting:** Vercel
- **Cola de trabajos:** tabla `generaciones` en Supabase + procesamiento en segundo plano (evaluar Inngest, Trigger.dev o cron de Vercel)
- **IA de texto:** API de Anthropic (Claude)
- **IA de imágenes:** proveedor configurable (adaptador)
- **IA de video:** proveedor configurable (adaptador), fase posterior

## 4. Mapa de la aplicación

1. **Sitio público** (marketing)
2. **App del usuario** (después del login)
3. **Landings publicadas** (las ven los compradores finales)
4. **Panel de administrador** (solo el dueño)

## 5. Sitio público

**Navbar fija:** logo, Funciones, Cómo funciona, Precios, Preguntas frecuentes, selector ES/EN, "Iniciar sesión", "Empezar gratis". Menú hamburguesa en celular.

**Secciones de la home:**
1. Hero: etiqueta "+X marcas activas", título, subtítulo, botón "Crear mi primera landing", botón "Ver cómo funciona", 3 datos cortos, logos de integraciones (Dropi, Shopify, Meta, TikTok, WhatsApp)
2. Galería de ejemplos: carrusel automático (landings, creativos, videos), pausa al pasar el mouse, clic abre modal
3. El problema: 3 tarjetas con dolores del dropshipper
4. Testimonios: tarjetas con nombre, país, nicho, cita y métrica
5. Contadores animados: marcas activas, ventas generadas, landings creadas
6. Publica en 1 clic: animación producto → Dropi / Shopify / Meta / TikTok
7. Cómo funciona: 3 pasos
8. Funciones: Landings, Creativos, Ángulos de venta, Videos
9. Para quién es: dropshippers, e-commerce, emprendedores, marketers
10. Comparativa: ChatGPT vs Canva vs Agencia vs Nosotros
11. Precios: interruptor Mensual/Anual, 4 planes, packs, mensajes de confianza
12. Preguntas frecuentes: acordeón
13. Llamado final
14. Footer: Privacidad, Términos, Reembolsos, Contacto, redes

**Extras:** botón flotante de WhatsApp, pixel de Meta del propio sitio.

**Páginas:** `/privacidad`, `/terminos`, `/reembolsos`, `/contacto` (formulario), `/install` (instrucciones MCP).

**Páginas SEO (fase final):** generador de video, creador UGC, herramientas de dropshipping, videos de producto, landings, Facebook Ads, TikTok Ads, Instagram Ads, AI Shorts, pruebas de creativos. Cada una con hero, ejemplos, pasos, FAQ y CTA.

## 6. Autenticación y onboarding

**Login/registro:** "Continuar con Google", enlace mágico por correo, casilla obligatoria de términos y tratamiento de datos (Ley 1581 de Colombia), mensajes de error claros.

**Onboarding (primera vez), con barra de progreso y botón "Atrás":**
1. País (define moneda y transportadoras)
2. Tipo de negocio (Dropi, marca propia, ambos)
3. Conectar Dropi (pegar token, enlace de ayuda, botón "Hacerlo después")
4. Regalo de bienvenida (2.000 créditos) + botón "Crear mi primera landing"

## 7. App del usuario

**Estructura fija:**
- Menú lateral: Inicio, Nuevo producto, Mis productos, Pedidos, Pruebas de creativos, Campañas, Integraciones, Créditos, Ajustes, Ayuda
- Barra superior: selector de marca (plan Agency), saldo de créditos, botón "Recargar", avatar (Perfil, Facturación, Cerrar sesión)
- En celular: menú inferior o hamburguesa

### 7.1 Inicio
Botón "Nuevo producto", tarjetas de resumen (landings, pedidos del mes, créditos), últimos productos, aviso si Dropi no está conectado.

### 7.2 Nuevo producto
Pestañas:
- **Desde Dropi:** buscador por nombre o ID, resultados con foto, precio proveedor y sugerido, botón "Usar este producto"
- **Subir foto:** arrastrar y soltar, JPG/PNG/WEBP, máx. 10 MB, hasta 5 fotos, vista previa
- **Pegar link:** Dropi, Shopify o AliExpress + "Importar"
- **Carga múltiple:** varias fotos o links, tabla de revisión, "Procesar todos" con costo total, progreso por producto

Campos editables: nombre, precio, precio tachado, moneda, descripción corta, público objetivo.
Botón "Analizar producto · 100 🪙".

### 7.3 Ángulos de venta
- 3 ángulos por defecto (titular, dolor, promesa, público, gancho, etiquetas de psicología)
- Por ángulo: Elegir, Editar, Regenerar
- "Generar 3 ángulos más · 50 🪙" (hasta 8+)
- "Usar en landing / creativos / video"

### 7.4 Configurar landing
- Estilo visual (4–6 opciones con miniatura)
- Color automático o manual
- Interruptores de secciones: Hero, Beneficios, Prueba social, Antes y después, Cómo se usa, Garantía, FAQ, Oferta
- Oferta: combos 1/2/3 unidades con precio, envío gratis sí/no
- Formulario contraentrega: nombre, teléfono, departamento, ciudad, dirección, barrio, notas (cada uno obligatorio sí/no)
- Texto del botón de compra
- "Generar landing · 1.500 🪙"

### 7.5 Generación en progreso
Pasos: Escribiendo textos → Creando imágenes → Armando la página. "Puedes salir, te avisamos". Si falla: "Te devolvimos tus créditos" + "Intentar de nuevo".

### 7.6 Editor de landing
- Vista Celular / Escritorio
- Clic en sección → panel: editar texto (gratis), regenerar imagen (200 🪙), subir imagen propia, subir/bajar, eliminar
- Deshacer / Rehacer, guardado automático
- Historial de versiones con "Restaurar"
- "Crear variante B"
- Botones: Publicar (URL + copiar + abrir), Descargar (ZIP de imágenes), Publicar en Shopify, Actualizar en Shopify
- Configuración: pixel Meta, pixel TikTok, WhatsApp, dominio propio

### 7.7 Creativos
Formato (1:1, 4:5, 9:16), ángulo, cantidad (1/3/5/10) con costo total, "Generar creativos". Galería: descargar, regenerar, editar texto, favorito, "Descargar todos".

### 7.8 Videos
- Tipo: UGC, Reseña, Demostración, AI Short
- Avatar (galería con filtros y vista previa)
- Duración: 8/15/30/60 s
- Formato: 9:16, 1:1, 16:9
- Guion automático editable + "Reescribir guion"
- Voz con vista previa y acento (colombiano, mexicano, neutro)
- Subtítulos (animados, simples, estilo TikTok), música de fondo, 3 opciones de gancho inicial
- Resultado: Descargar, Regenerar, Cambiar voz, Cambiar subtítulos, Enviar a Meta, Enviar a TikTok

### 7.9 Pruebas de creativos
Nuevo lote (ángulos, formatos, cantidad), nombrado automático `producto_angulo_formato_n`, "Lanzar prueba en Meta Ads", tabla de resultados (gasto, clics, CTR, costo por compra, ROAS), marca Ganador/Perdedor, "Crear variaciones del ganador".

### 7.10 Campañas (Meta y TikTok)
Objetivo, presupuesto diario, país y ciudades, edad y género, creativos, texto y titular prellenados, CTA, link de destino, Revisar → Lanzar. Lista con estados (Activa, Pausada, En revisión, Rechazada) y Pausar/Activar/Ver resultados. Opción "Solo subir a mi biblioteca".

### 7.11 Mis productos
Buscador, filtros (todos, publicados, borradores), vista tarjetas/lista, menú: Abrir, Duplicar, Estadísticas, Despublicar, Eliminar (con confirmación). Dentro: pestañas Landing, Creativos, Videos, Pedidos, Estadísticas.

### 7.12 Pedidos
Tabla: fecha, cliente, teléfono, ciudad, producto, cantidad, total, estado.
Estados: Nuevo → Confirmado → Enviado a Dropi → Entregado / Devuelto / Cancelado.
Acciones: Confirmar por WhatsApp (mensaje prellenado), Enviar a Dropi, Cancelar, Ver detalle. Exportar a Excel, filtros, interruptor "Enviar a Dropi automáticamente".

### 7.13 Estadísticas
Visitas, pedidos, conversión, ventas; gráfica por día; rango de fechas.

### 7.14 Integraciones
Tarjetas con estado y Conectar/Desconectar: Dropi (token + país), Shopify (OAuth), Meta (negocio, cuenta publicitaria, página, Instagram, pixel), TikTok for Business, Meta Pixel, TikTok Pixel, WhatsApp.

### 7.15 Créditos y facturación
Saldo separado (plan y packs), próxima recarga, plan actual, Cambiar plan / Cancelar, comprar packs, historial de movimientos con filtros, facturas, método de pago.

### 7.16 Ajustes
Perfil, Mi marca (logo, colores, nombre), notificaciones (correo/WhatsApp), idioma, **API y MCP** (generar/ver/copiar/revocar clave, historial de uso), equipo (plan Agency: invitar, roles Dueño/Editor/Lectura, eliminar), eliminar cuenta con doble confirmación.

### 7.17 Ayuda
FAQ, videos tutoriales, botón de WhatsApp de soporte.

## 8. Landing publicada (comprador final)

- Mobile-first, carga rápida, SEO básico y Open Graph
- Botón de compra fijo abajo en celular: "Pedir ahora – Pago contra entrega"
- Formulario en modal: combo 1/2/3 con precio actualizado, departamento → ciudad de Colombia, validación (teléfono de 10 dígitos, etc.)
- Página de "¡Gracias!" con resumen + botón WhatsApp
- Eventos de pixel Meta/TikTok: PageView, InitiateCheckout, Purchase
- Anti-spam (honeypot + límite por IP/teléfono)
- Casilla de tratamiento de datos
- URL: `/{marca}/{producto}` y soporte futuro de dominio propio

## 9. Sistema de créditos

### Precios por acción (editables desde admin, tabla `precios_acciones`)
| Acción | Créditos |
|---|---|
| Analizar producto + 3 ángulos | 100 |
| 3 ángulos más | 50 |
| Landing completa | 1.500 |
| Regenerar sección | 200 |
| Editar textos | 0 |
| Creativo (imagen) | 250 |
| Video 8 s | 2.000 |
| Video 15 s | 3.500 |
| Video 30 s | 6.000 |
| AI Short | 2.500 |
| Publicar / pedidos / Dropi | 0 |

Los precios de video son provisionales hasta medir el costo real.

### Planes (anual = paga 10 meses)
| Plan | USD/mes | Créditos/mes |
|---|---|---|
| Starter | 19 | 20.000 |
| Growth (Más popular) | 39 | 48.000 |
| Scale | 79 | 105.000 |
| Agency (Mejor valor) | 179 | 250.000 |

### Packs (nunca vencen)
| Pack | USD | Créditos |
|---|---|---|
| Básico | 15 | 13.000 |
| Medio | 35 | 32.000 |
| Grande | 75 | 70.000 |

Bienvenida: 2.000 créditos (solo con correo verificado).

### Reglas
- Dos bolsillos: **plan** (se recarga mensual; lo sobrante se acumula máximo 1 mes) y **pack** (nunca vence). Se gasta primero el del plan.
- **El saldo nunca se edita directamente.** Todo es un registro en `movimientos_creditos`; el saldo es la suma.
- Flujo: verificar saldo → **reservar** → generar → **confirmar** si sale bien / **reembolsar** automáticamente si falla. Si una generación queda colgada más de 15 min, reembolso automático.
- Operaciones de créditos atómicas (funciones SQL/transacciones) para evitar saldos negativos o dobles cobros.
- Subir de plan: diferencia inmediata. Bajar: en la renovación. Cancelar: conserva créditos hasta fin del periodo; packs nunca se pierden.
- Anti-abuso: bienvenida con correo verificado, límite de cuentas por dispositivo/IP, máximo 3 generaciones simultáneas por usuario.

### UI de créditos
- Saldo visible en la barra superior + "Recargar"
- Cada botón que gasta muestra su costo ("Generar landing · 1.500 🪙")
- Modal de créditos insuficientes: "Te faltan X" → Comprar pack / Mejorar plan / Cancelar
- Aviso al quedar menos del 20% del plan
- Plan Agency: créditos compartidos o asignados por marca, gasto por marca y miembro

## 10. Panel de administrador

- Usuarios: buscar, ver detalle, bloquear, regalar créditos (motivo obligatorio)
- Tabla de precios por acción editable
- Margen en vivo: créditos vendidos vs costo real de IA (por día, acción y usuario); alerta si alguna acción baja de 2x de margen
- Historial de generaciones con fallos marcados
- Cupones (% o créditos extra, vencimiento, límite de usos)
- Suscripciones e ingresos
- Configuración de planes, packs y estilos de landing
- Anuncio global para todos los usuarios

## 11. Backend

### Tablas principales
`usuarios`, `marcas`, `miembros_marca`, `productos`, `imagenes_producto`, `angulos`, `landings`, `secciones_landing`, `versiones_landing`, `creativos`, `videos`, `lotes_prueba`, `campanas`, `pedidos`, `integraciones`, `generaciones` (cola, con estado y costo real de IA), `movimientos_creditos`, `precios_acciones`, `planes`, `packs`, `suscripciones`, `pagos`, `cupones`, `claves_api`, `eventos_landing` (visitas y conversiones).

Row Level Security en todas las tablas: cada usuario solo ve los datos de sus marcas.

### Flujo de cada generación
1. Validar y reservar créditos
2. Crear registro en `generaciones` (estado `pendiente`)
3. Procesar en segundo plano: textos con Claude → imágenes por sección → armar landing
4. Guardar archivos en Supabase Storage
5. Guardar costo real de IA en la generación
6. Confirmar créditos o reembolsar
7. Notificar al usuario

### Servidor MCP
Herramientas: listar productos, crear producto, generar ángulos, generar landing, generar creativos, generar video, consultar créditos. Autenticación con la clave API del usuario.

## 12. Fases

1. **Base:** Next.js + Supabase + Vercel, estructura de carpetas, `.env.example`, diseño base (layout, menú, componentes)
2. **Base de datos completa** + RLS + migraciones
3. **Login y onboarding**
4. **Sistema de créditos** + panel admin básico (cargar créditos, editar precios)
5. **Nuevo producto → ángulos de venta**
6. **Generador y editor de landing**
7. **Landing publicada con contraentrega + panel de pedidos + estadísticas**
8. **Creativos + pruebas de creativos**
9. **Videos**
10. **Integraciones:** Dropi, Shopify, Meta, TikTok, MCP
11. **Plan Agency:** marcas múltiples y equipos
12. **Sitio público completo + páginas SEO + i18n**
13. **Pasarela de pagos** (el dueño ya la tiene definida)

## 13. Decisiones tomadas (Fase 1)

- **Nombre:** temporal, definido en un solo archivo de configuración (`src/config/site.ts`) para cambiarlo fácil.
- **Estilo visual de la app:** claro y confiable (fondo claro, mucho espacio, un acento fuerte). Sin modo oscuro por ahora.
- **Color de acento:** verde esmeralda.
- **Menú en celular:** barra inferior con Inicio, Nuevo producto, Pedidos, Productos y "Más" (el resto de secciones). En escritorio: menú lateral.
- **Idiomas:** estructura de traducción desde el día 1 (archivos de mensajes), solo español activo al inicio.
- **Componentes base:** shadcn/ui personalizado con el estilo del proyecto.
- **Supabase:** proyecto en la nube (no local).
- **Repositorio:** GitHub `Dxpruebas/LandingG` (rama `main`, público), conectado a Vercel (despliegue automático).
- **Honestidad en el contenido:** no inventar cifras, testimonios ni logos. Mientras no haya datos reales, usar espacios marcados "por confirmar".

## 14. Skills instaladas

En `.claude/skills/`: karpathy, verification-before-completion, nextjs-typescript-tailwindcss-supabase, supabase-development, tailwindcss, zod-schema-validation, postgresql-best-practices, internationalization-i18n, ui-ux-pro-max, emil-design-eng, hallmark, form-cro, page-cro, landing-page-generator. Si una skill contradice este documento, manda este documento. La carpeta original con el resto de skills fue eliminada; las de SEO, MCP y creativos se descargan de nuevo cuando se llegue a su fase.

## 15. Notas técnicas (Next.js 16)

@AGENTS.md

- `middleware` ahora se llama `proxy` (`src/proxy.ts`).
- `cookies()`, `headers()`, `params` y `searchParams` son asíncronos: siempre con `await`.
- Tipos `PageProps` / `LayoutProps` se generan con `npx next typegen` (también los genera `npm run build`).
- shadcn/ui usa Base UI: para cambiar el elemento se usa la prop `render` (no `asChild`); en botones que son enlaces, `render={<Link href="..." />}` + `nativeButton={false}`.
- Traducciones con next-intl, sin prefijo de idioma en la URL (idioma por cookie `NEXT_LOCALE`). Textos en `messages/es.json` y `messages/en.json`.
- Estructura: `src/app/(marketing)` sitio público · `src/app/app` app del usuario · `src/app/admin` administrador · (fase 7) landings publicadas en `/{marca}/{producto}`: reservar los slugs `app`, `admin`, `api`.

## 16. Base de datos (Fase 2)

- Proyecto Supabase `pyqiwsztehqukemxvjrb` (East US), enlazado con la CLI (`npx supabase`, ya con sesión iniciada).
- Migraciones en `supabase/migrations/`. **Nunca editar una migración ya aplicada**: crear un archivo nuevo con fecha posterior.
- Comandos: `npm run db:aplicar` (subir migraciones) · `npm run db:tipos` (regenerar `src/lib/supabase/database.types.ts` tras cada cambio) · `npm run db:prueba` (prueba de seguridad RLS: todo debe decir OK) · `npm run db:revisar` (revisor de Supabase).
- Tablas y columnas en español. Funciones internas de permisos en el esquema `privado` (`es_miembro`, `puede_editar`, `es_dueno`, `marca_de_ruta`).
- Las tablas de contenido tienen `marca_id`; las hijas lo repiten con llave compuesta `(padre_id, marca_id)`.
- Créditos: pertenecen a la cuenta (`usuario_id`); el saldo es la vista `saldos_creditos`. Las escrituras de créditos, pagos y generaciones NO se hacen desde el navegador (permisos revocados): van por funciones atómicas (fase 4) o por el servidor con la clave secreta.
- `integraciones_secretos` y `cupones`: sin reglas a propósito (solo servidor).
- Storage: bucket `archivos` (privado) y `publico` (imágenes de landings). Rutas `{marca_id}/...`.
- Una cuenta nueva en Auth crea sola su perfil (`usuarios`) y su marca "Mi marca" (slug `marca-xxxxxxxxxx`).
- Los pedidos de compradores y los eventos de landing los escribe el servidor (anti-spam), no el navegador.
- Pendiente de definir: precio en créditos del video de 60 s; teléfono de pedidos acepta solo 10 dígitos (Colombia).

## 17. Notas importantes

- La API de Dropi no está documentada públicamente. Se sabe que el token se genera en dropi.co → "Mis tiendas" → crear tienda. Construir la integración detrás de un adaptador y confirmar endpoints antes de implementarla.
- Meta, Shopify y TikTok requieren aprobación de sus apps; construir primero con cuentas de desarrollo/prueba.
- Política de tratamiento de datos (Ley 1581 de 2012, Colombia) para usuarios y compradores finales.
