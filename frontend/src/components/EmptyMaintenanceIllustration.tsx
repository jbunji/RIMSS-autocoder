/**
 * EmptyMaintenanceIllustration Component
 *
 * A friendly SVG illustration displayed when no maintenance jobs exist
 * or match current filters. Features a wrench with a checkmark to convey
 * that there's nothing requiring attention at the moment - a calm maintenance bay.
 */

interface EmptyMaintenanceIllustrationProps {
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

export default function EmptyMaintenanceIllustration({
  title = 'No maintenance jobs found',
  subtitle = 'All systems operational - nothing requires attention',
  className = '',
  size = 'md',
}: EmptyMaintenanceIllustrationProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* SVG Illustration - Wrench with Checkmark */}
      <svg
        className={`${sizeClasses[size]} text-gray-300`}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="100" cy="100" r="90" fill="currentColor" fillOpacity="0.1" />

        {/* Maintenance bay floor - subtle grid pattern */}
        <g opacity="0.15">
          <line x1="30" y1="155" x2="170" y2="155" stroke="currentColor" strokeWidth="2" />
          <line x1="40" y1="155" x2="40" y2="170" stroke="currentColor" strokeWidth="1" />
          <line x1="70" y1="155" x2="70" y2="170" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="155" x2="100" y2="170" stroke="currentColor" strokeWidth="1" />
          <line x1="130" y1="155" x2="130" y2="170" stroke="currentColor" strokeWidth="1" />
          <line x1="160" y1="155" x2="160" y2="170" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Large wrench - main element */}
        <g transform="translate(45, 35) rotate(45, 55, 65)">
          {/* Wrench head - open jaw */}
          <path
            d="M20 15 L30 5 L45 5 L55 15 L55 35 L45 45 L30 45 L20 35 Z"
            fill="currentColor"
            fillOpacity="0.5"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeWidth="2"
          />
          {/* Jaw opening */}
          <path
            d="M32 10 L43 10 L43 40 L32 40 Z"
            fill="white"
            fillOpacity="0.8"
          />
          {/* Handle */}
          <rect
            x="32"
            y="45"
            width="12"
            height="70"
            rx="3"
            fill="currentColor"
            fillOpacity="0.5"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeWidth="2"
          />
          {/* Handle grip texture */}
          <line x1="35" y1="60" x2="41" y2="60" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          <line x1="35" y1="70" x2="41" y2="70" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          <line x1="35" y1="80" x2="41" y2="80" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          <line x1="35" y1="90" x2="41" y2="90" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          <line x1="35" y1="100" x2="41" y2="100" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
        </g>

        {/* Success checkmark circle - green tinted */}
        <circle
          cx="145"
          cy="145"
          r="35"
          fill="white"
          stroke="#10B981"
          strokeWidth="3"
          strokeOpacity="0.6"
        />

        {/* Checkmark */}
        <path
          d="M127 145 L140 158 L163 132"
          stroke="#10B981"
          strokeWidth="5"
          strokeOpacity="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Decorative sparkles - indicating clean/clear status */}
        <g opacity="0.4">
          {/* Sparkle 1 */}
          <path
            d="M35 70 L38 65 L41 70 L38 75 Z"
            fill="currentColor"
          />
          {/* Sparkle 2 */}
          <path
            d="M160 60 L163 55 L166 60 L163 65 Z"
            fill="currentColor"
          />
          {/* Sparkle 3 */}
          <path
            d="M50 140 L52 136 L54 140 L52 144 Z"
            fill="currentColor"
          />
        </g>

        {/* Subtle tool outline in background */}
        <g opacity="0.1">
          {/* Small screwdriver silhouette */}
          <rect x="165" y="85" width="4" height="25" rx="1" fill="currentColor" />
          <path d="M165 85 L167 75 L169 85 Z" fill="currentColor" />
        </g>

        {/* Decorative dashed arc */}
        <path
          d="M40 120 Q60 100 80 105"
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
