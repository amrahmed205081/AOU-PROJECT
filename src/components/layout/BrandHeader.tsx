import { Link } from 'react-router-dom'
import { siteSettings } from '../../data/siteSettings.ts'

export function BrandHeader() {
  return (
    <header className="brand">
      <img className="brand__photo brand__photo--books" src="/images/library-rows.webp" alt="" />
      <img className="brand__photo brand__photo--city" src="/images/cairo-skyline.webp" alt="" />
      <Link to="/" aria-label={siteSettings.name}>
        <img className="brand__logo" src={siteSettings.logo} alt={siteSettings.logoAlt} />
      </Link>
    </header>
  )
}
