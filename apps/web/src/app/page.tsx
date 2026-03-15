"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChaxLogo } from "@/components/ChaxLogo";
import { loginApi, setToken, setStoredUser } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!usuario.trim()) {
      setError("Ingresa tu correo.");
      return;
    }
    if (!password) {
      setError("Ingresa tu contraseña.");
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await loginApi(usuario.trim(), password);
      setToken(token);
      setStoredUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId ?? null,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <ChaxLogo size="lg" showWordmark showTagline layout="vertical" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm p-6 sm:p-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
            Ingreso
          </h2>

          {error && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="usuario"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Correo
              </label>
              <input
                id="usuario"
                type="email"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Correo o usuario"
                autoComplete="username"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
