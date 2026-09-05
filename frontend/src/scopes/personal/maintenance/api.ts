import type {
  MaintenanceArea,
  MaintenanceAsset,
  MaintenanceItem,
  MaintenanceOccurrence,
  MaintenanceSummary,
  RepairCase,
  WeeklyPlan,
} from "./types";

const API_BASE =
  import.meta.env.VITE_PERSONAL_API_URL || "http://localhost:5000/api";
let csrfToken = "";

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${API_BASE}/auth/session`, {
    credentials: "include",
  });
  const session = await response.json().catch(() => ({}));
  if (!response.ok || !session.authenticated)
    throw new Error("Sign in to use Maintenance.");
  csrfToken = session.csrfToken;
  return csrfToken;
}

async function request<T>(path: string, options: RequestInit = {}) {
  const method = options.method ?? "GET";
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (!["GET", "HEAD", "OPTIONS"].includes(method))
    headers.set("x-csrf-token", await getCsrfToken());
  const response = await fetch(`${API_BASE}/maintenance${path}`, {
    ...options,
    method,
    headers,
    credentials: "include",
  });
  if (response.status === 401) csrfToken = "";
  const payload = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(payload.error || "Maintenance request failed");
  return payload as T;
}

export const maintenanceApi = {
  summary: () => request<MaintenanceSummary>("/summary"),
  areas: () => request<MaintenanceArea[]>("/areas"),
  createArea: (data: { name: string; standard?: string }) =>
    request<MaintenanceArea>("/areas", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  items: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<MaintenanceItem[]>(`/items${query ? `?${query}` : ""}`);
  },
  item: (id: string) => request<MaintenanceItem>(`/items/${id}`),
  itemHistory: (id: string) =>
    request<MaintenanceOccurrence[]>(`/items/${id}/history`),
  createItem: (data: Partial<MaintenanceItem>) =>
    request<MaintenanceItem>("/items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateItem: (id: string, data: Partial<MaintenanceItem>) =>
    request<MaintenanceItem>(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  completeItem: (id: string, clientOperationId: string = crypto.randomUUID()) =>
    request<{ item: MaintenanceItem }>(`/items/${id}/complete`, {
      method: "POST",
      body: JSON.stringify({ clientOperationId }),
    }),
  assets: () => request<MaintenanceAsset[]>("/assets"),
  createAsset: (data: Partial<MaintenanceAsset>) =>
    request<MaintenanceAsset>("/assets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  repairs: () => request<RepairCase[]>("/repairs"),
  createRepair: (data: Partial<RepairCase>) =>
    request<RepairCase>("/repairs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateRepair: (id: string, data: Partial<RepairCase>) =>
    request<RepairCase>(`/repairs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  plan: () => request<WeeklyPlan>("/plan"),
  updatePlan: (data: Partial<WeeklyPlan>) =>
    request<WeeklyPlan>("/plan", { method: "PUT", body: JSON.stringify(data) }),
};
