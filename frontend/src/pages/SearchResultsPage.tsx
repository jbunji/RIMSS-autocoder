import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { MagnifyingGlassIcon, WrenchScrewdriverIcon, CubeIcon, CogIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import EmptySearchIllustration from '../components/EmptySearchIllustration'

interface SearchResult {
  id: number
  type: 'asset' | 'event' | 'configuration'
  title: string
  subtitle?: string
  status?: string
  location?: string
  asset?: string
  version?: string
  url: string
}

interface SearchResponse {
  query: string
  totalResults: number
  assets: SearchResult[]
  events: SearchResult[]
  configurations: SearchResult[]
  message?: string
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { token } = useAuthStore()

  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.trim().length < 2) {
        setResults(null)
        setError('Please enter at least 2 characters to search')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()
        setResults(data)
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to perform search. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, token])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'asset':
        return <CubeIcon className="h-5 w-5 text-primary-600" />
      case 'event':
        return <WrenchScrewdriverIcon className="h-5 w-5 text-orange-600" />
      case 'configuration':
        return <CogIcon className="h-5 w-5 text-purple-600" />
      default:
        return null
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'asset':
        return 'bg-primary-100 text-primary-800'
      case 'event':
        return 'bg-orange-100 text-orange-800'
      case 'configuration':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderResult = (result: SearchResult) => (
    <Link
      key={`${result.type}-${result.id}`}
      to={result.url}
      className="block border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getTypeIcon(result.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeBadgeColor(result.type)} capitalize`}>
              {result.type}
            </span>
            {result.status && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {result.status}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {result.title}
          </h3>
          {result.subtitle && (
            <p className="text-sm text-gray-600 mt-1 truncate">
              {result.subtitle}
            </p>
          )}
          {result.location && (
            <p className="text-sm text-gray-500 mt-1">
              📍 {result.location}
            </p>
          )}
          {result.asset && (
            <p className="text-sm text-gray-500 mt-1">
              🔧 {result.asset}
            </p>
          )}
          {result.version && (
            <p className="text-sm text-gray-500 mt-1">
              v{result.version}
            </p>
          )}
        </div>
      </div>
    </Link>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
        </div>
        {query && (
          <p className="text-gray-600">
            Showing results for: <span className="font-semibold">"{query}"</span>
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Found <span className="font-semibold">{results.totalResults}</span> result{results.totalResults !== 1 ? 's' : ''}
              {' '}({results.assets.length} asset{results.assets.length !== 1 ? 's' : ''}, {results.events.length} event{results.events.length !== 1 ? 's' : ''}, {results.configurations.length} configuration{results.configurations.length !== 1 ? 's' : ''})
            </p>
          </div>

          {/* No Results */}
          {results.totalResults === 0 && (
            <div className="py-12 px-4 sm:py-16 md:py-20">
              <EmptySearchIllustration
                title="No results found"
                subtitle={`We couldn't find anything matching "${query}". Try adjusting your search terms or search for something else.`}
                size="lg"
              />
            </div>
          )}

          {/* Asset Results */}
          {results.assets.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CubeIcon className="h-6 w-6 text-primary-600" />
                Assets ({results.assets.length})
              </h2>
              <div className="space-y-3">
                {results.assets.map(renderResult)}
              </div>
            </div>
          )}

          {/* Event Results */}
          {results.events.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <WrenchScrewdriverIcon className="h-6 w-6 text-orange-600" />
                Maintenance Events ({results.events.length})
              </h2>
              <div className="space-y-3">
                {results.events.map(renderResult)}
              </div>
            </div>
          )}

          {/* Configuration Results */}
          {results.configurations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CogIcon className="h-6 w-6 text-purple-600" />
                Configurations ({results.configurations.length})
              </h2>
              <div className="space-y-3">
                {results.configurations.map(renderResult)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
