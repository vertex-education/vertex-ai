import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  ArrowRight,
  Bell,
  Bot,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderOpen,
  Layers3,
  Lightbulb,
  LockKeyhole,
  MessageCircle,
  MessageSquareText,
  PanelRightOpen,
  Paperclip,
  Search,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VertexAIBrand } from "@/components/VertexAIBrand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VertexAI | Coming Soon" },
      {
        name: "description",
        content: "VertexAI is a coming workspace for Vertex teams to use AI across projects, documents, decisions, and execution.",
      },
    ],
  }),
  component: VertexAIHomePage,
});

const capabilityCards: Array<{
  title: string;
  body: string;
  icon: LucideIcon;
}> = [
  {
    title: "Workspace shell",
    body: "A persistent rail, topbar search, scope tabs, and project navigation keep the main work surface stable.",
    icon: Layers3,
  },
  {
    title: "Chat and actions",
    body: "The chat surface keeps reasoning controls, workspace context, attachments, and follow-up actions close together.",
    icon: MessageCircle,
  },
  {
    title: "Pinned outputs",
    body: "Pinned ideas, decisions, approvals, tasks, risks, and artifacts stay visible above the active workspace tab.",
    icon: Archive,
  },
];

const previewTiles = [
  { label: "Context checked", value: "Docs, tasks, and chats", icon: SearchCheck },
  { label: "Artifacts ready", value: "Briefs, trackers, decks", icon: Layers3 },
  { label: "Access guarded", value: "Team-aware permissions", icon: ShieldCheck },
];

function VertexAIHomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafb] text-[#24302f]">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a className="inline-flex rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-[#C0C3C2]/60" href="/" aria-label="VertexAI home">
          <VertexAIBrand logoClassName="h-8 w-fit" aiClassName="text-[1.35rem] text-[#003865]" />
        </a>
        <nav className="flex items-center gap-2 text-sm font-semibold text-[#404342]" aria-label="Public navigation">
          <a className="hidden rounded-md px-3 py-2 hover:bg-white hover:text-[#003865] sm:inline-flex" href="#mockups">
            Mockups
          </a>
          <a className="hidden rounded-md px-3 py-2 hover:bg-white hover:text-[#003865] sm:inline-flex" href="#soon">
            Coming Soon
          </a>
          <Button asChild className="bg-[#003865] text-white hover:bg-[#003865]/90">
            <a href="/sign-in">
              Sign in
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </nav>
      </header>

      <section className="landing-grid-background relative border-y border-[#C0C3C2]/50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:min-h-[calc(100svh-190px)] lg:grid-cols-[minmax(0,0.82fr)_minmax(600px,1.18fr)] lg:px-8 lg:py-14">
          <div className="relative z-10 max-w-3xl space-y-7">
            <Badge className="border-[#CBA052]/35 bg-[#CBA052]/15 text-[#003865]" variant="outline">
              Coming Soon
            </Badge>
            <div className="space-y-5">
              <h1 className="font-heading text-5xl font-extrabold leading-none text-[#003865] sm:text-6xl lg:text-7xl">VertexAI</h1>
              <p className="max-w-2xl text-lg leading-8 text-[#404342]">
                VertexAI is a lightweight AI workspace for Vertex teams. It is being built to help teams turn project context, documents,
                meetings, tasks, and decisions into clearer execution.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-[#003865] text-white shadow-lg shadow-[#003865]/20 hover:bg-[#003865]/90">
                <a href="/sign-in">
                  Invited user sign in
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <span className="inline-flex min-h-10 items-center rounded-md border border-[#C0C3C2] bg-white px-4 text-sm font-semibold text-[#707372]">
                Wider access is coming soon.
              </span>
            </div>
            <div className="hidden gap-3 sm:grid sm:grid-cols-3">
              {previewTiles.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-md border border-[#C0C3C2]/70 bg-white/90 p-4 shadow-sm">
                  <Icon className="mb-3 size-5 text-[#003865]" />
                  <p className="text-sm font-bold text-[#003865]">{label}</p>
                  <p className="mt-1 text-sm text-[#707372]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <HeroMockup />
        </div>
      </section>

      <section id="mockups" className="border-b border-[#C0C3C2]/50 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-3">
            <Badge className="bg-[#003865] text-white">Preview</Badge>
            <h2 className="font-heading text-3xl font-bold text-[#003865] sm:text-4xl">Early workspace mockups</h2>
            <p className="text-base leading-7 text-[#404342]">
              The first release is focused on practical work surfaces: project awareness, AI-assisted follow-through, and durable outputs
              that teams can come back to.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {capabilityCards.map((card, index) => (
              <CapabilityCard key={card.title} {...card} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="soon" className="bg-[#003865] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(360px,0.55fr)] lg:items-center">
          <div className="space-y-4">
            <Badge className="border-white/25 bg-white/10 text-white" variant="outline">
              Built For Vertex Teams
            </Badge>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Coming soon to help teams move from context to action.</h2>
            <p className="max-w-3xl text-base leading-7 text-white/78">
              VertexAI is currently taking shape around real project workflows: collecting the right context, creating useful artifacts, and
              keeping decisions, risks, and next steps visible.
            </p>
          </div>

          <div className="rounded-md border border-white/20 bg-white/8 p-5 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 border-b border-white/15 pb-4">
              <span className="grid size-10 place-items-center rounded-md bg-[#CBA052] text-[#003865]">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="font-bold">Launch posture</p>
                <p className="text-sm text-white/68">Private preview now, broader rollout later.</p>
              </div>
            </div>
            <ul className="mt-4 grid gap-3 text-sm text-white/82">
              <SoonItem>Useful before it is broad: focused pilot access for invited users.</SoonItem>
              <SoonItem>Brand-consistent workspace surfaces instead of generic AI chat shells.</SoonItem>
              <SoonItem>Project outputs designed to become reusable team artifacts.</SoonItem>
            </ul>
          </div>
        </div>
      </section>

      <footer className="bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-sm text-[#707372]">
          <VertexAIBrand logoClassName="h-7 w-fit" aiClassName="text-xl text-[#003865]" />
          <p>VertexAI is coming soon.</p>
        </div>
      </footer>
    </main>
  );
}

function HeroMockup() {
  const railItems = [
    { label: "Workspaces", icon: FolderOpen, active: true },
    { label: "Chats", icon: MessageCircle },
    { label: "Ideas", icon: Lightbulb },
    { label: "Artifacts", icon: Archive },
    { label: "Risks", icon: ShieldAlert },
  ];

  return (
    <div className="landing-float-slow relative z-10 mx-auto hidden w-full max-w-[720px] lg:block">
      <div className="landing-flow-line left-4 top-8 hidden lg:block" />
      <div className="landing-flow-line landing-flow-line-delay bottom-18 right-8 hidden lg:block" />
      <div className="overflow-hidden rounded-md border border-[#003865]/15 bg-white shadow-2xl shadow-[#003865]/18">
        <div className="grid min-h-[520px] grid-cols-[56px_minmax(0,1fr)] bg-white">
          <aside className="flex min-h-0 flex-col items-center gap-2 bg-[#003865] px-2 py-3 text-white">
            <span className="mb-2 grid size-10 place-items-center rounded-md bg-white">
              <img alt="" className="size-7" src="/vertex-mountain-blue.svg" />
            </span>
            {railItems.map(({ active, icon: Icon, label }) => (
              <span
                key={label}
                className={`grid size-10 place-items-center rounded-md ${active ? "bg-white/18 text-white" : "text-white/72"}`}
                title={label}
              >
                <Icon className="size-4" />
              </span>
            ))}
            <span className="mt-auto grid size-8 place-items-center rounded-full border border-white/35 bg-white/12 text-xs font-bold">
              RC
            </span>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-white">
            <div className="grid min-h-14 grid-cols-[160px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#C0C3C2]/50 bg-white px-4">
              <VertexAIBrand logoClassName="h-6 w-fit" aiClassName="text-lg text-[#003865]" />
              <div className="flex h-8 min-w-0 items-center gap-2 rounded-md border border-[#C0C3C2]/65 bg-[#f8fafb] px-3 text-xs text-[#707372]">
                <Search className="size-3.5 text-[#003865]" />
                Search workspace knowledge
              </div>
              <div className="flex items-center gap-2">
                <span className="flex -space-x-1">
                  <span className="grid size-6 place-items-center rounded-full border-2 border-white bg-[#003865] text-[9px] font-bold text-white">
                    RC
                  </span>
                  <span className="grid size-6 place-items-center rounded-full border-2 border-white bg-[#CBA052] text-[9px] font-bold text-[#003865]">
                    AI
                  </span>
                </span>
                <Bell className="size-4 text-[#003865]" />
              </div>
            </div>

            <div className="border-b border-[#C0C3C2]/50 bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <div className="inline-flex overflow-hidden rounded-md border border-[#C0C3C2]/70 text-xs font-semibold">
                    <span className="bg-[#003865] px-3 py-1.5 text-white">Personal</span>
                    <span className="px-3 py-1.5 text-[#707372]">Team</span>
                    <span className="px-3 py-1.5 text-[#707372]">Org</span>
                  </div>
                  <p className="truncate text-xs font-semibold text-[#707372]">Location / Team Vertex / Launch readiness</p>
                </div>
                <Badge className="border-[#2DA44A]/30 bg-[#2DA44A]/10 text-[#2DA44A]" variant="outline">
                  Live context
                </Badge>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-[170px_minmax(0,1fr)_190px] bg-white">
              <aside className="min-h-0 border-r border-[#C0C3C2]/50 bg-[#f8fafb] p-3">
                <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold text-[#707372]">
                  <span>PERSONAL PROJECTS</span>
                  <span className="grid size-5 place-items-center rounded-md bg-white text-[#003865]">+</span>
                </div>
                <ProjectNavRow active icon={FolderOpen} label="Launch readiness" />
                <ProjectNavRow icon={MessageCircle} inset label="Steering update" />
                <ProjectNavRow icon={MessageCircle} inset label="Weekly status" />
                <ProjectNavRow icon={FolderOpen} label="AI governance" />
                <div className="mt-4 px-1 text-[10px] font-bold text-[#707372]">GENERAL CHATS</div>
                <ProjectNavRow icon={MessageCircle} label="Workspace chat" />
              </aside>

              <section className="flex min-h-0 min-w-0 flex-col border-r border-[#C0C3C2]/50">
                <div className="border-b border-[#C0C3C2]/45 bg-white px-3 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#707372]">PINNED ITEMS</span>
                    <span className="text-[10px] font-semibold text-[#707372]">Current view</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <PinnedPreview icon={Lightbulb} label="Idea" title="Launch playbook" />
                    <PinnedPreview icon={FileText} label="Artifact" title="Exec briefing" />
                    <PinnedPreview icon={CheckCircle2} label="Task" title="Sync owners" />
                  </div>
                </div>

                <div className="border-b border-[#C0C3C2]/45 bg-white px-3">
                  <div className="flex h-10 items-end gap-4 text-xs font-semibold">
                    {["Chat", "Ideas", "Artifacts", "Decisions", "Tasks"].map((tab, index) => (
                      <span
                        key={tab}
                        className={`h-10 border-b-2 pt-3 ${index === 0 ? "border-[#003865] text-[#003865]" : "border-transparent text-[#707372]"}`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-hidden bg-[#f8fafb] p-3">
                  <MockMessage icon={MessageSquareText} title="Roger" body="What changed this week on launch readiness?" />
                  <MockMessage
                    active
                    icon={Bot}
                    title="VertexAI"
                    body="I found 3 decisions, 2 risks, and a draft executive update ready to review."
                  />
                  <div className="rounded-md border border-[#C0C3C2]/55 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#003865]">Reasoning</span>
                      <span className="rounded-md bg-[#003865] px-2 py-1 text-[10px] font-bold text-white">Medium</span>
                    </div>
                    <div className="flex gap-2 text-[10px] font-bold text-[#707372]">
                      <span className="rounded-full border border-[#C0C3C2] bg-[#f8fafb] px-2 py-1">Web Off</span>
                      <span className="rounded-full border border-[#C0C3C2] bg-[#f8fafb] px-2 py-1">Asana On</span>
                      <span className="rounded-full border border-[#C0C3C2] bg-[#f8fafb] px-2 py-1">8k tokens</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#C0C3C2]/45 bg-white p-3">
                  <div className="grid grid-cols-[1fr_28px_34px] items-center gap-2 rounded-md border border-[#C0C3C2]/65 bg-white p-2 text-xs text-[#707372]">
                    <span className="flex items-center gap-2">
                      <Zap className="size-3.5 text-[#003865]" />
                      Message VertexAI about Launch readiness
                    </span>
                    <Paperclip className="size-4 text-[#003865]" />
                    <span className="grid size-8 place-items-center rounded-md bg-[#003865] text-white">
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </section>

              <aside className="min-h-0 bg-white p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#707372]">DETAIL PANEL</p>
                    <p className="font-heading text-sm font-bold text-[#003865]">Launch readiness</p>
                  </div>
                  <PanelRightOpen className="size-4 text-[#003865]" />
                </div>
                <MiniMetric label="Pinned outputs" value="6" icon={FileText} />
                <MiniMetric label="Open risks" value="4" icon={ShieldAlert} />
                <MiniMetric label="Team actions" value="12" icon={CalendarCheck2} />
                <div className="mt-3 rounded-md border border-[#C0C3C2]/55 bg-[#f8fafb] p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#003865]">
                    <LockKeyhole className="size-3.5" />
                    Scope guardrails
                  </div>
                  <div className="landing-pulse-bar mb-2 h-2 rounded-full bg-[#003865]/18" />
                  <div className="landing-pulse-bar landing-pulse-delay h-2 w-3/4 rounded-full bg-[#CBA052]/35" />
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProjectNavRow({ active, icon: Icon, inset, label }: { active?: boolean; icon: LucideIcon; inset?: boolean; label: string }) {
  return (
    <div className={`${inset ? "ml-3 border-l border-[#C0C3C2]/70 pl-2" : ""}`}>
      <span
        className={`mt-1 flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-xs font-semibold ${
          active ? "bg-white text-[#003865] shadow-sm" : "text-[#707372]"
        }`}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
    </div>
  );
}

function PinnedPreview({ icon: Icon, label, title }: { icon: LucideIcon; label: string; title: string }) {
  return (
    <div className="rounded-md border border-[#C0C3C2]/60 bg-[#f8fafb] p-2">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold text-[#707372]">
        <Icon className="size-3 text-[#003865]" />
        {label}
      </div>
      <p className="truncate text-xs font-bold text-[#003865]">{title}</p>
    </div>
  );
}

function MockMessage({ active, body, icon: Icon, title }: { active?: boolean; body: string; icon: LucideIcon; title: string }) {
  return (
    <div className={`rounded-md border p-3 ${active ? "border-[#CBA052]/55 bg-[#CBA052]/10" : "border-[#C0C3C2]/55 bg-white"}`}>
      <div className="flex gap-3">
        <span
          className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-md ${active ? "bg-[#CBA052] text-[#003865]" : "bg-[#003865] text-white"}`}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#003865]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[#404342]">{body}</p>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#C0C3C2]/55 bg-white p-3">
      <Icon className="mb-3 size-4 text-[#003865]" />
      <p className="font-heading text-2xl font-bold text-[#003865]">{value}</p>
      <p className="text-xs font-semibold text-[#707372]">{label}</p>
    </div>
  );
}

function CapabilityCard({ body, icon: Icon, index, title }: { body: string; icon: LucideIcon; index: number; title: string }) {
  return (
    <article
      className="landing-rise rounded-md border border-[#C0C3C2]/60 bg-[#f8fafb] p-5 shadow-sm"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-md bg-[#003865] text-white">
          <Icon className="size-5" />
        </span>
        <span className="text-sm font-bold text-[#CBA052]">0{index + 1}</span>
      </div>
      <h3 className="font-heading text-xl font-bold text-[#003865]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#404342]">{body}</p>
      <CapabilityPreview index={index} />
    </article>
  );
}

function CapabilityPreview({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="mt-5 overflow-hidden rounded-md border border-[#C0C3C2]/55 bg-white">
        <div className="flex h-8 items-center gap-2 border-b border-[#C0C3C2]/45 px-2">
          <span className="size-5 rounded-md bg-[#003865]" />
          <span className="h-2 w-24 rounded-full bg-[#003865]/18" />
          <span className="ml-auto h-2 w-16 rounded-full bg-[#707372]/20" />
        </div>
        <div className="grid grid-cols-[58px_minmax(0,1fr)]">
          <div className="grid gap-1 bg-[#003865] p-2">
            <span className="size-6 rounded-md bg-white/20" />
            <span className="size-6 rounded-md bg-white/10" />
            <span className="size-6 rounded-md bg-white/10" />
          </div>
          <div className="space-y-2 p-2">
            <span className="block h-6 rounded-md bg-[#003865]/10" />
            <span className="block h-6 rounded-md bg-[#C0C3C2]/25" />
            <span className="block h-6 rounded-md bg-[#CBA052]/20" />
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="mt-5 grid gap-2 rounded-md border border-[#C0C3C2]/55 bg-white p-2">
        <MockMessage icon={MessageSquareText} title="User" body="Summarize current blockers." />
        <MockMessage active icon={Bot} title="VertexAI" body="2 risks and 1 owner ask found." />
        <div className="flex items-center gap-2 rounded-md border border-[#C0C3C2]/55 bg-[#f8fafb] px-2 py-1.5 text-[10px] font-bold text-[#707372]">
          <Zap className="size-3 text-[#003865]" />
          Reasoning
          <span className="ml-auto rounded-md bg-[#003865] px-1.5 py-0.5 text-white">Med</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-2 rounded-md border border-[#C0C3C2]/55 bg-white p-2">
      <PinnedPreview icon={Lightbulb} label="Idea" title="Launch playbook" />
      <PinnedPreview icon={ClipboardList} label="Decision" title="Approve rollout" />
      <PinnedPreview icon={FileText} label="Artifact" title="Exec briefing" />
    </div>
  );
}

function SoonItem({ children }: { children: string }) {
  return (
    <li className="flex gap-3">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#CBA052]" />
      <span>{children}</span>
    </li>
  );
}
