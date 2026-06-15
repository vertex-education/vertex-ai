import { searchScopedKnowledgeForCurrentUser, type ScopedKnowledgeSearchInput, type ScopedKnowledgeSearchResponse } from "@/lib/rag";

export function searchScopedKnowledgeServer(input: ScopedKnowledgeSearchInput): Promise<ScopedKnowledgeSearchResponse> {
  return searchScopedKnowledgeForCurrentUser(input);
}
