# 02 — Página de Inicio

- **Estado:** Aprobado
- **Depende de:** SPEC 01
- **Fecha:** 2026-09-22

**Objetivo:** Implementar la página de Inicio (landing) de Arcade Vault en la ruta `/`, replicando fielmente `references/resources/templates/home-about/home.jsx`, trasladando la Biblioteca actual a `/biblioteca` y actualizando el Nav y los enlaces internos en consecuencia.

## Alcance

**Incluye:**

- Nueva página de Inicio en `app/page.tsx` (landing), que reemplaza a la Biblioteca actual en esa ruta, replicando `home.jsx`:
  - Hero con siluetas pixel flotantes decorativas, eyebrow, título en 3 líneas, subtítulo, CTAs ("Explorar juegos" → `/biblioteca`, "Crear cuenta" → `/auth`) e indicador de scroll.
  - Sección "¿Por qué Arcade Vault?" con grid de 4 tarjetas de features (con iconos pixel SVG).
  - Sección "Juegos disponibles ahora": rail con los primeros 6 juegos de `GAMES` (`app/data/games.ts`), cada uno enlazando a `/juegos/[id]`, más botón "Ver todos los juegos" → `/biblioteca`.
  - Sección de estadísticas (3 bloques: juegos, partidas, ranking).
  - Sección "Actividad en vivo": ticker de últimas puntuaciones y top 5 jugadores de hoy, con datos ficticios hardcodeados igual que la plantilla, más enlace "Ver salón" → `/salon`.
  - Sección de precios: plan único gratuito con lista de beneficios y CTA → `/auth`, más FAQ de 3 preguntas.
  - CTA final → `/biblioteca`.
  - Animación "reveal on scroll" (IntersectionObserver) igual que la plantilla.
- Traslado de la Biblioteca actual (`app/page.tsx` existente) a `app/biblioteca/page.tsx`, sin cambios funcionales.
- Actualización de todos los enlaces/redirecciones internas que hoy apuntan a `/` esperando la Biblioteca, para que apunten a `/biblioteca`: `app/auth/page.tsx` (tras iniciar sesión, crear cuenta o entrar como invitado), `app/components/GamePlayer.tsx` ("Volver al Vault"), `app/salon/page.tsx` ("Volver al Vault"), `app/juegos/[id]/page.tsx` ("Volver al Vault").
- Actualización de `app/components/Nav.tsx`: nuevo enlace "Inicio" apuntando a `/`, el enlace "Biblioteca" pasa a apuntar a `/biblioteca`, y ajuste de la detección de sección activa (escritorio y panel móvil), replicando `nav.jsx`.
- Portado del bloque de estilos "HOME PAGE" (incluida la clase `.reveal`/`.reveal.in`) de `styles.css` a `app/globals.css`.

**No incluye:**

- La página "Acerca de" (`about.jsx`) — queda fuera de este spec, para uno futuro.
- El enlace "Acerca de" en el Nav — no se agrega porque la página aún no existe.
- Conectar el ticker de "últimas puntuaciones" o el "top jugadores de hoy" a datos reales o a `app/data`/`localStorage` — se mantienen como contenido ficticio hardcodeado dentro del componente de Inicio, igual que en la plantilla.
- Cualquier lógica real de juego, autenticación real o backend (ya fuera de alcance según SPEC 01).
- Tests automatizados (el proyecto no tiene test runner configurado).

## Modelo de datos

No se introducen estructuras de datos nuevas. La sección "Juegos disponibles ahora" reutiliza `GAMES` desde `app/data/games.ts` (ya existente). El ticker de puntuaciones recientes y el top de jugadores de hoy son arreglos de datos ficticios hardcodeados directamente en el componente de Inicio (mismos valores que `home.jsx`), sin persistencia ni tipado compartido con `app/data`.

## Plan de implementación

1. **Mover la Biblioteca.** Trasladar el contenido actual de `app/page.tsx` a `app/biblioteca/page.tsx` sin cambios funcionales.
2. **Actualizar enlaces internos a la Biblioteca.** En `app/auth/page.tsx` (redirecciones tras iniciar sesión, crear cuenta o invitado), `app/components/GamePlayer.tsx`, `app/salon/page.tsx` y `app/juegos/[id]/page.tsx`, cambiar los enlaces/redirecciones que hoy apuntan a `/` por `/biblioteca`.
3. **Portar estilos de Inicio.** Copiar el bloque "HOME PAGE" de `styles.css` (incluyendo `.reveal`/`.reveal.in`) a `app/globals.css`.
4. **Sección Hero.** Crear el nuevo `app/page.tsx` con el Hero: siluetas pixel flotantes decorativas, eyebrow, título de 3 líneas, subtítulo, CTAs e indicador de scroll.
5. **Sección de features.** Añadir "¿Por qué Arcade Vault?" con el grid de 4 tarjetas e iconos pixel.
6. **Sección de juegos destacados.** Añadir "Juegos disponibles ahora" con el rail de los primeros 6 `GAMES`, enlazando a `/juegos/[id]`, y el botón "Ver todos los juegos" → `/biblioteca`.
7. **Stats y actividad en vivo.** Añadir la sección de estadísticas y la de "Actividad en vivo" (ticker + top jugadores, datos ficticios hardcodeados), con enlace "Ver salón" → `/salon`.
8. **Precios y CTA final.** Añadir la sección de precios (plan único + FAQ, CTA → `/auth`) y la sección de CTA final → `/biblioteca`.
9. **Reveal on scroll.** Implementar el efecto de aparición al hacer scroll (IntersectionObserver) sobre las secciones marcadas, con limpieza del observer al desmontar.
10. **Actualizar Nav.** En `app/components/Nav.tsx`, agregar el enlace "Inicio" (→ `/`), cambiar "Biblioteca" para que apunte a `/biblioteca`, y ajustar la detección de sección activa en escritorio y en el panel móvil.
11. **Verificación final.** Recorrer en el navegador Inicio, Biblioteca, Detalle, Auth, Reproductor y Salón, confirmando que todos los enlaces cruzados funcionan como se espera, y que `npm run lint` y `npm run build` terminan sin errores.

## Criterios de aceptación

- [ ] La ruta `/` renderiza la nueva página de Inicio con todas sus secciones (Hero, Por qué Arcade Vault, Juegos disponibles, Stats, Actividad en vivo, Precios, CTA final).
- [ ] La ruta `/biblioteca` renderiza la Biblioteca (buscador, chips de categoría, grid de juegos) igual que antes funcionaba en `/`.
- [ ] El Nav muestra el enlace "Inicio" (apunta a `/`) y el enlace "Biblioteca" (apunta a `/biblioteca`), ambos resaltando correctamente la sección activa, en escritorio y en el menú móvil.
- [ ] Los CTAs de Inicio navegan correctamente: "Explorar juegos" y "Ver todos los juegos" y el CTA final → `/biblioteca`; "Crear cuenta" y el CTA de precios → `/auth`; "Ver salón" → `/salon`; cada mini-tarjeta de juego → `/juegos/[id]` correspondiente.
- [ ] Tras iniciar sesión, crear cuenta o entrar como invitado en `/auth`, se redirige a `/biblioteca` (no a `/`).
- [ ] Los botones "Volver al Vault" en Reproductor, Salón y Detalle navegan a `/biblioteca`.
- [ ] Las secciones marcadas con animación "reveal" aparecen progresivamente al hacer scroll, igual que en la plantilla.
- [ ] El diseño visual de Inicio (colores, tipografías retro, siluetas flotantes, glow neón) coincide con `home.jsx`/`styles.css`.
- [ ] `npm run lint` y `npm run build` finalizan sin errores.

## Decisiones tomadas y descartadas

- **Inicio pasa a vivir en `/` y la Biblioteca se traslada a `/biblioteca`**, replicando el modelo de rutas de la plantilla (donde "Inicio" es la landing en la raíz), en vez de ubicar Inicio en una ruta como `/inicio` y dejar la Biblioteca en `/`.
- **La página "Acerca de" queda fuera de este spec.** El folder de referencia `home-about` incluye `about.jsx`, pero se decidió implementar solo Inicio ahora y dejar Acerca de para un spec futuro, ya que el pedido original fue específicamente sobre el home page.
- **El Nav no agrega un enlace "Acerca de"** en este spec, porque la página correspondiente no existe todavía; se agregará junto con el spec de Acerca de.
- **El ticker de puntuaciones recientes y el top de jugadores de hoy quedan hardcodeados** con los mismos valores ficticios de `home.jsx`, en vez de generarse desde `app/data` o `localStorage`, priorizando fidelidad visual con la plantilla para esta pantalla puramente decorativa/de marketing.
- **El rail "Juegos disponibles ahora" reutiliza `GAMES`** de `app/data/games.ts` (los primeros 6) en vez de duplicar una lista de juegos ficticia aparte, para mantener consistencia con la Biblioteca y el Detalle.

## Riesgos identificados

- Trasladar la Biblioteca de `/` a `/biblioteca` puede dejar algún enlace o redirección interna sin actualizar si no se revisan todos los puntos que hoy asumen que "Volver"/"Iniciar sesión" lleva a `/`; mitigación: grep de `href="/"` y `router.push("/")` en todo `app/` antes de dar por cerrado el paso 2, y verificación manual en el paso 11.
- El observer de "reveal on scroll" (IntersectionObserver) debe desconectarse correctamente al desmontar el componente de Inicio para evitar fugas al navegar entre rutas con el App Router; mitigación: replicar la limpieza (`io.disconnect()`) del `useEffect` tal como está en `home.jsx`.
