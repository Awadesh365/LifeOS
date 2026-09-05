import type {
  Summary,
  Consent,
  Diagnostics,
  IntelligenceArtifact,
} from "./types";
const BASE =
  (import.meta.env.VITE_PERSONAL_API_URL || "http://localhost:5000/api") +
  "/intelligence";
export async function intelligenceRequest<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (method !== "GET") {
    const r = await fetch(BASE.replace(/\/intelligence$/, "/auth/session"), {
      credentials: "include",
    });
    const s = await r.json();
    if (!r.ok || !s.authenticated)
      throw new Error("Sign in to use Intelligence");
    headers["x-csrf-token"] = s.csrfToken;
  }
  const response = await fetch(BASE + path, {
    method,
    credentials: "include",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok)
    throw new Error(payload.error || "Intelligence request failed");
  return payload;
}
export const intelligenceApi = {
  summary: () => intelligenceRequest<Summary>("/summary"),
  consents: () => intelligenceRequest<Consent[]>("/consents"),
  diagnostics: () => intelligenceRequest<Diagnostics>("/diagnostics"),
  artifact: (id: string) =>
    intelligenceRequest<IntelligenceArtifact>(
      "/artifacts/" + encodeURIComponent(id),
    ),
  request: intelligenceRequest,
};
