'use client'

import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider, useTheme } from 'next-themes'

/* --------------------------------
 * Hook: usePrevious (sem useEffect)
 * -------------------------------- */
function usePrevious<T>(value: T) {
  const ref = useRef<T>(value)
  const previous = ref.current
  ref.current = value
  return previous
}

/* --------------------------------
 * ThemeWatcher otimizado
 * -------------------------------- */
function ThemeWatcher() {
  const { resolvedTheme, setTheme } = useTheme()
  const themeRef = useRef(resolvedTheme)

  useEffect(() => {
    themeRef.current = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const onMediaChange = () => {
      const systemTheme = media.matches ? 'dark' : 'light'
      if (themeRef.current === systemTheme) {
        setTheme('system')
      }
    }

    media.addEventListener('change', onMediaChange)
    return () => media.removeEventListener('change', onMediaChange)
  }, [setTheme])

  return null
}

/* --------------------------------
 * Context
 * -------------------------------- */
export const AppContext = createContext<{
  previousPathname?: string
}>({})

/* --------------------------------
 * Providers
 * -------------------------------- */
export function Providers({ children }: { children: ReactNode }) {
  const followerRef = useRef<HTMLDivElement | null>(null)

  const pathname = usePathname()
  const previousPathname = usePrevious(pathname)

  const contextValue = useMemo(
    () => ({ previousPathname }),
    [previousPathname]
  )

  /* --------------------------------
   * Mouse follower (GPU-friendly)
   * -------------------------------- */
  useEffect(() => {
    const follower = followerRef.current
    if (!follower) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let currentX = mouseX
    let currentY = mouseY

    const easeAmount = 0.1
    let rafId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    document.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    })

    const animate = () => {
      currentX += (mouseX - currentX) * easeAmount
      currentY += (mouseY - currentY) * easeAmount

      follower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <AppContext.Provider value={contextValue}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <div
          ref={followerRef}
          id="follower"
          className="mix-blend-difference hidden md:block fixed w-4 h-4 bg-orange-500 dark:bg-orange-400 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[1000]"
        />
        <ThemeWatcher />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  )
}
