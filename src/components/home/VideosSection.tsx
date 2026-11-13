import { Clapperboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../common/SectionHeading.tsx'
import { getCategoryById } from '../../data/categories.ts'
import { videos } from '../../data/videos.ts'

export function VideosSection() {
  return (
    <section className="band" aria-labelledby="videos">
      <SectionHeading id="videos" title="فيديوهات مختارة" icon={<Clapperboard size={18} aria-hidden="true" />} />
      <div className="videos">
        {videos.map((video) => {
          const category = getCategoryById(video.categoryId)
          return (
            <article className="video" key={video.id}>
              <div className="video__media">
                <img src={video.poster} alt="" loading="lazy" decoding="async" />
                <span className="video__note">سيُضاف رابط الفيديو لاحقاً</span>
              </div>
              <div className="video__body">
                {category ? (
                  <Link className="badge" to={`/category/${category.slug}`}>{category.name}</Link>
                ) : null}
                <h3>{video.title}</h3>
                <p>{video.excerpt}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
