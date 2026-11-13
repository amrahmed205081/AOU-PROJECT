import { articles } from '../data/articles.ts'
import { getCategoryById } from '../data/categories.ts'
import type { Article } from '../types/content.ts'
import { normalizeArabic } from './format.ts'

export function sortByDate(list: Article[]) {
  return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug)
}

export function getArticlesByCategory(categoryId: string) {
  return sortByDate(articles.filter((article) => article.categoryId === categoryId))
}

export function pickArticles(slugs: string[]) {
  return slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is Article => Boolean(article))
}

export function getRelatedArticles(article: Article, limit = 3) {
  const sameCategory = sortByDate(
    articles.filter((item) => item.categoryId === article.categoryId && item.id !== article.id),
  )
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit)
  const filler = sortByDate(articles.filter((item) => item.id !== article.id && item.categoryId !== article.categoryId))
  return [...sameCategory, ...filler].slice(0, limit)
}

export function searchArticles(query: string) {
  const normalized = normalizeArabic(query)
  if (!normalized) return sortByDate(articles)

  return sortByDate(
    articles.filter((article) => {
      const categoryName = getCategoryById(article.categoryId)?.name ?? ''
      const haystack = normalizeArabic(`${article.title} ${article.excerpt} ${categoryName}`)
      return haystack.includes(normalized)
    }),
  )
}
