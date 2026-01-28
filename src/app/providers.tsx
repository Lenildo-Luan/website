'use client'

import { createContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider, useTheme } from 'next-themes'

function usePrevious<T>(value: T) {
  let ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    let media = window.matchMedia('(prefers-color-scheme: dark)')

    function onMediaChange() {
      let systemTheme = media.matches ? 'dark' : 'light'
      if (resolvedTheme === systemTheme) {
        setTheme('system')
      }
    }

    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export const AppContext = createContext<{ previousPathname?: string }>({})

export function Providers({ children }: { children: React.ReactNode }) {
  const followerRef = useRef<HTMLDivElement | null>(null);
  let pathname = usePathname()
  let previousPathname = usePrevious(pathname)

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    const easeAmount = 0.10;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      currentX += dx * easeAmount;
      currentY += dy * easeAmount;

      follower.style.left = `${currentX}px`;
      follower.style.top = `${currentY}px`;

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <div ref={followerRef} id="follower" className="fidden md:block absolute w-4 h-4 bg-orange-500 dark:orange-400 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[1000]" ></div>
        <ThemeWatcher />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  )
}
