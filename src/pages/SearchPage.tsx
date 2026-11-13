import { Search } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArticleCard } from '../components/common/ArticleCard.tsx'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { searchArticles } from '../utils/content.ts'

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const [value, setValue] = useState(initial)
  const results = useMemo(() => searchArticles(initial), [initial])

  usePageMeta({
    title: initial ? `نتائج البحث: ${initial}` : 'بحث',
    description: 'ابحث في عناوين المقالات ومقدماتها والأقسام المتاحة في المعاينة.',
    path: initial ? `/search?q=${encodeURIComponent(initial)}` : '/search',
  })

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = value.trim()
    setParams(query ? { q: query } : {})
  }

  return (
    <div className="container page">
      <div className="search-hero">
        <h1>{initial ? 'نتائج البحث' : 'كل المقالات'}</h1>
        <form className="search" role="search" onSubmit={onSubmit}>
          <label className="visually-hidden" htmlFor="page-search">عبارة البحث</label>
          <input
            id="page-search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="ابحث بالعنوان أو المقدمة أو اسم القسم"
          />
          <button type="submit" aria-label="بحث">
            <Search size={18} />
          </button>
        </form>
        <p className="results-count">
          {initial ? `${results.length} نتيجة مطابقة` : `${results.length} مقالاً في المعاينة`}
        </p>
      </div>
      {results.length === 0 ? (
        <div className="empty">لا توجد مقالات مطابقة. جرّب اسم قسم مثل «اللهجات» أو كلمة من العنوان.</div>
      ) : (
        <div className="cards">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
