import { useState, type FormEvent } from 'react'

export function DemoForm({ submitLabel }: { submitLabel: string }) {
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()

    if (!name || !email || !message) {
      setError('يرجى تعبئة الاسم والبريد ونص الرسالة.')
      setSent(false)
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('يرجى إدخال بريد إلكتروني بصيغة صحيحة.')
      setSent(false)
      return
    }
    setError('')
    setSent(true)
    event.currentTarget.reset()
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <p className="note">نموذج تجريبي للمعاينة. لا يُرسل إلى خادم، ولن تُحفظ الرسالة.</p>
      <label>
        الاسم
        <input name="name" autoComplete="name" />
      </label>
      <label>
        البريد الإلكتروني
        <input name="email" type="email" autoComplete="email" />
      </label>
      <label>
        الرسالة
        <textarea name="message" />
      </label>
      {error ? <p className="form__error">{error}</p> : null}
      {sent ? (
        <p className="form__ok">ظهرت الرسالة داخل المعاينة فقط. عند ربط البريد لاحقاً ستصل إلى هيئة التحرير.</p>
      ) : null}
      <button className="btn" type="submit">{submitLabel}</button>
    </form>
  )
}
