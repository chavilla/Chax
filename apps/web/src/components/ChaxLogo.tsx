type ChaxLogoProps = {
  /** Tamaño del bloque logo (icono + texto) */
  size?: "sm" | "md" | "lg";
  /** Mostrar la palabra "Chax" junto al icono */
  showWordmark?: boolean;
  /** Mostrar el tagline "Facturación e inventario" (solo con wordmark) */
  showTagline?: boolean;
  /** horizontal = icono al lado del texto; vertical = icono arriba (para login) */
  layout?: "horizontal" | "vertical";
  /** Clase extra para el contenedor */
  className?: string;
};

const sizeClasses = {
  sm: { icon: "h-9 w-9", text: "text-lg", gap: "gap-2.5" },
  md: { icon: "h-11 w-11", text: "text-xl", gap: "gap-3" },
  lg: { icon: "h-16 w-16", text: "text-2xl", gap: "gap-4" },
};

export function ChaxLogo({
  size = "md",
  showWordmark = true,
  showTagline = false,
  layout = "horizontal",
  className = "",
}: ChaxLogoProps) {
  const s = sizeClasses[size];
  const isVertical = layout === "vertical";

  return (
    <div
      className={`flex flex-col items-center ${isVertical ? "gap-4" : ""} ${className}`}
    >
      <div
        className={`flex ${isVertical ? "flex-col items-center" : "items-center"} ${showWordmark ? s.gap : ""}`}
      >
        {/* Icono: squircle violeta + curva blanca tipo swoosh / C */}
        <div
          className={`${s.icon} flex-shrink-0 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 shadow-xl shadow-indigo-500/30 flex items-center justify-center ring-1 ring-black/5`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-[58%] h-[58%]"
            aria-hidden
          >
            <path
              d="M7 6.5C5 10 6 16 10 19.5c2 1.5 5 2 8 .5"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {showWordmark && (
          <div className={`flex flex-col ${isVertical ? "items-center text-center" : ""}`}>
            <span
              className={`${s.text} font-bold tracking-tight text-slate-800 dark:text-white`}
            >
              Chax
            </span>
            {showTagline && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Facturación e inventario
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
