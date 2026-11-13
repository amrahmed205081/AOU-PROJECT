import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../common/SectionHeading.tsx'
import { categories } from '../../data/categories.ts'

export function FeaturedCategories() {
  return (
    <section className="topics" aria-labelledby="featured-topics">
      <SectionHeading
        title="موضوعات مميزة"
        icon={<Star size={18} aria-hidden="true" />}
        to="/search"
        id="featured-topics"
      />
      <div className="topics__grid">
        {categories.map((category) => (
          <Link className="topic" key={category.id} to={`/category/${category.slug}`}>
            <div className="topic__media">
              <img src={category.image} alt="" loading="lazy" decoding="async" />
            </div>
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
