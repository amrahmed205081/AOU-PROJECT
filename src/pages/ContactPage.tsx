import { DemoForm } from '../components/common/DemoForm.tsx'
import { siteSettings } from '../data/siteSettings.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function ContactPage() {
  usePageMeta({
    title: 'اتصل بنا',
    description: 'باب التواصل مع مشروع اللغة هوية وانتماء.',
    path: '/contact',
  })

  return (
    <div className="container page">
      <section className="banner">
        <img src="/images/cairo-skyline.webp" alt="" />
        <div className="banner__content">
          <h1>اتصل بنا</h1>
          <p>للاقتراحات والملاحظات المتعلقة بالمعاينة التحريرية.</p>
        </div>
      </section>
      <div className="layout">
        <DemoForm submitLabel="إرسال للمعاينة" />
        <aside className="prose-page">
          <h2>بيانات التواصل</h2>
          <p>
            {siteSettings.email
              ? siteSettings.email
              : 'سيُعلن البريد الرسمي عند اعتماد بيانات هيئة التحرير. لا يوجد عنوان بديل في هذه المعاينة.'}
          </p>
          <p>المشروع واجهة أمامية فقط، بلا لوحة إدارة ولا قاعدة بيانات.</p>
        </aside>
      </div>
    </div>
  )
}
