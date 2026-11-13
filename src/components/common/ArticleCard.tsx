import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCategoryById } from '../../data/categories.ts'
import type { Article } from '../../types/content.ts'
import { formatArabicDate } from '../../utils/format.ts'

export function ArticleCard({ article }: { article: Article }) {
  const category = getCategoryById(article.categoryId)

  return (
    <article className="card">
      <Link to={`/article/${article.slug}`}>
        <div className="card__media">
          <img src={article.featuredImage} alt="" loading="lazy" decoding="async" />
          {category ? <span className="badge">{category.name}</span> : null}
        </div>
        <div className="card__body">
          <h3>{article.title}</h3>
          <p>{article.excerpt}</p>
          <time className="meta" dateTime={article.publishedAt}>
            <Calendar size={14} aria-hidden="true" />
            {formatArabicDate(article.publishedAt)}
          </time>
        </div>
      </Link>
    </article>
  )
}
