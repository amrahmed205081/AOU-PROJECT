import { Calendar, List } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../common/SectionHeading.tsx'
import { getCategoryById } from '../../data/categories.ts'
import type { Article } from '../../types/content.ts'
import { formatArabicDate } from '../../utils/format.ts'

export function LatestTopics({ articles }: { articles: Article[] }) {
  return (
    <section className="band" aria-labelledby="latest-topics">
      <SectionHeading id="latest-topics" title="أحدث الموضوعات" icon={<List size={18} aria-hidden="true" />} to="/search" />
      <div className="topic-rows">
        {articles.map((article) => {
          const category = getCategoryById(article.categoryId)
          return (
            <article className="topic-row" key={article.id}>
              <Link to={`/article/${article.slug}`}>
                <img src={article.featuredImage} alt="" loading="lazy" decoding="async" />
              </Link>
              <div>
                {category ? <span className="badge">{category.name}</span> : null}
                <h3>
                  <Link to={`/article/${article.slug}`}>{article.title}</Link>
                </h3>
                <p>{article.excerpt}</p>
                <time className="meta" dateTime={article.publishedAt}>
                  <Calendar size={14} aria-hidden="true" />
                  {formatArabicDate(article.publishedAt)}
                </time>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
