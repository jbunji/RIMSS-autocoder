/**
 * SkeletonList - List item placeholder skeleton
 * Mimics list items with icon/avatar + text content
 */

interface SkeletonListProps {
  items?: number
  showIcon?: boolean
  className?: string
}

export default function SkeletonList({ items = 5, showIcon = true, className = '' }: SkeletonListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          {showIcon && (
            <div className="h-10 w-10 rounded bg-gray-200 animate-pulse flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <div
              className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
            <div
              className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"
              style={{ animationDelay: `${i * 100 + 50}ms` }}
            />
          </div>
          <div
            className="h-8 w-8 rounded bg-gray-200 animate-pulse flex-shrink-0"
            style={{ animationDelay: `${i * 100 + 100}ms` }}
          />
        </div>
      ))}
    </div>
  )
}
