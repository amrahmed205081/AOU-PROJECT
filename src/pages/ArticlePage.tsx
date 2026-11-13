import { Calendar, UserRound } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArticleCard } from '../components/common/ArticleCard.tsx'
import { Breadcrumb } from '../components/common/Breadcrumb.tsx'
import { ShareBar } from '../components/common/ShareBar.tsx'
import { getCategoryById } from '../data/categories.ts'
import { siteSettings } from '../data/siteSettings.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { getArticleBySlug, getRelatedArticles } from '../utils/content.ts'
import { formatArabicDate } from '../utils/format.ts'

export function ArticlePage() {
  const { slug = '' } = useParams()
  const article = getArticleBySlug(slug)
  const category = article ? getCategoryById(article.categoryId) : undefined
  const related = article ? getRelatedArticles(article) : []

  usePageMeta({
    title: article?.title ?? 'المقال',
    description: article?.excerpt ?? siteSettings.description,
    path: article ? `/article/${article.slug}` : '/article',
    image: article?.featuredImage,
    type: 'article',
  })

  useEffect(() => {
    if (!article) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      datePublished: article.publishedAt,
      description: article.excerpt,
      inLanguage: 'ar',
      author: { '@type': 'Organization', name: article.author },
      image: new URL(article.featuredImage, window.location.origin).href,
    })
    document.head.appendChild(script)
    return () => script.remove()
  }, [article])

  if (!article || !category) {
    return (
      <div className="container page">
        <div className="empty">
          <h1>المقال غير موجود</h1>
          <Link className="btn" to="/">العودة إلى الرئيسية</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <article className="article">
        <Breadcrumb
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: category.name, to: `/category/${category.slug}` },
            { label: article.title },
          ]}
        />
        <Link className="badge" to={`/category/${category.slug}`}>{category.name}</Link>
        <h1 className="article__title">{article.title}</h1>
        <div className="article__meta">
          <span className="meta"><UserRound size={15} aria-hidden="true" />{article.author}</span>
          <time className="meta" dateTime={article.publishedAt}>
            <Calendar size={15} aria-hidden="true" />
            {formatArabicDate(article.publishedAt)}
          </time>
        </div>
        <figure className="article__figure">
          <img src={article.featuredImage} alt="" />
        </figure>
        <div className="prose">
          {article.content.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
        {article.videoId ? (
          <div className="band">
            <h2>شاهد</h2>
            <iframe
              title={article.title}
              src={`https://www.youtube-nocookie.com/embed/${article.videoId}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 12, marginTop: 10 }}
            />
          </div>
        ) : null}
        <p className="note">{siteSettings.previewNotice}</p>
        <ShareBar title={article.title} />
        <section className="related">
          <h2>مقالات ذات صلة</h2>
          <div className="cards">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
