/**
 * MaintenanceDataService.ts
 * =========================
 * Database-backed maintenance data access layer that returns
 * V1-API-compatible response formats for backward compatibility.
 * 
 * This replaces mock arrays with Prisma queries while keeping
 * the same response shapes the frontend expects.
 */

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// V1 Response Types (matching mock data shapes)
// ============================================================================

export interface MaintenanceEventV1 {
  event_id: number;
  asset_id: number;
  asset_sn: string;
  asset_name: string;
  job_no: string;
  discrepancy: string;
  start_job: string;
  stop_job: string | null;
  event_type: string;
  priority: string;
  status: 'open' | 'closed';
  pgm_id: number;
  location: string;
  loc_id: number;
  etic?: string | null;
  sortie_id?: number | null;
  pqdr?: boolean;
  total_repairs?: number;
  closed_repairs?: number;
  progress_percentage?: number;
  created_by_id?: number;
  created_by_name?: string;
  created_at?: string;
}

export interface RepairV1 {
  repair_id: number;
  event_id: number;
  repair_seq: number;
  asset_id: number;
  start_date: string;
  stop_date: string | null;
  type_maint: string;
  how_mal: string | null;
  when_disc: string | null;
  action_taken: string | null;
  shop_status: 'open' | 'closed';
  narrative: string;
  tag_no: string | null;
  doc_no: string | null;
  micap: boolean;
  micap_login: string | null;
  chief_review: boolean;
  chief_review_by: string | null;
  super_review: boolean;
  super_review_by: string | null;
  repeat_recur: boolean;
  repeat_recur_by: string | null;
  donor_asset_id: number | null;
  donor_asset_sn: string | null;
  donor_asset_pn: string | null;
  donor_asset_name: string | null;
  eti_in: number | null;
  eti_out: number | null;
  eti_delta: number | null;
  meter_changed: boolean;
  created_by_name: string;
  created_at: string;
  linked_tcto?: {
    tcto_id: number;
    tcto_no: string;
    title: string;
    status: string;
    priority: string;
    completion_date?: string;
  } | null;
}

export interface LaborV1 {
  labor_id: number;
  repair_id: number;
  labor_seq: number;
  asset_id: number;
  action_taken: string | null;
  how_mal: string | null;
  when_disc: string | null;
  type_maint: string | null;
  cat_labor: string | null;
  start_date: string;
  stop_date: string | null;
  hours: number | null;
  crew_chief: string | null;
  crew_size: number | null;
  corrective: string | null;
  discrepancy: string | null;
  remarks: string | null;
  corrected_by: string | null;
  inspected_by: string | null;
  bit_log: string | null;
  sent_imds: boolean;
  valid: boolean;
  created_by: number;
  created_by_name: string;
  created_at: string;
}

export interface InstalledPartV1 {
  installed_part_id: number;
  repair_id: number;
  labor_id?: number;
  event_id: number;
  asset_id: number;
  asset_sn: string;
  asset_pn: string;
  asset_name: string;
  installation_date: string;
  installation_notes: string | null;
  previous_location: string | null;
  installed_by: number;
  installed_by_name: string;
  created_at: string;
}

export interface RemovedPartV1 {
  removed_part_id: number;
  repair_id: number;
  labor_id?: number;
  event_id: number;
  asset_id: number;
  asset_sn: string;
  asset_pn: string;
  asset_name: string;
  removal_date: string;
  removal_reason: string | null;
  removal_notes: string | null;
  new_status: string | null;
  removed_by: number;
  removed_by_name: string;
  created_at: string;
}

export interface LaborPartV1 {
  labor_part_id: number;
  labor_id: number;
  repair_id: number;
  event_id: number;
  asset_id: number;
  asset_sn: string;
  asset_pn: string;
  asset_name: string;
  part_action: 'INSTALLED' | 'REMOVED' | 'WORKED';
  how_mal: string | null;
  is_pqdr: boolean;
  dr_num: string | null;
  qty: number;
  installed_by?: number;
  installed_by_name?: string;
  removed_by?: number;
  removed_by_name?: string;
  installation_date?: string;
  removal_date?: string;
  installation_notes?: string | null;
  removal_reason?: string | null;
  removal_notes?: string | null;
  created_at: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatDateString(date: Date | null | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0];
  return date.toISOString().split('T')[0];
}

function formatDateTime(date: Date | null | undefined): string {
  if (!date) return new Date().toISOString();
  return date.toISOString();
}

// ============================================================================
// MaintenanceDataService Class
// ============================================================================

export class MaintenanceDataService {

  // ==========================================================================
  // EVENTS
  // ==========================================================================

  /**
   * Get a single event by ID with V1-compatible format
   */
  async getEventById(eventId: number): Promise<MaintenanceEventV1 | null> {
    const dbEvent = await prisma.event.findUnique({
      where: { event_id: eventId },
      include: {
        asset: {
          include: {
            part: {
              include: { program: true }
            }
          }
        },
        location: true,
        repairs: true,
      },
    });

    if (!dbEvent) return null;

    const totalRepairs = dbEvent.repairs.length;
    const closedRepairs = dbEvent.repairs.filter(r => r.stop_date !== null || r.shop_status === 'closed').length;

    return {
      event_id: dbEvent.event_id,
      asset_id: dbEvent.asset_id,
      asset_sn: dbEvent.asset?.serno || 'Unknown',
      asset_name: dbEvent.asset?.part?.noun || dbEvent.asset?.serno || 'Unknown',
      job_no: dbEvent.job_no || `JOB-${dbEvent.event_id}`,
      discrepancy: dbEvent.discrepancy || 'No discrepancy',
      start_job: formatDateString(dbEvent.start_job),
      stop_job: dbEvent.stop_job ? formatDateString(dbEvent.stop_job) : null,
      event_type: dbEvent.event_type || 'Standard',
      priority: dbEvent.priority || 'Routine',
      status: dbEvent.stop_job ? 'closed' : 'open',
      pgm_id: dbEvent.asset?.part?.pgm_id || 1,
      location: dbEvent.location?.display_name || 'Unknown',
      loc_id: dbEvent.loc_id || 0,
      etic: dbEvent.etic_date ? formatDateString(dbEvent.etic_date) : null,
      sortie_id: dbEvent.sortie_id,
      pqdr: false, // TODO: Add PQDR field to Event model
      total_repairs: totalRepairs,
      closed_repairs: closedRepairs,
      progress_percentage: totalRepairs > 0 ? Math.round((closedRepairs / totalRepairs) * 100) : 0,
      created_by_name: dbEvent.ins_by || 'System',
      created_at: formatDateTime(dbEvent.ins_date),
    };
  }

  /**
   * Create a new event and return V1-compatible format
   */
  async createEvent(params: {
    asset_id: number;
    discrepancy: string;
    event_type: string;
    priority?: string;
    start_job: string;
    etic?: string | null;
    loc_id: number;
    sortie_id?: number | null;
    job_no?: string;
    ins_by?: string;
  }): Promise<MaintenanceEventV1> {
    // Generate job number if not provided
    const jobNo = params.job_no || await this.generateJobNumber(params.loc_id);

    const dbEvent = await prisma.event.create({
      data: {
        asset_id: params.asset_id,
        discrepancy: params.discrepancy,
        event_type: params.event_type,
        priority: params.priority || 'Routine',
        start_job: new Date(params.start_job),
        etic_date: params.etic ? new Date(params.etic) : null,
        loc_id: params.loc_id,
        sortie_id: params.sortie_id,
        job_no: jobNo,
        ins_by: params.ins_by || 'system',
        ins_date: new Date(),
      },
      include: {
        asset: {
          include: {
            part: { include: { program: true } }
          }
        },
        location: true,
      },
    });

    return {
      event_id: dbEvent.event_id,
      asset_id: dbEvent.asset_id,
      asset_sn: dbEvent.asset?.serno || 'Unknown',
      asset_name: dbEvent.asset?.part?.noun || dbEvent.asset?.serno || 'Unknown',
      job_no: dbEvent.job_no || `JOB-${dbEvent.event_id}`,
      discrepancy: dbEvent.discrepancy || '',
      start_job: formatDateString(dbEvent.start_job),
      stop_job: null,
      event_type: dbEvent.event_type || 'Standard',
      priority: dbEvent.priority || 'Routine',
      status: 'open',
      pgm_id: dbEvent.asset?.part?.pgm_id || 1,
      location: dbEvent.location?.display_name || 'Unknown',
      loc_id: dbEvent.loc_id || 0,
      etic: dbEvent.etic_date ? formatDateString(dbEvent.etic_date) : null,
      sortie_id: dbEvent.sortie_id,
      pqdr: false,
      total_repairs: 0,
      closed_repairs: 0,
      progress_percentage: 0,
      created_by_name: dbEvent.ins_by || 'System',
      created_at: formatDateTime(dbEvent.ins_date),
    };
  }

  /**
   * Update an event
   */
  async updateEvent(eventId: number, updates: {
    discrepancy?: string;
    event_type?: string;
    priority?: string;
    etic?: string | null;
    sortie_id?: number | null;
    chg_by?: string;
  }): Promise<MaintenanceEventV1 | null> {
    const dbEvent = await prisma.event.update({
      where: { event_id: eventId },
      data: {
        ...(updates.discrepancy && { discrepancy: updates.discrepancy }),
        ...(updates.event_type && { event_type: updates.event_type }),
        ...(updates.priority && { priority: updates.priority }),
        ...(updates.etic !== undefined && { etic_date: updates.etic ? new Date(updates.etic) : null }),
        ...(updates.sortie_id !== undefined && { sortie_id: updates.sortie_id }),
        chg_by: updates.chg_by || 'system',
        chg_date: new Date(),
      },
      include: {
        asset: { include: { part: { include: { program: true } } } },
        location: true,
        repairs: true,
      },
    });

    return this.getEventById(eventId);
  }

  /**
   * Close an event
   */
  async closeEvent(eventId: number, chgBy?: string): Promise<MaintenanceEventV1 | null> {
    // Check for open repairs first
    const openRepairs = await prisma.repair.count({
      where: { event_id: eventId, stop_date: null },
    });

    if (openRepairs > 0) {
      throw new Error(`Cannot close event with ${openRepairs} open repair(s)`);
    }

    await prisma.event.update({
      where: { event_id: eventId },
      data: {
        stop_job: new Date(),
        chg_by: chgBy || 'system',
        chg_date: new Date(),
      },
    });

    return this.getEventById(eventId);
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: number): Promise<boolean> {
    try {
      await prisma.event.delete({
        where: { event_id: eventId },
      });
      return true;
    } catch {
      return false;
    }
  }

  // ==========================================================================
  // REPAIRS
  // ==========================================================================

  /**
   * Get repairs for an event with V1-compatible format
   */
  async getRepairsForEvent(eventId: number): Promise<RepairV1[]> {
    const dbRepairs = await prisma.repair.findMany({
      where: { event_id: eventId },
      include: {
        event: true,
        asset: { include: { part: true } },
      },
      orderBy: { repair_seq: 'asc' },
    });

    return dbRepairs.map(r => this.mapRepairToV1(r));
  }

  /**
   * Get a single repair by ID
   */
  async getRepairById(repairId: number): Promise<RepairV1 | null> {
    const dbRepair = await prisma.repair.findUnique({
      where: { repair_id: repairId },
      include: {
        event: true,
        asset: { include: { part: true } },
      },
    });

    if (!dbRepair) return null;
    return this.mapRepairToV1(dbRepair);
  }

  /**
   * Create a new repair
   */
  async createRepair(params: {
    event_id: number;
    asset_id: number;
    start_date?: string;
    type_maint: string;
    how_mal?: string | null;
    when_disc?: string | null;
    action_taken?: string | null;
    narrative: string;
    tag_no?: string | null;
    doc_no?: string | null;
    micap?: boolean;
    chief_review?: boolean;
    super_review?: boolean;
    repeat_recur?: boolean;
    eti_in?: number | null;
    ins_by?: string;
  }): Promise<RepairV1> {
    // Get next sequence
    const maxSeq = await prisma.repair.aggregate({
      where: { event_id: params.event_id },
      _max: { repair_seq: true },
    });
    const nextSeq = (maxSeq._max.repair_seq || 0) + 1;

    const dbRepair = await prisma.repair.create({
      data: {
        event_id: params.event_id,
        repair_seq: nextSeq,
        asset_id: params.asset_id,
        start_date: params.start_date ? new Date(params.start_date) : new Date(),
        type_maint: params.type_maint,
        how_mal: params.how_mal,
        when_disc: params.when_disc,
        shop_status: 'open',
        narrative: params.narrative,
        tag_no: params.tag_no,
        doc_no: params.doc_no,
        micap: params.micap || false,
        micap_login: params.micap ? params.ins_by : null,
        chief_review: params.chief_review || false,
        super_review: params.super_review || false,
        repeat_recur: params.repeat_recur || false,
        eti_in: params.eti_in !== null && params.eti_in !== undefined 
          ? new Prisma.Decimal(params.eti_in) : null,
        ins_by: params.ins_by || 'system',
        ins_date: new Date(),
      },
      include: {
        event: true,
        asset: { include: { part: true } },
      },
    });

    return this.mapRepairToV1(dbRepair);
  }

  /**
   * Update a repair
   */
  async updateRepair(repairId: number, updates: {
    type_maint?: string;
    how_mal?: string | null;
    when_disc?: string | null;
    action_taken?: string | null;
    narrative?: string;
    tag_no?: string | null;
    doc_no?: string | null;
    micap?: boolean;
    chief_review?: boolean;
    super_review?: boolean;
    repeat_recur?: boolean;
    eti_out?: number | null;
    shop_status?: string;
    stop_date?: string | null;
    chg_by?: string;
  }): Promise<RepairV1 | null> {
    // Calculate eti_delta if eti_out is being set
    let etiDelta: Prisma.Decimal | null = null;
    if (updates.eti_out !== undefined && updates.eti_out !== null) {
      const existing = await prisma.repair.findUnique({ where: { repair_id: repairId } });
      if (existing?.eti_in) {
        etiDelta = new Prisma.Decimal(updates.eti_out).sub(existing.eti_in);
      }
    }

    await prisma.repair.update({
      where: { repair_id: repairId },
      data: {
        ...(updates.type_maint && { type_maint: updates.type_maint }),
        ...(updates.how_mal !== undefined && { how_mal: updates.how_mal }),
        ...(updates.when_disc !== undefined && { when_disc: updates.when_disc }),
        ...(updates.action_taken !== undefined && { action_taken: updates.action_taken }),
        ...(updates.narrative && { narrative: updates.narrative }),
        ...(updates.tag_no !== undefined && { tag_no: updates.tag_no }),
        ...(updates.doc_no !== undefined && { doc_no: updates.doc_no }),
        ...(updates.micap !== undefined && { micap: updates.micap }),
        ...(updates.chief_review !== undefined && { chief_review: updates.chief_review }),
        ...(updates.super_review !== undefined && { super_review: updates.super_review }),
        ...(updates.repeat_recur !== undefined && { repeat_recur: updates.repeat_recur }),
        ...(updates.eti_out !== undefined && { eti_out: updates.eti_out !== null ? new Prisma.Decimal(updates.eti_out) : null }),
        ...(etiDelta && { eti_delta: etiDelta }),
        ...(updates.shop_status && { shop_status: updates.shop_status }),
        ...(updates.stop_date !== undefined && { stop_date: updates.stop_date ? new Date(updates.stop_date) : null }),
        chg_by: updates.chg_by || 'system',
        chg_date: new Date(),
      },
    });

    return this.getRepairById(repairId);
  }

  /**
   * Close a repair
   */
  async closeRepair(repairId: number, params?: {
    eti_out?: number | null;
    chg_by?: string;
  }): Promise<RepairV1 | null> {
    return this.updateRepair(repairId, {
      shop_status: 'closed',
      stop_date: new Date().toISOString(),
      eti_out: params?.eti_out,
      chg_by: params?.chg_by,
    });
  }

  /**
   * Delete a repair
   */
  async deleteRepair(repairId: number): Promise<boolean> {
    try {
      await prisma.repair.delete({ where: { repair_id: repairId } });
      return true;
    } catch {
      return false;
    }
  }

  private mapRepairToV1(dbRepair: any): RepairV1 {
    return {
      repair_id: dbRepair.repair_id,
      event_id: dbRepair.event_id,
      repair_seq: dbRepair.repair_seq,
      asset_id: dbRepair.asset_id || dbRepair.event?.asset_id || 0,
      start_date: formatDateString(dbRepair.start_date),
      stop_date: dbRepair.stop_date ? formatDateString(dbRepair.stop_date) : null,
      type_maint: dbRepair.type_maint || 'Corrective',
      how_mal: dbRepair.how_mal,
      when_disc: dbRepair.when_disc,
      action_taken: null, // Not in DB schema - stored in labor
      shop_status: dbRepair.stop_date ? 'closed' : (dbRepair.shop_status || 'open'),
      narrative: dbRepair.narrative || '',
      tag_no: dbRepair.tag_no,
      doc_no: dbRepair.doc_no,
      micap: dbRepair.micap || false,
      micap_login: dbRepair.micap_login,
      chief_review: dbRepair.chief_review || false,
      chief_review_by: null, // Could track in separate field
      super_review: dbRepair.super_review || false,
      super_review_by: null,
      repeat_recur: dbRepair.repeat_recur || false,
      repeat_recur_by: null,
      donor_asset_id: null, // Cannibalization - not in current schema
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: dbRepair.eti_in ? Number(dbRepair.eti_in) : null,
      eti_out: dbRepair.eti_out ? Number(dbRepair.eti_out) : null,
      eti_delta: dbRepair.eti_delta ? Number(dbRepair.eti_delta) : null,
      meter_changed: dbRepair.eti_change || false,
      created_by_name: dbRepair.ins_by || 'System',
      created_at: formatDateString(dbRepair.ins_date),
    };
  }

  // ==========================================================================
  // LABOR
  // ==========================================================================

  /**
   * Get labor records for a repair
   */
  async getLaborForRepair(repairId: number): Promise<LaborV1[]> {
    const dbLabors = await prisma.labor.findMany({
      where: { repair_id: repairId },
      include: {
        repair: { include: { event: true } },
        asset: { include: { part: true } },
      },
      orderBy: { labor_seq: 'asc' },
    });

    return dbLabors.map(l => this.mapLaborToV1(l));
  }

  /**
   * Get a single labor record by ID
   */
  async getLaborById(laborId: number): Promise<LaborV1 | null> {
    const dbLabor = await prisma.labor.findUnique({
      where: { labor_id: laborId },
      include: {
        repair: { include: { event: true } },
        asset: { include: { part: true } },
      },
    });

    if (!dbLabor) return null;
    return this.mapLaborToV1(dbLabor);
  }

  /**
   * Create a labor record
   */
  async createLabor(params: {
    repair_id: number;
    asset_id?: number;
    action_taken?: string | null;
    how_mal?: string | null;
    when_disc?: string | null;
    type_maint?: string | null;
    cat_labor?: string | null;
    start_date?: string;
    crew_chief?: string | null;
    crew_size?: number | null;
    corrective?: string | null;
    discrepancy?: string | null;
    remarks?: string | null;
    ins_by?: string;
  }): Promise<LaborV1> {
    // Get repair to get asset_id if not provided
    const repair = await prisma.repair.findUnique({ 
      where: { repair_id: params.repair_id },
      include: { event: true }
    });

    // Get next sequence
    const maxSeq = await prisma.labor.aggregate({
      where: { repair_id: params.repair_id },
      _max: { labor_seq: true },
    });
    const nextSeq = (maxSeq._max.labor_seq || 0) + 1;

    const dbLabor = await prisma.labor.create({
      data: {
        repair_id: params.repair_id,
        labor_seq: nextSeq,
        asset_id: params.asset_id || repair?.asset_id || repair?.event?.asset_id,
        action_taken: params.action_taken,
        how_mal: params.how_mal,
        when_disc: params.when_disc,
        type_maint: params.type_maint,
        cat_labor: params.cat_labor,
        start_date: params.start_date ? new Date(params.start_date) : new Date(),
        crew_chief: params.crew_chief,
        crew_size: params.crew_size,
        corrective: params.corrective,
        discrepancy: params.discrepancy,
        remarks: params.remarks,
        ins_by: params.ins_by || 'system',
        ins_date: new Date(),
      },
      include: {
        repair: { include: { event: true } },
        asset: { include: { part: true } },
      },
    });

    return this.mapLaborToV1(dbLabor);
  }

  /**
   * Update a labor record
   */
  async updateLabor(laborId: number, updates: {
    action_taken?: string | null;
    how_mal?: string | null;
    when_disc?: string | null;
    type_maint?: string | null;
    cat_labor?: string | null;
    stop_date?: string | null;
    hours?: number | null;
    crew_chief?: string | null;
    crew_size?: number | null;
    corrective?: string | null;
    discrepancy?: string | null;
    remarks?: string | null;
    corrected_by?: string | null;
    inspected_by?: string | null;
    bit_log?: string | null;
    chg_by?: string;
  }): Promise<LaborV1 | null> {
    await prisma.labor.update({
      where: { labor_id: laborId },
      data: {
        ...(updates.action_taken !== undefined && { action_taken: updates.action_taken }),
        ...(updates.how_mal !== undefined && { how_mal: updates.how_mal }),
        ...(updates.when_disc !== undefined && { when_disc: updates.when_disc }),
        ...(updates.type_maint !== undefined && { type_maint: updates.type_maint }),
        ...(updates.cat_labor !== undefined && { cat_labor: updates.cat_labor }),
        ...(updates.stop_date !== undefined && { stop_date: updates.stop_date ? new Date(updates.stop_date) : null }),
        ...(updates.hours !== undefined && { hours: updates.hours !== null ? new Prisma.Decimal(updates.hours) : null }),
        ...(updates.crew_chief !== undefined && { crew_chief: updates.crew_chief }),
        ...(updates.crew_size !== undefined && { crew_size: updates.crew_size }),
        ...(updates.corrective !== undefined && { corrective: updates.corrective }),
        ...(updates.discrepancy !== undefined && { discrepancy: updates.discrepancy }),
        ...(updates.remarks !== undefined && { remarks: updates.remarks }),
        ...(updates.corrected_by !== undefined && { corrected_by: updates.corrected_by }),
        ...(updates.inspected_by !== undefined && { inspected_by: updates.inspected_by }),
        ...(updates.bit_log !== undefined && { bit_log: updates.bit_log }),
        chg_by: updates.chg_by || 'system',
        chg_date: new Date(),
      },
    });

    return this.getLaborById(laborId);
  }

  /**
   * Delete a labor record
   */
  async deleteLabor(laborId: number): Promise<boolean> {
    try {
      await prisma.labor.delete({ where: { labor_id: laborId } });
      return true;
    } catch {
      return false;
    }
  }

  private mapLaborToV1(dbLabor: any): LaborV1 {
    return {
      labor_id: dbLabor.labor_id,
      repair_id: dbLabor.repair_id,
      labor_seq: dbLabor.labor_seq,
      asset_id: dbLabor.asset_id || dbLabor.repair?.asset_id || dbLabor.repair?.event?.asset_id || 0,
      action_taken: dbLabor.action_taken,
      how_mal: dbLabor.how_mal,
      when_disc: dbLabor.when_disc,
      type_maint: dbLabor.type_maint,
      cat_labor: dbLabor.cat_labor,
      start_date: formatDateString(dbLabor.start_date),
      stop_date: dbLabor.stop_date ? formatDateString(dbLabor.stop_date) : null,
      hours: dbLabor.hours ? Number(dbLabor.hours) : null,
      crew_chief: dbLabor.crew_chief,
      crew_size: dbLabor.crew_size,
      corrective: dbLabor.corrective,
      discrepancy: dbLabor.discrepancy,
      remarks: dbLabor.remarks,
      corrected_by: dbLabor.corrected_by,
      inspected_by: dbLabor.inspected_by,
      bit_log: dbLabor.bit_log,
      sent_imds: dbLabor.sent_imds || false,
      valid: dbLabor.valid || false,
      created_by: 0, // Not tracked in DB
      created_by_name: dbLabor.ins_by || 'System',
      created_at: formatDateTime(dbLabor.ins_date),
    };
  }

  // ==========================================================================
  // LABOR PARTS (Installed/Removed/Worked Parts)
  // ==========================================================================

  /**
   * Get labor parts for a labor record
   */
  async getLaborParts(laborId: number): Promise<LaborPartV1[]> {
    const dbParts = await prisma.laborPart.findMany({
      where: { labor_id: laborId },
      include: {
        labor: { include: { repair: { include: { event: true } } } },
        asset: { include: { part: true } },
      },
    });

    return dbParts.map(p => this.mapLaborPartToV1(p));
  }

  /**
   * Get installed parts for a repair (backwards compatibility)
   */
  async getInstalledPartsForRepair(repairId: number): Promise<InstalledPartV1[]> {
    // Get all labors for this repair, then their installed parts
    const parts = await prisma.laborPart.findMany({
      where: {
        labor: { repair_id: repairId },
        part_action: 'INSTALLED',
      },
      include: {
        labor: { include: { repair: { include: { event: true } } } },
        asset: { include: { part: true } },
      },
    });

    return parts.map(p => ({
      installed_part_id: p.labor_part_id,
      repair_id: p.labor.repair_id,
      labor_id: p.labor_id,
      event_id: p.labor.repair.event_id,
      asset_id: p.asset_id || 0,
      asset_sn: p.asset?.serno || 'Unknown',
      asset_pn: p.asset?.part?.partno || 'Unknown',
      asset_name: p.asset?.part?.noun || 'Unknown',
      installation_date: formatDateString(p.ins_date),
      installation_notes: null,
      previous_location: null,
      installed_by: 0,
      installed_by_name: p.ins_by || 'System',
      created_at: formatDateTime(p.ins_date),
    }));
  }

  /**
   * Get removed parts for a repair (backwards compatibility)
   */
  async getRemovedPartsForRepair(repairId: number): Promise<RemovedPartV1[]> {
    const parts = await prisma.laborPart.findMany({
      where: {
        labor: { repair_id: repairId },
        part_action: 'REMOVED',
      },
      include: {
        labor: { include: { repair: { include: { event: true } } } },
        asset: { include: { part: true } },
      },
    });

    return parts.map(p => ({
      removed_part_id: p.labor_part_id,
      repair_id: p.labor.repair_id,
      labor_id: p.labor_id,
      event_id: p.labor.repair.event_id,
      asset_id: p.asset_id || 0,
      asset_sn: p.asset?.serno || 'Unknown',
      asset_pn: p.asset?.part?.partno || 'Unknown',
      asset_name: p.asset?.part?.noun || 'Unknown',
      removal_date: formatDateString(p.ins_date),
      removal_reason: p.how_mal,
      removal_notes: null,
      new_status: null,
      removed_by: 0,
      removed_by_name: p.ins_by || 'System',
      created_at: formatDateTime(p.ins_date),
    }));
  }

  /**
   * Add a labor part (installed, removed, or worked)
   */
  async addLaborPart(params: {
    labor_id: number;
    asset_id: number;
    part_action: 'INSTALLED' | 'REMOVED' | 'WORKED';
    how_mal?: string | null;
    is_pqdr?: boolean;
    dr_num?: string | null;
    qty?: number;
    ins_by?: string;
  }): Promise<LaborPartV1> {
    const dbPart = await prisma.laborPart.create({
      data: {
        labor_id: params.labor_id,
        asset_id: params.asset_id,
        part_action: params.part_action,
        how_mal: params.how_mal,
        is_pqdr: params.is_pqdr || false,
        dr_num: params.dr_num,
        qty: params.qty || 1,
        ins_by: params.ins_by || 'system',
        ins_date: new Date(),
      },
      include: {
        labor: { include: { repair: { include: { event: true } } } },
        asset: { include: { part: true } },
      },
    });

    return this.mapLaborPartToV1(dbPart);
  }

  /**
   * Delete a labor part
   */
  async deleteLaborPart(laborPartId: number): Promise<boolean> {
    try {
      await prisma.laborPart.delete({ where: { labor_part_id: laborPartId } });
      return true;
    } catch {
      return false;
    }
  }

  private mapLaborPartToV1(p: any): LaborPartV1 {
    return {
      labor_part_id: p.labor_part_id,
      labor_id: p.labor_id,
      repair_id: p.labor?.repair_id || 0,
      event_id: p.labor?.repair?.event_id || 0,
      asset_id: p.asset_id || 0,
      asset_sn: p.asset?.serno || 'Unknown',
      asset_pn: p.asset?.part?.partno || 'Unknown',
      asset_name: p.asset?.part?.noun || 'Unknown',
      part_action: p.part_action || 'WORKED',
      how_mal: p.how_mal,
      is_pqdr: p.is_pqdr || false,
      dr_num: p.dr_num,
      qty: p.qty || 1,
      installed_by_name: p.part_action === 'INSTALLED' ? (p.ins_by || 'System') : undefined,
      removed_by_name: p.part_action === 'REMOVED' ? (p.ins_by || 'System') : undefined,
      installation_date: p.part_action === 'INSTALLED' ? formatDateString(p.ins_date) : undefined,
      removal_date: p.part_action === 'REMOVED' ? formatDateString(p.ins_date) : undefined,
      created_at: formatDateTime(p.ins_date),
    };
  }

  // ==========================================================================
  // UTILITY
  // ==========================================================================

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

  /**
   * Check if user has access to an event (by program and location)
   */
  async checkEventAccess(eventId: number, userProgramIds: number[], userLocationIds: number[], isAdmin: boolean): Promise<{ hasAccess: boolean; reason?: string }> {
    const event = await prisma.event.findUnique({
      where: { event_id: eventId },
      include: {
        asset: { include: { part: true } },
      },
    });

    if (!event) {
      return { hasAccess: false, reason: 'Event not found' };
    }

    const eventProgramId = event.asset?.part?.pgm_id;
    if (eventProgramId && !userProgramIds.includes(eventProgramId)) {
      return { hasAccess: false, reason: 'Access denied - program not authorized' };
    }

    if (!isAdmin && event.loc_id && userLocationIds.length > 0 && !userLocationIds.includes(event.loc_id)) {
      return { hasAccess: false, reason: 'Access denied - location not authorized' };
    }

    return { hasAccess: true };
  }
}

// Export singleton
export const maintenanceData = new MaintenanceDataService();
