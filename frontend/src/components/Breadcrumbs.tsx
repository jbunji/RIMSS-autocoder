import { Link } from 'react-router-dom'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'

export interface BreadcrumbItem {
  label: string
  path: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* Home */}
        <li>
          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-gray-500"
            aria-label="Home"
          >
            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.path} className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {isLast ? (
                <span className="ml-2 text-sm font-medium text-gray-500" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
