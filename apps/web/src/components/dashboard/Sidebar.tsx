"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { getStoredUser } from "@/lib/api";

type NavItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: { href: string; label: string }[];
};

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "NAVEGACIÓN",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "VENTAS",
    items: [
      {
        href: "/dashboard/facturas",
        label: "Facturas",
        icon: FileText,
        children: [
          { href: "/dashboard/facturas", label: "Ver facturas" },
          { href: "/dashboard/facturas/nueva", label: "Crear factura" },
        ],
      },
      { href: "/dashboard/caja", label: "Caja", icon: Wallet },
    ],
  },
  {
    title: "INVENTARIO",
    items: [
      {
        href: "/dashboard/productos",
        label: "Productos",
        icon: Package,
        children: [
          { href: "/dashboard/productos", label: "Ver productos" },
          { href: "/dashboard/productos/nuevo", label: "Crear producto" },
        ],
      },
      { href: "/dashboard/compras", label: "Compras", icon: ShoppingCart },
      { href: "/dashboard/kardex", label: "Kardex", icon: BarChart3 },
    ],
  },
  {
    title: "MAESTROS",
    items: [
      {
        href: "/dashboard/clientes",
        label: "Clientes",
        icon: Users,
        children: [
          { href: "/dashboard/clientes", label: "Ver clientes" },
          { href: "/dashboard/clientes/nuevo", label: "Crear cliente" },
        ],
      },
    ],
  },
  {
    title: "OPERACIÓN",
    items: [
      {
        href: "/dashboard/gastos",
        label: "Gastos",
        icon: Receipt,
        children: [
          { href: "/dashboard/gastos", label: "Ver gastos" },
          { href: "/dashboard/gastos/nuevo", label: "Crear gasto" },
        ],
      },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

type SidebarProps = { isOpen?: boolean; onClose?: () => void };

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [collapsedByUser, setCollapsedByUser] = useState<Set<string>>(new Set());

  useEffect(() => {
    let next: string | null = null;
    for (const section of sections) {
      for (const item of section.items) {
        if (item.children?.some((c) => isActive(pathname, c.href))) {
          next = item.href;
          setCollapsedByUser((prev) => {
            const nextSet = new Set(prev);
            nextSet.delete(item.href);
            return nextSet;
          });
          break;
        }
      }
      if (next) break;
    }
    setExpanded(next);
  }, [pathname]);

  const user = getStoredUser();
  const userName = user?.name ?? user?.email ?? "Usuario";
  const userRole = user?.role === "SUPER_ADMIN" ? "Super admin" : user?.role === "ADMIN" ? "Administrador" : "Usuario";

  return (
    <>
      <aside
        className={`
          w-[240px] flex-shrink-0 flex flex-col h-screen lg:h-full bg-white dark:bg-slate-800
          fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo - fijo arriba */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 pb-2 px-4">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="text-xl font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            Chax
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Espaciador fijo: la barra de scroll empieza justo donde empieza el cuadro de usuario */}
        <div className="flex-shrink-0 h-8" aria-hidden />

        {/* Zona con scroll: gutter estable = mismo ancho con o sin barra de scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-auto-hide scrollbar-gutter-stable">
          {/* User - margen derecho reducido para acercar al borde derecho del sidebar */}
          <div className="mt-1 ml-3 mr-0.5 py-3.5 px-3 bg-slate-50/80 dark:bg-slate-900/50 min-h-[5rem] flex items-center rounded-lg">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 font-semibold text-sm flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userRole}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="pl-3 pr-0 pt-3 pb-3">
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6c757d] dark:text-[#6c757d]">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const hasChildren = item.children && item.children.length > 0;
                  const isParentActive = hasChildren && item.children!.some((c) => isActive(pathname, c.href));
                  const isManuallyCollapsed = collapsedByUser.has(item.href);
                  const isOpenGroup = (expanded === item.href || isParentActive) && !isManuallyCollapsed;

                  if (hasChildren) {
                    return (
                      <li key={item.href}>
                        <button
                          type="button"
                          onClick={() => {
                            if (isOpenGroup) {
                              setCollapsedByUser((prev) => new Set(prev).add(item.href));
                              setExpanded(null);
                            } else {
                              setCollapsedByUser((prev) => {
                                const next = new Set(prev);
                                next.delete(item.href);
                                return next;
                              });
                              setExpanded(item.href);
                            }
                          }}
                          className={`
                            w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                            ${isOpenGroup ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-l-2 border-violet-500 -ml-[2px] pl-[14px]" : "text-[#6c757d] dark:text-[#6c757d] hover:bg-slate-100 dark:hover:bg-slate-700"}
                          `}
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            {Icon && <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={2} />}
                            {item.label}
                          </span>
                          {isOpenGroup ? (
                            <ChevronDown className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 flex-shrink-0" />
                          )}
                        </button>
                        <div
                          className="grid transition-[grid-template-rows] duration-200 ease-out"
                          style={{ gridTemplateRows: isOpenGroup ? "1fr" : "0fr" }}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <ul className="mt-0.5 ml-4 pl-3 space-y-0.5">
                              {item.children!.map((child) => {
                                const childActive = isActive(pathname, child.href);
                                return (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      onClick={onClose}
                                      className={`
                                        block px-2 py-2 rounded-lg text-sm transition-colors
                                        ${childActive ? "text-violet-600 dark:text-violet-400 font-medium" : "text-[#6c757d] dark:text-[#6c757d] hover:text-slate-900 dark:hover:text-slate-200"}
                                      `}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </li>
                    );
                  }

                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                          ${active ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-l-2 border-violet-500 -ml-[2px] pl-[14px]" : "text-[#6c757d] dark:text-[#6c757d] hover:bg-slate-100 dark:hover:bg-slate-700"}
                        `}
                      >
                        {Icon && <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={2} />}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          </nav>
        </div>

        <div className="flex-shrink-0 p-3">
          <p className="px-3 text-xs text-slate-400 dark:text-slate-500">Facturación e inventario</p>
        </div>
      </aside>
    </>
  );
}
