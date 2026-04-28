import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Bookmark, Sparkles, Save } from "lucide-react";
import { randomColor, hslString } from "../lib/colorUtils";
import ColorGrid from "./ColorGrid";
import SavedPalettesDrawer from "./SavedPalettesDrawer";

const SIZES = [6, 8, 9];
const FORMATS = ["HEX", "HSL"];
const STORAGE_KEY = "colorfly:savedPalettes";

const generatePalette = (size, baseColors = []) => {
  const next = [];
  for (let i = 0; i < size; i++) {
    const existing = baseColors[i];
    if (existing && existing.locked) {
      next.push(existing);
    } else {
      next.push(randomColor());
    }
  }
  return next;
};

const PaletteGenerator = () => {
  const [size, setSize] = useState(6);
  const [format, setFormat] = useState("HEX");
  const [colors, setColors] = useState(() => generatePalette(6));
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Persist saved palettes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* ignore quota errors */
    }
  }, [saved]);

  const handleGenerate = useCallback(() => {
    setColors((prev) => generatePalette(size, prev));
  }, [size]);

  const handleSizeChange = useCallback((newSize) => {
    setSize(newSize);
    setColors((prev) => generatePalette(newSize, prev));
  }, []);

  const handleToggleLock = useCallback((id) => {
    setColors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c))
    );
  }, []);

  const handleCopy = useCallback(
    (color) => {
      const value = format === "HSL" ? hslString(color.hsl) : color.hex;
      try {
        navigator.clipboard.writeText(value);
        toast(`Copiado · ${value}`, {
          description: "Código de color en el portapapeles.",
        });
      } catch {
        toast.error("No se pudo copiar el color");
      }
    },
    [format]
  );

  const handleSave = useCallback(() => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      colors: colors.map((c) => ({
        hex: c.hex,
        hsl: c.hsl,
        rgb: c.rgb,
      })),
    };
    setSaved((prev) => [entry, ...prev].slice(0, 50));
    toast("Paleta guardada", {
      description: "Disponible en el panel de paletas guardadas.",
    });
  }, [colors]);

  const handleDeleteSaved = useCallback((id) => {
    setSaved((prev) => prev.filter((p) => p.id !== id));
    toast("Paleta eliminada");
  }, []);

  const handleRestoreSaved = useCallback((p) => {
    const restored = p.colors.map((c, i) => ({
      id: `r-${Date.now()}-${i}`,
      hex: c.hex,
      hsl: c.hsl,
      rgb: c.rgb,
      locked: false,
    }));
    setSize(restored.length);
    setColors(restored);
    setDrawerOpen(false);
    toast("Paleta restaurada");
  }, []);

  // Spacebar to regenerate
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable)
        return;
      if (e.code === "Space") {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleGenerate]);

  const lockedCount = useMemo(
    () => colors.filter((c) => c.locked).length,
    [colors]
  );

  return (
    <div className="grain-overlay min-h-screen flex flex-col bg-cream text-ink">
      <a
        href="#main-palette"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-ink focus:text-cream focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:z-50"
      >
        Saltar al contenido
      </a>

      {/* HEADER */}
      <header
        className="px-8 lg:px-12 pt-10 pb-6 border-b border-rule flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between"
        data-testid="hero-header"
      >
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest-2 text-muted2 mb-2">
            Estudio de branding · Generador interno
          </p>
          <h1 className="font-serif font-medium tracking-tight text-5xl md:text-6xl leading-[0.95]">
            Colorfly <em className="italic font-light">Studio</em>
          </h1>
          <p className="mt-3 font-sans text-sm text-muted2 max-w-md">
            Paletas aleatorias con estilo editorial. Pulsa{" "}
            <kbd className="font-mono text-[11px] border border-ink/30 px-1.5 py-0.5">
              Espacio
            </kbd>{" "}
            o el botón para generar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Size selector */}
          <fieldset
            className="inline-flex items-center border border-ink"
            aria-label="Tamaño de paleta"
          >
            <legend className="sr-only">Tamaño de paleta</legend>
            {SIZES.map((s) => (
              <label
                key={s}
                className={`px-4 py-3 font-mono text-xs uppercase tracking-widest-2 cursor-pointer transition-colors ${
                  size === s ? "bg-ink text-cream" : "bg-cream hover:bg-ink/5"
                }`}
              >
                <input
                  type="radio"
                  name="palette-size"
                  value={s}
                  checked={size === s}
                  onChange={() => handleSizeChange(s)}
                  className="sr-only"
                  data-testid={`size-selector-${s}`}
                />
                {s}
              </label>
            ))}
          </fieldset>

          {/* Format toggle */}
          <fieldset
            className="inline-flex items-center border border-ink"
            aria-label="Formato de color"
          >
            <legend className="sr-only">Formato de color</legend>
            {FORMATS.map((f) => (
              <label
                key={f}
                className={`px-4 py-3 font-mono text-xs uppercase tracking-widest-2 cursor-pointer transition-colors ${
                  format === f ? "bg-ink text-cream" : "bg-cream hover:bg-ink/5"
                }`}
              >
                <input
                  type="radio"
                  name="color-format"
                  value={f}
                  checked={format === f}
                  onChange={() => setFormat(f)}
                  className="sr-only"
                  data-testid={`format-toggle-${f}`}
                />
                {f}
              </label>
            ))}
          </fieldset>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-3 border border-ink hover:bg-ink hover:text-cream font-mono text-xs uppercase tracking-widest-2 transition-colors"
            aria-label="Abrir paletas guardadas"
            data-testid="open-saved-palettes"
          >
            <Bookmark className="w-3.5 h-3.5" aria-hidden />
            Guardadas
            <span className="font-mono text-[10px] opacity-70">
              ({saved.length})
            </span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-3 border border-ink hover:bg-ink hover:text-cream font-mono text-xs uppercase tracking-widest-2 transition-colors"
            aria-label="Guardar paleta actual"
            data-testid="save-palette-button"
          >
            <Save className="w-3.5 h-3.5" aria-hidden />
            Guardar
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-cream hover:bg-ink/90 font-mono text-xs uppercase tracking-widest-2 transition-transform active:scale-[0.98]"
            aria-label="Generar nueva paleta"
            data-testid="generate-palette-button"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden />
            Generar paleta
          </button>
        </div>
      </header>

      {/* MAIN GRID */}
      <main
        id="main-palette"
        className="flex flex-col flex-1 px-8 lg:px-12 py-6 min-h-0"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[11px] uppercase tracking-widest-2 text-muted2">
            Paleta · {size} colores · formato {format}
          </p>
          <p
            className="font-mono text-[11px] uppercase tracking-widest-2 text-muted2"
            aria-live="polite"
          >
            {lockedCount > 0
              ? `${lockedCount} bloqueado${lockedCount > 1 ? "s" : ""}`
              : "Sin bloqueos"}
          </p>
        </div>
        <ColorGrid
          colors={colors}
          format={format}
          onToggleLock={handleToggleLock}
          onCopy={handleCopy}
        />
      </main>

      {/* FOOTER */}
      <footer
        className="px-8 lg:px-12 py-5 border-t border-rule flex justify-between font-mono text-[11px] uppercase tracking-widest-2 text-muted2"
        data-testid="footer"
      >
        <span>Colorfly Studio © 2026</span>
        <span>
          Pulsa{" "}
          <kbd className="font-mono text-[10px] border border-ink/30 px-1 py-0.5">
            Espacio
          </kbd>{" "}
          para regenerar · Click en color para copiar
        </span>
      </footer>

      <SavedPalettesDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        saved={saved}
        onRestore={handleRestoreSaved}
        onDelete={handleDeleteSaved}
      />
    </div>
  );
};

export default PaletteGenerator;
