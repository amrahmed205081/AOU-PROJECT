import { Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../common/SectionHeading.tsx'
import type { Article } from '../../types/content.ts'

export function MostRead({ articles }: { articles: Article[] }) {
  return (
    <section className="panel" aria-labelledby="most-read">
      <SectionHeading id="most-read" title="مقالات الأكثر قراءة" icon={<Flame size={18} aria-hidden="true" />} />
      <ol>
        {articles.map((article, index) => (
          <li className="rank-item" key={article.id}>
            <span className="rank" aria-hidden="true">{index + 1}</span>
            <Link to={`/article/${article.slug}`}>
              <img src={article.featuredImage} alt="" loading="lazy" decoding="async" />
            </Link>
            <h3>
              <Link to={`/article/${article.slug}`}>{article.title}</Link>
            </h3>
          </li>
        ))}
      </ol>
    </section>
  )
}
