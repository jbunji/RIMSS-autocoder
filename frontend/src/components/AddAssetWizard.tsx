import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
  CubeIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import StepIndicator, { HorizontalStepIndicator } from './StepIndicator'
import LocationSelect from './LocationSelect'
import { compareLocations } from '../utils/locationFormatter'
import type { Location } from '../utils/locationFormatter'

// Zod schema for asset creation (same as original)
const createAssetSchema = z.object({
  partno: z.string()
    .trim()
    .min(1, 'Part number is required')
    .max(50, 'Part number must be at most 50 characters')
    .regex(/^[A-Za-z0-9\-_]+$/, 'Part number can only contain letters, numbers, hyphens, and underscores'),
  serno: z.string()
    .trim()
    .min(1, 'Serial number is required')
    .max(50, 'Serial number must be at most 50 characters'),
  name: z.string()
    .trim()
    .max(100, 'Name must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  status_cd: z.string().trim().min(1, 'Status is required'),
  admin_loc: z.string().trim().min(1, 'Assigned base is required'),
  cust_loc: z.string().trim().min(1, 'Current base is required'),
  notes: z.string().trim().max(500, 'Notes must be at most 500 characters').optional().or(z.literal('')),
})

type CreateAssetFormData = z.infer<typeof createAssetSchema>

interface AssetStatus {
  status_cd: string
  status_name: string
  description: string
}

interface AddAssetWizardProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateAssetFormData) => Promise<void>
  adminLocations: Location[]
  custodialLocations: Location[]
  assetStatuses: AssetStatus[]
  majcoms: string[]
  isLoading?: boolean
}

// Define wizard steps
const wizardSteps = [
  { id: 1, label: 'Identification' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Review & Submit' },
]

export default function AddAssetWizard({
  isOpen,
  onClose,
  onSubmit,
  adminLocations,
  custodialLocations,
  assetStatuses,
  majcoms,
  isLoading = false,
}: AddAssetWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<CreateAssetFormData>({
    resolver: zodResolver(createAssetSchema),
    mode: 'onChange',
  })

  // Watch form values for preview
  const formValues = watch()

  const handleStepClick = async (stepId: number) => {
    // Only allow navigating to completed steps or next step
    if (completedSteps.includes(stepId) || stepId === currentStep + 1) {
      // Validate current step before moving forward
      if (stepId > currentStep) {
        const isStepValid = await validateCurrentStep()
        if (!isStepValid) return
      }
      setCurrentStep(stepId)
    }
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    switch (currentStep) {
      case 1:
        // Validate identification fields
        return await trigger(['partno', 'serno', 'name'])
      case 2:
        // Validate location fields
        return await trigger(['status_cd', 'admin_loc', 'cust_loc'])
      default:
        return true
    }
  }

  const handleNext = async () => {
    const isStepValid = await validateCurrentStep()
    if (!isStepValid) return

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }

    if (currentStep < wizardSteps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFormSubmit = async (data: CreateAssetFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      // Reset wizard state on success
      setCurrentStep(1)
      setCompletedSteps([])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    setCompletedSteps([])
    onClose()
  }

  const canGoNext = currentStep < wizardSteps.length
  const canGoBack = currentStep > 1
  const isLastStep = currentStep === wizardSteps.length

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all flex flex-col max-h-[90vh]">
                {/* Fixed Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <CubeIcon className="h-6 w-6 mr-2 text-blue-600" />
                    Add New Asset
                  </Dialog.Title>

                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Step Indicators */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="hidden sm:block">
                    <StepIndicator
                      steps={wizardSteps}
                      currentStep={currentStep}
                      completedSteps={completedSteps}
                      onStepClick={handleStepClick}
                    />
                  </div>
                  <div className="sm:hidden">
                    <HorizontalStepIndicator
                      steps={wizardSteps}
                      currentStep={currentStep}
                      completedSteps={completedSteps}
                    />
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="px-6 py-6 overflow-y-auto flex-1">
                  <form onSubmit={handleSubmit(handleFormSubmit)} id="add-asset-wizard-form">
                    {/* Step 1: Identification */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          Asset Identification
                        </h4>

                        {/* Part Number */}
                        <div>
                          <label htmlFor="partno" className="block text-sm font-medium text-gray-700">
                            Part Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="partno"
                            {...register('partno')}
                            className={`mt-1 block w-full rounded-md border shadow-sm px-3 py-2 sm:text-sm ${
                              errors.partno
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                            placeholder="PN-SENSOR-A"
                          />
                          {errors.partno && (
                            <p className="mt-1 text-sm text-red-600">{errors.partno.message}</p>
                          )}
                        </div>

                        {/* Serial Number */}
                        <div>
                          <label htmlFor="serno" className="block text-sm font-medium text-gray-700">
                            Serial Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="serno"
                            {...register('serno')}
                            className={`mt-1 block w-full rounded-md border shadow-sm px-3 py-2 sm:text-sm ${
                              errors.serno
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                            placeholder="CRIIS-011"
                          />
                          {errors.serno && (
                            <p className="mt-1 text-sm text-red-600">{errors.serno.message}</p>
                          )}
                        </div>

                        {/* Asset Name (optional) */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Asset Name <span className="text-gray-400">(optional)</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            {...register('name')}
                            className={`mt-1 block w-full rounded-md border shadow-sm px-3 py-2 sm:text-sm ${
                              errors.name
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                            placeholder="Sensor Unit A-3"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            If not provided, a name will be generated from the part and serial number.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Location */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          Location & Status
                        </h4>

                        {/* Status */}
                        <div>
                          <label htmlFor="status_cd" className="block text-sm font-medium text-gray-700">
                            Status <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="status_cd"
                            {...register('status_cd')}
                            className={`mt-1 block w-full rounded-md border shadow-sm px-3 py-2 sm:text-sm ${
                              errors.status_cd
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                          >
                            <option value="">Select a status...</option>
                            {assetStatuses.map((status) => (
                              <option key={status.status_cd} value={status.status_cd}>
                                {status.status_cd} - {status.status_name}
                              </option>
                            ))}
                          </select>
                          {errors.status_cd && (
                            <p className="mt-1 text-sm text-red-600">{errors.status_cd.message}</p>
                          )}
                        </div>

                        {/* Assigned Base */}
                        <div>
                          <label htmlFor="admin_loc" className="block text-sm font-medium text-gray-700">
                            Assigned Base <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name="admin_loc"
                            control={control}
                            render={({ field }) => (
                              <LocationSelect
                                value={field.value}
                                onChange={field.onChange}
                                locations={adminLocations.sort(compareLocations)}
                                majcoms={majcoms}
                                label=""
                                required={true}
                                error={errors.admin_loc?.message}
                                id="admin_loc"
                                placeholder="Select assigned base..."
                              />
                            )}
                          />
                        </div>

                        {/* Current Base */}
                        <div>
                          <label htmlFor="cust_loc" className="block text-sm font-medium text-gray-700">
                            Current Base <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name="cust_loc"
                            control={control}
                            render={({ field }) => (
                              <LocationSelect
                                value={field.value}
                                onChange={field.onChange}
                                locations={custodialLocations.sort(compareLocations)}
                                majcoms={majcoms}
                                label=""
                                required={true}
                                error={errors.cust_loc?.message}
                                id="cust_loc"
                                placeholder="Select current base..."
                              />
                            )}
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes <span className="text-gray-400">(optional)</span>
                          </label>
                          <textarea
                            id="notes"
                            rows={3}
                            {...register('notes')}
                            className={`mt-1 block w-full rounded-md border shadow-sm px-3 py-2 sm:text-sm ${
                              errors.notes
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                            placeholder="Any additional notes about this asset..."
                          />
                          {errors.notes && (
                            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Review & Submit */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          Review Asset Details
                        </h4>

                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Part Number</p>
                              <p className="text-sm text-gray-900">{formValues.partno || '-'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Serial Number</p>
                              <p className="text-sm text-gray-900">{formValues.serno || '-'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Asset Name</p>
                              <p className="text-sm text-gray-900">{formValues.name || '-'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Status</p>
                              <p className="text-sm text-gray-900">{formValues.status_cd || '-'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Assigned Base</p>
                              <p className="text-sm text-gray-900">{formValues.admin_loc || '-'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Current Base</p>
                              <p className="text-sm text-gray-900">{formValues.cust_loc || '-'}</p>
                            </div>
                          </div>
                          {formValues.notes && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">Notes</p>
                              <p className="text-sm text-gray-900">{formValues.notes}</p>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600">
                          Please review the information above before submitting. Click <strong>Submit</strong> to create the asset or <strong>Back</strong> to make changes.
                        </p>
                      </div>
                    )}
                  </form>
                </div>

                {/* Fixed Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <div>
                    {canGoBack && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ChevronLeftIcon className="h-4 w-4 mr-1" />
                        Back
                      </button>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>

                    {!isLastStep ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        form="add-asset-wizard-form"
                        disabled={isSubmitting || isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Creating...' : 'Submit'}
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
