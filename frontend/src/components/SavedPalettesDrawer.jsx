import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet";
import { Trash2, RotateCcw, Bookmark } from "lucide-react";

const SavedPalettesDrawer = ({
  open,
  onOpenChange,
  saved,
  onRestore,
  onDelete,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="hidden"
          aria-hidden
          data-testid="saved-palettes-trigger-hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-cream border-l border-rule p-0 sm:max-w-md w-[420px] [&>button]:text-ink"
        data-testid="saved-palettes-drawer"
      >
        <SheetHeader className="px-8 pt-10 pb-6 border-b border-rule">
          <SheetTitle className="font-serif text-3xl text-ink tracking-tight">
            Paletas guardadas
          </SheetTitle>
          <SheetDescription className="font-mono text-xs uppercase tracking-widest-2 text-muted2">
            Almacenadas localmente · {saved.length} ítems
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100%-140px)]">
          {saved.length === 0 ? (
            <div
              className="px-8 py-16 text-center text-muted2"
              data-testid="saved-palettes-empty"
            >
              <Bookmark className="w-6 h-6 mx-auto mb-3 opacity-60" />
              <p className="font-sans text-sm">
                Aún no tienes paletas guardadas.
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest-2 mt-2 text-muted2">
                Genera una paleta y presiona "Guardar"
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-rule">
              {saved.map((p) => (
                <li
                  key={p.id}
                  className="px-8 py-5"
                  data-testid={`saved-palette-${p.id}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] uppercase tracking-widest-2 text-muted2">
                      {new Date(p.createdAt).toLocaleString("es", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onRestore(p)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-ink/20 hover:bg-ink hover:text-cream font-mono text-[10px] uppercase tracking-widest-2 transition-colors"
                        aria-label="Restaurar paleta"
                        data-testid={`restore-palette-${p.id}`}
                      >
                        <RotateCcw className="w-3 h-3" aria-hidden />
                        Restaurar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(p.id)}
                        className="inline-flex items-center justify-center w-7 h-7 border border-ink/20 hover:bg-ink hover:text-cream transition-colors"
                        aria-label="Eliminar paleta"
                        data-testid={`delete-palette-${p.id}`}
                      >
                        <Trash2 className="w-3 h-3" aria-hidden />
                      </button>
                    </div>
                  </div>
                  <div className="flex h-14 border border-rule">
                    {p.colors.map((c, i) => (
                      <div
                        key={i}
                        className="flex-1"
                        style={{ backgroundColor: c.hex }}
                        title={c.hex}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                    {p.colors.map((c, i) => (
                      <span
                        key={i}
                        className="font-mono text-[10px] uppercase tracking-widest-2 text-muted2"
                      >
                        {c.hex}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SavedPalettesDrawer;
