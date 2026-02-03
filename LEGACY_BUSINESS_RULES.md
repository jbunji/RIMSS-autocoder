# RIMSS Legacy Business Rules
## Extracted from ColdFusion Codebase

This document captures the actual business logic from the legacy ColdFusion RIMSS application that must be implemented in the new React/Node app.

---

## 1. MAINTENANCE WORKFLOW

### 1.1 Event Creation
When creating a maintenance event:
1. Validate Job ID, Asset (Serno), Status, and Start Date
2. For AIRBORNE assets (POD/IM types, not PART):
   - Record ETM (Elapsed Time Meter) start value
   - Create meter_hist record
   - Create cfg_meters record
3. Update asset status
4. If CT asset exists, send to IMPULS service

### 1.2 Repair/Labor Creation - THE STATE MACHINE

When adding a repair with labor, the **action_taken** code drives cascading actions:

#### Part Removal Logic
When a part is REMOVED:
1. **Create labor_part record** with `part_action = 'REMOVED'`
2. **Change removed asset status to NMCM** (Not Mission Capable - Maintenance)
   - EXCEPTION: If HOW_MAL code indicates "no defect", keep status as FMC
   - No-defect codes: 799, 800, 804, 806
3. **Clear NHA_ASSET_ID** (removed from parent)
4. **Update location** to current session location
5. **Auto-create Depot Work Order** at the part's assigned repair depot (loc_idr)
   - EXCEPTION: Skip if HOW_MAL = no-defect codes
   - EXCEPTION: Skip if Action Taken = "T - REMOVED FOR CANN"

#### ECU-Specific Logic (Part# 987-1404-550)
When an ECU is REMOVED:
1. Auto-create a 365-day PMI event for the ECU
2. Set PMI type to '365-DAY'
3. Set HOW_MAL to '999-22'

When an ECU is INSTALLED:
1. Find and CLOSE any open 365-day PMI on that ECU
2. Check if parent POD has a PMI365 running - if not, start one

#### Part Installation Logic
When a part is INSTALLED:
1. **Create labor_part record** with `part_action = 'INSTALLED'`
2. **Set NHA_ASSET_ID** to the parent asset
3. **Clear in_transit flag** and set recv_date
4. Update location

#### NRTS (Not Reparable This Station) Logic
If Action Taken code is numeric 0-9 AND the end-item part has a depot location:
- Auto-create NRTS job at the depot
- Copy event, repair, labor, and labor_part to new job

### 1.3 HOW_MAL Code Groups

**HOW_MAL_TYPE_6 (No Defect Codes) - Exempt from status change & depot WO:**
- 799 - No Defect
- 800 - No Defect, Removed to Facilitate Other Maintenance
- 804 - No Defect, Removed for Scheduled Maintenance
- 806 - No Defect, Removed for Routine/Emergency/Special Reprogramming

### 1.4 Meter Tracking

For AIRBORNE assets (POD/IM):
- Track ETM (Elapsed Time Meter) start/completion values
- Meter sequence increments when meter is physically replaced
- Validate: ETM Completion >= ETM Start (unless meter changed)

---

## 2. PARTS ORDERING WORKFLOW

### 2.1 Order Lifecycle
```
ORDER PLACED → ACKNOWLEDGED → FILLED → SHIPPED → RECEIVED
```

### 2.2 Order Placed (`partOrdered`)
1. Create SRU_ORDER record with order_date
2. Clear any previous shipping info on asset (tcn, shipper, ship_date)
3. Send email notification to depot personnel

### 2.3 Order Acknowledged (`partOrderedAcknowledged`)
1. Set acknowledge_date on SRU_ORDER
2. Update removed asset:
   - Clear in_transit flag
   - (Only if NOT an NSP - Non-Standard Part)

### 2.4 Order Filled (`partOrderedFilled`)
1. Set asset_id (replacement) on SRU_ORDER
2. Clear shipping info on replacement asset

### 2.5 Order Shipped (`partOrderedShipped`)
1. Update SRU_ORDER with ship date
2. Update replacement ASSET:
   - Set shipper, tcn, ship_date
   - Set in_transit = 'Y'
   - Set loc_idc to destination (requesting unit)

### 2.6 REQ Shipped (Removed Part Back to Depot)
1. Update SRU_ORDER with rem_shipper, rem_tcn, rem_sru_ship_date
2. Update removed ASSET:
   - Set shipper, tcn, ship_date
   - Set in_transit = 'Y'
   - Set loc_idc to depot (loc_idr from part_list)

### 2.7 Shipment Received (`shipRecvAcknowledged`)
1. Set repl_sru_recv_date on SRU_ORDER
2. Update asset:
   - Set recv_date
   - Clear in_transit flag

---

## 3. LOCATION MANAGEMENT

### 3.1 Multi-Location Architecture
Assets have multiple location references:
- **LOC_ID_A** - Assigned location (home base)
- **LOC_ID_C** - Current location (where it is now)

### 3.2 Location Set Restrictions
- Programs can restrict visible locations via LOC_SET table
- Query: `GLOBALEYE.LOC_SET WHERE SET_NAME = {PROGRAM}_LOC`
- User sees only locations in their program's loc_set

### 3.3 In-Transit Tracking
- `in_transit = 'Y'` when shipped but not received
- `ship_date`, `recv_date`, `shipper`, `tcn` track movement

---

## 4. PMI (Periodic Maintenance Inspection)

### 4.1 PMI Types
- 90-DAY (code 35419 → 35466 for follow-on)
- 180-DAY (code 35409 → 35459 for follow-on)
- 365-DAY (for ECU batteries)

### 4.2 Next PMI Scheduling
When completing a PMI:
1. Record complete_date on asset_inspection
2. Auto-create follow-on event with:
   - New job number
   - Start date = next_due_date
   - Linked via asset_inspection.job_no

### 4.3 PMI Due Date Filtering
- Default view shows PMIs due within 60 days
- User can adjust due_date_interval

---

## 5. TCTO (Time Compliance Technical Order)

### 5.1 TCTO Tracking
- Link TCTO to repair via tcto_asset table
- Track effective_date, complete_date
- Cannot close event with open TCTO repairs

---

## 6. VALIDATION RULES

### 6.1 Event Validation
- Job ID required
- Asset ID (Serno) required
- Start Date required and must be valid date
- Stop Date (if provided) must be >= Start Date
- Cannot close event with open repairs

### 6.2 Repair Validation
- Stop Date (if provided) must be >= Start Date

### 6.3 Labor Validation
- Stop Date (if provided) must be >= Start Date

### 6.4 Meter Validation
- ETM Start required for AIRBORNE assets
- ETM Completion >= ETM Start (unless meter changed)

---

## 7. DATA MODEL RELATIONSHIPS

### 7.1 Event → Repair → Labor → LaborPart
```
EVENT (1) ──→ (N) REPAIR (1) ──→ (N) LABOR (1) ──→ (N) LABOR_PART
                                              └──→ (N) LABOR_BIT_PC
                                              └──→ (N) TEST_FAILED
```

### 7.2 Asset Hierarchy
```
ASSET (NHA=null) ──→ ASSET (NHA=parent) ──→ ASSET (NHA=grandparent)
     POD                   ECU                    SRA
```

### 7.3 Part Tracking
- LABOR_PART.part_action: 'WORKED', 'REMOVED', 'INSTALLED'
- Each action creates separate labor_part record

---

## 8. PROGRAM-BASED ISOLATION

### 8.1 Programs
- CRIIS
- ACTS
- ARDS
- 236

### 8.2 Data Filtering
- All queries filter by user's assigned program
- Users only see assets, events, repairs for their program(s)
- Admin can see all programs

---

## 9. AUDIT TRAIL

### 9.1 Standard Audit Fields
Every table has:
- `ins_by`, `ins_date` - Created by/when
- `chg_by`, `chg_date` - Modified by/when
- `valid` - Record validity flag
- `val_by`, `val_date` - Validated by/when

---

## 10. CONFIGURATIONS

### 10.1 Asset Configuration Hierarchy
- Assets are configured in parent-child relationships
- Configuration tracked via BOM (Bill of Materials)
- NHA_ASSET_ID links child to parent

### 10.2 Configuration Changes During Maintenance
- Removing a part breaks the NHA link
- Installing a part creates/restores the NHA link
- Find correct NHA via `findNhaInBom()` function

---

## IMPLEMENTATION PRIORITY

1. **Critical** - Action-driven repair workflow (state machine)
2. **Critical** - Part removal/installation cascade logic
3. **Critical** - Location tracking (LOC_ID_A, LOC_ID_C, in_transit)
4. **High** - Parts ordering full lifecycle
5. **High** - PMI scheduling and follow-on creation
6. **Medium** - Meter tracking for AIRBORNE assets
7. **Medium** - TCTO compliance tracking
8. **Lower** - NSP (Non-Standard Parts) handling
