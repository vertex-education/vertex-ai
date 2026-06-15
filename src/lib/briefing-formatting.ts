export type BriefingFormatProject = {
  name: string;
  workspaceName: string;
  status: string;
};

function isoDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shortDateKey(date: Date) {
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = String(date.getUTCFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

export function utcTimeLabel(date: Date) {
  return date.toISOString().slice(11, 16) + " UTC";
}

export function resolveInstructionPlaceholders(
  promptInstructions: string | null | undefined,
  project: BriefingFormatProject,
  windowEnd: Date,
) {
  const instructions = promptInstructions?.trim();
  if (!instructions) return "";

  const projectName = project.name?.trim();
  const workspaceName = project.workspaceName?.trim();
  const values: Record<string, string | undefined> = {
    "project name": projectName,
    project: projectName,
    "workspace name": workspaceName,
    workspace: workspaceName,
    "project status": project.status?.trim(),
    status: project.status?.trim(),
    date: isoDateKey(windowEnd),
    "yyyy-mm-dd": isoDateKey(windowEnd),
    "mm/dd/yy": shortDateKey(windowEnd),
    "mm/dd/yyyy": `${String(windowEnd.getUTCMonth() + 1).padStart(2, "0")}/${String(windowEnd.getUTCDate()).padStart(2, "0")}/${windowEnd.getUTCFullYear()}`,
    time: utcTimeLabel(windowEnd),
  };

  return instructions.replace(/\{([^{}]+)\}/g, (match, rawKey: string) => {
    const key = rawKey.trim().toLowerCase();
    return values[key] || match;
  });
}

export function formatCustomInstructionTemplate(instructions: string) {
  const lines = instructions.replace(/\r/g, "\n").split("\n");
  const formatted: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      formatted.push("");
      continue;
    }

    const titleMatch = line.match(/^title\s*:\s*(.+)$/i);
    if (titleMatch?.[1]) {
      formatted.push(`# ${titleMatch[1].trim()}`);
      continue;
    }

    const parentheticalMatch = line.match(/^([A-Z][A-Za-z0-9 /&-]{1,70})\s*\((.+)\)$/);
    if (parentheticalMatch?.[1] && parentheticalMatch[2]) {
      formatted.push(`## ${parentheticalMatch[1].trim()}`);
      formatted.push(parentheticalMatch[2].trim());
      continue;
    }

    const sentenceLike = /[.!?]$/.test(line) || /\b(the|a|an|and|or|but|because|based|choose|give|summarize|list|include)\b/i.test(line);
    const alreadyFormatted = /^(#{1,6}\s+|- |\* |\d+\. )/.test(line);
    if (!alreadyFormatted && !sentenceLike && line.length <= 80) {
      formatted.push(`## ${line.replace(/:$/, "")}`);
      continue;
    }

    formatted.push(line);
  }

  return formatted
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeBriefingMarkdown(markdown: string) {
  const sectionLabels = new Set([
    "status",
    "status summary",
    "risks",
    "decisions requiring executive input",
    "decisions made within workstream scope",
    "completed asana tasks",
    "key strategic decisions",
    "elevated project risks",
    "recommended next moves",
  ]);

  return markdown
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/([^\n])\s+(#{1,6}\s+)/g, "$1\n\n$2")
    .replace(/([^\n])\s+(\*\*[^*\n]+:\*\*)/g, "$1\n\n$2")
    .replace(/(\S)\s+(Status:\s*)/g, "$1\n\n$2")
    .replace(/([^\n])\s+([-*]\s+\*\*)/g, "$1\n$2")
    .replace(/(\S)\s+(Status Summary:)/g, "$1\n\n$2")
    .replace(/\s+(Risks)\s+[-*]\s+/g, "\n\n$1\n- ")
    .replace(/(\S)\s+(Decisions Requiring Executive Input)/g, "$1\n\n$2")
    .replace(/\s+(Decisions Requiring Executive Input)\s+[-*]\s+/g, "\n\n$1\n- ")
    .replace(/(\S)\s+(Decisions Made Within Workstream Scope)/g, "$1\n\n$2")
    .replace(/\s+(Decisions Made Within Workstream Scope)\s+[-*]\s+/g, "\n\n$1\n- ")
    .split("\n")
    .map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || /^#{1,6}\s+/.test(trimmed) || /^[-*]\s+/.test(trimmed)) return line;
      const labelWithBody = trimmed.match(
        /^(Status|Status Summary|Risks|Decisions Requiring Executive Input|Decisions Made Within Workstream Scope):\s+(.+)$/i,
      );
      if (labelWithBody?.[1] && labelWithBody[2]) return `## ${labelWithBody[1]}\n${labelWithBody[2]}`;
      const normalized = trimmed.replace(/:$/, "").toLowerCase();
      if (index > 0 && sectionLabels.has(normalized)) return `## ${trimmed.replace(/:$/, "")}`;
      return line;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
