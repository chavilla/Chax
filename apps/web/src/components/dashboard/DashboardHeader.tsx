"use client";

import Link from "next/link";
import { Moon, Sun, HelpCircle, Search, Menu, LogOut } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

type DashboardHeaderProps = {
  onMenuClick?: () => void;
};

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 sm:px-4 md:px-6 py-3">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden flex-shrink-0"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
          <span className="font-medium text-slate-900 dark:text-white">
            {getGreeting()}, Usuario
          </span>
        </p>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 justify-end">
        <div className="relative w-32 sm:w-40 md:max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Modo oscuro"
          aria-label="Alternar tema"
        >
          <Moon className="h-5 w-5 dark:hidden" />
          <Sun className="h-5 w-5 hidden dark:block" />
        </button>
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Ayuda"
          aria-label="Ayuda"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <Link
          href="#"
          className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 whitespace-nowrap hidden min-[420px]:inline"
        >
          Ayuda
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </Link>
      </div>
    </header>
  );
}
