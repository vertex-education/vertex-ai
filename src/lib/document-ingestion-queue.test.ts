import { describe, expect, it } from "vitest";
import {
  chunkText,
  clampVectorMetadata,
  customTagsIndexValue,
  inferSensitivityLabel,
  isConfidentialTag,
  vectorMetadataBytes,
} from "@/lib/document-ingestion-queue";

describe("document ingestion utilities", () => {
  it("chunks markdown on top-level headings while preserving section text", () => {
    const chunks = chunkText(
      ["# Launch Plan", "Intro paragraph.", "", "## Workstream A", "Detailed notes.", "", "### Evidence", "Source-backed evidence."].join(
        "\n",
      ),
    );

    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toContain("# Launch Plan");
    expect(chunks[1]).toContain("## Workstream A");
    expect(chunks[2]).toContain("### Evidence");
  });

  it("does not split fenced code blocks as blank-line text sections", () => {
    const chunks = chunkText(["# Query", "```sql", "SELECT *", "FROM projects;", "```", "", "Explanation after the query."].join("\n"));

    expect(chunks.join("\n\n")).toContain("```sql\nSELECT *\nFROM projects;\n```");
    expect(chunks.join("\n\n")).toContain("Explanation after the query.");
  });

  it("keeps oversized paragraphs intact instead of splitting on sentence or word boundaries", () => {
    const longParagraph = ["This paragraph must stay whole.", "x".repeat(1_700), "Final sentence."].join(" ");
    const chunks = chunkText(["# Strategy", "", longParagraph].join("\n"));

    expect(chunks).toEqual([["# Strategy", longParagraph].join("\n\n")]);
  });

  it("splits all markdown heading levels as structural section boundaries", () => {
    const chunks = chunkText(["# One", "A", "", "#### Four", "B", "", "###### Six", "C"].join("\n"));

    expect(chunks).toEqual(["# One\n\nA", "#### Four\n\nB", "###### Six\n\nC"]);
  });

  it("indexes custom tags in a lowercase comma-separated form", () => {
    expect(customTagsIndexValue([" PMO ", "", "Confidential", "Launch"])).toBe("pmo,confidential,launch");
  });

  it("detects confidential and restricted sensitivity markers", () => {
    expect(isConfidentialTag(" confidential ")).toBe(true);
    expect(isConfidentialTag("restricted")).toBe(true);
    expect(isConfidentialTag("internal")).toBe(false);
  });

  it("infers sensitivity from tags, metadata, or document name", () => {
    expect(inferSensitivityLabel({ customTags: ["Confidential"], documentName: "plan.md" })).toBe("Confidential");
    expect(
      inferSensitivityLabel({
        documentName: "brief.md",
        metadata: { restricted: "restricted" },
      }),
    ).toBe("Confidential");
    expect(inferSensitivityLabel({ documentName: "restricted-roadmap.md" })).toBe("Confidential");
    expect(inferSensitivityLabel({ customTags: ["PMO"], documentName: "roadmap.md" })).toBe("Standard");
  });

  it("clamps Vectorize metadata to the operational byte limit while preserving filter fields", () => {
    const metadata = clampVectorMetadata({
      artifact_id: "artifact-123",
      chunk_id: "chunk-123",
      r2_key: `uploads/team/${"deep-path-".repeat(400)}/document.md`,
      document_name: `${"long-document-name-".repeat(300)}.md`,
      scope_level: "team",
      scope_id: "team-123",
      project_id: "project-123",
      document_type: "strategy",
      custom_tags: "confidential,launch,roadmap",
      confidentiality: "Confidential",
      restricted: true,
      chunk_index: 7,
    });

    expect(vectorMetadataBytes(metadata)).toBeLessThanOrEqual(2_048);
    expect(metadata.scope_level).toBe("team");
    expect(metadata.scope_id).toBe("team-123");
    expect(metadata.project_id).toBe("project-123");
    expect(metadata.confidentiality).toBe("Confidential");
    expect(metadata.restricted).toBe(true);
    expect(metadata.chunk_index).toBe(7);
  });
});
