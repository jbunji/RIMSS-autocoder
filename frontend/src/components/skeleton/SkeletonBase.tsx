/**
 * SkeletonBase - Base component with shimmer animation effect
 * Provides the foundation for all skeleton loaders
 */

interface SkeletonBaseProps {
  className?: string
  children?: React.ReactNode
}

export default function SkeletonBase({ className = '', children }: SkeletonBaseProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
      style={{
        animation: 'shimmer 1.5s infinite',
      }}
    >
      {children}
    </div>
  )
}

// Add the shimmer keyframes to the global CSS via a style tag
export function SkeletonStyles() {
  return (
    <style>{`
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `}</style>
  )
}
