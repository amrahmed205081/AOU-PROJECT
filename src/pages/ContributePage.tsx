import { DemoForm } from '../components/common/DemoForm.tsx'
import { siteSettings } from '../data/siteSettings.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function ContributePage() {
  usePageMeta({
    title: 'شارك معنا',
    description: 'كيف يمكن المشاركة بملاحظة أو فكرة لمشروع اللغة هوية وانتماء.',
    path: '/contribute',
  })

  return (
    <div className="container page">
      <section className="banner">
        <img src="/images/calligraphy-book.webp" alt="" />
        <div className="banner__content">
          <h1>شارك معنا</h1>
          <p>باب مفتوح للاقتراحات اللغوية والثقافية، بانتظار ربطه بقناة التحرير.</p>
        </div>
      </section>
      <div className="layout">
        <div className="prose-page prose">
          <p>
            إذا لاحظت تعبيراً يتكرر على غير وجهه، أو مثلاً يُقال في غير موضعه، أو حكاية لهجية تستحق التسجيل، يمكن وصفها في النموذج. في هذه المعاينة تبقى الرسالة على جهازك ولا تغادر المتصفح.
          </p>
          <p>هيئة التحرير هي التي تقرر لاحقاً ما يُنشر، بعد التحقق من اللغة والمصدر والصورة.</p>
          <p className="note">{siteSettings.previewNotice}</p>
        </div>
        <DemoForm submitLabel="إرسال الفكرة للمعاينة" />
      </div>
    </div>
  )
}
