import { CheckIcon } from '@heroicons/react/24/outline'

interface Step {
  id: number
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  completedSteps: number[]
  onStepClick?: (stepId: number) => void
}

/**
 * StepIndicator - Visual step indicator for multi-step forms/wizards
 *
 * Features:
 * - Numbered steps with labels
 * - Current step is visually highlighted
 * - Completed steps show checkmarks
 * - Progress line connects steps
 * - Clickable navigation back to completed steps
 * - Responsive design for smaller screens
 */
export default function StepIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="hidden sm:block">
      <ol role="list" className="space-y-4">
        {steps.map((step, stepIdx) => {
          const isCurrent = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id)
          const isClickable = onStepClick && (isCompleted || step.id === currentStep)

          return (
            <li key={step.id} className="relative">
              {/* Step line */}
              {stepIdx !== steps.length - 1 && (
                <div
                  className={`absolute left-4 top-6 -ml-px mt-0.5 h-full w-0.5 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-hidden="true"
                />
              )}

              <div className="group relative flex items-start">
                <span className="flex h-9 items-center" aria-hidden="true">
                  <span
                    className={`
                      relative z-10 flex h-8 w-8 items-center justify-center rounded-full
                      ${isCurrent ? 'bg-blue-600' : isCompleted ? 'bg-blue-600' : 'bg-gray-200'}
                      ${isClickable ? 'cursor-pointer hover:bg-blue-700' : ''}
                      transition-colors duration-200
                    `}
                    onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    ) : (
                      <span
                        className={isCurrent ? 'text-white' : 'text-gray-600'}
                      >
                        {step.id}
                      </span>
                    )}
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span
                    className={`
                      text-sm font-medium
                      ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}
                      ${isClickable ? 'cursor-pointer hover:text-blue-700' : ''}
                      transition-colors duration-200
                    `}
                    onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-sm text-gray-500">In progress</span>
                  )}
                  {isCompleted && !isCurrent && (
                    <span className="text-sm text-gray-500">Completed</span>
                  )}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * HorizontalStepIndicator - Compact horizontal version for smaller screens
 */
interface HorizontalStepIndicatorProps {
  steps: Step[]
  currentStep: number
  completedSteps: number[]
}

export function HorizontalStepIndicator({
  steps,
  currentStep,
  completedSteps,
}: HorizontalStepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="sm:hidden">
      <ol role="list" className="flex items-center justify-between">
        {steps.map((step, stepIdx) => {
          const isCurrent = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id)

          return (
            <li key={step.id} className={`flex-1 ${stepIdx !== 0 ? 'ml-2' : ''}`}>
              <div className="flex items-center">
                {/* Connector line */}
                {stepIdx !== 0 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                )}

                {/* Step circle */}
                <div
                  className={`
                    relative flex h-8 w-8 items-center justify-center rounded-full
                    ${isCurrent ? 'bg-blue-600 ring-4 ring-blue-100' : isCompleted ? 'bg-blue-600' : 'bg-gray-200'}
                    ${stepIdx !== 0 ? '-ml-2' : ''}
                    transition-all duration-200
                  `}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                  ) : (
                    <span
                      className={isCurrent ? 'text-white' : 'text-gray-600'}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
              </div>

              {/* Step label (only show for current and adjacent steps on mobile) */}
              {(isCurrent || isCompleted || step.id === currentStep + 1) && (
                <div className="mt-1 text-xs text-center">
                  <span
                    className={`${
                      isCurrent ? 'font-semibold text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
