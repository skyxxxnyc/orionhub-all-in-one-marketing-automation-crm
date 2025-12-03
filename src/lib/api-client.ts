import { ApiResponse } from "../../shared/types"
import { useAuthStore } from "./mock-auth";
export async function api<T>(path: string, init?: RequestInit & { query?: Record<string, string | number | null | undefined> }): Promise<T> {
  const { token, currentOrg, currentWorkspace } = useAuthStore.getState();
  const url = new URL(path, window.location.origin);
  const queryParams = { ...init?.query };
  // Auto-append org and workspace IDs if not already present
  if (currentOrg && !queryParams.orgId) {
    queryParams.orgId = currentOrg.id;
  }
  if (currentWorkspace && !queryParams.workspaceId) {
    queryParams.workspaceId = currentWorkspace.id;
  }
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  }
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(url.toString(), { ...init, headers });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error || 'Request failed');
  }
  return json.data;
}