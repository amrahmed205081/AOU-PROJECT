import { ChevronDown, Home, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { mainNav, utilityLinks } from '../../data/navigation.ts'

export function MainNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  return (
    <nav className="nav" aria-label="الأقسام">
      <div className="container nav__bar">
        <ul className="nav__list">
          {mainNav.map((item) => {
            const isHome = item.to === '/'
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={isHome}
                  className={({ isActive }) =>
                    `nav__link${isHome ? ' nav__link--home' : ''}${isActive ? ' is-active' : ''}`
                  }
                >
                  {isHome ? <Home size={16} aria-hidden="true" /> : null}
                  {item.label}
                  {isHome ? null : <ChevronDown size={14} aria-hidden="true" />}
                </NavLink>
              </li>
            )
          })}
        </ul>
        <button
          className="nav__burger"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
          القائمة
        </button>
      </div>
      <div className={`nav__panel${open ? ' is-open' : ''}`} id="mobile-menu">
        {mainNav.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            {item.label}
          </NavLink>
        ))}
        {utilityLinks.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
