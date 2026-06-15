import { type DocCategory } from "./content";

export function filterDocCategories(categories: DocCategory[], searchTerm: string): DocCategory[] {
  const normalized = searchTerm.trim().toLowerCase();
  if (!normalized) return categories;

  return categories
    .map((category) => ({
      ...category,
      articles: category.articles.filter((article) =>
        [article.title, article.category, article.summary, ...article.blocks.flatMap((block) => [block.title, ...block.items])]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      ),
    }))
    .filter((category) => category.articles.length > 0);
}
