/**
 * EmptyConfigurationsIllustration
 *
 * A professional SVG illustration displayed when no configurations exist.
 * Shows a stylized gear/cog with a plus sign to represent "add configuration"
 * and encourage users to create their first configuration.
 */

interface EmptyConfigurationsIllustrationProps {
  className?: string
}

export default function EmptyConfigurationsIllustration({
  className = 'w-48 h-48'
}: EmptyConfigurationsIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="No configurations illustration"
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="smallGearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A5B4FC" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
        <linearGradient id="plusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        {/* Soft shadow filter */}
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15"/>
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx="100" cy="100" r="90" fill="url(#bgGradient)" />

      {/* Decorative dots */}
      <circle cx="45" cy="55" r="3" fill="#C7D2FE" opacity="0.7" />
      <circle cx="155" cy="65" r="4" fill="#C7D2FE" opacity="0.6" />
      <circle cx="50" cy="145" r="3.5" fill="#C7D2FE" opacity="0.5" />
      <circle cx="160" cy="140" r="2.5" fill="#C7D2FE" opacity="0.7" />

      {/* Small decorative gear (background, top-right) */}
      <g transform="translate(140, 45)" filter="url(#softShadow)">
        <path
          d="M20 10.5L18.5 8.5L19 5.5L17 4L15 6L12 5.5L11 3H9L8 5.5L5 6L3 4L1 5.5L1.5 8.5L0 10.5V12.5L1.5 14.5L1 17.5L3 19L5 17L8 17.5L9 20H11L12 17.5L15 17L17 19L19 17.5L18.5 14.5L20 12.5V10.5Z"
          fill="url(#smallGearGradient)"
          opacity="0.6"
        />
        <circle cx="10" cy="11.5" r="4" fill="#E0E7FF" />
      </g>

      {/* Main gear (center) */}
      <g transform="translate(100, 100)" filter="url(#softShadow)">
        {/* Gear teeth - 8 teeth around the center */}
        <path
          d="M-8 -45 L8 -45 L10 -38 L-10 -38 Z"
          fill="url(#gearGradient)"
          transform="rotate(0)"
        />
        <path
          d="M-8 -45 L8 -45 L10 -38 L-10 -38 Z"
          fill="url(#gearGradient)"
          transform="rotate(45)"
        />
        <path
          d="M-8 -45 L8 -45 L10 -38 L-10 -38 Z"
          fill="url(#gearGradient)"
          transform="rotate(90)"
        />
        <path
          d="M-8 -45 L8 -45 L10 -38 L-10 -38 Z"
          fill="url(#gearGradient)"
          transform="rotate(135)"
        />
        <path
          d="M-8 -45 L8 -45 L10 -38 L-10 -38 Z"
          fill="url(#gearGradient)"
          transform="rotate(180)"
        />
        <path
          d="M-8 -45 L8 -45 L10 -38 L-10 -38 Z"
          fill="url(#gearGradient)"
          transform="rotate(225)"
        />
        <path
          d="M-8 -45 L8 -45 L10 -38 L-10 -38 Z"
          fill="url(#gearGradient)"
          transform="rotate(270)"
        />
        <path
          d="M-8 -45 L8 -45 L10 -38 L-10 -38 Z"
          fill="url(#gearGradient)"
          transform="rotate(315)"
        />

        {/* Main gear body (outer circle) */}
        <circle cx="0" cy="0" r="35" fill="url(#gearGradient)" />

        {/* Inner circle (hollow center) */}
        <circle cx="0" cy="0" r="20" fill="#F8FAFC" />

        {/* Center hub */}
        <circle cx="0" cy="0" r="8" fill="url(#gearGradient)" opacity="0.5" />
      </g>

      {/* Plus sign badge (bottom-right of gear) */}
      <g transform="translate(135, 125)" filter="url(#softShadow)">
        {/* Badge circle background */}
        <circle cx="0" cy="0" r="20" fill="white" />
        <circle cx="0" cy="0" r="18" fill="url(#plusGradient)" />

        {/* Plus sign */}
        <rect x="-10" y="-2.5" width="20" height="5" rx="2" fill="white" />
        <rect x="-2.5" y="-10" width="5" height="20" rx="2" fill="white" />
      </g>

      {/* Small gear (bottom-left, decorative) */}
      <g transform="translate(55, 150)" filter="url(#softShadow)">
        <path
          d="M15 8L13.875 6.5L14.25 4.125L12.75 3L11.25 4.5L9 4.125L8.25 2.25H6.75L6 4.125L3.75 4.5L2.25 3L0.75 4.125L1.125 6.5L0 8V9.5L1.125 11L0.75 13.375L2.25 14.5L3.75 13L6 13.375L6.75 15.25H8.25L9 13.375L11.25 13L12.75 14.5L14.25 13.375L13.875 11L15 9.5V8Z"
          fill="url(#smallGearGradient)"
          opacity="0.5"
        />
        <circle cx="7.5" cy="8.75" r="3" fill="#E0E7FF" />
      </g>

      {/* Dashed configuration connection lines (decorative) */}
      <path
        d="M65 95 Q50 100 45 115"
        stroke="#A5B4FC"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M135 85 Q150 75 155 60"
        stroke="#A5B4FC"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}
