/**
 * SkeletonTable - Table row placeholder skeleton
 * Mimics table rows with proper column structure
 */

interface SkeletonTableProps {
  rows?: number
  columns?: number
  showHeader?: boolean
  className?: string
}

export default function SkeletonTable({
  rows = 5,
  columns = 5,
  showHeader = true,
  className = ''
}: SkeletonTableProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Table Header */}
      {showHeader && (
        <div className="border-b border-gray-200 pb-3 mb-3">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={`header-${i}`}
                className="h-5 bg-gray-200 rounded animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Table Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-4 py-2"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-8 bg-gray-200 rounded animate-pulse"
                style={{ animationDelay: `${(rowIndex * columns + colIndex) * 30}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
