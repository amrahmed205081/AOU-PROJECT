import { Search } from 'lucide-react'
import { type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SocialIcons } from '../common/SocialIcons.tsx'
import { utilityLinks } from '../../data/navigation.ts'
import { formatToday } from '../../utils/format.ts'

export function TopBar() {
  const navigate = useNavigate()
  const today = formatToday()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const query = String(data.get('q') || '').trim()
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <div className="topbar__start">
          <time dateTime={new Date().toISOString()}>{today}</time>
          <nav className="topbar__links" aria-label="روابط مساعدة">
            {utilityLinks.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
            ))}
          </nav>
        </div>
        <div className="topbar__end">
          <form className="search search--desktop" role="search" onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor="site-search">بحث في الموقع</label>
            <input id="site-search" name="q" placeholder="ابحث في الموقع..." />
            <button type="submit" aria-label="بحث">
              <Search size={16} />
            </button>
          </form>
          <Link className="icon-button" to="/search" aria-label="فتح البحث">
            <Search size={18} />
          </Link>
          <SocialIcons />
        </div>
      </div>
    </div>
  )
}
