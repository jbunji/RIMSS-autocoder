# Feature #166: ETM Validation (out >= in)

## Status: ✅ COMPLETED AND PASSING

## Overview
Implemented meter reading validation to ensure ETI Out (meter reading at repair end) is greater than or equal to ETI In (meter reading at repair start), with an exception for meter replacement scenarios.

## Problem Statement
When closing a repair with meter readings, the system needs to prevent data entry errors where the ending meter reading is less than the starting reading. However, this validation must allow legitimate cases where the physical meter was replaced during the repair (new meters start at 0).

## Solution
Added a `meter_changed` boolean flag to track meter replacements and conditional validation that skips the ETI Out >= ETI In check when the flag is true.

## Implementation Details

### Backend Changes
**File:** `backend/src/index.ts`

1. **Repair Interface** (line 2958)
   ```typescript
   interface Repair {
     // ... existing fields
     eti_in: number | null;
     eti_out: number | null;
     eti_delta: number | null;
     meter_changed: boolean; // NEW FIELD
     created_by_name: string;
     created_at: string;
   }
   ```

2. **Validation Logic** (PUT /api/repairs/:id)
   ```typescript
   // Validate eti_out >= eti_in unless meter_changed is true
   if (parsedEtiOut !== null && repairs[repairIndex].eti_in !== null && !repairs[repairIndex].meter_changed) {
     if (parsedEtiOut < repairs[repairIndex].eti_in) {
       return res.status(400).json({
         error: `ETI Out (${parsedEtiOut}) cannot be less than ETI In (${repairs[repairIndex].eti_in}) unless the meter was replaced. Check the "Meter Changed" checkbox if the physical meter was replaced.`
       });
     }
   }
   ```

### Frontend Changes
**File:** `frontend/src/pages/MaintenanceDetailPage.tsx`

1. **State Management**
   ```typescript
   const [closeRepairMeterChanged, setCloseRepairMeterChanged] = useState(false)
   ```

2. **UI Component** (Close Repair Dialog)
   ```tsx
   <div className="mt-3 flex items-start">
     <input
       type="checkbox"
       id="close_repair_meter_changed"
       checked={closeRepairMeterChanged}
       onChange={(e) => setCloseRepairMeterChanged(e.target.checked)}
       className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
       disabled={closeRepairLoading || !!closeRepairSuccess}
     />
     <label htmlFor="close_repair_meter_changed" className="ml-2 text-sm text-blue-800">
       <span className="font-medium">Meter Changed</span>
       <span className="block text-xs text-blue-600 mt-0.5">
         Check this box if the physical meter was replaced during repair (allows ETI Out to be less than ETI In)
       </span>
     </label>
   </div>
   ```

3. **Frontend Validation**
   ```typescript
   // Validate ETI Out >= ETI In if both are provided (unless meter was changed)
   if (closeRepairEtiOut && closingRepair.eti_in !== null && !closeRepairMeterChanged) {
     const etiOutValue = parseFloat(closeRepairEtiOut)
     if (etiOutValue < closingRepair.eti_in) {
       setCloseRepairError(`ETI Out (${etiOutValue}) cannot be less than ETI In (${closingRepair.eti_in}). If the meter was replaced, check the "Meter Changed" checkbox.`)
       return
     }
   }
   ```

## Test Results

All 8 test steps passed successfully:

| Step | Description | Result |
|------|-------------|--------|
| 1 | Log in as field technician | ✅ PASS |
| 2 | Navigate to maintenance event | ✅ PASS |
| 3 | Open Close Repair dialog | ✅ PASS |
| 4 | Enter meter out value less than in | ✅ PASS |
| 5 | Attempt to save | ✅ PASS |
| 6 | Verify error message | ✅ PASS |
| 7 | Check 'Meter Changed' flag | ✅ PASS |
| 8 | Verify allows out < in when changed | ✅ PASS |

### Test Case
- **Repair:** #2 in maintenance event MX-2024-001
- **ETI In:** 782 hours
- **ETI Out:** 780 hours (less than in!)
- **ETI Delta:** -2 hours (negative)
- **Meter Changed:** true
- **Result:** Repair closed successfully with negative delta

## Screenshots
1. `feature166_meter_changed_checkbox.png` - Close Repair dialog showing validation error and meter changed checkbox
2. `feature166_repair_closed_with_meter_changed.png` - Repair successfully closed with negative ETI delta

## User Experience

### Default Behavior (Meter NOT Changed)
- User enters ETI Out < ETI In
- Validation error appears: "ETI Out (X) cannot be less than ETI In (Y). If the meter was replaced, check the 'Meter Changed' checkbox."
- Form stays open for correction
- User must either:
  - Correct the ETI Out value, OR
  - Check the "Meter Changed" checkbox

### Meter Replacement Scenario
- User checks "Meter Changed" checkbox
- Validation skips the ETI Out >= ETI In check
- Negative ETI delta is allowed and calculated
- Repair closes successfully
- System tracks that meter was replaced

## Technical Notes

### Why This Matters
- **Hour meters** on military equipment can fail and require replacement
- New meters start at 0 hours
- If a meter is replaced mid-repair, the ending reading will be less than the starting reading
- Without this feature, technicians couldn't document meter replacements properly

### Data Integrity
- ✅ Prevents accidental data entry errors (out < in by mistake)
- ✅ Allows legitimate meter replacements (out < in expected)
- ✅ Tracks which repairs involved meter replacement
- ✅ Maintains accurate ETI delta calculations (can be negative)
- ✅ Audit trail preserved with meter_changed flag

### Error Messages
Clear, actionable error messages guide users to the correct solution:
- Frontend: Displays inline in the dialog
- Backend: Returns 400 Bad Request with explanation
- Both messages mention the "Meter Changed" checkbox

## Code Quality
- ✅ Zero JavaScript errors in console
- ✅ Type-safe TypeScript interfaces
- ✅ Consistent frontend/backend validation
- ✅ Clear variable naming (meter_changed)
- ✅ Comprehensive error handling
- ✅ User-friendly UI with explanatory text

## Future Enhancements
- Add reason field for meter replacement (optional documentation)
- Track old meter serial number and new meter serial number
- Generate alerts when meter replacements are detected
- Include meter replacement info in maintenance reports

## Related Features
- Feature #163: ETM meter history tracking
- Feature #100: Labor start/stop time validation

## Session Info
- **Completed:** 2026-01-20 00:38 UTC
- **Agent:** Claude Sonnet 4.5
- **Feature Status:** PASSING
- **Progress:** 166/374 features passing (44.4%)
