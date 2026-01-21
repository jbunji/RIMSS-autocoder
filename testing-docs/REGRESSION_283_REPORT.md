# Feature #283 Regression Report

**Date:** 2026-01-20
**Feature:** Delete item refreshes cached views
**Status:** ❌ FAILING (Regression Detected)
**Tested By:** Testing Agent (Browser Automation)

## Summary

Feature #283 "Delete item refreshes cached views" has **REGRESSED**. Cached data is NOT automatically updated after deletion operations, requiring manual refresh to see changes.

## Test Results

### Verification Steps Executed:

1. ✅ **Step 1:** Logged in as admin user
2. ✅ **Step 2:** Viewed list of assets (10 total assets displayed)
3. ✅ **Step 3:** Deleted CRIIS-010 (Navigation Unit) in a new tab - **Delete succeeded**
4. ❌ **Step 4:** Returned to original tab - **Stale data still showing**:
   - Count still showed "10 total assets" (should be 9)
   - CRIIS-010 still visible in list (should be removed)
5. ✅ **Step 5:** Manual refresh button clicked - **Data updated correctly**
6. ❌ **Step 6:** Automatic cache invalidation DID NOT occur

### Expected Behavior:
When an asset is deleted in one tab/context, all other tabs/views showing the assets list should automatically reflect the deletion without requiring manual user intervention.

###Actual Behavior:
- Deletion succeeded in tab 2 (showed success message, count updated to 9)
- Tab 1 (original tab) retained stale data showing 10 assets with CRIIS-010 still present
- Manual refresh required to sync the view
- No automatic cache invalidation occurred

## Root Cause Analysis

### Primary Issue: No React Query Implementation

The AssetsPage component (`frontend/src/pages/AssetsPage.tsx`) uses **plain fetch + useState** instead of React Query, despite React Query being listed in the technology stack and installed as a dependency.

**Evidence:**
- Lines 209-248: `fetchAssets` uses plain `fetch()` with local `useState`
- Lines 350-412: Delete handlers call `fetchAssets()` which only updates local component state
- No `@tanstack/react-query` imports in AssetsPage.tsx
- No `QueryClientProvider` configured in the application
- Each component instance maintains isolated state with no cache sharing

### Consequences:

1. **No Shared Cache:** Each tab/component instance has its own isolated state
2. **No Automatic Invalidation:** Mutations don't trigger cache updates
3. **No Cross-Tab Communication:** Changes in one tab don't affect other tabs
4. **Stale Data:** Users see outdated information until manual refresh

## Technical Details

### Current Architecture (Broken):
```
Tab 1: fetch() → local useState → Component State (isolated)
Tab 2: fetch() → local useState → Component State (isolated)
❌ No communication between tabs
❌ No shared cache
❌ Manual refresh required
```

### Required Architecture (With React Query):
```
Tab 1: useQuery() → QueryClient Cache (shared) ← useMutation() invalidates
Tab 2: useQuery() → QueryClient Cache (shared) ← automatically refetches
✅ Shared cache across all components
✅ Automatic invalidation on mutations
✅ Background refetching
✅ Optimistic updates
```

## Fix Required

### 1. Configure React Query Provider

Create `frontend/src/lib/queryClient.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
})
```

Wrap app in `QueryClientProvider` in `frontend/src/main.tsx`:
```typescript
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### 2. Convert AssetsPage to Use React Query

Replace plain fetch with:
- `useQuery(['assets', filters], fetchAssets)` for data fetching
- `useMutation(deleteAsset, { onSuccess: () => queryClient.invalidateQueries(['assets']) })` for deletions

### 3. Implement Cache Invalidation

In delete mutation's `onSuccess`:
```typescript
queryClient.invalidateQueries({ queryKey: ['assets'] })
```

This will:
- Automatically refetch assets list in all components
- Update all tabs showing assets
- Provide real-time synchronization

## Screenshots

1. **Before Delete** (`feature_283_step1_before_delete.png`): 10 assets, CRIIS-010 visible
2. **Tab Showing Stale Data** (`feature_283_step4_cache_not_updated.png`): Original tab still shows 10 assets with CRIIS-010
3. **After Manual Refresh** (`feature_283_step5_after_manual_refresh.png`): Correctly shows 9 assets without CRIIS-010

## Impact

**Severity:** HIGH
**User Experience Impact:** SIGNIFICANT

### Problems for Users:
1. **Data Inconsistency:** Users see different data in different tabs
2. **Manual Workarounds Required:** Must remember to manually refresh
3. **Risk of Errors:** Users might make decisions based on stale data
4. **Frustration:** Unexpected behavior violates user expectations
5. **Trust Issues:** Users lose confidence in data accuracy

### Affected Operations:
- Asset deletions
- Asset creations
- Asset updates
- Any list view with mutations

## Recommendation

**Priority:** P0 (Critical)
**Action:** Implement React Query immediately across all data-fetching pages

### Implementation Order:
1. Set up QueryClientProvider (15 min)
2. Convert AssetsPage to use React Query (30 min)
3. Test cross-tab behavior (15 min)
4. Apply pattern to other pages (MaintenancePage, SparesPage, etc.)

### Testing Validation:
After fix, verify:
- [ ] Delete in tab 2 automatically updates tab 1
- [ ] No manual refresh required
- [ ] Count updates immediately
- [ ] Item removed from list automatically
- [ ] Console shows no errors
- [ ] Background refetching works on tab focus

##Conclusion

Feature #283 has **REGRESSED** due to missing React Query implementation. The application's architecture does not support automatic cache synchronization, requiring a fundamental change to the data-fetching layer.

**Status:** Feature marked as FAILING
**Next Steps:** Implement fix and re-test

---
**Testing Method:** Full end-to-end browser automation with Playwright
**Console Errors:** None (architecture issue, not runtime error)
**Quality:** Regression confirmed with screenshots and detailed reproduction steps
