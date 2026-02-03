/**
 * PmiService
 * ==========
 * Preventive Maintenance Inspection scheduling and tracking.
 * 
 * PMI Types:
 * - Calendar-based (30-day, 90-day, 180-day, 365-day)
 * - Meter-based (hours, cycles, rounds)
 * - Condition-based (on specific events)
 * 
 * Features:
 * - Auto-schedule based on intervals
 * - Due date calculation
 * - Overdue tracking
 * - Inspection checklists
 * - Auto-create maintenance events when due
 */

import { PrismaClient } from "@prisma/client";
import { maintenanceService } from "./MaintenanceService";

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export interface PmiScheduleData {
  assetId: number;
  pmiType: string;        // 30-DAY, 90-DAY, 180-DAY, 365-DAY, HOURS, CYCLES
  intervalDays?: number;  // For calendar-based
  intervalHours?: number; // For meter-based
  wucCd?: string;
  checklistId?: number;
  remarks?: string;
  userId: string;
}

export interface PmiCompletionData {
  histId: number;
  repairId?: number;
  meterReading?: number;
  findings?: string;
  userId: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export class PmiService {

  /**
   * Create/schedule a new PMI for an asset
   */
  async schedulePmi(data: PmiScheduleData): Promise<any> {
    // Calculate next due date
    const nextDueDate = this.calculateNextDueDate(
      new Date(),
      data.pmiType,
      data.intervalDays
    );

    const pmi = await prisma.assetInspection.create({
      data: {
        asset_id: data.assetId,
        pmi_type: data.pmiType,
        next_due_date: nextDueDate,
        interval_days: data.intervalDays,
        interval_hours: data.intervalHours,
        wuc_cd: data.wucCd || "0",
        valid: true,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: {
        asset: { include: { part: true } },
      },
    });

    console.log(`[PMI] Scheduled ${data.pmiType} PMI for asset ${pmi.asset.serno}, due ${nextDueDate.toISOString().split("T")[0]}`);

    return pmi;
  }

  /**
   * Complete a PMI inspection
   */
  async completePmi(data: PmiCompletionData): Promise<any> {
    const pmi = await prisma.assetInspection.findUnique({
      where: { hist_id: data.histId },
      include: { asset: true },
    });

    if (!pmi) throw new Error("PMI record not found");
    if (pmi.complete_date) throw new Error("PMI already completed");

    // Update completion
    const updated = await prisma.assetInspection.update({
      where: { hist_id: data.histId },
      data: {
        complete_date: new Date(),
        completed_by: data.userId,
        repair_id: data.repairId,
        meter_reading: data.meterReading,
        findings: data.findings,
        chg_by: data.userId,
        chg_date: new Date(),
      },
      include: {
        asset: { include: { part: true } },
      },
    });

    // Auto-schedule next PMI if recurring
    if (pmi.interval_days || pmi.interval_hours) {
      await this.schedulePmi({
        assetId: pmi.asset_id,
        pmiType: pmi.pmi_type || "ROUTINE",
        intervalDays: pmi.interval_days || undefined,
        intervalHours: pmi.interval_hours || undefined,
        wucCd: pmi.wuc_cd || undefined,
        userId: data.userId,
      });
    }

    console.log(`[PMI] Completed ${pmi.pmi_type} PMI for asset ${updated.asset.serno}`);

    return updated;
  }

  /**
   * Create maintenance event for a due PMI
   */
  async createPmiEvent(params: {
    histId: number;
    locationId: number;
    userId: string;
  }): Promise<any> {
    const pmi = await prisma.assetInspection.findUnique({
      where: { hist_id: params.histId },
      include: { asset: true },
    });

    if (!pmi) throw new Error("PMI record not found");

    // Create event
    const event = await maintenanceService.createEvent({
      assetId: pmi.asset_id,
      locationId: params.locationId,
      discrepancy: `${pmi.pmi_type} Preventive Maintenance Inspection`,
      source: "PMI",
      userId: params.userId,
    });

    // Create repair
    const repair = await maintenanceService.createRepair({
      eventId: event.event_id,
      typeMaint: "PMI",
      narrative: `${pmi.pmi_type} inspection due`,
      userId: params.userId,
    });

    // Link repair to PMI
    await prisma.assetInspection.update({
      where: { hist_id: params.histId },
      data: {
        repair_id: repair.repair_id,
        chg_by: params.userId,
        chg_date: new Date(),
      },
    });

    return { event, repair, pmi };
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Get upcoming PMIs for a location
   */
  async getUpcomingPmis(locationId: number, daysAhead: number = 30): Promise<any[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return prisma.assetInspection.findMany({
      where: {
        complete_date: null,
        valid: true,
        next_due_date: { lte: futureDate },
        asset: {
          OR: [
            { loc_ida: locationId },
            { loc_idc: locationId },
          ],
          active: true,
        },
      },
      include: {
        asset: { include: { part: true, currentLocation: true } },
      },
      orderBy: { next_due_date: "asc" },
    });
  }

  /**
   * Get overdue PMIs
   */
  async getOverduePmis(locationId?: number): Promise<any[]> {
    const now = new Date();

    const whereClause: any = {
      complete_date: null,
      valid: true,
      next_due_date: { lt: now },
      asset: { active: true },
    };

    if (locationId) {
      whereClause.asset.OR = [
        { loc_ida: locationId },
        { loc_idc: locationId },
      ];
    }

    return prisma.assetInspection.findMany({
      where: whereClause,
      include: {
        asset: { include: { part: true, currentLocation: true } },
      },
      orderBy: { next_due_date: "asc" },
    });
  }

  /**
   * Get PMI schedule for an asset
   */
  async getAssetPmiSchedule(assetId: number): Promise<any[]> {
    return prisma.assetInspection.findMany({
      where: {
        asset_id: assetId,
        valid: true,
      },
      orderBy: { next_due_date: "asc" },
    });
  }

  /**
   * Get PMI compliance stats for a location
   */
  async getLocationPmiStats(locationId: number): Promise<{
    total: number;
    current: number;
    dueSoon: number;
    overdue: number;
  }> {
    const now = new Date();
    const soon = new Date();
    soon.setDate(soon.getDate() + 7);

    const pmis = await prisma.assetInspection.findMany({
      where: {
        complete_date: null,
        valid: true,
        asset: {
          OR: [
            { loc_ida: locationId },
            { loc_idc: locationId },
          ],
          active: true,
        },
      },
      select: { next_due_date: true },
    });

    const total = pmis.length;
    const overdue = pmis.filter(p => p.next_due_date && p.next_due_date < now).length;
    const dueSoon = pmis.filter(p => 
      p.next_due_date && p.next_due_date >= now && p.next_due_date <= soon
    ).length;
    const current = total - overdue - dueSoon;

    return { total, current, dueSoon, overdue };
  }

  /**
   * Get PMI history for an asset
   */
  async getPmiHistory(assetId: number, limit: number = 20): Promise<any[]> {
    return prisma.assetInspection.findMany({
      where: {
        asset_id: assetId,
        complete_date: { not: null },
      },
      include: {
        repair: true,
      },
      orderBy: { complete_date: "desc" },
      take: limit,
    });
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private calculateNextDueDate(
    fromDate: Date,
    pmiType: string,
    intervalDays?: number
  ): Date {
    const dueDate = new Date(fromDate);

    if (intervalDays) {
      dueDate.setDate(dueDate.getDate() + intervalDays);
    } else {
      // Standard intervals
      switch (pmiType) {
        case "30-DAY":
          dueDate.setDate(dueDate.getDate() + 30);
          break;
        case "90-DAY":
          dueDate.setDate(dueDate.getDate() + 90);
          break;
        case "180-DAY":
          dueDate.setDate(dueDate.getDate() + 180);
          break;
        case "365-DAY":
        case "BAT365":
          dueDate.setDate(dueDate.getDate() + 365);
          break;
        default:
          dueDate.setDate(dueDate.getDate() + 30); // Default 30 days
      }
    }

    return dueDate;
  }

  /**
   * Check meter-based PMIs against current readings
   */
  async checkMeterBasedPmis(assetId: number, currentHours: number): Promise<any[]> {
    const pmis = await prisma.assetInspection.findMany({
      where: {
        asset_id: assetId,
        complete_date: null,
        valid: true,
        interval_hours: { not: null },
      },
    });

    const duePmis = [];
    for (const pmi of pmis) {
      const lastReading = pmi.meter_reading || 0;
      const interval = pmi.interval_hours || 0;
      
      if (currentHours >= lastReading + interval) {
        duePmis.push(pmi);
      }
    }

    return duePmis;
  }
}

// Export singleton
export const pmiService = new PmiService();
