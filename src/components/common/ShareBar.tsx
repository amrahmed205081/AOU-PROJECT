import { Link2, Share2 } from 'lucide-react'
import { useState } from 'react'

export function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window === 'undefined' ? '' : window.location.href
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(title)

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        return
      }
    }
    await copyLink()
  }

  return (
    <div className="share" aria-label="مشاركة المقال">
      <button type="button" onClick={nativeShare}>
        <Share2 size={16} aria-hidden="true" />
        مشاركة
      </button>
      <button type="button" onClick={copyLink}>
        <Link2 size={16} aria-hidden="true" />
        {copied ? 'تم نسخ الرابط' : 'نسخ الرابط'}
      </button>
      <a href={`https://wa.me/?text=${text}%20${encoded}`} target="_blank" rel="noreferrer">واتساب</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`} target="_blank" rel="noreferrer">فيسبوك</a>
      <a href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`} target="_blank" rel="noreferrer">إكس</a>
    </div>
  )
}
