"use client";

import Link from "next/link";
import {
  FileText,
  Package,
  Users,
  ShoppingCart,
  Receipt,
  Wallet,
  BarChart3,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { MiniChart, MiniBarChart } from "@/components/dashboard/MiniChart";
import { EarningReportChart } from "@/components/dashboard/EarningReportChart";

const accent = "rgb(79 70 229)"; // indigo-600
const slate = "rgb(100 116 139)";

const topCards = [
  {
    label: "Tráfico / Ventas",
    value: "—",
    change: "15%",
    positive: true,
    chart: "bar" as const,
  },
  {
    label: "Tasa de conversión",
    value: "—",
    change: "10%",
    positive: false,
    chart: "line" as const,
  },
  {
    label: "Reporte de ingresos",
    value: "—",
    change: "8%",
    positive: true,
    chart: "line" as const,
  },
];

const midCards = [
  {
    label: "Duración sesión",
    value: "—",
    change: "25%",
    positive: true,
    chart: "line" as const,
  },
  {
    label: "Usuarios activos",
    value: "—",
    change: "4%",
    positive: true,
    chart: "bar" as const,
  },
];

const progressCards = [
  {
    label: "Ingresos",
    value: "—",
    percent: 70,
    icon: DollarSign,
    iconBg: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
    barColor: "bg-sky-500",
  },
  {
    label: "Utilidad",
    value: "—",
    percent: 50,
    icon: TrendingUp,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    barColor: "bg-emerald-500",
  },
];

const quickLinks = [
  { href: "/dashboard/facturas", label: "Facturas", icon: FileText },
  { href: "/dashboard/productos", label: "Productos", icon: Package },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/compras", label: "Compras", icon: ShoppingCart },
  { href: "/dashboard/gastos", label: "Gastos", icon: Receipt },
  { href: "/dashboard/caja", label: "Caja", icon: Wallet },
  { href: "/dashboard/kardex", label: "Kardex", icon: BarChart3 },
];

function KpiCard({
  label,
  value,
  change,
  positive,
  chart,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  chart: "bar" | "line";
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
        {value}
      </p>
      <p
        className={`mt-1 text-xs sm:text-sm font-medium flex items-center gap-0.5 ${
          positive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {positive ? (
          <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
        )}
        {change} vs período anterior
      </p>
      <div className="mt-3 sm:mt-4 h-12 sm:h-14 -mx-1 overflow-hidden rounded-b-lg">
        {chart === "bar" ? (
          <MiniBarChart color={slate} accentColor={accent} />
        ) : (
          <MiniChart color={accent} />
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-5 md:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8">
        Dashboard
      </h1>

      {/* Top row: 3 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {topCards.map((card) => (
          <KpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            change={card.change}
            positive={card.positive}
            chart={card.chart}
          />
        ))}
      </div>

      {/* Main chart + 2 small cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Reporte de ventas
            </h2>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Opciones"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="min-h-[200px] sm:min-h-[220px] overflow-x-auto -mx-1">
            <div className="min-w-[280px]">
              <EarningReportChart />
            </div>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {midCards.map((card) => (
            <KpiCard
              key={card.label}
              label={card.label}
              value={card.value}
              change={card.change}
              positive={card.positive}
              chart={card.chart}
            />
          ))}
        </div>
      </div>

      {/* Progress cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {progressCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full flex-shrink-0 ${card.iconBg}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                    {card.value}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${card.barColor} transition-all`}
                    style={{ width: `${card.percent}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {card.percent}% del objetivo
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all group"
              >
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                </span>
                <span className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
