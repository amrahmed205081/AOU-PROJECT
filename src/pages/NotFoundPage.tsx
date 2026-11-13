import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function NotFoundPage() {
  usePageMeta({
    title: 'الصفحة غير موجودة',
    description: 'تعذر العثور على هذه الصفحة في موقع اللغة هوية وانتماء.',
    path: '/404',
  })

  return (
    <div className="container page">
      <div className="empty">
        <h1>الصفحة غير موجودة</h1>
        <p>ربما تغيّر الرابط، أو أن المادة لم تُضف بعد إلى المعاينة.</p>
        <Link className="btn" to="/">العودة إلى الرئيسية</Link>
      </div>
    </div>
  )
}
