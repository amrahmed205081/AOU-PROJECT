import { useEffect } from 'react'
import { siteSettings } from '../data/siteSettings.ts'

interface PageMeta {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function usePageMeta({ title, description, path = '/', image, type = 'website' }: PageMeta) {
  useEffect(() => {
    const fullTitle = title === siteSettings.name ? title : `${title} | ${siteSettings.name}`
    document.title = fullTitle
    const url = `${window.location.origin}${path}`
    const imageUrl = image ? new URL(image, window.location.origin).href : new URL(siteSettings.logo, window.location.origin).href

    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:locale', 'ar_EG')
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path, image, type])
}
