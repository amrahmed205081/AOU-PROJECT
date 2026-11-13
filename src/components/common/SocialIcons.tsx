import { siteSettings } from '../../data/siteSettings.ts'

interface IconProps {
  name: 'facebook' | 'x' | 'instagram' | 'youtube'
}

const labels = {
  facebook: 'فيسبوك',
  x: 'إكس',
  instagram: 'إنستغرام',
  youtube: 'يوتيوب',
}

function Glyph({ name }: IconProps) {
  if (name === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path fill="currentColor" d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.4 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.4-2.7h-2.7z" />
      </svg>
    )
  }
  if (name === 'x') {
    return (
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <path fill="currentColor" d="M4 4h3.2l4.1 5.7L16.2 4H20l-6.3 7.6L20.4 20h-3.2l-4.5-6.2L7.6 20H4l6.7-8.1z" />
      </svg>
    )
  }
  if (name === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path fill="currentColor" d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8A3.2 3.2 0 0 0 19.2 16V8A3.2 3.2 0 0 0 16 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.4 6.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M22 8.2a3 3 0 0 0-2.1-2.1C18.2 5.6 12 5.6 12 5.6s-6.2 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.5 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.7.5 7.9.5 7.9.5s6.2 0 7.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22.5 12 31 31 0 0 0 22 8.2zM10.2 15.1V8.9L15.6 12z" />
    </svg>
  )
}

export function SocialIcons() {
  const items = [
    ['facebook', siteSettings.social.facebook],
    ['x', siteSettings.social.x],
    ['instagram', siteSettings.social.instagram],
    ['youtube', siteSettings.social.youtube],
  ] as const

  return (
    <div className="social">
      {items.map(([name, href]) =>
        href ? (
          <a key={name} className="social__link" href={href} target="_blank" rel="noreferrer">
            <Glyph name={name} />
            <span className="visually-hidden">{labels[name]}</span>
          </a>
        ) : (
          <span key={name} className="social__pending" title="سيُضاف الحساب لاحقاً">
            <Glyph name={name} />
            <span className="visually-hidden">{labels[name]} — سيُضاف الحساب لاحقاً</span>
          </span>
        ),
      )}
    </div>
  )
}
