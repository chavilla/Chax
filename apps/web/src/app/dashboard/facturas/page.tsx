"use client";

import Link from "next/link";
import { FileText, Plus, Search } from "lucide-react";

export default function FacturasPage() {
  return (
    <div className="pl-[17px] sm:pl-[21px] md:pl-[25px] pr-4 sm:pr-5 md:pr-6 py-4 sm:py-5 md:py-6 bg-[#EFF2F5] dark:bg-slate-900 min-h-full">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">Facturas</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar aquí..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />
        </div>
        <Link
          href="/dashboard/facturas/nueva"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          Agregar factura
        </Link>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center shadow-sm text-slate-500 dark:text-slate-400">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Listado de facturas (conectar con la API).</p>
      </div>
    </div>
  );
}
