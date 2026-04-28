/* Color generation & conversion utilities for Colorfly Studio. */

/** Generate a random hue 0-359, with constrained saturation/lightness for visually pleasing results. */
export function randomHsl() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(35 + Math.random() * 55); // 35-90
  const l = Math.floor(28 + Math.random() * 52); // 28-80
  return { h, s, l };
}

/** Convert HSL (h:0-360, s:0-100, l:0-100) -> {r,g,b} 0-255 */
export function hslToRgb({ h, s, l }) {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/** {r,g,b} -> "#RRGGBB" */
export function rgbToHex({ r, g, b }) {
  const toHex = (n) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/** "hsl(h, s%, l%)" string */
export function hslString({ h, s, l }) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/** Build a complete color object from an HSL value */
export function buildColor(hsl, locked = false, id = undefined) {
  const rgb = hslToRgb(hsl);
  const hex = rgbToHex(rgb);
  return {
    id: id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    hsl,
    rgb,
    hex,
    locked,
  };
}

/** Generate a fresh random color object */
export function randomColor() {
  return buildColor(randomHsl());
}

/** Determine if a hex color is light (so we should use dark text) */
export function isLight(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150;
}

/** Returns "dark" or "light" contrast color suggestion for text on top of the given hex */
export function readableTextOn(hex) {
  return isLight(hex) ? "#121212" : "#F4F3EE";
}
