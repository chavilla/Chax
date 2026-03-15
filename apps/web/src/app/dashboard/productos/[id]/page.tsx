"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VerProductoPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="pl-[17px] sm:pl-[21px] md:pl-[25px] pr-4 sm:pr-5 md:pr-6 py-4 sm:py-5 md:py-6 bg-[#EFF2F5] dark:bg-slate-900 min-h-full">
      <div className="mb-6">
        <Link
          href="/dashboard/productos"
          className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Detalle del producto</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Vista de producto (ID: {id}). Conectar con la API para cargar datos.
      </p>
    </div>
  );
}
