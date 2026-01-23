import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset animation when route changes
    if (containerRef.current) {
      // Remove and re-add the animation class to trigger re-animation
      containerRef.current.classList.remove('page-transition-enter')
      void containerRef.current.offsetWidth // Force reflow
      containerRef.current.classList.add('page-transition-enter')
    }
  }, [location.pathname])

  return (
    <div ref={containerRef} className="page-transition-enter">
      {children}
    </div>
  )
}
