import { FeaturedCategories } from '../components/home/FeaturedCategories.tsx'
import { HeroSlider } from '../components/home/HeroSlider.tsx'
import { ImportantNews } from '../components/home/ImportantNews.tsx'
import { LatestArticles } from '../components/home/LatestArticles.tsx'
import { LatestTopics } from '../components/home/LatestTopics.tsx'
import { MostRead } from '../components/home/MostRead.tsx'
import { VideosSection } from '../components/home/VideosSection.tsx'
import { heroSlugs, importantNewsSlugs, latestSlugs, latestTopicSlugs, popularSlugs } from '../data/homepage.ts'
import { siteSettings } from '../data/siteSettings.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { pickArticles } from '../utils/content.ts'

export function HomePage() {
  usePageMeta({
    title: siteSettings.name,
    description: siteSettings.description,
    path: '/',
  })

  return (
    <div className="container page-home">
      <div className="home-grid">
        <div className="home-main">
          <HeroSlider articles={pickArticles(heroSlugs)} />
          <LatestArticles articles={pickArticles(latestSlugs)} />
        </div>
        <aside className="home-side">
          <ImportantNews articles={pickArticles(importantNewsSlugs)} />
          <MostRead articles={pickArticles(popularSlugs)} />
        </aside>
      </div>
      <FeaturedCategories />
      <VideosSection />
      <LatestTopics articles={pickArticles(latestTopicSlugs)} />
    </div>
  )
}
