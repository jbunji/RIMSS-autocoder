/**
 * MaintenanceService
 * ==================
 * Database-backed maintenance operations using Prisma.
 * Replaces the mock data arrays with real database operations.
 * Integrates with MaintenanceWorkflowService for business logic.
 */

import { PrismaClient } from "@prisma/client";
import { maintenanceWorkflow } from "./MaintenanceWorkflowService";

const prisma = new PrismaClient();

export class MaintenanceService {

  // ============================================================================
  // EVENTS
  // ============================================================================

  async createEvent(params: {
    assetId: number;
    locationId: number;
    jobNo?: string;
    discrepancy?: string;
    startJob?: Date;
    source?: string;
    userId: string;
  }) {
    // Generate job number if not provided
    const jobNo = params.jobNo || await this.generateJobNumber(params.locationId);

    const event = await prisma.event.create({
      data: {
        asset_id: params.assetId,
        loc_id: params.locationId,
        job_no: jobNo,
        discrepancy: params.discrepancy,
        start_job: params.startJob || new Date(),
        source: params.source || "FIELD",
        ins_by: params.userId,
        ins_date: new Date(),
      },
      include: {
        asset: { include: { part: true } },
        location: true,
      },
    });

    return event;
  }

  async getEvent(eventId: number) {
    return prisma.event.findUnique({
      where: { event_id: eventId },
      include: {
        asset: { include: { part: true } },
        location: true,
        repairs: {
          include: {
            labors: {
              include: { laborParts: true }
            }
          }
        },
      },
    });
  }

  async closeEvent(eventId: number, userId: string) {
    // Check for open repairs
    const openRepairs = await prisma.repair.count({
      where: { event_id: eventId, stop_date: null },
    });

    if (openRepairs > 0) {
      throw new Error(`Cannot close event with ${openRepairs} open repair(s). Close all repairs first.`);
    }

    return prisma.event.update({
      where: { event_id: eventId },
      data: {
        stop_job: new Date(),
        chg_by: userId,
        chg_date: new Date(),
      },
    });
  }

  // ============================================================================
  // REPAIRS
  // ============================================================================

  async createRepair(params: {
    eventId: number;
    assetId?: number;
    typeMaint: string;
    howMal?: string;
    whenDisc?: string;
    narrative?: string;
    startDate?: Date;
    userId: string;
  }) {
    // Get next repair sequence for this event
    const maxSeq = await prisma.repair.aggregate({
      where: { event_id: params.eventId },
      _max: { repair_seq: true },
    });
    const nextSeq = (maxSeq._max.repair_seq || 0) + 1;

    // Get event to get asset_id if not provided
    const event = await prisma.event.findUnique({
      where: { event_id: params.eventId },
    });

    const repair = await prisma.repair.create({
      data: {
        event_id: params.eventId,
        repair_seq: nextSeq,
        asset_id: params.assetId || event?.asset_id,
        type_maint: params.typeMaint,
        how_mal: params.howMal,
        when_disc: params.whenDisc,
        narrative: params.narrative,
        start_date: params.startDate || new Date(),
        ins_by: params.userId,
        ins_date: new Date(),
      },
    });

    return repair;
  }

  async closeRepair(repairId: number, userId: string) {
    return prisma.repair.update({
      where: { repair_id: repairId },
      data: {
        stop_date: new Date(),
        chg_by: userId,
        chg_date: new Date(),
      },
    });
  }

  // ============================================================================
  // LABOR
  // ============================================================================

  async createLabor(params: {
    repairId: number;
    assetId?: number;
    actionTaken?: string;
    howMal?: string;
    whenDisc?: string;
    corrective?: string;
    remarks?: string;
    crewChief?: string;
    crewSize?: number;
    startDate?: Date;
    userId: string;
  }) {
    // Get next labor sequence for this repair
    const maxSeq = await prisma.labor.aggregate({
      where: { repair_id: params.repairId },
      _max: { labor_seq: true },
    });
    const nextSeq = (maxSeq._max.labor_seq || 0) + 1;

    const labor = await prisma.labor.create({
      data: {
        repair_id: params.repairId,
        labor_seq: nextSeq,
        asset_id: params.assetId,
        action_taken: params.actionTaken,
        how_mal: params.howMal,
        when_disc: params.whenDisc,
        corrective: params.corrective,
        remarks: params.remarks,
        crew_chief: params.crewChief,
        crew_size: params.crewSize,
        start_date: params.startDate || new Date(),
        ins_by: params.userId,
        ins_date: new Date(),
      },
    });

    return labor;
  }

  // ============================================================================
  // LABOR PARTS (with workflow triggers!)
  // ============================================================================

  /**
   * Add a removed part to labor - TRIGGERS WORKFLOW CASCADE
   */
  async addRemovedPart(params: {
    laborId: number;
    assetId: number;
    howMal?: string;
    isPqdr?: boolean;
    drNum?: string;
    userId: string;
    userLocationId: number;
  }) {
    // Get the labor record to find repair and event
    const labor = await prisma.labor.findUnique({
      where: { labor_id: params.laborId },
      include: { repair: { include: { event: true } } },
    });

    if (!labor) throw new Error("Labor record not found");

    // Create the labor_part record
    const laborPart = await prisma.laborPart.create({
      data: {
        labor_id: params.laborId,
        asset_id: params.assetId,
        part_action: "REMOVED",
        how_mal: params.howMal,
        is_pqdr: params.isPqdr || false,
        dr_num: params.drNum,
        ins_by: params.userId,
        ins_date: new Date(),
      },
    });

    // 🔥 TRIGGER THE WORKFLOW CASCADE
    const workflowResult = await maintenanceWorkflow.processRepairWithLabor({
      eventId: labor.repair.event_id,
      repairId: labor.repair_id,
      laborId: params.laborId,
      actionTaken: labor.action_taken || undefined,
      howMal: params.howMal,
      removedAssetId: params.assetId,
      userId: params.userId,
      userLocationId: params.userLocationId,
    });

    return {
      laborPart,
      workflow: workflowResult,
    };
  }

  /**
   * Add an installed part to labor - TRIGGERS WORKFLOW CASCADE
   */
  async addInstalledPart(params: {
    laborId: number;
    assetId: number;
    userId: string;
    userLocationId: number;
  }) {
    // Get the labor record to find repair and event
    const labor = await prisma.labor.findUnique({
      where: { labor_id: params.laborId },
      include: { repair: { include: { event: true } } },
    });

    if (!labor) throw new Error("Labor record not found");

    // Create the labor_part record
    const laborPart = await prisma.laborPart.create({
      data: {
        labor_id: params.laborId,
        asset_id: params.assetId,
        part_action: "INSTALLED",
        ins_by: params.userId,
        ins_date: new Date(),
      },
    });

    // 🔥 TRIGGER THE WORKFLOW CASCADE
    const workflowResult = await maintenanceWorkflow.processRepairWithLabor({
      eventId: labor.repair.event_id,
      repairId: labor.repair_id,
      laborId: params.laborId,
      actionTaken: labor.action_taken || undefined,
      installedAssetId: params.assetId,
      userId: params.userId,
      userLocationId: params.userLocationId,
    });

    return {
      laborPart,
      workflow: workflowResult,
    };
  }

  /**
   * Add a worked part to labor (no removal/installation, just tracking)
   */
  async addWorkedPart(params: {
    laborId: number;
    assetId: number;
    howMal?: string;
    userId: string;
  }) {
    const laborPart = await prisma.laborPart.create({
      data: {
        labor_id: params.laborId,
        asset_id: params.assetId,
        part_action: "WORKED",
        how_mal: params.howMal,
        ins_by: params.userId,
        ins_date: new Date(),
      },
    });

    return { laborPart };
  }

  // ============================================================================
  // UTILITY
  // ============================================================================

  private async generateJobNumber(locationId: number): Promise<string> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
    );

    // Get count of events at this location today
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const count = await prisma.event.count({
      where: {
        loc_id: locationId,
        ins_date: { gte: todayStart },
      },
    });

    return `MX-${locationId}-${year}${dayOfYear.toString().padStart(3, "0")}-${(count + 1).toString().padStart(3, "0")}`;
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  async getEventsForLocation(params: {
    locationId: number;
    status?: "open" | "closed";
    limit?: number;
    offset?: number;
  }) {
    const whereClause: any = {};
    
    // Filter by location (check both assigned and current)
    whereClause.OR = [
      { loc_id: params.locationId },
      { asset: { loc_ida: params.locationId } },
      { asset: { loc_idc: params.locationId } },
    ];

    // Filter by status
    if (params.status === "open") {
      whereClause.stop_job = null;
    } else if (params.status === "closed") {
      whereClause.stop_job = { not: null };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        include: {
          asset: { include: { part: true } },
          location: true,
          repairs: { include: { labors: true } },
        },
        orderBy: { ins_date: "desc" },
        take: params.limit || 50,
        skip: params.offset || 0,
      }),
      prisma.event.count({ where: whereClause }),
    ]);

    return { events, total };
  }

  async getRepairsForEvent(eventId: number) {
    return prisma.repair.findMany({
      where: { event_id: eventId },
      include: {
        labors: {
          include: {
            laborParts: {
              include: { asset: { include: { part: true } } }
            }
          }
        }
      },
      orderBy: { repair_seq: "asc" },
    });
  }
}

// Export singleton
export const maintenanceService = new MaintenanceService();
