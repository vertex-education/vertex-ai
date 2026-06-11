param(
  [string]$Bucket = "ARTIFACTS_BUCKET",
  [switch]$Remote
)

$ErrorActionPreference = "Stop"

$objects = @(
  @{ Key = "personal/artifacts/personal-focus-plan.docx"; Path = "r2-seed/personal/artifacts/personal-focus-plan.docx" },
  @{ Key = "personal/artifacts/personal-tracker.xlsx"; Path = "r2-seed/personal/artifacts/personal-tracker.xlsx" },
  @{ Key = "personal/artifacts/personal-planning-brief.pptx"; Path = "r2-seed/personal/artifacts/personal-planning-brief.pptx" },
  @{ Key = "team/artifacts/team-improvement-register.xlsx"; Path = "r2-seed/team/artifacts/team-improvement-register.xlsx" },
  @{ Key = "team/artifacts/team-vertex-roadmap-brief.pptx"; Path = "r2-seed/team/artifacts/team-vertex-roadmap-brief.pptx" },
  @{ Key = "team/artifacts/team-launch-checklist.docx"; Path = "r2-seed/team/artifacts/team-launch-checklist.docx" },
  @{ Key = "org/artifacts/org-ai-governance-charter.docx"; Path = "r2-seed/org/artifacts/org-ai-governance-charter.docx" },
  @{ Key = "org/artifacts/org-portfolio-health-model.xlsx"; Path = "r2-seed/org/artifacts/org-portfolio-health-model.xlsx" },
  @{ Key = "org/artifacts/org-executive-ai-briefing.pptx"; Path = "r2-seed/org/artifacts/org-executive-ai-briefing.pptx" }
)

foreach ($object in $objects) {
  if (!(Test-Path -LiteralPath $object.Path)) {
    throw "Missing R2 seed file: $($object.Path)"
  }

  $args = @("wrangler", "r2", "object", "put", "$Bucket/$($object.Key)", "--file", $object.Path)
  if ($Remote) {
    $args += "--remote"
  }

  npx @args
}
