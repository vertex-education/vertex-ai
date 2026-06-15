import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type DocCategory } from "./content";

type DocsNavigationProps = {
  activeArticleId: string;
  categories: DocCategory[];
  onSelectArticle: (articleId: string) => void;
};

export function DocsSidebarNav({ activeArticleId, categories, onSelectArticle }: DocsNavigationProps) {
  if (categories.length === 0) {
    return <p className="px-3 py-2 text-sm text-muted-foreground">No docs match your search.</p>;
  }

  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <section key={category.title}>
          <div className="mb-2 px-3">
            <h2 className="text-xs font-semibold uppercase tracking-normal text-primary">{category.title}</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{category.description}</p>
          </div>
          <div className="space-y-1">
            {category.articles.map((article) => (
              <button
                key={article.id}
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                  activeArticleId === article.id && "bg-accent text-accent-foreground",
                )}
                onClick={() => onSelectArticle(article.id)}
              >
                <article.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="min-w-0">
                  <strong className="block truncate">{article.title}</strong>
                  <span className="block truncate text-xs text-muted-foreground">{article.status}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function DocsMobileNav({ activeArticleId, categories, onSelectArticle }: DocsNavigationProps) {
  if (categories.length === 0) {
    return <p className="text-sm text-muted-foreground">No docs match your search.</p>;
  }

  return (
    <div className="grid gap-3">
      {categories.map((category) => (
        <section key={category.title} className="grid gap-2">
          <h2 className="px-1 text-xs font-semibold uppercase text-primary">{category.title}</h2>
          <div className="flex gap-2 overflow-auto pb-1">
            {category.articles.map((article) => (
              <Button
                key={article.id}
                type="button"
                size="sm"
                variant={activeArticleId === article.id ? "default" : "outline"}
                onClick={() => onSelectArticle(article.id)}
              >
                {article.title}
              </Button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
