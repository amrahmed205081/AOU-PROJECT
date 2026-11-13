import { Link } from 'react-router-dom'
import { SocialIcons } from '../common/SocialIcons.tsx'
import { categories } from '../../data/categories.ts'
import { utilityLinks } from '../../data/navigation.ts'
import { siteSettings } from '../../data/siteSettings.ts'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <img className="footer__logo" src={siteSettings.logo} alt={siteSettings.logoAlt} />
          <p>{siteSettings.tagline}</p>
        </div>
        <div>
          <h2>الأقسام</h2>
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>{category.name}</Link>
          ))}
        </div>
        <div>
          <h2>الموقع</h2>
          <Link to="/">الرئيسية</Link>
          {utilityLinks.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
          <Link to="/search">بحث</Link>
          <SocialIcons />
        </div>
      </div>
      <div className="container footer__base">
        <p>© {new Date().getFullYear()} {siteSettings.name}. {siteSettings.copyright}.</p>
        <p>{siteSettings.previewNotice}</p>
      </div>
    </footer>
  )
}
