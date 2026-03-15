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
  ShoppingBag,
  Info,
} from "lucide-react";
import { MiniChart, MiniBarChart } from "@/components/dashboard/MiniChart";
import { EarningReportChart } from "@/components/dashboard/EarningReportChart";

const accent = "rgb(139 92 246)"; // violet-500
const slate = "rgb(100 116 139)";

const kpiCards = [
  {
    label: "Total pedidos",
    value: "—",
    change: "15%",
    positive: true,
    chart: "bar" as const,
    iconBg: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
    icon: ShoppingBag,
  },
  {
    label: "Ingresos totales",
    value: "—",
    change: "10%",
    positive: false,
    chart: "line" as const,
    iconBg: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
    icon: DollarSign,
  },
  {
    label: "Tasa de conversión",
    value: "—",
    change: "8%",
    positive: true,
    chart: "line" as const,
    iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    icon: TrendingUp,
  },
  {
    label: "Ventas del período",
    value: "—",
    change: "25%",
    positive: true,
    chart: "bar" as const,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    icon: BarChart3,
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
  iconBg,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  chart: "bar" | "line";
  iconBg: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-[4px] bg-white dark:bg-slate-800 shadow-none p-4 sm:p-5 flex flex-col">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
        {value}
      </p>
      <p
        className={`mt-1 text-xs font-medium flex items-center gap-0.5 ${
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
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="h-10 sm:h-12 flex-1 min-w-0 -mx-1 overflow-hidden rounded">
          {chart === "bar" ? (
            <MiniBarChart color={slate} accentColor={accent} />
          ) : (
            <MiniChart color={accent} />
          )}
        </div>
        <span
          className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="pl-[17px] sm:pl-[21px] md:pl-[25px] pr-3 sm:pr-4 md:pr-5 pt-[20px] pb-4 sm:pb-5 md:pb-6 bg-[#EFF2F5] dark:bg-slate-900 min-h-full">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
        ¡Bienvenido!
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Resumen de tu negocio. Los datos se conectarán con la API.
      </p>

      {/* Alert banner (white card with violet accent) */}
      <div className="rounded-[4px] bg-white dark:bg-slate-800 shadow-none p-4 mb-6 flex items-start gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
          <Info className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Revisa tus transacciones y facturas recientes
          </p>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Mantén al día el inventario y la caja para un mejor control.
          </p>
          <Link
            href="/dashboard/facturas"
            className="mt-2 inline-flex items-center text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
          >
            Ir a facturas →
          </Link>
        </div>
      </div>

      {/* 4 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {kpiCards.map((card) => (
          <KpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            change={card.change}
            positive={card.positive}
            chart={card.chart}
            iconBg={card.iconBg}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Statistics + Total Revenue panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Statistics panel */}
        <div className="rounded-[4px] bg-white dark:bg-slate-800 shadow-none p-4 sm:p-5 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Estadísticas
            </h2>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Opciones"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-4 w-4" />
              </span>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Ingresos totales</p>
                <p className="font-semibold text-slate-900 dark:text-white">—</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <Receipt className="h-4 w-4" />
              </span>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Gastos totales</p>
                <p className="font-semibold text-slate-900 dark:text-white">—</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                <BarChart3 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Capital invertido</p>
                <p className="font-semibold text-slate-900 dark:text-white">—</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <Wallet className="h-4 w-4" />
              </span>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Ahorro neto</p>
                <p className="font-semibold text-slate-900 dark:text-white">—</p>
              </div>
            </div>
          </div>
          <div className="min-h-[180px] overflow-x-auto -mx-1">
            <div className="min-w-[260px]">
              <EarningReportChart />
            </div>
          </div>
        </div>

        {/* Total Revenue panel */}
        <div className="rounded-[4px] bg-white dark:bg-slate-800 shadow-none p-4 sm:p-5 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Ingresos totales
            </h2>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Opciones"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Ingresos</span>
              <span className="font-semibold text-slate-900 dark:text-white">—</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Gastos</span>
              <span className="font-semibold text-slate-900 dark:text-white">—</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Inversión</span>
              <span className="font-semibold text-slate-900 dark:text-white">—</span>
            </div>
          </div>
          <div className="min-h-[180px] overflow-x-auto -mx-1">
            <div className="min-w-[280px] h-[180px] flex items-center justify-center">
              <MiniChart color={accent} />
            </div>
          </div>
        </div>
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
                className="flex items-center gap-2 sm:gap-3 rounded-[2px] bg-white dark:bg-slate-800 shadow-none p-3 sm:p-4 transition-all group"
              >
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 group-hover:bg-violet-200 dark:group-hover:bg-violet-800/50">
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
