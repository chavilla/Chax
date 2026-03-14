"use client";

import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Overlay móvil: cierra el sidebar al tocar fuera */}
      <div
        role="button"
        tabIndex={-1}
        aria-hidden={!sidebarOpen}
        onClick={closeSidebar}
        onKeyDown={(e) => e.key === "Escape" && closeSidebar()}
        className={`
          fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm transition-opacity
          lg:hidden
          ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <DashboardHeader onMenuClick={openSidebar} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
