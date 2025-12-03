import { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit & { query?: Record<string, string | number | null | undefined> }): Promise<T> {
  const url = new URL(path, window.location.origin);
  if (init?.query) {
    for (const [key, value] of Object.entries(init.query)) {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    }
  }
  const res = await fetch(url.toString(), { headers: { 'Content-Type': 'application/json' }, ...init });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error || 'Request failed');
  }
  return json.data;
}