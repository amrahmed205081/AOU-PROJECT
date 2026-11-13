import { siteSettings } from '../data/siteSettings.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function AboutPage() {
  usePageMeta({
    title: 'من نحن',
    description: siteSettings.description,
    path: '/about',
  })

  return (
    <div className="container page">
      <section className="banner">
        <img src="/images/library-rows.webp" alt="" />
        <div className="banner__content">
          <h1>من نحن</h1>
          <p>{siteSettings.tagline}</p>
        </div>
      </section>
      <div className="prose-page prose">
        <p>
          «اللغة هوية وانتماء» مشروع تخرج في كلية الإعلام. ينطلق من سؤال قريب: كيف تتراجع العربية في الاستعمال اليومي، وما الذي يبقى من هويتها حين تضيق المساحة بين البيت والمدرسة والشاشة.
        </p>
        <p>
          الموقع بوابة ثقافية تحريرية، لا منصة تعليم نحوي مغلقة. فيها سبعة أبواب: لسان الضاد، وقل ولا تقل، واللهجات، والشخصيات، وظواهر غريبة، والأمثلة، ومنوعات. الأسماء ثابتة، والمادة التي ترونها الآن مادة معاينة حتى يجهز الأرشيف الحقيقي.
        </p>
        <h2>ما الذي يعدّه الموقع؟</h2>
        <ul className="checks">
          <li>قراءة هادئة لتاريخ العربية ومكانتها، بلغة يفهمها غير المتخصص.</li>
          <li>تصويب الأخطاء الشائعة من غير تعالٍ على المتحدث.</li>
          <li>إنصات إلى اللهجة بوصفها ذاكرة، لا بوصفها خطأً دائماً.</li>
          <li>تعريف بأعلام اللغة والأدب، وبالأمثال التي ما زالت تُقال.</li>
        </ul>
        <p className="note">{siteSettings.previewNotice}</p>
      </div>
    </div>
  )
}
