const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "";

const AUTH_TOKEN_KEY = "chax_token";
const AUTH_USER_KEY = "chax_user";

export function getApiUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string | null;
};

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_KEY);
}

export function logout(): void {
  clearToken();
  clearStoredUser();
}

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = getApiUrl(path);
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) ?? {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    logout();
    throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(typeof err.error === "string" ? err.error : "Error en la API");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type LoginResponse = {
  token: string;
  user: AuthUser & { name: string };
};

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const base = getBaseUrl().replace(/\/$/, "");
  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Credenciales inválidas");
  }
  return data as LoginResponse;
}

export async function fetchMe(): Promise<AuthUser> {
  return fetchApi<AuthUser>("/api/auth/me");
}

export type OrganizationListItem = {
  id: string;
  nit: string;
  businessName: string;
  tradeName: string | null;
  city: string;
  email: string;
  usesDian: boolean;
};

export type ProductListItem = {
  id: string;
  internalCode: string;
  barcode: string | null;
  name: string;
  description: string | null;
  salePrice: number;
  costPrice: number;
  unitOfMeasure: string;
  taxType: string;
  taxPercentage: number;
  stock: number;
  minStock: number;
  isActive: boolean;
  categoryId: string | null;
  organizationId: string;
};

export async function fetchOrganizations(): Promise<OrganizationListItem[]> {
  return fetchApi<OrganizationListItem[]>("/api/organizations");
}

/**
 * Lista productos. Sin argumentos usa la organización del usuario (token).
 * Con organizationId (ej. super_admin) filtra por esa organización.
 */
export async function fetchProducts(organizationId?: string): Promise<ProductListItem[]> {
  const query = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
  return fetchApi<ProductListItem[]>(`/api/products${query}`);
}
