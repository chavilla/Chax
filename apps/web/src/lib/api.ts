const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "";

export function getApiUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = getApiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(typeof err.error === "string" ? err.error : "Error en la API");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
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

export async function fetchProducts(organizationId: string): Promise<ProductListItem[]> {
  return fetchApi<ProductListItem[]>(`/api/products?organizationId=${encodeURIComponent(organizationId)}`);
}
