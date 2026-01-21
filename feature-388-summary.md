# Feature #388: Store Active Location in User Session

## Status: ✅ PASSING

## Summary
Fixed location persistence bug where user's selected location would reset to default on page refresh. The location switcher UI and localStorage persistence were already implemented; the issue was that the `setUser()` function was overwriting the persisted location value.

## Problem
- Location switcher worked correctly when selecting a new location
- Location persisted across page navigation within the same session
- **BUG**: Location reset to default after page refresh/reload
- Root cause: `authStore.setUser()` always overwrote `currentLocationId` with default value

## Solution
Modified `frontend/src/stores/authStore.ts` to preserve persisted location:

```typescript
// BEFORE: Always overwrites with default
setUser: (user) => set({
  currentLocationId: user?.locations?.find(l => l.is_default)?.loc_id || ...
})

// AFTER: Preserves persisted value if it exists
setUser: (user) => set((state) => ({
  currentLocationId: state.currentLocationId || user?.locations?.find(l => l.is_default)?.loc_id || ...
}))
```

## Verification Steps

### ✅ Step 1: Select location from switcher
- Logged in as admin (2 locations available)
- Clicked location dropdown in navbar
- Selected "24892/1360/24893" (non-default location)
- **Result**: Location changed in navbar ✓

### ✅ Step 2: Navigate to different pages
- Navigated: Dashboard → Assets → Maintenance
- **Result**: Location remained "24892/1360/24893" throughout ✓

### ✅ Step 3: Verify selected location persists
- Checked navbar: "24892/1360/24893" displayed
- Checked localStorage: `currentLocationId: 212` ✓
- **Result**: Selected location stored correctly ✓

### ✅ Step 4: Verify persistence after page refresh
- Hard refreshed page (F5)
- **Result**: Location still shows "24892/1360/24893" ✓
- **Note**: This was broken before the fix - would reset to default

### ✅ Step 5: Log out and log back in
- Clicked user menu → Sign out
- Logged back in with admin credentials
- **Result**: Location reset to default "24892/1160/1426" ✓

### ✅ Step 6: Verify default location after login
- After fresh login, default location displayed
- **Result**: Expected behavior confirmed ✓

## Technical Details

### Architecture
- **UI Component**: `frontend/src/components/layout/Navbar.tsx` (lines 142-196)
- **State Management**: `frontend/src/stores/authStore.ts` (Zustand with persist middleware)
- **Persistence**: localStorage key `rimss-auth-storage`
- **Persisted Fields**: `token`, `currentProgramId`, `currentLocationId`

### Location Data Structure
```typescript
locations?: Array<{
  loc_id: number
  display_name: string
  majcom_cd?: string
  site_cd?: string
  is_default: boolean
}>
```

### User Locations (Test Data)
- Admin user has 2 locations:
  - `24892/1160/1426` (loc_id: 154, default: true)
  - `24892/1360/24893` (loc_id: 212, default: false)

### Behavior Rules
1. **On location select**: Update `currentLocationId` in state and persist to localStorage
2. **On page navigation**: Read from state (already in memory)
3. **On page refresh**: Restore from localStorage via persist middleware
4. **On fresh login**: Set to default location (clear persisted value)
5. **On logout**: Clear all persisted state including location

## Files Changed
- `frontend/src/stores/authStore.ts` - Fixed setUser() function

## Testing Evidence
- Screenshots saved:
  - `feature-388-location-persists-across-pages.png`
  - `feature-388-location-persists-after-refresh.png`
  - `feature-388-default-location-after-login.png`

## Project Impact
- **Before**: 385/423 features passing (91.0%)
- **After**: 388/423 features passing (91.7%)
- **Session**: Completed Feature #388

## Related Features
- Feature #383: Add location assignment field to user management
- Feature #384: Create user_location junction table
- Feature #385: User can view assigned locations in profile

## Session Info
- **Date**: Tuesday, January 21, 2026
- **Duration**: ~30 minutes
- **Agent**: Coding Agent (Parallel Session)
- **Status**: SUCCESS ✅
