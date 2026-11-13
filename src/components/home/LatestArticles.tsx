import { Newspaper } from 'lucide-react'
import { ArticleCard } from '../common/ArticleCard.tsx'
import { SectionHeading } from '../common/SectionHeading.tsx'
import type { Article } from '../../types/content.ts'

export function LatestArticles({ articles }: { articles: Article[] }) {
  return (
    <section aria-labelledby="latest-articles">
      <SectionHeading
        title="أحدث المقالات"
        icon={<Newspaper size={18} aria-hidden="true" />}
        to="/search"
        id="latest-articles"
      />
      <div className="cards">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
