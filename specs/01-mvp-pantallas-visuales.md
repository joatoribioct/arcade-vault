# 01 — MVP Pantallas Visuales

- **Estado:** Implementado
- **Depende de:** Ninguno
- **Fecha:** 2026-09-19

**Objetivo:** Implementar la capa visual completa del MVP de Arcade Vault (Biblioteca, Detalle de juego, Reproductor, Autenticación y Salón de la Fama) en Next.js/Tailwind, replicando fielmente el diseño de las plantillas de referencia con datos ficticios, sin implementar lógica real de ningún juego.

## Alcance

**Incluye:**

- Las 5 pantallas de `references/resources/templates/` más la navegación compartida (Nav), migradas a Next.js App Router.
- Rutas en español: `/` (Biblioteca), `/juegos/[id]` (Detalle), `/juegos/[id]/jugar` (Reproductor), `/auth` (Autenticación), `/salon` (Salón de la Fama).
- `app/data/` con los juegos, jugadores y el generador de puntuaciones pseudoaleatorio, tipados en TypeScript, con el mismo contenido ficticio que `data.jsx` (pensado para que a futuro se reemplace por una fuente de datos real).
- Sesión de usuario mock persistida en `localStorage` (iniciar sesión / crear cuenta / invitado, sin validar credenciales; sin backend ni autenticación real).
- Guardado de la puntuación final en `localStorage` al terminar una "partida" simulada.
- Reproductor con incremento automático de puntuación simulado (`setInterval`), estados de pausa y fin de partida, y reinicio.
- Diseño visual a medida (scanlines, glow neón, efecto CRT, tipografía pixel) portado desde `styles.css` a `app/globals.css`.
- Fuentes retro (Press Start 2P, Courier Prime, JetBrains Mono) vía `next/font/google`, reemplazando Geist.
- Menú móvil (hamburguesa) igual que la plantilla.

**No incluye:**

- Lógica real de ningún juego (colisiones, motor de juego, controles de teclado/táctil reales). El área de juego del Reproductor es decorativa/estática; solo el número de puntuación se anima.
- Autenticación real, backend o base de datos. Todo dato vive en `app/data` (mock) y `localStorage`.
- Login social real con Google/GitHub — los botones son decorativos, sin OAuth.
- Sistema de créditos/monedas funcional — el contador "CRÉDITOS · 03" es un valor fijo decorativo.
- Tests automatizados (el proyecto no tiene test runner configurado).
- Internacionalización o soporte multi-idioma.
- Accesibilidad avanzada más allá de lo que ya trae la plantilla de referencia.
- Persistencia real multi-dispositivo o sincronización entre usuarios — solo `localStorage` del navegador.

## Modelo de datos

Todo el contenido ficticio vive en `app/data/`, con el mismo contenido que las plantillas de referencia:

- `app/data/types.ts` — tipos compartidos:
  - `Game`: `{ id, title, short, long, cat, cover, color, best, plays }`
  - `ScoreRow`: `{ rank, name, score, date }`
  - `User`: `{ name: string }`
- `app/data/games.ts` — exporta `GAMES: Game[]` (los 8 juegos de `data.jsx`) y `CATS: string[]`.
- `app/data/scores.ts` — exporta `PLAYERS: string[]` y `seededScores(seed: number, count?: number): ScoreRow[]` (mismo generador pseudoaleatorio determinista de la plantilla).

Persistencia en `localStorage` (mock, sin backend):

- `av_user` — usuario de sesión actual (`User | null`).
- `av_scores` — arreglo de puntuaciones guardadas al terminar una partida (`{ game: string, score: number, name: string, at: number }[]`).

## Plan de implementación

1. **Fuentes y estilos base.** Configurar `next/font/google` (Press Start 2P, Courier Prime, JetBrains Mono) en `app/layout.tsx` y portar `styles.css` a `app/globals.css` (tokens de color/tipografía, fondo, scanlines, estilos base de componentes).
2. **Capa de datos.** Crear `app/data/types.ts`, `app/data/games.ts` y `app/data/scores.ts` con el contenido de la plantilla, tipado en TypeScript.
3. **Estado de sesión.** Crear un componente cliente (`app/providers.tsx`) con un Context para `user` (login/logout) que lee/escribe `av_user` en `localStorage`, y envolver `app/layout.tsx` con él.
4. **Navegación compartida.** Implementar `Nav` (componente cliente) con `next/navigation` (`usePathname`, `Link`) replicando `nav.jsx`: logo, enlaces Biblioteca/Salón, contador de créditos fijo, botón de sesión, menú móvil.
5. **Pantalla Biblioteca (`/`).** Buscador, chips de categoría y grid de tarjetas de juego (`GameCard`) que enlazan a `/juegos/[id]`.
6. **Pantalla Detalle (`/juegos/[id]`).** Portada, información del juego, tabla de mejores puntuaciones (`seededScores`), botones "Jugar Ahora" / "Volver al Vault".
7. **Pantalla Auth (`/auth`).** Tabs iniciar sesión / crear cuenta, formulario mock (acepta cualquier valor sin validar), botón de invitado, botones sociales decorativos; al enviar, actualiza el contexto de sesión y navega a `/`.
8. **Pantalla Reproductor (`/juegos/[id]/jugar`).** HUD (jugador, puntuación, vidas, nivel), área "CRT" decorativa, puntuación con incremento automático simulado, pausa/reanudar, fin de partida con modal para guardar la puntuación (persistida en `av_scores`) y reinicio.
9. **Pantalla Salón de la Fama (`/salon`).** Tabs por juego, podio (top 3) y tabla de puntuaciones, con fila destacada de la posición del usuario si hay sesión iniciada.
10. **Verificación final.** Recorrer las 5 pantallas navegando entre ellas en el navegador, y confirmar que `npm run lint` y `npm run build` terminan sin errores.

## Criterios de aceptación

- [ ] Existen las rutas `/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/auth` y `/salon`, y todas renderizan sin errores.
- [ ] La `Nav` se muestra en todas las pantallas, resalta la sección activa y funciona en móvil (menú hamburguesa).
- [ ] `app/data` contiene los 8 juegos, categorías, jugadores y el generador `seededScores`, tipados en TypeScript.
- [ ] Biblioteca filtra los juegos por texto de búsqueda y por categoría en tiempo real.
- [ ] Detalle muestra la información del juego seleccionado y su tabla de mejores puntuaciones.
- [ ] Auth permite iniciar sesión, crear cuenta o entrar como invitado (sin validar credenciales) y redirige a la Biblioteca; el usuario queda persistido en `localStorage` (`av_user`).
- [ ] Reproductor muestra un HUD con puntuación que sube automáticamente, permite pausar/reanudar y finalizar la partida, y al finalizar muestra un modal para guardar la puntuación (persistida en `localStorage` bajo `av_scores`) o reiniciar.
- [ ] Salón de la Fama permite cambiar entre juegos, muestra el podio top 3 y la tabla completa, y resalta la marca del usuario si hay sesión iniciada.
- [ ] El diseño visual (colores, tipografías retro, scanlines, efecto CRT, glow neón) coincide con la plantilla de referencia.
- [ ] `npm run lint` y `npm run build` finalizan sin errores.
- [ ] Ninguna pantalla implementa lógica real de juego (sin colisiones, sin motor, sin controles reales).

## Decisiones tomadas y descartadas

- **Rutas en español** (`/juegos/[id]`, `/salon`, `/auth`) en vez de inglés, para mantener consistencia con el idioma y el naming de la plantilla.
- **Persistencia mock vía `localStorage`** (`av_user`, `av_scores`) igual que la plantilla, aceptando que no hay backend real; se documenta como deuda técnica esperada para una spec futura de autenticación/backend real.
- **Se mantiene el incremento automático de puntuación** en el Reproductor como simulación visual (no como lógica de juego real) — decorativo, no jugable.
- **Los botones de login social** (Google/GitHub) quedan decorativos; implementar OAuth real queda fuera de este spec.
- **Se porta el CSS a medida de la plantilla casi tal cual** a `app/globals.css`, en lugar de reconstruir el diseño con utilidades Tailwind, priorizando fidelidad visual y velocidad para el MVP. Los tokens de color/fuente del tema retro se añaden vía `@theme inline`, siguiendo la convención de Tailwind v4 ya usada en el proyecto (sin `tailwind.config.*`).
- **Se reemplazan las fuentes Geist** del scaffold por Press Start 2P / Courier Prime / JetBrains Mono, para fidelidad 1:1 con la plantilla.
- **Los datos ficticios se reutilizan tal cual** desde la plantilla y se colocan en `app/data/`, anticipando que esa carpeta se reemplace a futuro por llamadas a una base de datos real.
- **No se agregan tests automatizados** porque el proyecto no tiene test runner configurado (fuera de alcance de este spec).

## Riesgos identificados

- El CSS a medida portado "casi tal cual" puede chocar con el reset/utilidades de Tailwind v4 si no se aísla bien (ej. `box-sizing`, estilos de botones/inputs); mitigación: revisar visualmente cada pantalla tras portar los estilos.
- El routing por hash de la plantilla (SPA) difiere del App Router de Next.js (rutas reales, `params` de servidor); puede haber pequeños desajustes de comportamiento. Mitigación: usar componentes cliente donde se necesite estado/interactividad y `next/navigation` para la navegación.
- Persistir usuario y puntuaciones solo en `localStorage` implica que los datos no se comparten entre dispositivos ni son una fuente de verdad confiable; se acepta como parte del alcance de este MVP.
