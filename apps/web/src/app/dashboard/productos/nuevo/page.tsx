"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getStoredUser } from "@/lib/api";
import {
  fetchCategories,
  createProduct,
  type CategoryListItem,
  type CreateProductInput,
} from "@/lib/api";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const orgId = user?.organizationId;
    if (!orgId) {
      setLoadingCategories(false);
      return;
    }
    let cancelled = false;
    fetchCategories(orgId)
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingCategories(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.organizationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const price = parseFloat(salePrice.replace(/,/g, "."));
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (isNaN(price) || price < 0) {
      setError("El precio de venta debe ser un número mayor o igual a 0.");
      return;
    }
    setSubmitting(true);
    try {
      const payload: CreateProductInput = {
        name: name.trim(),
        description: description.trim() || undefined,
        salePrice: price,
        isActive,
      };
      if (costPrice.trim()) {
        const cost = parseFloat(costPrice.replace(/,/g, "."));
        if (!isNaN(cost) && cost >= 0) payload.costPrice = cost;
      }
      if (barcode.trim()) payload.barcode = barcode.trim();
      if (stock.trim()) {
        const n = parseInt(stock, 10);
        if (!isNaN(n) && n >= 0) payload.stock = n;
      }
      if (minStock.trim()) {
        const n = parseInt(minStock, 10);
        if (!isNaN(n) && n >= 0) payload.minStock = n;
      }
      if (categoryId) payload.categoryId = categoryId;
      await createProduct(payload);
      router.push("/dashboard/productos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el producto");
    } finally {
      setSubmitting(false);
    }
  };

  if (user && !user.organizationId) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <p className="text-slate-600 dark:text-slate-400">
          Debes seleccionar una organización para crear productos. Usa la lista de productos y el selector de organización.
        </p>
        <Link
          href="/dashboard/productos"
          className="mt-4 inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="pl-[17px] sm:pl-[21px] md:pl-[25px] pr-3 sm:pr-4 md:pr-5 pt-[6px] pb-4 sm:pb-5 md:pb-6 w-full bg-[#EFF2F5] dark:bg-slate-900 min-h-full">
      <div className="rounded-[2px] bg-white dark:bg-slate-800 shadow-none overflow-hidden">
        {/* Encabezado dentro del cuadro, como en la tabla de productos */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <Link
            href="/dashboard/productos"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Productos
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Nuevo producto
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Completa los datos. La organización se toma de tu sesión.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 md:p-6 space-y-5"
        >
        {error && (
          <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Nombre *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Arroz 1 kg"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Opcional"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="salePrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Precio de venta *
            </label>
            <input
              id="salePrice"
              type="text"
              inputMode="decimal"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="costPrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Costo
            </label>
            <input
              id="costPrice"
              type="text"
              inputMode="decimal"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="Opcional"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="barcode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Código de barras
          </label>
          <input
            id="barcode"
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Opcional"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Stock inicial
            </label>
            <input
              id="stock"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="minStock" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Stock mínimo
            </label>
            <input
              id="minStock"
              type="number"
              min={0}
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Categoría
          </label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={loadingCategories}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-slate-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Producto activo
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : (
              "Crear producto"
            )}
          </button>
          <Link
            href="/dashboard/productos"
            className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </Link>
        </div>
        </form>
      </div>
    </div>
  );
};
