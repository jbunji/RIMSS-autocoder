/**
 * MaintenanceWorkflowService
 * ==========================
 * Implements the RIMSS maintenance workflow state machine.
 * Extracted from legacy ColdFusion MaintenanceBO.cfc and maintenanceController.cfc
 * 
 * Key workflows:
 * 1. Part removal cascade (status change, depot WO, ECU PMI)
 * 2. Part installation (NHA linkage, close ECU PMI)
 * 3. NRTS job creation for action codes 0-9
 * 4. HOW_MAL exemption codes (no-defect = skip depot WO)
 */

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// CONSTANTS - HOW_MAL Codes
// ============================================================================

/**
 * HOW_MAL codes that indicate "No Defect" - exempt from status change and depot WO
 * From legacy: CR 609 and maintenanceController.cfc
 */
const NO_DEFECT_HOW_MAL_CODES = [
  "799",  // No Defect
  "800",  // No Defect, Removed to Facilitate Other Maintenance
  "804",  // No Defect, Removed for Scheduled Maintenance
  "806",  // No Defect, Removed for Routine/Emergency/Special Reprogramming
];

/**
 * ECU Part Number - triggers special 365-day PMI logic
 */
const ECU_PART_NUMBER = "987-1404-550";

/**
 * Status codes
 */
const STATUS_CODES = {
  FMC: "FMC",     // Fully Mission Capable
  NMCM: "NMCM",   // Not Mission Capable - Maintenance
};

// ============================================================================
// MAIN WORKFLOW SERVICE
// ============================================================================

export class MaintenanceWorkflowService {
  
  /**
   * Process a repair with labor - the main entry point
   * This is the "state machine" that triggers cascading actions
   */
  async processRepairWithLabor(params: {
    eventId: number;
    repairId: number;
    laborId: number;
    actionTaken?: string;
    howMal?: string;
    workedAssetId?: number;
    removedAssetId?: number;
    installedAssetId?: number;
    userId: string;
    userLocationId: number;
  }): Promise<{
    depotEventCreated?: number;
    pmiCreated?: number;
    pmiClosed?: number;
    nrtsJobCreated?: number;
    statusChanges: Array<{ assetId: number; oldStatus: string; newStatus: string }>;
  }> {
    const result = {
      statusChanges: [] as Array<{ assetId: number; oldStatus: string; newStatus: string }>,
    };

    // Determine if we should skip depot WO based on HOW_MAL or action
    const skipDepotWO = this.shouldSkipDepotWO(params.howMal, params.actionTaken);

    // 1. Handle REMOVED part
    if (params.removedAssetId) {
      const removalResult = await this.handlePartRemoval({
        assetId: params.removedAssetId,
        repairId: params.repairId,
        laborId: params.laborId,
        howMal: params.howMal,
        actionTaken: params.actionTaken,
        skipDepotWO,
        userId: params.userId,
        userLocationId: params.userLocationId,
      });
      
      if (removalResult.statusChanged) {
        result.statusChanges.push(removalResult.statusChanged);
      }
      if (removalResult.depotEventId) {
        (result as any).depotEventCreated = removalResult.depotEventId;
      }
      if (removalResult.pmiCreated) {
        (result as any).pmiCreated = removalResult.pmiCreated;
      }
    }

    // 2. Handle INSTALLED part
    if (params.installedAssetId) {
      const installResult = await this.handlePartInstallation({
        assetId: params.installedAssetId,
        eventId: params.eventId,
        repairId: params.repairId,
        laborId: params.laborId,
        userId: params.userId,
        userLocationId: params.userLocationId,
      });
      
      if (installResult.pmiClosed) {
        (result as any).pmiClosed = installResult.pmiClosed;
      }
    }

    // 3. Check for NRTS job creation (action codes 0-9)
    if (params.actionTaken && params.workedAssetId) {
      const nrtsResult = await this.checkAndCreateNRTSJob({
        eventId: params.eventId,
        repairId: params.repairId,
        laborId: params.laborId,
        actionTaken: params.actionTaken,
        assetId: params.workedAssetId,
        userId: params.userId,
      });
      
      if (nrtsResult.nrtsJobId) {
        (result as any).nrtsJobCreated = nrtsResult.nrtsJobId;
      }
    }

    return result;
  }

  /**
   * Determine if depot WO should be skipped based on HOW_MAL code or action
   */
  private shouldSkipDepotWO(howMal?: string, actionTaken?: string): boolean {
    // Skip if "REMOVED FOR CANN" action
    if (actionTaken && actionTaken.toUpperCase().includes("REMOVED FOR CANN")) {
      return true;
    }

    // Skip if HOW_MAL is a no-defect code
    if (howMal) {
      const howMalCode = howMal.substring(0, 3);
      if (NO_DEFECT_HOW_MAL_CODES.includes(howMalCode)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Handle part removal - the big cascade
   */
  private async handlePartRemoval(params: {
    assetId: number;
    repairId: number;
    laborId: number;
    howMal?: string;
    actionTaken?: string;
    skipDepotWO: boolean;
    userId: string;
    userLocationId: number;
  }): Promise<{
    statusChanged?: { assetId: number; oldStatus: string; newStatus: string };
    depotEventId?: number;
    pmiCreated?: number;
  }> {
    const result: any = {};

    // Get the removed asset with its part info
    const asset = await prisma.asset.findUnique({
      where: { asset_id: params.assetId },
      include: { part: true },
    });

    if (!asset) return result;

    const oldStatus = asset.status_cd;
    let newStatus = oldStatus;

    // 1. Change status based on skipDepotWO flag
    if (params.skipDepotWO) {
      // No defect - keep FMC
      newStatus = STATUS_CODES.FMC;
    } else {
      // Defect - change to NMCM
      newStatus = STATUS_CODES.NMCM;
    }

    // 2. Update the removed asset
    await prisma.asset.update({
      where: { asset_id: params.assetId },
      data: {
        status_cd: newStatus,
        nha_asset_id: null,  // Clear NHA link - removed from parent
        loc_ida: params.userLocationId,
        loc_idc: params.userLocationId,
        chg_by: params.userId,
        chg_date: new Date(),
      },
    });

    if (oldStatus !== newStatus) {
      result.statusChanged = { assetId: params.assetId, oldStatus, newStatus };
    }

    // 3. Create depot work order if not skipped AND part has a depot location
    if (!params.skipDepotWO && asset.part.loc_idr) {
      const depotEvent = await this.createDepotWorkOrder({
        assetId: params.assetId,
        depotLocationId: asset.part.loc_idr,
        originalRepairId: params.repairId,
        howMal: params.howMal,
        userId: params.userId,
      });
      result.depotEventId = depotEvent?.event_id;
    }

    // 4. If ECU removed, create 365-day PMI
    if (asset.part.partno === ECU_PART_NUMBER) {
      const pmi = await this.createEcuPMI({
        assetId: params.assetId,
        repairId: params.repairId,
        userId: params.userId,
        userLocationId: params.userLocationId,
      });
      result.pmiCreated = pmi?.hist_id;
    }

    return result;
  }

  /**
   * Handle part installation
   */
  private async handlePartInstallation(params: {
    assetId: number;
    eventId: number;
    repairId: number;
    laborId: number;
    userId: string;
    userLocationId: number;
  }): Promise<{
    pmiClosed?: number;
  }> {
    const result: any = {};

    // Get the installed asset with its part info
    const asset = await prisma.asset.findUnique({
      where: { asset_id: params.assetId },
      include: { part: true },
    });

    if (!asset) return result;

    // Get the parent event to find the NHA asset
    const event = await prisma.event.findUnique({
      where: { event_id: params.eventId },
      include: { asset: true },
    });

    // 1. Set NHA to the event's asset (the parent/end item)
    await prisma.asset.update({
      where: { asset_id: params.assetId },
      data: {
        nha_asset_id: event?.asset_id,
        in_transit: false,
        recv_date: new Date(),
        chg_by: params.userId,
        chg_date: new Date(),
      },
    });

    // 2. If ECU installed, close any open 365-day PMI on that ECU
    if (asset.part.partno === ECU_PART_NUMBER) {
      const closedPmi = await this.closeEcuPMI({
        assetId: params.assetId,
        userId: params.userId,
      });
      result.pmiClosed = closedPmi?.hist_id;

      // Also check if parent POD needs a PMI365 started
      if (event?.asset_id) {
        await this.ensurePodHasPMI365({
          podAssetId: event.asset_id,
          userId: params.userId,
          userLocationId: params.userLocationId,
        });
      }
    }

    return result;
  }

  /**
   * Create a depot work order for a removed part
   */
  private async createDepotWorkOrder(params: {
    assetId: number;
    depotLocationId: number;
    originalRepairId: number;
    howMal?: string;
    userId: string;
  }): Promise<{ event_id: number } | null> {
    // Generate new job number
    const jobNo = await this.generateJobNumber(params.depotLocationId);

    // Create the depot event
    const depotEvent = await prisma.event.create({
      data: {
        asset_id: params.assetId,
        loc_id: params.depotLocationId,
        job_no: jobNo,
        start_job: new Date(),
        source_cat: "DEPOT",
        ins_by: params.userId,
        ins_date: new Date(),
      },
    });

    // Create initial repair
    await prisma.repair.create({
      data: {
        event_id: depotEvent.event_id,
        repair_seq: 1,
        asset_id: params.assetId,
        how_mal: params.howMal,
        ins_by: params.userId,
        ins_date: new Date(),
      },
    });

    return depotEvent;
  }

  /**
   * Create a 365-day PMI for an ECU
   */
  private async createEcuPMI(params: {
    assetId: number;
    repairId: number;
    userId: string;
    userLocationId: number;
  }): Promise<{ hist_id: number } | null> {
    // Create the PMI inspection record
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 365);

    const pmi = await prisma.assetInspection.create({
      data: {
        asset_id: params.assetId,
        repair_id: params.repairId,
        pmi_type: "365-DAY",
        next_due_date: nextDueDate,
        wuc_cd: "0",
        valid: true,
        ins_by: params.userId,
        ins_date: new Date(),
      },
    });

    return pmi;
  }

  /**
   * Close any open 365-day PMI for an ECU
   */
  private async closeEcuPMI(params: {
    assetId: number;
    userId: string;
  }): Promise<{ hist_id: number } | null> {
    // Find open 365-day PMI
    const openPmi = await prisma.assetInspection.findFirst({
      where: {
        asset_id: params.assetId,
        pmi_type: "365-DAY",
        complete_date: null,
      },
    });

    if (!openPmi) return null;

    // Close it
    const closedPmi = await prisma.assetInspection.update({
      where: { hist_id: openPmi.hist_id },
      data: {
        complete_date: new Date(),
        completed_by: params.userId,
        chg_by: params.userId,
        chg_date: new Date(),
      },
    });

    // Also close the associated repair if any
    if (openPmi.repair_id) {
      await prisma.repair.update({
        where: { repair_id: openPmi.repair_id },
        data: {
          stop_date: new Date(),
          chg_by: params.userId,
          chg_date: new Date(),
        },
      });
    }

    return closedPmi;
  }

  /**
   * Ensure a POD has an active PMI365 running
   */
  private async ensurePodHasPMI365(params: {
    podAssetId: number;
    userId: string;
    userLocationId: number;
  }): Promise<void> {
    // Check if POD already has an open PMI365
    const existingPmi = await prisma.assetInspection.findFirst({
      where: {
        asset_id: params.podAssetId,
        pmi_type: { in: ["365-DAY", "BAT365"] },
        complete_date: null,
      },
    });

    if (existingPmi) return;  // Already has one

    // Create new PMI365 for the POD
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 365);

    await prisma.assetInspection.create({
      data: {
        asset_id: params.podAssetId,
        pmi_type: "BAT365",
        next_due_date: nextDueDate,
        wuc_cd: "0",
        valid: true,
        ins_by: params.userId,
        ins_date: new Date(),
      },
    });
  }

  /**
   * Check if NRTS job should be created and create it
   * NRTS = Not Reparable This Station
   */
  private async checkAndCreateNRTSJob(params: {
    eventId: number;
    repairId: number;
    laborId: number;
    actionTaken: string;
    assetId: number;
    userId: string;
  }): Promise<{ nrtsJobId?: number }> {
    // Action taken codes 0-9 trigger NRTS
    const actionCode = params.actionTaken.charAt(0);
    if (!actionCode.match(/^[0-9]$/)) {
      return {};
    }

    // Get the asset and check if it has a depot location
    const asset = await prisma.asset.findUnique({
      where: { asset_id: params.assetId },
      include: { part: true },
    });

    if (!asset?.part.loc_idr) {
      return {};  // No depot location, skip NRTS
    }

    // Create NRTS job at the depot
    const nrtsEvent = await this.createDepotWorkOrder({
      assetId: params.assetId,
      depotLocationId: asset.part.loc_idr,
      originalRepairId: params.repairId,
      userId: params.userId,
    });

    return { nrtsJobId: nrtsEvent?.event_id };
  }

  /**
   * Generate a new job number
   */
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
}

// Export singleton instance
export const maintenanceWorkflow = new MaintenanceWorkflowService();
