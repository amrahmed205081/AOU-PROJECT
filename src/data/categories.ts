import type { Category } from '../types/content.ts'

export const categories: Category[] = [
  {
    id: 'lisan',
    slug: 'lisan-al-dad',
    name: 'لسان الضاد',
    description:
      'مقالات عن العربية: تاريخها، وهويتها، ونحوها، ومكانتها الثقافية، وما الذي يجعلها لغة حضارة لا مجرد أداة تخاطب.',
    image: '/images/kufic.webp',
  },
  {
    id: 'qul',
    slug: 'qul-wa-la-taqul',
    name: 'قل ولا تقل',
    description:
      'تصويب الأخطاء الشائعة في الكتابة والحديث، مع شرح مبسّط للوجه الصحيح حتى يستقيم اللسان من غير تكلّف.',
    image: '/images/fountain-pen.webp',
  },
  {
    id: 'dialects',
    slug: 'dialects',
    name: 'اللهجات',
    description:
      'رحلة في اللهجات المصرية والعربية: أصول الألفاظ، واختلاف المعاني، وما تحمله العامية من ذاكرة مكان.',
    image: '/images/cairo-skyline.webp',
  },
  {
    id: 'figures',
    slug: 'figures',
    name: 'شخصيات',
    description:
      'أعلام اللغة والأدب: نحويون وشعراء ومعجميون تركوا أثراً ما زال يُدرّس ويُقرأ حتى اليوم.',
    image: '/images/library-rows.webp',
  },
  {
    id: 'phenomena',
    slug: 'phenomena',
    name: 'ظواهر غريبة',
    description:
      'ظواهر لغوية وثقافية غير مألوفة: كلمات نادرة، ومعانٍ متقابلة، وحقائق طريفة عن طريقة عمل العربية.',
    image: '/images/nizami.webp',
  },
  {
    id: 'proverbs',
    slug: 'proverbs',
    name: 'أمثلة',
    description:
      'أمثال وتعبيرات وأقوال مأثورة: معانيها، ومواضع استخدامها، والحكايات التي خرجت منها.',
    image: '/images/pyramids-sunset.webp',
  },
  {
    id: 'misc',
    slug: 'misc',
    name: 'منوعات',
    description:
      'مواد ثقافية وأدبية وتعليمية تتصل بالعربية والإعلام والخط والمخطوطات، خارج الأبواب الستة الأخرى.',
    image: '/images/mosque-aerial.webp',
  },
]

export function getCategoryById(id: string) {
  return categories.find((category) => category.id === id)
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}
