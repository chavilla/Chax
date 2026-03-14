"use client";

/**
 * Gráfico principal: barras + línea por mes (estilo Earning Reports).
 */
const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"];
const barValues = [400, 520, 380, 600, 480, 720, 650];
const lineValues = [420, 500, 450, 580, 520, 680, 640];

export function EarningReportChart() {
  const width = 520;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 36, left: 44 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = Math.max(...barValues, ...lineValues);
  const barW = chartW / months.length - 8;
  const gap = 8;

  const getY = (v: number) =>
    padding.top + chartH - (v / maxVal) * chartH;
  const getBarX = (i: number) =>
    padding.left + i * (barW + gap) + gap / 2;

  const linePoints = lineValues
    .map((v, i) => {
      const x = getBarX(i) + barW / 2;
      const y = getY(v);
      return `${x},${y}`;
    })
    .join(" L ");

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={padding.left}
          y1={padding.top + chartH * (1 - p)}
          x2={width - padding.right}
          y2={padding.top + chartH * (1 - p)}
          stroke="currentColor"
          strokeOpacity={0.08}
          strokeDasharray="4 4"
        />
      ))}
      {/* Bars */}
      {barValues.map((v, i) => (
        <rect
          key={i}
          x={getBarX(i)}
          y={getY(v)}
          width={barW}
          height={chartH - (getY(v) - padding.top)}
          rx={4}
          fill="rgb(79 70 229)"
          opacity={0.85}
        />
      ))}
      {/* Line */}
      <path
        d={`M ${linePoints}`}
        fill="none"
        stroke="rgb(79 70 229)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* X labels */}
      {months.map((label, i) => (
        <text
          key={label}
          x={getBarX(i) + barW / 2}
          y={height - 8}
          textAnchor="middle"
          className="fill-slate-500 dark:fill-slate-400 text-[10px] font-medium"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
