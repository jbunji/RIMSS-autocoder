/**
 * ReportsService
 * ==============
 * Generate reports and dashboard data.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ReportsService {

  /**
   * Get dashboard summary for a location
   */
  async getLocationDashboard(locationId: number): Promise<any> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      assetStats,
      openEvents,
      overdueItems,
      recentActivity
    ] = await Promise.all([
      // Asset status breakdown
      prisma.asset.groupBy({
        by: ["status_cd"],
        where: {
          active: true,
          OR: [{ loc_ida: locationId }, { loc_idc: locationId }],
        },
        _count: { asset_id: true },
      }),
      // Open maintenance events
      prisma.event.count({
        where: { loc_id: locationId, stop_job: null },
      }),
      // Overdue items
      Promise.all([
        prisma.assetInspection.count({
          where: {
            complete_date: null,
            next_due_date: { lt: now },
            asset: { OR: [{ loc_ida: locationId }, { loc_idc: locationId }] },
          },
        }),
        prisma.tctoAsset.count({
          where: {
            complete_date: null,
            tcto: { eff_date: { lt: now } },
            asset: { OR: [{ loc_ida: locationId }, { loc_idc: locationId }] },
          },
        }),
      ]),
      // Recent events
      prisma.event.findMany({
        where: { loc_id: locationId, ins_date: { gte: weekAgo } },
        orderBy: { ins_date: "desc" },
        take: 10,
        include: { asset: { include: { part: true } } },
      }),
    ]);

    const statusBreakdown: Record<string, number> = {};
    let totalAssets = 0;
    for (const row of assetStats) {
      statusBreakdown[row.status_cd || "UNKNOWN"] = row._count.asset_id;
      totalAssets += row._count.asset_id;
    }

    return {
      assets: { total: totalAssets, byStatus: statusBreakdown },
      maintenance: { openEvents },
      overdue: { pmi: overdueItems[0], tcto: overdueItems[1] },
      recentActivity,
    };
  }

  /**
   * Get program-wide status report
   */
  async getProgramStatusReport(pgmId: number): Promise<any> {
    const [assets, events, locations] = await Promise.all([
      prisma.asset.groupBy({
        by: ["status_cd"],
        where: { pgm_id: pgmId, active: true },
        _count: { asset_id: true },
      }),
      prisma.event.groupBy({
        by: ["loc_id"],
        where: { 
          asset: { pgm_id: pgmId },
          stop_job: null,
        },
        _count: { event_id: true },
      }),
      prisma.location.findMany({
        where: { programLocations: { some: { pgm_id: pgmId } } },
        select: { loc_id: true, display_name: true },
      }),
    ]);

    const locMap = new Map(locations.map(l => [l.loc_id, l.display_name]));

    return {
      assetStatus: assets.map(a => ({ status: a.status_cd, count: a._count.asset_id })),
      openEventsByLocation: events.map(e => ({
        locationId: e.loc_id,
        locationName: locMap.get(e.loc_id!) || "Unknown",
        openEvents: e._count.event_id,
      })),
    };
  }

  /**
   * Get maintenance backlog report
   */
  async getBacklogReport(params: {
    locationId?: number;
    pgmId?: number;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<any[]> {
    const whereClause: any = { stop_job: null };
    
    if (params.locationId) whereClause.loc_id = params.locationId;
    if (params.pgmId) whereClause.asset = { pgm_id: params.pgmId };
    if (params.fromDate || params.toDate) {
      whereClause.start_job = {};
      if (params.fromDate) whereClause.start_job.gte = params.fromDate;
      if (params.toDate) whereClause.start_job.lte = params.toDate;
    }

    return prisma.event.findMany({
      where: whereClause,
      include: {
        asset: { include: { part: true } },
        location: true,
        repairs: { where: { stop_date: null } },
      },
      orderBy: { start_job: "asc" },
    });
  }

  /**
   * Get PMI compliance report
   */
  async getPmiComplianceReport(locationId: number): Promise<any> {
    const now = new Date();
    const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const pmis = await prisma.assetInspection.findMany({
      where: {
        complete_date: null,
        valid: true,
        asset: {
          active: true,
          OR: [{ loc_ida: locationId }, { loc_idc: locationId }],
        },
      },
      include: {
        asset: { include: { part: true } },
      },
      orderBy: { next_due_date: "asc" },
    });

    const overdue = pmis.filter(p => p.next_due_date && p.next_due_date < now);
    const dueSoon = pmis.filter(p => 
      p.next_due_date && p.next_due_date >= now && p.next_due_date <= soon
    );
    const current = pmis.filter(p => !p.next_due_date || p.next_due_date > soon);

    return {
      summary: {
        total: pmis.length,
        overdue: overdue.length,
        dueSoon: dueSoon.length,
        current: current.length,
      },
      overdue,
      dueSoon,
    };
  }

  /**
   * Get TCTO compliance report
   */
  async getTctoComplianceReport(pgmId: number): Promise<any> {
    const tctos = await prisma.tcto.findMany({
      where: { pgm_id: pgmId, active: true },
      include: {
        tctoAssets: {
          include: {
            asset: { include: { part: true, currentLocation: true } },
          },
        },
      },
    });

    return tctos.map(tcto => {
      const total = tcto.tctoAssets.length;
      const completed = tcto.tctoAssets.filter(a => a.complete_date).length;
      const validated = tcto.tctoAssets.filter(a => a.valid).length;

      return {
        tctoId: tcto.tcto_id,
        tctoNo: tcto.tcto_no,
        effDate: tcto.eff_date,
        compliance: {
          total,
          completed,
          validated,
          pending: total - completed,
          percentComplete: total > 0 ? Math.round((completed / total) * 100) : 100,
        },
        pendingAssets: tcto.tctoAssets
          .filter(a => !a.complete_date)
          .map(a => ({
            assetId: a.asset_id,
            serno: a.asset.serno,
            location: a.asset.currentLocation?.display_name,
          })),
      };
    });
  }

  /**
   * Get parts ordering summary
   */
  async getPartsOrderingSummary(locationId: number): Promise<any> {
    const orders = await prisma.partsOrder.groupBy({
      by: ["status"],
      where: { loc_id: locationId },
      _count: { order_id: true },
    });

    const statusCounts: Record<string, number> = {};
    for (const row of orders) {
      statusCounts[row.status] = row._count.order_id;
    }

    const micapOrders = await prisma.partsOrder.findMany({
      where: { loc_id: locationId, priority: "MICAP", status: { not: "ISSUED" } },
      include: { part: true },
    });

    return {
      bystatus: statusCounts,
      micapPending: micapOrders,
    };
  }
}

export const reportsService = new ReportsService();
