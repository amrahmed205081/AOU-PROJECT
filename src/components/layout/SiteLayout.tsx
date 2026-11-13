import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { RouteTransition } from '../transition/RouteTransition.tsx'
import { BrandHeader } from './BrandHeader.tsx'
import { Footer } from './Footer.tsx'
import { MainNav } from './MainNav.tsx'
import { TopBar } from './TopBar.tsx'

export function SiteLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a className="skip" href="#content">تخطي إلى المحتوى</a>
      <TopBar />
      <BrandHeader />
      <MainNav />
      <main id="content">
        <Suspense fallback={<div className="loading">جارٍ التحميل…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <RouteTransition />
    </>
  )
}
