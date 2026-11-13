import { ArrowLeft, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArticleCard } from '../components/common/ArticleCard.tsx'
import { SectionHeading } from '../components/common/SectionHeading.tsx'
import { popularSlugs } from '../data/homepage.ts'
import { getCategoryBySlug } from '../data/categories.ts'
import { siteSettings } from '../data/siteSettings.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { getArticlesByCategory, pickArticles } from '../utils/content.ts'
import { formatArabicDate } from '../utils/format.ts'

const pageSize = 2

export function CategoryPage() {
  const { slug = '' } = useParams()
  const category = getCategoryBySlug(slug)
  const articles = category ? getArticlesByCategory(category.id) : []
  const [visible, setVisible] = useState(pageSize)

  useEffect(() => {
    setVisible(pageSize)
  }, [slug])
  const featured = articles[0]
  const rest = articles.slice(1)
  const shown = rest.slice(0, visible)
  const popular = pickArticles(popularSlugs)

  usePageMeta({
    title: category?.name ?? 'القسم',
    description: category?.description ?? siteSettings.description,
    path: category ? `/category/${category.slug}` : '/category',
    image: category?.image,
  })

  if (!category) {
    return (
      <div className="container page">
        <div className="empty">
          <h1>القسم غير موجود</h1>
          <Link className="btn" to="/">العودة إلى الرئيسية</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <section className="banner">
        <img src={category.image} alt="" />
        <div className="banner__content">
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      </section>
      <div className="layout">
        <div className="stack">
          {featured ? (
            <article className="feature">
              <img src={featured.featuredImage} alt="" />
              <div>
                <span className="badge">{category.name}</span>
                <h2>
                  <Link to={`/article/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p>{featured.excerpt}</p>
                <time className="meta" dateTime={featured.publishedAt}>{formatArabicDate(featured.publishedAt)}</time>
                <Link className="btn" to={`/article/${featured.slug}`}>
                  اقرأ المزيد
                  <ArrowLeft size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ) : null}
          <div className="listing">
            {shown.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {visible < rest.length ? (
            <div className="center-actions">
              <button className="btn btn--ghost" type="button" onClick={() => setVisible((count) => count + pageSize)}>
                عرض المزيد
              </button>
            </div>
          ) : null}
          <p className="note">{siteSettings.previewNotice}</p>
        </div>
        <aside className="panel">
          <SectionHeading title="الأكثر قراءة" icon={<Flame size={18} aria-hidden="true" />} />
          <ol>
            {popular.map((article, index) => (
              <li className="rank-item" key={article.id}>
                <span className="rank">{index + 1}</span>
                <h3>
                  <Link to={`/article/${article.slug}`}>{article.title}</Link>
                </h3>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  )
}
