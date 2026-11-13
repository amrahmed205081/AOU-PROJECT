import { Calendar, Newspaper } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../common/SectionHeading.tsx'
import type { Article } from '../../types/content.ts'
import { formatArabicDate } from '../../utils/format.ts'

export function ImportantNews({ articles }: { articles: Article[] }) {
  return (
    <section className="panel" aria-labelledby="important-news">
      <SectionHeading id="important-news" title="أهم الأخبار" icon={<Newspaper size={18} aria-hidden="true" />} />
      <div>
        {articles.map((article) => (
          <article className="news__item" key={article.id}>
            <Link to={`/article/${article.slug}`}>
              <img src={article.featuredImage} alt="" loading="lazy" decoding="async" />
            </Link>
            <div>
              <h3>
                <Link to={`/article/${article.slug}`}>{article.title}</Link>
              </h3>
              <time className="meta" dateTime={article.publishedAt}>
                <Calendar size={13} aria-hidden="true" />
                {formatArabicDate(article.publishedAt)}
              </time>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
