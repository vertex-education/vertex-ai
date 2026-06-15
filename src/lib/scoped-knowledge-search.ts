import { createServerFn } from "@tanstack/react-start";
import type { ScopedKnowledgeSearchInput, ScopedKnowledgeSearchResponse } from "@/lib/rag";

export type { ScopedKnowledgeSearchInput, ScopedKnowledgeSearchResponse, ScopedKnowledgeSearchResult } from "@/lib/rag";

export const searchScopedKnowledge = createServerFn({ method: "POST" })
  .validator((data: ScopedKnowledgeSearchInput) => data)
  .handler(async ({ data }): Promise<ScopedKnowledgeSearchResponse> => {
    const { searchScopedKnowledgeServer } = await import("@/lib/scoped-knowledge-search.server");
    return searchScopedKnowledgeServer(data);
  });
