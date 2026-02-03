# RIMSS Legacy → V2 Gap Analysis

Generated: 2026-02-03

## Legacy Code Summary

| Module | BO (lines) | Controller (lines) | Total |
|--------|------------|-------------------|-------|
| Maintenance | 1,854 | 3,185 + 423 (UID) | **5,462** |
| Configuration | 108 | 795 | 903 |
| Inventory | 103 | 493 | 596 |
| Sorties | 132 | 882 | 1,014 |
| Spares | 571 | 536 | 1,107 |
| Notifications | - | 577 | 577 |
| **Total** | | | **~10,000** |

---

## ✅ IMPLEMENTED (V2 Services - 4,569 lines)

### Maintenance Module
- [x] Event CRUD (create, update, close)
- [x] Repair CRUD with sequences
- [x] Labor records with sequences
- [x] Labor parts (removed/installed/worked)
- [x] Part removal cascade (status → NMCM, clear NHA)
- [x] Auto depot work order creation
- [x] ECU 365-day PMI auto-create on removal
- [x] ECU PMI auto-close on installation
- [x] HOW_MAL no-defect exemptions (799, 800, 804, 806)
- [x] NRTS job creation for action codes 0-9
- [x] Job number generation

### Parts Ordering
- [x] 5-step lifecycle (REQUEST → APPROVE → ORDER → RECEIVE → ISSUE)
- [x] MICAP auto-approval
- [x] Auto-reorder at min stock
- [x] Order history tracking

### TCTO (Time Compliance Technical Orders)
- [x] TCTO creation
- [x] Auto-assign applicable assets
- [x] Compliance tracking per asset
- [x] Supervisor validation workflow
- [x] Create maintenance event for TCTO work
- [x] Overdue TCTO tracking

### PMI (Preventive Maintenance Inspections)
- [x] Calendar-based scheduling (30/90/180/365-day)
- [x] Meter-based scheduling (hours)
- [x] Auto-reschedule on completion
- [x] Upcoming/overdue tracking
- [x] Create maintenance event for PMI

### Shipping/Receiving
- [x] Ship assets (set in_transit, TCN)
- [x] Receive individual assets
- [x] Receive full shipment by TCN
- [x] Pending receipts tracking
- [x] Overdue shipment tracking

---

## ❌ NOT YET IMPLEMENTED

### Sorties Module (Flight Data)
- [ ] Create/edit/delete sorties
- [ ] Link sorties to maintenance events
- [ ] Import sorties from file (CSV mapping)
- [ ] Export sortie data
- [ ] Search sorties
- [ ] Sortie status tracking

### Configuration Module (Asset Configuration)
- [ ] Create/edit asset configurations
- [ ] Sub-configuration management
- [ ] Configuration tree/hierarchy
- [ ] Move assets between configurations
- [ ] Add/remove SRA (Shop Replaceable Assembly)
- [ ] Export configuration
- [ ] Configuration search

### Inventory Module
- [ ] Inventory search and filtering
- [ ] Inventory export
- [ ] Asset validation workflow
- [ ] Meter reading management (CFG_METERS, METER_HIST)
- [ ] IMPULS form population

### Spares Module
- [ ] Spare parts management (separate from assets)
- [ ] Like-item spare assignment
- [ ] Spare parts export
- [ ] Spare-to-asset linking

### Notifications Module
- [ ] Create notifications
- [ ] Notification acknowledgment workflow
- [ ] Message transmit tracking
- [ ] Notification search

### BIT/PC (Built-In Test / Power Check)
- [ ] BIT/PC labor entries (laborBitPc table exists)
- [ ] Test failed tracking
- [ ] BIT/PC sequence management

### Reports & Exports
- [ ] Backlog export
- [ ] PMI report export
- [ ] TCTO compliance report
- [ ] Part orders report
- [ ] Inventory export
- [ ] Configuration export
- [ ] Sortie export

### Maintenance UID (Unique Item Identifier)
- [ ] UII barcode decoding
- [ ] UID-based event creation
- [ ] UID-based labor entry

### Admin Functions
- [ ] BOM (Bill of Materials) management
- [ ] Code table management (beyond basic CRUD)
- [ ] Ad-hoc data export

---

## 🔶 PARTIALLY IMPLEMENTED

### Location Management
- [x] Basic location CRUD (V1)
- [ ] Location sets (LocSet model exists)
- [ ] Program-location relationships (model exists)

### Software Tracking
- [ ] Software version tracking (Software model exists)
- [ ] Software-asset relationships (SoftwareAsset model exists)

### Bad Actor Tracking
- [ ] Bad actor identification (BadActor model exists)
- [ ] Bad actor reporting

---

## PRIORITY RECOMMENDATIONS

### High Priority (Core Workflows)
1. **Sorties** - Critical for flight-line operations
2. **Configuration** - Needed for asset hierarchy
3. **Notifications** - User alerting system

### Medium Priority (Completeness)
4. **Inventory search/export** - User productivity
5. **Reports/Exports** - Management reporting
6. **BIT/PC** - Test data tracking

### Lower Priority (Can defer)
7. **Spares** - Separate spare tracking
8. **Maintenance UID** - Barcode scanning
9. **Admin functions** - System administration

---

## LINE COUNT COMPARISON

| | Legacy CF | V2 TypeScript | Coverage |
|--|-----------|---------------|----------|
| Maintenance | 5,462 | 2,245 | ~41% |
| Parts | ~500 | 601 | ✅ |
| TCTO | ~400 | 680 | ✅ |
| PMI | ~300 | 538 | ✅ |
| Shipping | ~200 | 505 | ✅ |
| Sorties | 1,014 | 0 | ❌ |
| Config | 903 | 0 | ❌ |
| Inventory | 596 | 0 | ❌ |
| Spares | 1,107 | 0 | ❌ |
| Notifications | 577 | 0 | ❌ |
| **Total** | ~10,000 | 4,569 | **~46%** |

---

## NEXT STEPS

1. Implement Sorties module (~1,000 lines)
2. Implement Configuration module (~900 lines)
3. Implement Notifications module (~600 lines)
4. Add export/report endpoints
5. Implement BIT/PC tracking
