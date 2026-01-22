/**
 * EmptyAssetsIllustration Component
 *
 * A friendly SVG illustration displayed when no assets match the current filters
 * or when the assets list is empty. Features an aircraft silhouette with a question
 * mark to provide visual feedback and help users understand no results were found.
 */

interface EmptyAssetsIllustrationProps {
  /** Title text shown below the illustration */
  title?: string
  /** Subtitle/description text */
  subtitle?: string
  /** Additional CSS classes */
  className?: string
  /** Size of the illustration: 'sm', 'md', 'lg' */
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
}

export default function EmptyAssetsIllustration({
  title = 'No assets found',
  subtitle = 'Try adjusting your filters or search criteria',
  className = '',
  size = 'md',
}: EmptyAssetsIllustrationProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* SVG Illustration - Aircraft with Question Mark */}
      <svg
        className={`${sizeClasses[size]} text-gray-300`}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="100" cy="100" r="90" fill="currentColor" fillOpacity="0.1" />

        {/* Aircraft silhouette - simplified F-16 style */}
        <g transform="translate(40, 55)">
          {/* Fuselage */}
          <path
            d="M60 90 L55 80 L30 75 L25 70 L20 70 L15 75 L10 75 L5 70 L0 70 L0 75 L5 80 L20 85 L60 90 Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
          {/* Main body */}
          <ellipse cx="60" cy="45" rx="55" ry="15" fill="currentColor" fillOpacity="0.5" />
          {/* Nose cone */}
          <path
            d="M115 45 Q125 45 120 48 L115 48 Z"
            fill="currentColor"
            fillOpacity="0.5"
          />
          <path
            d="M115 45 Q125 45 120 42 L115 42 Z"
            fill="currentColor"
            fillOpacity="0.5"
          />
          {/* Cockpit canopy */}
          <ellipse cx="90" cy="43" rx="15" ry="8" fill="currentColor" fillOpacity="0.3" />
          {/* Tail fin */}
          <path
            d="M5 45 L0 25 L10 25 L15 45"
            fill="currentColor"
            fillOpacity="0.5"
          />
          {/* Horizontal stabilizer */}
          <path
            d="M10 50 L0 60 L5 60 L15 55 L10 50"
            fill="currentColor"
            fillOpacity="0.4"
          />
          <path
            d="M10 40 L0 30 L5 30 L15 35 L10 40"
            fill="currentColor"
            fillOpacity="0.4"
          />
          {/* Wing - main */}
          <path
            d="M40 55 L30 90 L50 90 L55 55"
            fill="currentColor"
            fillOpacity="0.4"
          />
          <path
            d="M40 35 L30 0 L50 0 L55 35"
            fill="currentColor"
            fillOpacity="0.4"
          />
          {/* Engine intake */}
          <ellipse cx="50" cy="45" rx="8" ry="5" fill="currentColor" fillOpacity="0.6" />
        </g>

        {/* Question mark circle */}
        <circle cx="145" cy="145" r="35" fill="white" stroke="currentColor" strokeWidth="3" strokeOpacity="0.5" />

        {/* Question mark */}
        <text
          x="145"
          y="158"
          textAnchor="middle"
          fontSize="42"
          fontWeight="bold"
          fill="currentColor"
          fillOpacity="0.6"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          ?
        </text>

        {/* Decorative dashed lines */}
        <path
          d="M30 160 Q50 150 70 155"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
        />
        <path
          d="M130 40 Q150 35 170 40"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
        />
      </svg>

      {/* Text content */}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 max-w-sm">{subtitle}</p>
      )}
    </div>
  )
}
