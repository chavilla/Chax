"use client";

import { useEffect, useState } from "react";
import { Package, RefreshCw, AlertCircle } from "lucide-react";
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

  return (
    <div className="p-4 sm:p-5 md:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Productos
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Productos de tu organización. El listado se obtiene según tu sesión.
        </p>
      </header>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {isSuperAdmin && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="org-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Organización
          </label>
          <select
            id="org-select"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            disabled={loading}
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-0 max-w-md"
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
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 text-center text-slate-500 dark:text-slate-400">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Selecciona una organización.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 text-center text-slate-500 dark:text-slate-400">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No hay productos en esta organización.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Código</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Nombre</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">P. venta</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Stock</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Activo</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                      {p.internalCode}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{p.name}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {formatMoney(p.salePrice)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {p.stock}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          p.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                        }`}
                        title={p.isActive ? "Activo" : "Inactivo"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {products.length} producto{products.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
