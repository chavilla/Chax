"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  ShoppingCart,
  Receipt,
  Wallet,
  BarChart3,
  X,
} from "lucide-react";

const sections = [
  {
    title: "MENÚ",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "VENTAS",
    items: [
      { href: "/dashboard/facturas", label: "Facturas", icon: FileText },
      { href: "/dashboard/caja", label: "Caja", icon: Wallet },
    ],
  },
  {
    title: "INVENTARIO",
    items: [
      { href: "/dashboard/productos", label: "Productos", icon: Package },
      { href: "/dashboard/compras", label: "Compras", icon: ShoppingCart },
      { href: "/dashboard/kardex", label: "Kardex", icon: BarChart3 },
    ],
  },
  {
    title: "MAESTROS",
    items: [
      { href: "/dashboard/clientes", label: "Clientes", icon: Users },
    ],
  },
  {
    title: "OPERACIÓN",
    items: [
      { href: "/dashboard/gastos", label: "Gastos", icon: Receipt },
    ],
  },
];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose?.();
  }, [pathname, onClose]);

  return (
    <>
      <aside
        className={`
          w-64 flex-shrink-0 flex flex-col bg-slate-100 dark:bg-slate-900/80 border-r border-slate-200 dark:border-slate-800
          fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors"
            onClick={onClose}
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-sm">
              C
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              Chax
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                          ${
                            isActive
                              ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800"
                          }
                        `}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <p className="px-3 text-xs text-slate-500 dark:text-slate-400">
            Facturación e inventario
          </p>
        </div>
      </aside>
    </>
  );
}
