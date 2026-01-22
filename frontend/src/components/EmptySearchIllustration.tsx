/**
 * EmptySearchIllustration Component
 *
 * A friendly SVG illustration displayed when a search query returns no results.
 * Features a magnifying glass with an X mark to provide visual feedback
 * that the search found nothing, making the empty state more user-friendly.
 */

interface EmptySearchIllustrationProps {
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

export default function EmptySearchIllustration({
  title = 'No results found',
  subtitle = 'Try adjusting your search terms or search for something else',
  className = '',
  size = 'md',
}: EmptySearchIllustrationProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* SVG Illustration - Magnifying Glass with X */}
      <svg
        className={`${sizeClasses[size]} text-gray-300`}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="100" cy="100" r="90" fill="currentColor" fillOpacity="0.1" />

        {/* Magnifying glass lens */}
        <circle
          cx="85"
          cy="85"
          r="45"
          fill="white"
          stroke="currentColor"
          strokeWidth="8"
          strokeOpacity="0.5"
        />

        {/* Inner lens gradient effect */}
        <circle
          cx="85"
          cy="85"
          r="38"
          fill="currentColor"
          fillOpacity="0.05"
        />

        {/* Lens shine/reflection */}
        <ellipse
          cx="70"
          cy="72"
          rx="12"
          ry="8"
          fill="currentColor"
          fillOpacity="0.15"
          transform="rotate(-30 70 72)"
        />

        {/* X mark inside lens */}
        <g transform="translate(85, 85)">
          {/* X line 1 */}
          <line
            x1="-18"
            y1="-18"
            x2="18"
            y2="18"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
          {/* X line 2 */}
          <line
            x1="18"
            y1="-18"
            x2="-18"
            y2="18"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
        </g>

        {/* Magnifying glass handle */}
        <rect
          x="118"
          y="118"
          width="16"
          height="50"
          rx="8"
          fill="currentColor"
          fillOpacity="0.5"
          transform="rotate(45 118 118)"
        />

        {/* Handle grip lines */}
        <g transform="rotate(45 118 118)">
          <line
            x1="122"
            y1="135"
            x2="130"
            y2="135"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.3"
          />
          <line
            x1="122"
            y1="142"
            x2="130"
            y2="142"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.3"
          />
          <line
            x1="122"
            y1="149"
            x2="130"
            y2="149"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.3"
          />
        </g>

        {/* Decorative search dots/particles */}
        <circle cx="40" cy="140" r="4" fill="currentColor" fillOpacity="0.2" />
        <circle cx="55" cy="155" r="3" fill="currentColor" fillOpacity="0.15" />
        <circle cx="160" cy="50" r="5" fill="currentColor" fillOpacity="0.2" />
        <circle cx="175" cy="70" r="3" fill="currentColor" fillOpacity="0.15" />

        {/* Decorative dashed search path lines */}
        <path
          d="M30 165 Q45 160 50 145"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
        />
        <path
          d="M155 40 Q165 45 175 55"
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
