import { Component, lazy, Suspense, useEffect, useState } from 'react'
import type { AnimationEvent, ErrorInfo, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import './route-transition.css'

const BookScene = lazy(() =>
  import('./BookScene.tsx').catch((error: unknown) => {
    console.error(error)
    return { default: CssBook }
  }),
)

const FLIP_MS = 1320
const REDUCED_MS = 420
const SAFETY_MS = 2200

type BookMode = 'reduce' | 'css' | 'webgl'

let webglOk: boolean | null = null

function isMobileDevice() {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return true
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true
  if (window.matchMedia('(pointer: coarse)').matches) return true
  return window.matchMedia('(max-width: 820px)').matches
}

function hasWebGL() {
  if (webglOk !== null) return webglOk
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    webglOk = Boolean(gl)
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglOk = false
  }
  return webglOk
}

function bookMode(): BookMode {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduce'
    if (isMobileDevice()) return 'css'
    if (!hasWebGL()) return 'css'
    return 'webgl'
  } catch (error) {
    console.error(error)
    return 'css'
  }
}

function runWhenIdle(task: () => void) {
  try {
    const requestIdle = window.requestIdleCallback
    const cancelIdle = window.cancelIdleCallback
    if (typeof requestIdle === 'function') {
      const id = requestIdle(() => {
        try {
          task()
        } catch (error) {
          console.error(error)
        }
      }, { timeout: 1500 })
      return () => {
        if (typeof cancelIdle === 'function') cancelIdle(id)
      }
    }
  } catch (error) {
    console.error(error)
  }
  const id = window.setTimeout(() => {
    try {
      task()
    } catch (error) {
      console.error(error)
    }
  }, 1200)
  return () => window.clearTimeout(id)
}

class BookBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

class TransitionGuard extends Component<{ children: ReactNode }, { failed: boolean }> {
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

function CssBook() {
  return (
    <div className="css-book" aria-hidden="true">
      <div className="css-book__cover">
        <div className="css-book__page css-book__page--left">
          <p>هذا سفر في علم اللسان</p>
          <p>وحرف الضاد عنوان بيانها</p>
        </div>
        <div className="css-book__page css-book__page--right">
          <p>والمعرفة تنتقل مع الورق</p>
          <p>فاقلب الصفحة تجد أثرها</p>
        </div>
        <div className="css-book__turn">
          <div className="css-book__face css-book__face--front">
            <p>تُقام المعاني على أبنية الكلام</p>
            <p>ويحفظ النحو حدود العبارة</p>
          </div>
          <div className="css-book__face css-book__face--back">
            <p>وقد جرت عادة الكتّاب</p>
            <p>أن يضبطوا اللفظ قبل إرساله</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function RouteTransitionInner() {
  const { pathname } = useLocation()
  const [shownPath, setShownPath] = useState(pathname)
  const [run, setRun] = useState<null | { at: number; mode: BookMode; path: string }>(null)

  if (pathname !== shownPath) {
    setShownPath(pathname)
    setRun({ at: performance.now(), mode: bookMode(), path: pathname })
  }

  useEffect(() => {
    try {
      if (bookMode() !== 'webgl') return undefined
      return runWhenIdle(() => {
        void import('./BookScene.tsx')
        void import('./bookTextures.ts').then((module) => module.preloadBookAssets()).catch((error: unknown) => {
          console.error(error)
        })
      })
    } catch (error) {
      console.error(error)
      return undefined
    }
  }, [])

  useEffect(() => {
    if (!run) return undefined
    const total = run.mode === 'reduce' ? REDUCED_MS : FLIP_MS
    const close = () => setRun(null)
    const id = window.setTimeout(close, total)
    const safety = window.setTimeout(close, SAFETY_MS)
    const onHide = () => {
      if (document.visibilityState === 'hidden') close()
    }
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) close()
    }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', close)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      window.clearTimeout(id)
      window.clearTimeout(safety)
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', close)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [run])

  if (!run) return null

  const finishIfOurs = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.animationName !== 'knowledge-fade') return
    setRun(null)
  }

  return (
    <div
      className="route-transition"
      data-book-mode={run.mode}
      role="status"
      aria-live="polite"
      onAnimationEnd={finishIfOurs}
    >
      {run.mode === 'webgl' ? (
        <BookBoundary fallback={<CssBook />}>
          <Suspense fallback={<CssBook />}>
            <div className="route-transition__stage" key={run.at}>
              <BookScene startedAt={run.at} />
            </div>
          </Suspense>
        </BookBoundary>
      ) : null}
      {run.mode === 'css' ? <CssBook /> : null}
      <p>جاري تقليب صفحات المعرفة...</p>
    </div>
  )
}

export function RouteTransition() {
  return (
    <TransitionGuard>
      <RouteTransitionInner />
    </TransitionGuard>
  )
}
