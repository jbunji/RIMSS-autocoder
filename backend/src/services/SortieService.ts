/**
 * SortieService
 * =============
 * Flight sortie management for tracking pod/asset usage during missions.
 * 
 * Features:
 * - Create/edit/delete sorties
 * - Link sorties to assets and maintenance events
 * - Import sorties from CSV/file
 * - Search and filter sorties
 * - Validate sortie data
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export interface SortieCreateData {
  pgmId: number;
  assetId?: number;
  missionId?: string;
  serno?: string;
  acTailno?: string;
  sortieDate?: Date;
  sortieEffect?: string;
  acStation?: string;
  acType?: string;
  currentUnit?: string;
  assignedUnit?: string;
  range?: string;
  reason?: string;
  remarks?: string;
  sourceData?: string;
  isNonPodded?: boolean;
  isDebrief?: boolean;
  isLiveMonitor?: boolean;
  userId: string;
}

export interface SortieSearchParams {
  pgmId: number;
  serno?: string;
  missionId?: string;
  sortieDate?: Date;
  dateFrom?: Date;
  dateTo?: Date;
  locId?: number;
  isNonPodded?: boolean;
  acTailno?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// SERVICE
// ============================================================================

export class SortieService {

  /**
   * Create a new sortie
   */
  async createSortie(data: SortieCreateData): Promise<any> {
    // If serno provided but no assetId, try to find the asset
    let assetId = data.assetId;
    if (!assetId && data.serno) {
      const asset = await prisma.asset.findFirst({
        where: { serno: data.serno, part: { pgm_id: data.pgmId }, active: true },
      });
      assetId = asset?.asset_id;
    }

    const sortie = await prisma.sortie.create({
      data: {
        pgm_id: data.pgmId,
        asset_id: assetId,
        mission_id: data.missionId,
        serno: data.serno,
        ac_tailno: data.acTailno,
        sortie_date: data.sortieDate || new Date(),
        sortie_effect: data.sortieEffect,
        ac_station: data.acStation,
        ac_type: data.acType,
        current_unit: data.currentUnit,
        assigned_unit: data.assignedUnit,
        range: data.range,
        reason: data.reason,
        remarks: data.remarks,
        source_data: data.sourceData,
        is_non_podded: data.isNonPodded || false,
        is_debrief: data.isDebrief || false,
        is_live_monitor: data.isLiveMonitor || false,
        valid: false,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: {
        program: true,
        asset: { include: { part: true } },
      },
    });

    console.log(`[SORTIE] Created sortie ${sortie.sortie_id} for mission ${data.missionId || "N/A"}`);

    return sortie;
  }

  /**
   * Update a sortie
   */
  async updateSortie(sortieId: number, data: Partial<SortieCreateData>): Promise<any> {
    const sortie = await prisma.sortie.update({
      where: { sortie_id: sortieId },
      data: {
        mission_id: data.missionId,
        serno: data.serno,
        ac_tailno: data.acTailno,
        sortie_date: data.sortieDate,
        sortie_effect: data.sortieEffect,
        ac_station: data.acStation,
        ac_type: data.acType,
        current_unit: data.currentUnit,
        assigned_unit: data.assignedUnit,
        range: data.range,
        reason: data.reason,
        remarks: data.remarks,
        is_non_podded: data.isNonPodded,
        is_debrief: data.isDebrief,
        is_live_monitor: data.isLiveMonitor,
        chg_by: data.userId,
        chg_date: new Date(),
      },
      include: {
        program: true,
        asset: { include: { part: true } },
      },
    });

    return sortie;
  }

  /**
   * Delete a sortie
   */
  async deleteSortie(sortieId: number): Promise<void> {
    // Check if sortie is linked to any events
    const linkedEvents = await prisma.event.count({
      where: { sortie_id: sortieId },
    });

    if (linkedEvents > 0) {
      throw new Error(`Cannot delete sortie - linked to ${linkedEvents} maintenance event(s)`);
    }

    await prisma.sortie.delete({
      where: { sortie_id: sortieId },
    });

    console.log(`[SORTIE] Deleted sortie ${sortieId}`);
  }

  /**
   * Validate a sortie (supervisor sign-off)
   */
  async validateSortie(sortieId: number, userId: string): Promise<any> {
    const sortie = await prisma.sortie.update({
      where: { sortie_id: sortieId },
      data: {
        valid: true,
        val_by: userId,
        val_date: new Date(),
        chg_by: userId,
        chg_date: new Date(),
      },
      include: {
        asset: true,
      },
    });

    console.log(`[SORTIE] Validated sortie ${sortieId}`);

    return sortie;
  }

  /**
   * Link sortie to a maintenance event
   */
  async linkToEvent(sortieId: number, eventId: number, userId: string): Promise<any> {
    const event = await prisma.event.update({
      where: { event_id: eventId },
      data: {
        sortie_id: sortieId,
        chg_by: userId,
        chg_date: new Date(),
      },
      include: {
        sortie: true,
      },
    });

    console.log(`[SORTIE] Linked sortie ${sortieId} to event ${eventId}`);

    return event;
  }

  /**
   * Import sorties from parsed data (from CSV/file)
   */
  async importSorties(params: {
    pgmId: number;
    sorties: Partial<SortieCreateData>[];
    userId: string;
  }): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    const result = {
      imported: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const sortieData of params.sorties) {
      try {
        // Check for duplicate by mission_id + sortie_date
        if (sortieData.missionId && sortieData.sortieDate) {
          const existing = await prisma.sortie.findFirst({
            where: {
              pgm_id: params.pgmId,
              mission_id: sortieData.missionId,
              sortie_date: sortieData.sortieDate,
            },
          });

          if (existing) {
            result.skipped++;
            continue;
          }
        }

        await this.createSortie({
          ...sortieData,
          pgmId: params.pgmId,
          userId: params.userId,
        });

        result.imported++;
      } catch (error: any) {
        result.errors.push(`Row ${result.imported + result.skipped + 1}: ${error.message}`);
      }
    }

    console.log(`[SORTIE] Import complete: ${result.imported} imported, ${result.skipped} skipped`);

    return result;
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Get a sortie by ID
   */
  async getSortie(sortieId: number): Promise<any> {
    return prisma.sortie.findUnique({
      where: { sortie_id: sortieId },
      include: {
        program: true,
        asset: { include: { part: true, currentLocation: true } },
        events: { include: { repairs: true } },
      },
    });
  }

  /**
   * Search sorties
   */
  async searchSorties(params: SortieSearchParams): Promise<{
    sorties: any[];
    total: number;
  }> {
    const whereClause: any = {
      pgm_id: params.pgmId,
    };

    if (params.serno) {
      whereClause.serno = { contains: params.serno, mode: "insensitive" };
    }

    if (params.missionId) {
      whereClause.mission_id = { contains: params.missionId, mode: "insensitive" };
    }

    if (params.acTailno) {
      whereClause.ac_tailno = { contains: params.acTailno, mode: "insensitive" };
    }

    if (params.sortieDate) {
      whereClause.sortie_date = params.sortieDate;
    } else if (params.dateFrom || params.dateTo) {
      whereClause.sortie_date = {};
      if (params.dateFrom) whereClause.sortie_date.gte = params.dateFrom;
      if (params.dateTo) whereClause.sortie_date.lte = params.dateTo;
    }

    if (params.isNonPodded !== undefined) {
      whereClause.is_non_podded = params.isNonPodded;
    }

    if (params.locId) {
      whereClause.asset = {
        OR: [
          { loc_ida: params.locId },
          { loc_idc: params.locId },
        ],
      };
    }

    const [sorties, total] = await Promise.all([
      prisma.sortie.findMany({
        where: whereClause,
        include: {
          asset: { include: { part: true } },
          events: { select: { event_id: true, job_no: true } },
        },
        orderBy: { sortie_date: "desc" },
        take: params.limit || 50,
        skip: params.offset || 0,
      }),
      prisma.sortie.count({ where: whereClause }),
    ]);

    return { sorties, total };
  }

  /**
   * Get sorties for an asset
   */
  async getSortiesForAsset(assetId: number, limit: number = 50): Promise<any[]> {
    return prisma.sortie.findMany({
      where: { asset_id: assetId },
      include: {
        events: { select: { event_id: true, job_no: true } },
      },
      orderBy: { sortie_date: "desc" },
      take: limit,
    });
  }

  /**
   * Get recent sorties for a program
   */
  async getRecentSorties(pgmId: number, days: number = 30): Promise<any[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.sortie.findMany({
      where: {
        pgm_id: pgmId,
        sortie_date: { gte: since },
      },
      include: {
        asset: { include: { part: true } },
      },
      orderBy: { sortie_date: "desc" },
    });
  }

  /**
   * Get sortie statistics for a program
   */
  async getSortieStats(pgmId: number, dateFrom?: Date, dateTo?: Date): Promise<{
    total: number;
    validated: number;
    nonPodded: number;
    debrief: number;
    liveMonitor: number;
    byAircraft: Array<{ ac_tailno: string; count: number }>;
  }> {
    const whereClause: any = { pgm_id: pgmId };
    
    if (dateFrom || dateTo) {
      whereClause.sortie_date = {};
      if (dateFrom) whereClause.sortie_date.gte = dateFrom;
      if (dateTo) whereClause.sortie_date.lte = dateTo;
    }

    const [total, validated, nonPodded, debrief, liveMonitor, byAircraft] = await Promise.all([
      prisma.sortie.count({ where: whereClause }),
      prisma.sortie.count({ where: { ...whereClause, valid: true } }),
      prisma.sortie.count({ where: { ...whereClause, is_non_podded: true } }),
      prisma.sortie.count({ where: { ...whereClause, is_debrief: true } }),
      prisma.sortie.count({ where: { ...whereClause, is_live_monitor: true } }),
      prisma.sortie.groupBy({
        by: ["ac_tailno"],
        where: { ...whereClause, ac_tailno: { not: null } },
        _count: { sortie_id: true },
        orderBy: { _count: { sortie_id: "desc" } },
        take: 10,
      }),
    ]);

    return {
      total,
      validated,
      nonPodded,
      debrief,
      liveMonitor,
      byAircraft: byAircraft.map(a => ({
        ac_tailno: a.ac_tailno || "Unknown",
        count: a._count.sortie_id,
      })),
    };
  }

  /**
   * Get unvalidated sorties needing review
   */
  async getUnvalidatedSorties(pgmId: number): Promise<any[]> {
    return prisma.sortie.findMany({
      where: {
        pgm_id: pgmId,
        valid: false,
      },
      include: {
        asset: { include: { part: true } },
      },
      orderBy: { sortie_date: "desc" },
    });
  }
}

// Export singleton
export const sortieService = new SortieService();
