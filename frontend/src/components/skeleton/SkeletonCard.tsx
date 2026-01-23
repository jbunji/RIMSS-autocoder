/**
 * SkeletonCard - Card placeholder skeleton
 * Mimics a card with header, content, and optional footer
 */

interface SkeletonCardProps {
  showAvatar?: boolean
  showFooter?: boolean
  className?: string
}

export default function SkeletonCard({ showAvatar = false, showFooter = false, className = '' }: SkeletonCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {/* Card Header */}
      <div className="flex items-center space-x-3 mb-4">
        {showAvatar && (
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        )}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      </div>

      {/* Card Content */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
      </div>

      {/* Card Footer */}
      {showFooter && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      )}
    </div>
  )
}
