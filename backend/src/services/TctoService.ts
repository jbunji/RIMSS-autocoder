/**
 * TctoService
 * ===========
 * TCTO (Time Compliance Technical Order) workflow management.
 * 
 * TCTOs are mandatory modifications that must be applied to assets.
 * They can involve part replacements, software updates, or inspections.
 * 
 * Workflow:
 * 1. TCTO created for program with applicability criteria
 * 2. System identifies applicable assets
 * 3. Assets are assigned to TCTO (pending compliance)
 * 4. Tech performs work, creates repair, links to TCTO
 * 5. Supervisor validates completion
 * 6. Asset marked compliant
 */

import { PrismaClient } from "@prisma/client";
import { maintenanceService } from "./MaintenanceService";

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export interface TctoCreateData {
  pgmId: number;
  tctoNo: string;
  tctoType?: string;    // ROUTINE, URGENT, IMMEDIATE
  tctoCode?: string;    // MANDATORY, OPTIONAL
  wucCd?: string;
  sysType?: string;     // Filter by system type
  stationType?: string; // Filter by station type
  oldPartnoId?: number; // Part being replaced
  newPartnoId?: number; // Replacement part
  effDate?: Date;       // Effective date
  remarks?: string;
  userId: string;
}

export interface TctoComplianceData {
  tctoId: number;
  assetId: number;
  repairId?: number;
  remarks?: string;
  userId: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export class TctoService {

  /**
   * Create a new TCTO
   */
  async createTcto(data: TctoCreateData): Promise<any> {
    const tcto = await prisma.tcto.create({
      data: {
        pgm_id: data.pgmId,
        tcto_no: data.tctoNo,
        tcto_type: data.tctoType || "ROUTINE",
        tcto_code: data.tctoCode || "MANDATORY",
        wuc_cd: data.wucCd,
        sys_type: data.sysType,
        station_type: data.stationType,
        old_partno_id: data.oldPartnoId,
        new_partno_id: data.newPartnoId,
        eff_date: data.effDate || new Date(),
        remarks: data.remarks,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: {
        program: true,
      },
    });

    console.log(`[TCTO] Created TCTO ${tcto.tcto_no} for program ${tcto.program.pgm_cd}`);

    return tcto;
  }

  /**
   * Find applicable assets for a TCTO and assign them
   */
  async assignApplicableAssets(tctoId: number, userId: string): Promise<{
    assigned: number;
    alreadyAssigned: number;
    assets: any[];
  }> {
    const tcto = await prisma.tcto.findUnique({
      where: { tcto_id: tctoId },
    });

    if (!tcto) throw new Error("TCTO not found");

    // Build filter for applicable assets
    const whereClause: any = {
      pgm_id: tcto.pgm_id,
      active: true,
    };

    // Filter by system type if specified
    if (tcto.sys_type) {
      whereClause.part = { sys_type: tcto.sys_type };
    }

    // Filter by old part number if this is a part replacement TCTO
    if (tcto.old_partno_id) {
      whereClause.part_id = tcto.old_partno_id;
    }

    // Get applicable assets
    const applicableAssets = await prisma.asset.findMany({
      where: whereClause,
      include: { part: true },
    });

    // Get already assigned assets
    const existingAssignments = await prisma.tctoAsset.findMany({
      where: { tcto_id: tctoId },
      select: { asset_id: true },
    });
    const assignedIds = new Set(existingAssignments.map(a => a.asset_id));

    // Assign new assets
    const newAssignments = [];
    let alreadyAssigned = 0;

    for (const asset of applicableAssets) {
      if (assignedIds.has(asset.asset_id)) {
        alreadyAssigned++;
        continue;
      }

      const assignment = await prisma.tctoAsset.create({
        data: {
          tcto_id: tctoId,
          asset_id: asset.asset_id,
          valid: false,
          ins_by: userId,
          ins_date: new Date(),
        },
        include: {
          asset: { include: { part: true } },
        },
      });

      newAssignments.push(assignment);
    }

    console.log(`[TCTO] Assigned ${newAssignments.length} assets to TCTO ${tcto.tcto_no}`);

    return {
      assigned: newAssignments.length,
      alreadyAssigned,
      assets: newAssignments,
    };
  }

  /**
   * Manually assign a specific asset to a TCTO
   */
  async assignAsset(tctoId: number, assetId: number, userId: string): Promise<any> {
    // Check if already assigned
    const existing = await prisma.tctoAsset.findUnique({
      where: {
        tcto_id_asset_id: { tcto_id: tctoId, asset_id: assetId },
      },
    });

    if (existing) {
      throw new Error("Asset already assigned to this TCTO");
    }

    const assignment = await prisma.tctoAsset.create({
      data: {
        tcto_id: tctoId,
        asset_id: assetId,
        valid: false,
        ins_by: userId,
        ins_date: new Date(),
      },
      include: {
        tcto: true,
        asset: { include: { part: true } },
      },
    });

    return assignment;
  }

  /**
   * Record TCTO compliance for an asset (work completed)
   */
  async recordCompliance(data: TctoComplianceData): Promise<any> {
    const assignment = await prisma.tctoAsset.findUnique({
      where: {
        tcto_id_asset_id: { tcto_id: data.tctoId, asset_id: data.assetId },
      },
      include: { tcto: true },
    });

    if (!assignment) {
      throw new Error("Asset not assigned to this TCTO");
    }

    if (assignment.complete_date) {
      throw new Error("TCTO already completed for this asset");
    }

    const updated = await prisma.tctoAsset.update({
      where: {
        tcto_id_asset_id: { tcto_id: data.tctoId, asset_id: data.assetId },
      },
      data: {
        complete_date: new Date(),
        repair_id: data.repairId,
        remarks: data.remarks,
        chg_by: data.userId,
        chg_date: new Date(),
      },
      include: {
        tcto: true,
        asset: { include: { part: true } },
        repair: true,
      },
    });

    console.log(`[TCTO] Compliance recorded for asset ${updated.asset.serno} on TCTO ${updated.tcto.tcto_no}`);

    return updated;
  }

  /**
   * Validate TCTO completion (supervisor sign-off)
   */
  async validateCompletion(tctoId: number, assetId: number, userId: string): Promise<any> {
    const assignment = await prisma.tctoAsset.findUnique({
      where: {
        tcto_id_asset_id: { tcto_id: tctoId, asset_id: assetId },
      },
    });

    if (!assignment) {
      throw new Error("Asset not assigned to this TCTO");
    }

    if (!assignment.complete_date) {
      throw new Error("TCTO work not completed yet");
    }

    if (assignment.valid) {
      throw new Error("TCTO already validated");
    }

    const updated = await prisma.tctoAsset.update({
      where: {
        tcto_id_asset_id: { tcto_id: tctoId, asset_id: assetId },
      },
      data: {
        valid: true,
        val_by: userId,
        val_date: new Date(),
        chg_by: userId,
        chg_date: new Date(),
      },
      include: {
        tcto: true,
        asset: { include: { part: true } },
      },
    });

    console.log(`[TCTO] Validated completion for asset ${updated.asset.serno} on TCTO ${updated.tcto.tcto_no}`);

    return updated;
  }

  /**
   * Create maintenance event for TCTO work
   */
  async createTctoEvent(params: {
    tctoId: number;
    assetId: number;
    locationId: number;
    userId: string;
  }): Promise<any> {
    const tcto = await prisma.tcto.findUnique({
      where: { tcto_id: params.tctoId },
    });

    if (!tcto) throw new Error("TCTO not found");

    // Create event
    const event = await maintenanceService.createEvent({
      assetId: params.assetId,
      locationId: params.locationId,
      discrepancy: `TCTO ${tcto.tcto_no}: ${tcto.remarks || "Time Compliance Technical Order"}`,
      source: "TCTO",
      userId: params.userId,
    });

    // Create initial repair
    const repair = await maintenanceService.createRepair({
      eventId: event.event_id,
      typeMaint: "TCTO",
      narrative: `TCTO ${tcto.tcto_no} compliance work`,
      userId: params.userId,
    });

    // Link repair to TCTO asset
    await prisma.tctoAsset.update({
      where: {
        tcto_id_asset_id: { tcto_id: params.tctoId, asset_id: params.assetId },
      },
      data: {
        repair_id: repair.repair_id,
        chg_by: params.userId,
        chg_date: new Date(),
      },
    });

    return { event, repair };
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Get TCTOs for a program with compliance stats
   */
  async getTctosForProgram(pgmId: number): Promise<any[]> {
    const tctos = await prisma.tcto.findMany({
      where: { pgm_id: pgmId, active: true },
      include: {
        tctoAssets: {
          include: {
            asset: { select: { asset_id: true, serno: true } },
          },
        },
      },
      orderBy: { eff_date: "desc" },
    });

    // Add compliance stats
    return tctos.map(tcto => {
      const total = tcto.tctoAssets.length;
      const completed = tcto.tctoAssets.filter(a => a.complete_date).length;
      const validated = tcto.tctoAssets.filter(a => a.valid).length;

      return {
        ...tcto,
        compliance: {
          total,
          completed,
          validated,
          pending: total - completed,
          percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
      };
    });
  }

  /**
   * Get pending TCTOs for an asset
   */
  async getPendingTctosForAsset(assetId: number): Promise<any[]> {
    return prisma.tctoAsset.findMany({
      where: {
        asset_id: assetId,
        complete_date: null,
        tcto: { active: true },
      },
      include: {
        tcto: true,
      },
      orderBy: { tcto: { eff_date: "asc" } },
    });
  }

  /**
   * Get overdue TCTOs (past effective date, not completed)
   */
  async getOverdueTctos(pgmId: number): Promise<any[]> {
    const now = new Date();

    return prisma.tctoAsset.findMany({
      where: {
        complete_date: null,
        tcto: {
          pgm_id: pgmId,
          active: true,
          eff_date: { lt: now },
        },
      },
      include: {
        tcto: true,
        asset: { include: { part: true, currentLocation: true } },
      },
      orderBy: { tcto: { eff_date: "asc" } },
    });
  }

  /**
   * Get TCTO compliance status for a location
   */
  async getLocationCompliance(locationId: number): Promise<{
    total: number;
    completed: number;
    overdue: number;
    pending: number;
  }> {
    const now = new Date();

    const assignments = await prisma.tctoAsset.findMany({
      where: {
        tcto: { active: true },
        asset: {
          OR: [
            { loc_ida: locationId },
            { loc_idc: locationId },
          ],
        },
      },
      include: {
        tcto: { select: { eff_date: true } },
      },
    });

    const total = assignments.length;
    const completed = assignments.filter(a => a.complete_date).length;
    const overdue = assignments.filter(a => 
      !a.complete_date && a.tcto.eff_date && a.tcto.eff_date < now
    ).length;

    return {
      total,
      completed,
      overdue,
      pending: total - completed,
    };
  }
}

// Export singleton
export const tctoService = new TctoService();
