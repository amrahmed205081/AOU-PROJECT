import { Component, lazy, Suspense, useEffect, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import './route-transition.css'

const BookScene = lazy(() => import('./BookScene.tsx'))

const FLIP_MS = 1320
const REDUCED_MS = 420

class BookBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

export function RouteTransition() {
  const { pathname } = useLocation()
  const [shownPath, setShownPath] = useState(pathname)
  const [run, setRun] = useState<null | { at: number; reduce: boolean; path: string }>(null)

  if (pathname !== shownPath) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setShownPath(pathname)
    setRun({ at: performance.now(), reduce, path: pathname })
  }

  useEffect(() => {
    const id = window.requestIdleCallback(() => {
      void import('./BookScene.tsx')
      void import('./bookTextures.ts').then((module) => module.preloadBookAssets())
    }, { timeout: 1500 })
    return () => window.cancelIdleCallback(id)
  }, [])

  useEffect(() => {
    if (!run) return undefined
    const total = run.reduce ? REDUCED_MS : FLIP_MS
    const id = window.setTimeout(() => setRun(null), total)
    return () => window.clearTimeout(id)
  }, [run])

  if (!run) return null

  return (
    <div className="route-transition" role="status" aria-live="polite">
      {run.reduce ? null : (
        <BookBoundary>
          <Suspense fallback={null}>
            <div className="route-transition__stage" key={run.at}>
              <BookScene startedAt={run.at} />
            </div>
          </Suspense>
        </BookBoundary>
      )}
      <p>جاري تقليب صفحات المعرفة...</p>
    </div>
  )
}
