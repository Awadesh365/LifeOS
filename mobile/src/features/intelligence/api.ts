import { request } from "@/services/api";
import type { Summary, Consent, IntelligenceArtifact } from "./types";
export const intelligenceApi = {
  summary: () => request<Summary>("/intelligence/summary"),
  consents: () => request<Consent[]>("/intelligence/consents"),
  artifact: (id: string) =>
    request<IntelligenceArtifact>(
      "/intelligence/artifacts/" + encodeURIComponent(id),
    ),
  mutate: <T>(path: string, body: unknown, method = "POST") =>
    request<T>("/intelligence" + path, { method, body }),
  export: () => request<unknown>("/intelligence/export"),
};
