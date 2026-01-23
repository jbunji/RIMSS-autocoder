# Configuration Module Feature Set

## Overview
The configuration module needs to be updated to load data from the legacy cfg_set and cfg_list database tables, display the configuration hierarchy (Bill of Materials), and properly filter by the current program and location context selected in the navbar.

## Current State
- Configuration module uses mock data instead of database
- No location-based filtering
- Hierarchy (cfg_list) is partially implemented but not connected to database
- Program filtering exists but doesn't use actual database records

## Target State
- Load cfg_set records from PostgreSQL database
- Display cfg_list hierarchy (parent-child part relationships)
- Filter configurations by selected program
- Filter configurations by selected location (show configs used by assets at that location)
- Admin users with "All Locations" selected see all configurations for the program

---

## Feature Categories

### Category: DATA - Database Integration

#### Feature 1: Load configurations from cfg_set database table
**Description:** Replace mock configuration data with actual database queries to the cfg_set table. The API should query PostgreSQL using Prisma to fetch configuration records.

**Test Steps:**
1. Navigate to Configurations page
2. Verify configurations are loaded from database (not hardcoded mock data)
3. Check that cfg_set_id, cfg_name, cfg_type, pgm_id, partno_id, description, active fields are populated
4. Verify the total count matches database records for the selected program
5. Test with different programs to confirm data changes appropriately

#### Feature 2: Load configuration BOM items from cfg_list database table
**Description:** The Bill of Materials (BOM) for each configuration should be loaded from the cfg_list table, showing parent-child part relationships.

**Test Steps:**
1. Navigate to a Configuration detail page
2. Verify BOM items load from cfg_list table
3. Check that partno_p (parent part) and partno_c (child part) are correctly displayed
4. Verify sort_order is respected in the display
5. Verify qpa (quantity per assembly) is shown correctly
6. Test configurations with multiple BOM items

#### Feature 3: Resolve part numbers to readable names
**Description:** Part number IDs in cfg_set.partno_id and cfg_list (partno_p, partno_c) should be resolved to actual part numbers and names from the part_list table.

**Test Steps:**
1. View configuration list - verify base part number shows readable part number, not just ID
2. View configuration detail - verify BOM items show part numbers and nouns
3. Test configurations with and without a base partno_id
4. Verify part lookups work for both parent (partno_p) and child (partno_c) parts

---

### Category: FUNCTIONAL - Filtering

#### Feature 4: Filter configurations by selected program
**Description:** Configurations should be filtered to only show records where cfg_set.pgm_id matches the program selected in the navbar. Uses the currentProgramId from the auth store.

**Test Steps:**
1. Select CRIIS program in navbar
2. Navigate to Configurations - verify only CRIIS configurations appear
3. Switch to ACTS program in navbar
4. Verify configurations list updates to show only ACTS configurations
5. Verify page resets to page 1 when program changes
6. Verify total count in pagination reflects program-specific count

#### Feature 5: Filter configurations by selected location
**Description:** When a specific location is selected (not "All Locations"), only show configurations that are associated with assets at that location. This is an indirect filter: cfg_set -> assets (via cfg_set_id) -> location (via loc_ida or loc_idc).

**Test Steps:**
1. Select a specific location in navbar (e.g., "SHAW AFB")
2. Navigate to Configurations page
3. Verify only configurations used by assets at that location appear
4. Switch to a different location
5. Verify configurations list updates accordingly
6. If no configurations are used at a location, show appropriate empty state message

#### Feature 6: Show all configurations for "All Locations" option
**Description:** When an admin user selects "All Locations" (loc_id=0), the configurations page should show ALL configurations for the selected program without location filtering.

**Test Steps:**
1. As admin user, select "All Locations" in navbar
2. Navigate to Configurations page
3. Verify all configurations for the selected program appear
4. Verify the count is higher than when a specific location is selected
5. Verify non-admin users cannot access this option (they don't see "All Locations")

---

### Category: NAVIGATION - Page Interactions

#### Feature 7: Configuration list pagination with database
**Description:** Pagination should work with database queries using LIMIT and OFFSET, not in-memory filtering of mock data.

**Test Steps:**
1. Navigate to Configurations page with a program that has many configurations
2. Verify pagination controls appear (Previous, Next, page numbers)
3. Click Next - verify new page loads with different configurations
4. Verify page size selector works (10, 25, 50 items per page)
5. Verify total pages calculation is correct based on database count
6. Test first and last page navigation

#### Feature 8: Configuration list sorting with database
**Description:** Sorting should be performed at the database level using ORDER BY, not in-memory sorting.

**Test Steps:**
1. Click on "Configuration Name" column header
2. Verify list sorts alphabetically (ascending)
3. Click again - verify sort reverses (descending)
4. Test sorting by Type, Part Number, BOM Count, Asset Count columns
5. Verify sort indicator icons update correctly
6. Verify sorting persists across pagination

#### Feature 9: Configuration search with database
**Description:** Search functionality should query the database for matching configurations, searching across cfg_name, description, and associated part numbers.

**Test Steps:**
1. Enter search term in search box
2. Verify results filter to matching configurations
3. Test searching by configuration name
4. Test searching by description text
5. Test searching by part number
6. Verify debounce works (doesn't query on every keystroke)
7. Clear search - verify full list returns

---

### Category: STYLE - Display and UI

#### Feature 10: Display configuration hierarchy in detail view
**Description:** The configuration detail page should display the BOM items in a hierarchical tree structure showing parent-child relationships between parts.

**Test Steps:**
1. Navigate to a configuration detail page
2. Verify BOM items are displayed in a hierarchical/tree format
3. Verify parent parts are shown with their child components indented below
4. Verify quantity per assembly (QPA) is displayed for each item
5. Verify sort order is respected within hierarchy levels
6. Test configurations with nested hierarchies (if available)

#### Feature 11: Show configuration asset count linked to location
**Description:** The asset count for each configuration should reflect how many assets at the selected location use that configuration, not the global count.

**Test Steps:**
1. Select a specific location in navbar
2. View Configurations list
3. Verify asset count column shows count of assets at that location using each config
4. Select "All Locations" - verify asset count shows total across all locations
5. Verify count updates when location selection changes

#### Feature 12: Empty state for no configurations
**Description:** When no configurations exist for the selected program/location combination, display an appropriate empty state message.

**Test Steps:**
1. Select a program/location combination with no configurations
2. Verify empty state message appears
3. Verify message indicates why (no configs for this program/location)
4. Verify Add Configuration button is still accessible for authorized users
5. Test search with no results - verify different message appears

---

### Category: ERROR-HANDLING - Edge Cases

#### Feature 13: Handle missing part references gracefully
**Description:** If cfg_set.partno_id or cfg_list part references point to non-existent parts, display gracefully without crashing.

**Test Steps:**
1. If a configuration has partno_id pointing to non-existent part, verify it displays as "Unknown Part" or similar
2. If BOM item has invalid part reference, verify error handling
3. Verify the page doesn't crash with orphaned references
4. Verify error is logged for debugging
5. Test with configuration that has all valid references

#### Feature 14: Handle database connection errors
**Description:** If database queries fail, display appropriate error message and retry option.

**Test Steps:**
1. Simulate database connection failure (if possible)
2. Verify error message is displayed to user
3. Verify retry button is available
4. Verify page doesn't crash on database errors
5. Test recovery when database becomes available again

#### Feature 15: Validate program and location access permissions
**Description:** Ensure users can only view configurations for programs they have access to, and location filtering respects user's assigned locations.

**Test Steps:**
1. Log in as user with limited program access
2. Verify only authorized program's configurations are visible
3. Attempt to access configuration via direct URL for unauthorized program
4. Verify 403 Forbidden error is returned
5. Verify admin users can access all programs
6. Verify location filtering respects user's assigned locations for non-admin users

---

### Category: SECURITY - Access Control

#### Feature 16: Enforce CRUD permissions based on user role
**Description:** Only ADMIN and DEPOT_MANAGER roles should be able to create, update, or delete configurations. VIEWER and FIELD_TECHNICIAN can only view.

**Test Steps:**
1. Log in as VIEWER role
2. Verify Add Configuration button is hidden
3. Verify Edit and Delete buttons are hidden on configuration cards
4. Log in as ADMIN role
5. Verify Add, Edit, Delete options are available
6. Log in as DEPOT_MANAGER - verify same access as ADMIN
7. Log in as FIELD_TECHNICIAN - verify view-only access

---

## Implementation Notes

### Backend Changes Required
1. Create new Prisma queries for cfg_set and cfg_list tables
2. Add location filtering logic using asset -> location relationship
3. Update /api/configurations endpoint to use database queries
4. Update /api/configurations/:id/bom endpoint to query cfg_list
5. Add proper JOINs for part_list to resolve part numbers

### Frontend Changes Required
1. Update ConfigurationsPage to include currentLocationId in API calls
2. Update ConfigurationDetailPage to display hierarchical BOM
3. Handle location changes by refetching configurations
4. Update empty states for location-specific filtering

### Database Queries Overview
```sql
-- Configurations for program with location filter
SELECT cs.* FROM cfg_set cs
WHERE cs.pgm_id = :programId
  AND cs.active = true
  AND EXISTS (
    SELECT 1 FROM asset a
    WHERE a.cfg_set_id = cs.cfg_set_id
      AND (a.loc_ida = :locationId OR a.loc_idc = :locationId)
  )
ORDER BY cs.cfg_name;

-- BOM items for configuration
SELECT cl.*,
       pp.partno as parent_partno, pp.noun as parent_noun,
       cp.partno as child_partno, cp.noun as child_noun
FROM cfg_list cl
JOIN part_list pp ON cl.partno_p = pp.partno_id
JOIN part_list cp ON cl.partno_c = cp.partno_id
WHERE cl.cfg_set_id = :cfgSetId
  AND cl.active = true
ORDER BY cl.sort_order;
```

---

## Feature Summary

| # | Feature Name | Category | Priority |
|---|--------------|----------|----------|
| 1 | Load configurations from cfg_set database | DATA | High |
| 2 | Load BOM items from cfg_list database | DATA | High |
| 3 | Resolve part numbers to readable names | DATA | High |
| 4 | Filter configurations by selected program | FUNCTIONAL | High |
| 5 | Filter configurations by selected location | FUNCTIONAL | High |
| 6 | Show all configurations for "All Locations" | FUNCTIONAL | Medium |
| 7 | Pagination with database queries | NAVIGATION | Medium |
| 8 | Sorting with database queries | NAVIGATION | Medium |
| 9 | Search with database queries | NAVIGATION | Medium |
| 10 | Display hierarchy in detail view | STYLE | Medium |
| 11 | Asset count linked to location | STYLE | Medium |
| 12 | Empty state for no configurations | STYLE | Low |
| 13 | Handle missing part references | ERROR-HANDLING | Medium |
| 14 | Handle database connection errors | ERROR-HANDLING | Medium |
| 15 | Validate access permissions | ERROR-HANDLING | High |
| 16 | Enforce CRUD permissions | SECURITY | High |

**Total Features: 16**
