import { Component, lazy, Suspense, useEffect, useState } from 'react'
import type { AnimationEvent, ErrorInfo, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import './route-transition.css'

const BookScene = lazy(() =>
  import('./BookScene.tsx').catch((error: unknown) => {
    console.error(error)
    return { default: function BookFallback() { return <CssBook animated={false} /> } }
  }),
)

const FLIP_MS = 1320
const CSS_MS = 1900
const REDUCED_MS = 420
const SAFETY_MS = 2600

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

const LEAVES = [
  { front: ['هذا سفر في علم اللسان', 'وحرف الضاد عنوان بيانها'] },
  { front: ['والمعرفة تسكن الورق', 'فاقلب الصفحة تجد أثرها'] },
  { front: ['في كل صفحة أثر من البيان', 'وفي كل سطر نسب للعربية'] },
]

function CssBook({ animated }: { animated: boolean }) {
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!animated) return undefined
    const id = window.requestAnimationFrame(() => setLive(true))
    return () => window.cancelAnimationFrame(id)
  }, [animated])

  return (
    <div className={live ? 'css-book is-live' : 'css-book'} aria-hidden="true">
      <div className="css-book__board">
        <div className="css-book__corners">
          <i /><i /><i /><i />
        </div>
        <div className="css-book__spine"><span /></div>
        <div className="css-book__edges" />
        <div className="css-book__sheet css-book__sheet--left">
          <p>باب البيان في لغة الضاد</p>
          <p>وما يُحفظ من فصيح الكلام</p>
        </div>
        <div className="css-book__sheet css-book__sheet--right">
          <p>هنا تستقر الصفحة الأخيرة</p>
          <p>بعد أن تُقلب أوراق المعرفة</p>
        </div>
        {LEAVES.map((leaf, index) => (
          <div className={`css-book__leaf css-book__leaf--${index + 1}`} key={index}>
            <div className="css-book__hinge">
              <div className="css-book__face">
                {leaf.front.map((line) => <p key={line}>{line}</p>)}
              </div>
              <div className="css-book__curl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RouteTransitionInner() {
  const { pathname } = useLocation()
  const [shownPath, setShownPath] = useState(pathname)
  const [run, setRun] = useState<null | { at: number; mode: BookMode; path: string; mobile: boolean }>(null)

  if (pathname !== shownPath) {
    setShownPath(pathname)
    const mobile = isMobileDevice()
    setRun({ at: performance.now(), mode: bookMode(), path: pathname, mobile })
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
    const total = run.mode === 'css' ? CSS_MS : run.mode === 'reduce' && run.mobile ? 900 : run.mode === 'reduce' ? REDUCED_MS : FLIP_MS
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

  const showCssBook = run.mode === 'css' || (run.mode === 'reduce' && run.mobile)
  const overlay = (
    <div
      className={showCssBook ? 'route-transition route-transition--css' : 'route-transition'}
      data-book-mode={run.mode}
      role="status"
      aria-live="polite"
      onAnimationEnd={finishIfOurs}
    >
      {run.mode === 'webgl' ? (
        <BookBoundary fallback={<CssBook animated={false} />}>
          <Suspense fallback={<CssBook animated={false} />}>
            <div className="route-transition__stage" key={run.at}>
              <BookScene startedAt={run.at} />
            </div>
          </Suspense>
        </BookBoundary>
      ) : null}
      {showCssBook ? <CssBook key={run.at} animated={run.mode === 'css'} /> : null}
      <p>جاري تقليب صفحات المعرفة...</p>
    </div>
  )

  return createPortal(overlay, document.body)
}

export function RouteTransition() {
  return (
    <TransitionGuard>
      <RouteTransitionInner />
    </TransitionGuard>
  )
}
