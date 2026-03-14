"use client";

import { useId } from "react";

/**
 * Pequeño gráfico de área tipo sparkline (ondulado suave).
 * Acepta datos opcionales; si no hay, muestra una curva de ejemplo.
 */
const sampleData = [0, 20, 18, 35, 28, 45, 38, 52, 48, 60, 55, 72, 68, 80];

function buildPaths(
  values: number[],
  width: number,
  height: number
): { area: string; line: string } {
  const len = values.length;
  if (len === 0) return { area: "", line: "" };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (len - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const area = `M 0,${height} L ${points.join(" L ")} L ${width},${height} Z`;
  const line = `M ${points.join(" L ")}`;
  return { area, line };
}

const barData = [40, 65, 50, 75, 55, 85, 70, 90, 78, 95];

export function MiniChart({
  data = sampleData,
  color = "rgb(79 70 229)",
  className = "",
}: {
  data?: number[];
  color?: string;
  className?: string;
}) {
  const gradId = useId().replace(/:/g, "");
  const width = 280;
  const height = 56;
  const { area, line } = buildPaths(data, width, height);

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
    </svg>
  );
}

/** Minigráfico de barras (estilo Website Traffic / Active Users) */
export function MiniBarChart({
  data = barData,
  color = "rgb(100 116 139)",
  accentColor = "rgb(79 70 229)",
  className = "",
}: {
  data?: number[];
  color?: string;
  accentColor?: string;
  className?: string;
}) {
  const width = 280;
  const height = 56;
  const max = Math.max(...data);
  const barW = width / data.length - 2;
  const gap = 2;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
    >
      {data.map((v, i) => {
        const barH = (v / max) * (height - 4);
        const x = i * (barW + gap) + gap;
        const y = height - barH;
        const useAccent = i % 3 === 0;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={barH}
            rx={2}
            fill={useAccent ? accentColor : color}
            opacity={useAccent ? 0.9 : 0.5}
          />
        );
      })}
    </svg>
  );
}
