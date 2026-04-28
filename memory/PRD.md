# Colorfly Studio · Generador de Paletas — PRD

## Original Problem Statement
Colorfly Studio es una agencia de branding que produce propuestas visuales para más de 300 clientes en distintas ciudades. Para acelerar el flujo creativo del equipo y estandarizar las propuestas iniciales, la empresa necesita una herramienta web simple que permita generar paletas de colores de forma rápida e intuitiva.

Como Desarrollador/a Frontend Junior, el rol es diseñar, implementar y documentar un MVP funcional de una aplicación web estática e interactiva que genere paletas de colores aleatorias, entregando feedback visual inmediato y cumpliendo con buenas prácticas de desarrollo, versionado y accesibilidad.

## User Personas
- **Director(a) de arte / branding lead** — usa la herramienta como punto de partida para mood-boards de clientes.
- **Diseñador(a) junior** — explora paletas, bloquea colores que le gustan y guarda candidatas.

## Architecture
- 100% Frontend (React 19 + Tailwind + framer-motion + sonner toasts).
- Persistencia en `localStorage` bajo la clave `colorfly:savedPalettes`.
- Sin backend (consumo de FastAPI/Mongo no requerido para este MVP).
- Diseño editorial: Bodoni Moda (display) + IBM Plex Mono (códigos) + Outfit (UI), fondo crema #F4F3EE, tinta #121212, grain overlay.

## Core Requirements (Static)
- Botón "Generar paleta" (CTA principal).
- Selector de tamaño 6 / 8 / 9.
- Toggle de formato HEX / HSL.
- Render dinámico del grid según tamaño.
- Microfeedback (toast Sonner) al copiar / guardar / eliminar / restaurar.
- HTML semántico (`<header>`, `<main>`, `<footer>`, `<fieldset>`, `<legend>`).
- Accesibilidad: skip-link, aria-labels, focus visible, contraste auto-calculado para texto sobre tarjeta.

## Implemented (2026-02)
- Generación aleatoria HSL → conversión a RGB / HEX.
- Bloqueo individual por tarjeta (icono Lock/Unlock); colores bloqueados sobreviven a regeneración.
- Click en tarjeta → copia el código (HEX o HSL según formato) al portapapeles + toast.
- Guardar paleta + drawer lateral (Sheet de shadcn) con lista de paletas guardadas, restaurar y eliminar.
- Persistencia en localStorage (lazy `useState` initializer evita race con StrictMode).
- Atajo de teclado: barra **Espacio** regenera (ignora si foco en input/textarea/contenteditable).
- Animación de entrada sutil con framer-motion (sin layout flash al cambiar tamaño).
- Footer con copyright y atajo recordatorio.

## Backlog / Next Tasks
- **P1**: Exportar paleta (CSS vars / JSON / PNG screenshot).
- **P1**: Armonías cromáticas (complementaria, análoga, triádica) además de aleatorio puro.
- **P2**: Editar manualmente un color (color picker por tarjeta).
- **P2**: Drag-to-reorder de tarjetas.
- **P2**: Compartir paleta vía URL (encode hex en query string).
- **P2**: Modo móvil/tablet (actualmente desktop-first según requisito).
- **P2**: Despliegue automático a GitHub Pages (build estático del frontend).

## Test Credentials
N/A — la app no tiene autenticación.
