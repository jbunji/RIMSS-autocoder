/**
 * SkeletonDashboardWidget - Dashboard widget placeholder skeleton
 * Mimics the structure of dashboard widgets (title + content area)
 */

interface SkeletonDashboardWidgetProps {
  size?: 'small' | 'medium' | 'large'
  showChart?: boolean
  title?: string
  className?: string
}

export default function SkeletonDashboardWidget({
  size = 'medium',
  showChart = false,
  title,
  className = ''
}: SkeletonDashboardWidgetProps) {
  const heightClasses = {
    small: 'h-32',
    medium: 'h-48',
    large: 'h-64'
  }

  return (
    <div className={`bg-white shadow rounded-lg p-4 sm:p-6 ${className}`}>
      {/* Widget Title */}
      {title ? (
        <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
      ) : (
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
      )}

      {/* Widget Content */}
      <div className={`${heightClasses[size]} flex flex-col justify-center`}>
        {showChart ? (
          // Chart skeleton with bars/lines
          <div className="flex items-end justify-between h-full px-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-full mx-1 bg-gray-200 rounded-t animate-pulse"
                style={{
                  height: `${40 + Math.random() * 60}%`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        ) : (
          // Summary stats skeleton
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" style={{ animationDelay: '100ms' }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse" style={{ animationDelay: '400ms' }} />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" style={{ animationDelay: '500ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
