/**
 * PmiService
 * ==========
 * Preventive Maintenance Inspection scheduling and tracking.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PmiScheduleData {
  assetId: number;
  pmiType: string;
  nextDueDate?: Date;
  nextDueEtm?: number;
  wucCd?: string;
  userId: string;
}

export class PmiService {

  /**
   * Schedule a PMI for an asset
   */
  async schedulePmi(data: PmiScheduleData): Promise<any> {
    const pmi = await prisma.assetInspection.create({
      data: {
        asset_id: data.assetId,
        pmi_type: data.pmiType,
        next_due_date: data.nextDueDate,
        next_due_etm: data.nextDueEtm,
        wuc_cd: data.wucCd || "0",
        valid: true,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: {
        asset: { include: { part: true } },
      },
    });

    console.log(`[PMI] Scheduled ${data.pmiType} PMI for asset ${pmi.asset.serno}`);
    return pmi;
  }

  /**
   * Complete a PMI
   */
  async completePmi(histId: number, completedBy: string, repairId?: number): Promise<any> {
    return prisma.assetInspection.update({
      where: { hist_id: histId },
      data: {
        complete_date: new Date(),
        completed_by: completedBy,
        repair_id: repairId,
        chg_by: completedBy,
        chg_date: new Date(),
      },
      include: {
        asset: { include: { part: true } },
      },
    });
  }

  /**
   * Get upcoming PMIs for a location
   */
  async getUpcomingPmis(locationId: number, days: number = 30): Promise<any[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.assetInspection.findMany({
      where: {
        complete_date: null,
        next_due_date: { lte: futureDate },
        asset: {
          OR: [{ loc_ida: locationId }, { loc_idc: locationId }],
        },
      },
      include: {
        asset: { include: { part: true, currentLocation: true } },
      },
      orderBy: { next_due_date: "asc" },
    });
  }

  /**
   * Get overdue PMIs for a location
   */
  async getOverduePmis(locationId: number): Promise<any[]> {
    return prisma.assetInspection.findMany({
      where: {
        complete_date: null,
        next_due_date: { lt: new Date() },
        asset: {
          OR: [{ loc_ida: locationId }, { loc_idc: locationId }],
        },
      },
      include: {
        asset: { include: { part: true } },
      },
      orderBy: { next_due_date: "asc" },
    });
  }

  /**
   * Get PMI history for an asset
   */
  async getAssetPmiHistory(assetId: number): Promise<any[]> {
    return prisma.assetInspection.findMany({
      where: { asset_id: assetId },
      orderBy: { ins_date: "desc" },
      take: 50,
    });
  }

  /**
   * Get PMI status for a program
   */
  async getPmiStatusForProgram(pgmId: number): Promise<{
    total: number;
    overdue: number;
    upcoming: number;
    completed: number;
  }> {
    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);

    const baseWhere = {
      asset: { part: { pgm_id: pgmId } },
    };

    const [total, overdue, upcoming, completed] = await Promise.all([
      prisma.assetInspection.count({ where: baseWhere }),
      prisma.assetInspection.count({
        where: { ...baseWhere, complete_date: null, next_due_date: { lt: today } },
      }),
      prisma.assetInspection.count({
        where: {
          ...baseWhere,
          complete_date: null,
          next_due_date: { gte: today, lte: thirtyDays },
        },
      }),
      prisma.assetInspection.count({
        where: { ...baseWhere, complete_date: { not: null } },
      }),
    ]);

    return { total, overdue, upcoming, completed };
  }

  /**
   * Reschedule a PMI
   */
  async reschedulePmi(histId: number, newDueDate: Date, userId: string): Promise<any> {
    return prisma.assetInspection.update({
      where: { hist_id: histId },
      data: {
        next_due_date: newDueDate,
        chg_by: userId,
        chg_date: new Date(),
      },
    });
  }
}

export const pmiService = new PmiService();
