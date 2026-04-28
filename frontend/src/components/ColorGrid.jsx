import { motion } from "framer-motion";
import { Lock, Unlock, Copy } from "lucide-react";
import { readableTextOn, hslString } from "../lib/colorUtils";

const ColorCard = ({ color, index, format, onToggleLock, onCopy }) => {
  const textColor = readableTextOn(color.hex);
  const display = format === "HSL" ? hslString(color.hsl) : color.hex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.025,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex-1 flex flex-col border-r border-rule last:border-r-0 group focus-within:z-10"
      data-testid={`color-card-${index}`}
    >
      {/* Color area */}
      <button
        type="button"
        onClick={() => onCopy(color)}
        aria-label={`Copiar código de color ${color.hex}`}
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ backgroundColor: color.hex, color: textColor }}
        data-testid={`copy-color-button-${index}`}
      >
        {/* Hover overlay actions */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          <span
            className="font-mono text-xs uppercase tracking-widest-2 px-3 py-1 border"
            style={{ borderColor: textColor }}
          >
            COPIAR
          </span>
          <Copy className="w-4 h-4" aria-hidden />
        </div>
      </button>

      {/* Footer with code + lock */}
      <div
        className="px-6 py-5 flex items-center justify-between bg-cream border-t border-rule"
      >
        <span
          className="font-mono text-base md:text-lg uppercase tracking-widest text-ink"
          data-testid={`color-code-${index}`}
        >
          {display}
        </span>
        <button
          type="button"
          onClick={() => onToggleLock(color.id)}
          aria-pressed={color.locked}
          aria-label={
            color.locked
              ? `Desbloquear color ${color.hex}`
              : `Bloquear color ${color.hex}`
          }
          className="w-9 h-9 inline-flex items-center justify-center border border-ink/20 hover:border-ink hover:bg-ink hover:text-cream transition-colors"
          data-testid={`lock-color-button-${index}`}
        >
          {color.locked ? (
            <Lock className="w-4 h-4" aria-hidden />
          ) : (
            <Unlock className="w-4 h-4" aria-hidden />
          )}
        </button>
      </div>
    </motion.div>
  );
};

const ColorGrid = ({ colors, format, onToggleLock, onCopy }) => {
  return (
    <div
      className="flex flex-row flex-1 min-h-0 border-y border-rule"
      role="list"
      aria-label="Paleta de colores generada"
      data-testid="color-grid"
    >
      {colors.map((c, i) => (
        <ColorCard
          key={c.id}
          color={c}
          index={i}
          format={format}
          onToggleLock={onToggleLock}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
};

export default ColorGrid;
