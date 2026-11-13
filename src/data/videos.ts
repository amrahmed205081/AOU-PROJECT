import type { VideoItem } from '../types/content.ts'

export const videos: VideoItem[] = [
  {
    id: 'v1',
    title: 'ما الذي يجعل العربية لغة الضاد؟',
    excerpt: 'شرح مصوّر قصير عن الصوت، والرسم، والرمز الثقافي.',
    categoryId: 'lisan',
    poster: '/images/kufic.webp',
    videoId: null,
  },
  {
    id: 'v2',
    title: 'خمسة أخطاء نكتبها كل يوم',
    excerpt: 'حلقة معاينة لباب قل ولا تقل، بانتظار رابط النشر.',
    categoryId: 'qul',
    poster: '/images/fountain-pen.webp',
    videoId: null,
  },
  {
    id: 'v3',
    title: 'كلمة «خلاص» من مدينة إلى مدينة',
    excerpt: 'جولة في اختلاف المعنى الواحد بين اللهجات.',
    categoryId: 'dialects',
    poster: '/images/cairo-skyline.webp',
    videoId: null,
  },
  {
    id: 'v4',
    title: 'كيف تقرأ بيتاً من المخطوط؟',
    excerpt: 'تعريف بصري بأدوات النظر إلى الصفحة القديمة.',
    categoryId: 'misc',
    poster: '/images/nizami.webp',
    videoId: null,
  },
]
