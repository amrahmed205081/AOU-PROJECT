import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategoryById } from '../../data/categories.ts'
import type { Article } from '../../types/content.ts'

export function HeroSlider({ articles }: { articles: Article[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = articles.length

  useEffect(() => {
    if (paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [paused, count])

  if (count === 0) return null

  function go(next: number) {
    setIndex((next + count) % count)
  }

  return (
    <section
      className="hero"
      aria-roledescription="شريط"
      aria-label="المقالات البارزة"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {articles.map((article, slideIndex) => {
        const category = getCategoryById(article.categoryId)
        const active = slideIndex === index
        return (
          <article className={`hero__slide${active ? ' is-active' : ''}`} key={article.id} aria-hidden={!active}>
            <img
              src={article.featuredImage}
              alt=""
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
              fetchPriority={slideIndex === 0 ? 'high' : 'low'}
            />
            <div className="hero__content">
              {category ? <span className="kicker">{category.name}</span> : null}
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
              <Link className="btn" to={`/article/${article.slug}`} tabIndex={active ? 0 : -1}>
                اقرأ المزيد
                <ArrowLeft size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        )
      })}
      <button className="hero__arrow hero__arrow--prev" type="button" onClick={() => go(index - 1)} aria-label="السابق">
        <ChevronRight size={20} />
      </button>
      <button className="hero__arrow hero__arrow--next" type="button" onClick={() => go(index + 1)} aria-label="التالي">
        <ChevronLeft size={20} />
      </button>
      <div className="hero__dots">
        {articles.map((article, slideIndex) => (
          <button
            key={article.id}
            type="button"
            className={slideIndex === index ? 'is-active' : undefined}
            aria-label={`الشريحة ${slideIndex + 1}`}
            aria-current={slideIndex === index ? 'true' : undefined}
            onClick={() => setIndex(slideIndex)}
          />
        ))}
      </div>
    </section>
  )
}
