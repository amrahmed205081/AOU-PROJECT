import type { NavItem } from '../types/content.ts'

export const utilityLinks: NavItem[] = [
  { label: 'من نحن', to: '/about' },
  { label: 'اتصل بنا', to: '/contact' },
  { label: 'شارك معنا', to: '/contribute' },
]

export const mainNav: NavItem[] = [
  { label: 'الرئيسية', to: '/' },
  { label: 'لسان الضاد', to: '/category/lisan-al-dad' },
  { label: 'قل ولا تقل', to: '/category/qul-wa-la-taqul' },
  { label: 'اللهجات', to: '/category/dialects' },
  { label: 'شخصيات', to: '/category/figures' },
  { label: 'ظواهر غريبة', to: '/category/phenomena' },
  { label: 'أمثلة', to: '/category/proverbs' },
  { label: 'منوعات', to: '/category/misc' },
]
