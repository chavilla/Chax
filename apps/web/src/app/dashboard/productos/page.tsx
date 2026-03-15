"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, RefreshCw, AlertCircle, Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import {
  fetchOrganizations,
  fetchProducts,
  getStoredUser,
  type OrganizationListItem,
  type ProductListItem,
} from "@/lib/api";

export default function ProductosPage() {
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  useEffect(() => {
    setUser(getStoredUser());
  }, []);
  const isSuperAdmin = user && !user.organizationId;
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setError(null);
    fetchOrganizations()
      .then((data) => {
        if (!cancelled) {
          setOrganizations(data);
          if (data.length > 0 && !selectedOrgId) setSelectedOrgId(data[0].id);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error al cargar organizaciones");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin]);

  useEffect(() => {
    if (user === null) return;
    if (isSuperAdmin && !selectedOrgId) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    setLoadingProducts(true);
    setError(null);
    const orgId = isSuperAdmin ? selectedOrgId : undefined;
    fetchProducts(orgId)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error al cargar productos");
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, isSuperAdmin, selectedOrgId]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

  const filteredProducts = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.internalCode ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div className="pl-[17px] sm:pl-[21px] md:pl-[25px] pr-3 sm:pr-4 md:pr-5 pt-[6px] pb-4 sm:pb-5 md:pb-6 bg-[#EFF2F5] dark:bg-slate-900 min-h-full">
      <div className="rounded-[2px] bg-white dark:bg-slate-800 shadow-none overflow-hidden">
        {/* Cabecera del cuadro: título + buscar + agregar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white shrink-0">
            Productos
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative flex-1 sm:max-w-xs min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar aquí..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
            {!isSuperAdmin && (
              <Link
                href="/dashboard/productos/nuevo"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors shrink-0"
              >
                <Plus className="h-4 w-4" />
                Agregar producto
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {isSuperAdmin && (
          <div className="px-4 sm:px-5 pt-2 pb-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <label htmlFor="org-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Organización
            </label>
            <select
              id="org-select"
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              disabled={loading}
              className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 min-w-0 max-w-md"
            >
              {loading ? (
                <option value="">Cargando...</option>
              ) : organizations.length === 0 ? (
                <option value="">Sin organizaciones</option>
              ) : (
                organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.businessName} ({org.nit})
                  </option>
                ))
              )}
            </select>
            <button
              type="button"
              onClick={() => selectedOrgId && fetchProducts(selectedOrgId).then(setProducts).catch(() => {})}
              disabled={!selectedOrgId || loadingProducts}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loadingProducts ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>
        )}

        {loadingProducts && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mb-3" />
            <p className="text-sm">Cargando productos...</p>
          </div>
        ) : isSuperAdmin && (!selectedOrgId || organizations.length === 0) ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Selecciona una organización.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{search.trim() ? "Ningún producto coincide con la búsqueda." : "No hay productos en esta organización."}</p>
          </div>
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left py-3 px-4 font-semibold text-[#4c4c5c] dark:text-[#4c4c5c] uppercase tracking-wider text-xs">
                    Código
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#4c4c5c] dark:text-[#4c4c5c] uppercase tracking-wider text-xs">
                    Nombre
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-[#4c4c5c] dark:text-[#4c4c5c] uppercase tracking-wider text-xs">
                    P. venta
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-[#4c4c5c] dark:text-[#4c4c5c] uppercase tracking-wider text-xs">
                    Stock
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#4c4c5c] dark:text-[#4c4c5c] uppercase tracking-wider text-xs">
                    Estado
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#4c4c5c] dark:text-[#4c4c5c] uppercase tracking-wider text-xs">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-700/50 last:border-b-0"
                  >
                    <td className="py-3 px-4 text-[#4c4c5c] dark:text-[#4c4c5c] font-mono text-xs">
                      {p.internalCode ?? "—"}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#4c4c5c] dark:text-[#4c4c5c]">{p.name}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-[#4c4c5c] dark:text-[#4c4c5c]">
                      {formatMoney(p.salePrice)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-[#4c4c5c] dark:text-[#4c4c5c]">
                      {p.stock}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.isActive
                            ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                        }`}
                      >
                        {p.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/dashboard/productos/${p.id}`}
                          className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-800/50 transition-colors"
                          title="Ver"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/dashboard/productos/${p.id}/editar`}
                          className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-800/50 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 text-xs text-[#4c4c5c] dark:text-[#4c4c5c] bg-slate-50 dark:bg-slate-700/50">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
