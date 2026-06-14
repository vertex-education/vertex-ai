import { describe, expect, it } from "vitest";
import {
  formatCustomInstructionTemplate,
  normalizeBriefingMarkdown,
  resolveInstructionPlaceholders,
} from "@/lib/briefing-formatting";

const project = {
  name: "Vertex Hub",
  workspaceName: "Org Workspace",
  status: "Planning",
};

const runDate = new Date("2026-06-14T13:45:00.000Z");

describe("briefing custom instruction formatting", () => {
  it("resolves supported curly-brace placeholders and leaves unknown placeholders intact", () => {
    const resolved = resolveInstructionPlaceholders(
      "Title: {Project Name} - {MM/DD/YY}\nWorkspace: {Workspace}\nStatus: {Project Status}\nUnknown: {Owner}",
      project,
      runDate,
    );

    expect(resolved).toContain("Title: Vertex Hub - 06/14/26");
    expect(resolved).toContain("Workspace: Org Workspace");
    expect(resolved).toContain("Status: Planning");
    expect(resolved).toContain("Unknown: {Owner}");
  });

  it("turns plain user-friendly labels into markdown structure before prompting Gemma", () => {
    const formatted = formatCustomInstructionTemplate([
      "Title: {Project Name} - Weekly Status Update - {MM/DD/YY}",
      "",
      "Status (On Track, Off Track - choose based on analysis of the project)",
      "",
      "Status Summary",
      "Give a summary of the week in 100 words or less.",
    ].join("\n"));

    expect(formatted).toContain("# {Project Name} - Weekly Status Update - {MM/DD/YY}");
    expect(formatted).toContain("## Status\nOn Track, Off Track - choose based on analysis of the project");
    expect(formatted).toContain("## Status Summary\nGive a summary of the week in 100 words or less.");
  });

  it("preserves user-entered bullets while promoting section labels", () => {
    const formatted = formatCustomInstructionTemplate([
      "Risks",
      "- List elevated risks supported by source data.",
      "- Leave blank if no risks are supported.",
    ].join("\n"));

    expect(formatted).toBe([
      "## Risks",
      "- List elevated risks supported by source data.",
      "- Leave blank if no risks are supported.",
    ].join("\n"));
  });

  it("normalizes compressed model output into renderable markdown headings and bullets", () => {
    const normalized = normalizeBriefingMarkdown(
      "# Vertex Hub - Weekly Status Update - 06/14/26 Status Summary: The project is planning. Risks - Manual Process Errors: File-heavy handoffs. Decisions Requiring Executive Input - No decisions identified.",
    );

    expect(normalized).toContain("# Vertex Hub - Weekly Status Update - 06/14/26");
    expect(normalized).toContain("## Status Summary\nThe project is planning.");
    expect(normalized).toContain("## Risks");
    expect(normalized).toContain("- Manual Process Errors: File-heavy handoffs.");
    expect(normalized).toContain("## Decisions Requiring Executive Input");
    expect(normalized).toContain("- No decisions identified.");
  });

  it("promotes known plain section labels returned by the model", () => {
    const normalized = normalizeBriefingMarkdown([
      "Vertex Hub summary text.",
      "",
      "Risks",
      "- Human error during manual handoffs.",
      "",
      "Decisions Made Within Workstream Scope",
      "- Defined v1 and v2 roadmap distinction.",
    ].join("\n"));

    expect(normalized).toContain("## Risks");
    expect(normalized).toContain("## Decisions Made Within Workstream Scope");
  });
});
