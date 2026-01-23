import { ReactNode } from 'react'

interface IconAnimationProps {
  children: ReactNode
  type?: 'bounce' | 'pulse' | 'scale'
  className?: string
}

/**
 * IconAnimation - Wraps icons with subtle animation on interaction
 *
 * Animation types:
 * - bounce: Quick vertical bounce effect (great for "Add", "Create" actions)
 * - pulse: Subtle scale pulse (good for "Refresh", "Sync" actions)
 * - scale: Quick scale down and up (satisfying click feedback)
 *
 * All animations are 150ms duration for quick, satisfying feedback
 */
export default function IconAnimation({
  children,
  type = 'scale',
  className = ''
}: IconAnimationProps) {
  const animationClasses = {
    bounce: 'active:animate-icon-bounce',
    pulse: 'active:animate-icon-pulse',
    scale: 'active:animate-icon-scale'
  }

  return (
    <span className={`inline-block ${animationClasses[type]} ${className}`}>
      {children}
    </span>
  )
}
