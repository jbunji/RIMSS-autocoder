import { useState } from 'react'
import { ChevronRightIcon, ChevronDownIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface Location {
  loc_id: number
  display_name: string
  majcom_cd: string | null
  site_cd: string | null
  unit_cd: string | null
  squad_cd: string | null
  description: string | null
  active: boolean
}

interface TreeNode {
  id: string
  label: string
  type: 'majcom' | 'site' | 'unit' | 'squadron' | 'location'
  children: TreeNode[]
  location?: Location
  count: number
}

interface LocationHierarchyTreeProps {
  locations: Location[]
}

export default function LocationHierarchyTree({ locations }: LocationHierarchyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Build hierarchical tree structure
  const buildTree = (): TreeNode[] => {
    const majcomMap = new Map<string, TreeNode>()

    locations.forEach(location => {
      const majcom = location.majcom_cd || 'Unknown MAJCOM'
      const site = location.site_cd || 'Unknown Site'
      const unit = location.unit_cd || 'Unknown Unit'
      const squad = location.squad_cd || 'Unknown Squadron'

      // Get or create MAJCOM node
      if (!majcomMap.has(majcom)) {
        majcomMap.set(majcom, {
          id: `majcom-${majcom}`,
          label: majcom,
          type: 'majcom',
          children: [],
          count: 0
        })
      }
      const majcomNode = majcomMap.get(majcom)!
      majcomNode.count++

      // Get or create Site node
      let siteNode = majcomNode.children.find(n => n.label === site)
      if (!siteNode) {
        siteNode = {
          id: `site-${majcom}-${site}`,
          label: site,
          type: 'site',
          children: [],
          count: 0
        }
        majcomNode.children.push(siteNode)
      }
      siteNode.count++

      // Get or create Unit node
      let unitNode = siteNode.children.find(n => n.label === unit)
      if (!unitNode) {
        unitNode = {
          id: `unit-${majcom}-${site}-${unit}`,
          label: unit,
          type: 'unit',
          children: [],
          count: 0
        }
        siteNode.children.push(unitNode)
      }
      unitNode.count++

      // Get or create Squadron node
      let squadNode = unitNode.children.find(n => n.label === squad)
      if (!squadNode) {
        squadNode = {
          id: `squad-${majcom}-${site}-${unit}-${squad}`,
          label: squad,
          type: 'squadron',
          children: [],
          count: 0
        }
        unitNode.children.push(squadNode)
      }
      squadNode.count++

      // Add location as leaf node
      squadNode.children.push({
        id: `loc-${location.loc_id}`,
        label: location.display_name,
        type: 'location',
        children: [],
        location,
        count: 1
      })
    })

    // Sort nodes alphabetically at each level
    const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.label.localeCompare(b.label))
      nodes.forEach(node => sortNodes(node.children))
    }

    const rootNodes = Array.from(majcomMap.values())
    sortNodes(rootNodes)
    return rootNodes
  }

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const expandAll = () => {
    const allNodeIds = new Set<string>()
    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.children.length > 0 && node.type !== 'location') {
          allNodeIds.add(node.id)
          collectIds(node.children)
        }
      })
    }
    collectIds(tree)
    setExpandedNodes(allNodeIds)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  const renderNode = (node: TreeNode, depth: number = 0): JSX.Element => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children.length > 0 && node.type !== 'location'
    const paddingLeft = depth * 24

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer rounded ${
            node.type === 'location' ? 'ml-6' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <span className="mr-2">
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </span>
          )}
          {node.type === 'location' && (
            <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
          )}
          <span className="flex items-center gap-2">
            <span
              className={`${
                node.type === 'majcom'
                  ? 'font-bold text-gray-900'
                  : node.type === 'site'
                  ? 'font-semibold text-gray-800'
                  : node.type === 'unit'
                  ? 'font-medium text-gray-700'
                  : node.type === 'squadron'
                  ? 'text-gray-600'
                  : 'text-gray-500'
              }`}
            >
              {node.label}
            </span>
            {node.type !== 'location' && (
              <span className="text-xs text-gray-400">({node.count})</span>
            )}
            {node.type === 'location' && node.location && (
              <>
                <span className="text-xs text-gray-400">ID: {node.location.loc_id}</span>
                {node.location.active ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                )}
              </>
            )}
          </span>
        </div>
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const tree = buildTree()

  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">No locations found</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Location Hierarchy</h3>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Collapse All
          </button>
        </div>
      </div>
      <div className="px-4 py-4 max-h-[600px] overflow-y-auto">
        {tree.map(node => renderNode(node, 0))}
      </div>
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {locations.length} locations organized by MAJCOM → Base → Unit → Squadron
        </p>
      </div>
    </div>
  )
}
