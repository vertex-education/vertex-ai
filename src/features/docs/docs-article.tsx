import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type DocArticle, type DocStatus } from "./content";

export function DocsArticlePage({ article }: { article: DocArticle }) {
  return (
    <>
      <DocHero article={article} />
      <div className="mt-6 grid gap-5">
        {article.blocks.map((block) => (
          <DocBlock key={block.title} audience={block.variant === "technical" ? "Technical reference" : undefined} title={block.title}>
            <DocItems items={block.items} variant={block.variant ?? "notes"} />
          </DocBlock>
        ))}
      </div>
    </>
  );
}

function DocHero({ article }: { article: DocArticle }) {
  return (
    <section className="rounded-lg border bg-card p-5 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <article.icon className="size-6" />
          </span>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{article.category}</Badge>
              <StatusBadge status={article.status} />
            </div>
            <h2 className="text-2xl font-semibold tracking-normal lg:text-3xl">{article.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground lg:text-base">{article.summary}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DocBlock({ audience, children, title }: { audience?: string; children: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {audience ? <Badge variant="info">{audience}</Badge> : null}
      </div>
      {children}
    </section>
  );
}

function DocItems({ items, variant }: { items: string[]; variant: "steps" | "notes" | "technical" }) {
  if (variant === "steps") {
    return (
      <ol className="grid gap-3">
        {items.map((item, index) => (
          <li key={item} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <p className="pt-1 text-sm leading-6 text-muted-foreground">{item}</p>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item}
          className={cn(
            "rounded-md border p-3 leading-6",
            variant === "technical"
              ? "border-primary/15 bg-primary/5 font-mono text-xs text-foreground"
              : "bg-muted/25 text-sm text-muted-foreground",
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: DocStatus }) {
  if (status === "Available") return <Badge variant="success">Available</Badge>;
  if (status === "Admin") return <Badge variant="info">Admin</Badge>;
  if (status === "Partial") return <Badge variant="warning">Partial</Badge>;
  return <Badge variant="secondary">Coming Soon</Badge>;
}
