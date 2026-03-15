"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Moon, Sun, Search, Menu, LogOut, Bell, Settings } from "lucide-react";
import { getStoredUser, logout } from "@/lib/api";

const pathToBreadcrumbs: Record<string, string[]> = {
  "/dashboard": ["Dashboard"],
  "/dashboard/facturas": ["Facturas"],
  "/dashboard/facturas/nueva": ["Facturas", "Crear factura"],
  "/dashboard/productos": ["Productos"],
  "/dashboard/productos/nuevo": ["Productos", "Nuevo producto"],
  "/dashboard/clientes": ["Clientes"],
  "/dashboard/clientes/nuevo": ["Clientes", "Nuevo cliente"],
  "/dashboard/gastos": ["Gastos"],
  "/dashboard/gastos/nuevo": ["Gastos", "Nuevo gasto"],
  "/dashboard/caja": ["Caja"],
  "/dashboard/compras": ["Compras"],
  "/dashboard/kardex": ["Kardex"],
};

function getBreadcrumbs(pathname: string): string[] {
  if (pathToBreadcrumbs[pathname]) return pathToBreadcrumbs[pathname];
  const base = pathname.split("/").slice(0, 3).join("/");
  const rest = pathname.slice(base.length + 1).split("/").filter(Boolean);
  const baseLabels = pathToBreadcrumbs[base];
  if (baseLabels) return [...baseLabels, ...rest.map((s) => s.charAt(0).toUpperCase() + s.slice(1))];
  return pathname.split("/").filter(Boolean).slice(1).map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

type DashboardHeaderProps = { onMenuClick?: () => void };

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("Usuario");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const user = getStoredUser();
    setUserName(user?.name ?? user?.email ?? "Usuario");
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const segments = getBreadcrumbs(pathname);
  const breadcrumbs = ["Chax", ...segments];

  return (
    <header className="sticky top-0 z-20 h-20 flex items-center justify-between gap-2 sm:gap-4 pl-[17px] sm:pl-[21px] md:pl-[25px] pr-3 sm:pr-4 md:pr-5 py-4 bg-[#EFF2F5] dark:bg-slate-900">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors lg:hidden flex-shrink-0"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Breadcrumbs - indentados para alinear con el cuadro blanco */}
        <nav className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 min-w-0 items-center">
          {breadcrumbs.map((label, i) => (
            <span key={i} className="flex items-center gap-1 shrink-0">
              {i > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
              {i === 0 ? (
                <Link href="/dashboard" className="font-medium text-violet-600 dark:text-violet-400 hover:underline truncate">
                  {label}
                </Link>
              ) : i === breadcrumbs.length - 1 ? (
                <span className="font-medium text-slate-900 dark:text-white truncate">{label}</span>
              ) : (
                <span className="truncate">{label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <div className="relative w-32 sm:w-40 md:w-52 hidden sm:flex sm:items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Buscar algo..."
            className="w-full h-9 pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />
        </div>
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/80 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Notificaciones"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/80 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Configuración"
          aria-label="Configuración"
        >
          <Settings className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/80 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Modo oscuro"
          aria-label="Alternar tema"
        >
          <Moon className="h-5 w-5 dark:hidden" />
          <Sun className="h-5 w-5 hidden dark:block" />
        </button>
        <div className="hidden md:flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 font-semibold text-xs">
            {mounted ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
            {mounted ? userName : "Usuario"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/80 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}
