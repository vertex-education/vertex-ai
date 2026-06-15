import { describe, expect, it } from "vitest";
import { extractChatEntityJsonArrayCandidate, normalizeChatOperationalEntities, parseChatOperationalEntityJson } from "@/lib/chat-entities";

describe("chat entity JSON extraction", () => {
  it("parses a strict JSON array into normalized operational entities", () => {
    const entities = parseChatOperationalEntityJson(
      JSON.stringify([
        {
          id: "task-1",
          type: "Task",
          title: "Follow up with operations",
          description: "Operations needs a follow-up on the rollout plan.",
          owner: "Ops",
          dueDate: "Friday",
          priority: "High",
          sourceQuote: "follow up with operations",
          confidence: 0.92,
        },
      ]),
    );

    expect(entities).toEqual([
      {
        id: "task-1",
        type: "Task",
        title: "Follow up with operations",
        description: "Operations needs a follow-up on the rollout plan.",
        owner: "Ops",
        dueDate: "Friday",
        priority: "High",
        sourceQuote: "follow up with operations",
        confidence: 0.92,
        status: "active",
      },
    ]);
  });

  it("extracts and parses an array from fenced or prose-wrapped model output", () => {
    const raw = [
      "Here are the entities:",
      "```json",
      "[",
      "  {",
      '    "id": "risk-1",',
      '    "type": "Risk",',
      '    "title": "Approval may slip",',
      '    "description": "The approval dependency could delay delivery.",',
      '    "confidence": 80',
      "  }",
      "]",
      "```",
    ].join("\n");

    expect(extractChatEntityJsonArrayCandidate(raw)).toContain('"type": "Risk"');
    expect(parseChatOperationalEntityJson(raw)).toMatchObject([
      {
        id: "risk-1",
        type: "Risk",
        title: "Approval may slip",
        confidence: 0.8,
      },
    ]);
  });

  it("filters invalid entities instead of surfacing questionable cards", () => {
    const entities = normalizeChatOperationalEntities([
      {
        id: "idea-1",
        type: "Idea",
        title: "Create a dashboard",
        description: "A dashboard could make the rollout easier to monitor.",
        priority: "Urgent",
        confidence: 2,
      },
      {
        id: "bad-type",
        type: "Decision",
        title: "Unsupported type",
        description: "This should not render.",
      },
      {
        id: "missing-description",
        type: "Task",
        title: "No description",
      },
    ]);

    expect(entities).toHaveLength(1);
    expect(entities[0]).toMatchObject({
      id: "idea-1",
      type: "Idea",
      priority: null,
      confidence: 0.02,
      status: "active",
    });
  });

  it("throws on malformed non-json output so the extractor can run the repair pass", () => {
    expect(() => parseChatOperationalEntityJson("Task: follow up with finance")).toThrow(SyntaxError);
  });

  it("returns an empty array for blank output without forcing repair", () => {
    expect(parseChatOperationalEntityJson("   ")).toEqual([]);
  });
});
