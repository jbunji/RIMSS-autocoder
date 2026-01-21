/**
 * Utility functions for formatting location data
 */

export interface Location {
  loc_id: number
  majcom_cd: string | null
  site_cd: string | null
  unit_cd: string | null
  squad_cd: string | null
  description: string | null
  geoloc: string | null
  display_name: string
  active: boolean
}

/**
 * Format location for dropdown display in hierarchical format: BASE - UNIT (MAJCOM)
 *
 * @param location - Location object with hierarchical fields
 * @returns Formatted string in format "BASE - UNIT (MAJCOM)" or fallback to display_name
 *
 * @example
 * formatLocationHierarchical({ site_cd: "1160", unit_cd: "1426", majcom_cd: "743", ... })
 * // Returns: "1160 - 1426 (743)"
 *
 * @example
 * formatLocationHierarchical({ site_cd: null, unit_cd: null, majcom_cd: null, display_name: "Main Warehouse", ... })
 * // Returns: "Main Warehouse"
 */
export function formatLocationHierarchical(location: Location): string {
  const { site_cd, unit_cd, majcom_cd, display_name } = location

  // If we have hierarchical data, format as: BASE - UNIT (MAJCOM)
  if (site_cd && unit_cd && majcom_cd) {
    return `${site_cd} - ${unit_cd} (${majcom_cd})`
  }

  // If we only have some hierarchical data, use what we have
  if (site_cd && majcom_cd) {
    return `${site_cd} (${majcom_cd})`
  }

  if (unit_cd && majcom_cd) {
    return `${unit_cd} (${majcom_cd})`
  }

  if (site_cd) {
    return site_cd
  }

  // Fallback to display_name if no hierarchical data
  return display_name
}

/**
 * Sort locations by hierarchical order (MAJCOM > BASE > UNIT > display_name)
 *
 * @param a - First location
 * @param b - Second location
 * @returns Comparison result for Array.sort()
 */
export function compareLocations(a: Location, b: Location): number {
  // Sort by MAJCOM first
  if (a.majcom_cd !== b.majcom_cd) {
    if (!a.majcom_cd) return 1
    if (!b.majcom_cd) return -1
    return a.majcom_cd.localeCompare(b.majcom_cd)
  }

  // Then by site/base
  if (a.site_cd !== b.site_cd) {
    if (!a.site_cd) return 1
    if (!b.site_cd) return -1
    return a.site_cd.localeCompare(b.site_cd)
  }

  // Then by unit
  if (a.unit_cd !== b.unit_cd) {
    if (!a.unit_cd) return 1
    if (!b.unit_cd) return -1
    return a.unit_cd.localeCompare(b.unit_cd)
  }

  // Finally by display name
  return a.display_name.localeCompare(b.display_name)
}
