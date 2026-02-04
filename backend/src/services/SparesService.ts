/**
 * SparesService
 * =============
 * Spare parts pool management - tracking serviceable spares available for use.
 * Spares are parts in inventory not yet assigned to an asset configuration.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SpareCreateData {
  pgmId: number;
  partno: string;
  serno: string;
  status?: string;
  locationId?: number;
  warrantyExp?: Date;
  mfgDate?: Date;
  unitPrice?: number;
  remarks?: string;
  userId: string;
}

export class SparesService {

  /**
   * Create a new spare
   */
  async createSpare(data: SpareCreateData): Promise<any> {
    const spare = await prisma.spare.create({
      data: {
        pgm_id: data.pgmId,
        partno: data.partno,
        serno: data.serno,
        status: data.status || "AVAILABLE",
        loc_id: data.locationId,
        warranty_exp: data.warrantyExp,
        mfg_date: data.mfgDate,
        unit_price: data.unitPrice,
        remarks: data.remarks,
        active: true,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: {
        program: true,
        location: true,
      },
    });

    console.log(`[SPARES] Created spare ${spare.partno} / ${spare.serno}`);
    return spare;
  }

  /**
   * Update a spare
   */
  async updateSpare(spareId: number, data: Partial<SpareCreateData>): Promise<any> {
    return prisma.spare.update({
      where: { spare_id: spareId },
      data: {
        status: data.status,
        loc_id: data.locationId,
        warranty_exp: data.warrantyExp,
        unit_price: data.unitPrice,
        remarks: data.remarks,
        chg_by: data.userId,
        chg_date: new Date(),
      },
      include: { location: true },
    });
  }

  /**
   * Delete/deactivate a spare
   */
  async deleteSpare(spareId: number, userId: string): Promise<void> {
    await prisma.spare.update({
      where: { spare_id: spareId },
      data: { active: false, chg_by: userId, chg_date: new Date() },
    });
  }

  /**
   * Issue spare (convert to asset)
   */
  async issueSpare(spareId: number, assetData: {
    nhaAssetId?: number;
    locationId: number;
    userId: string;
  }): Promise<any> {
    const spare = await prisma.spare.findUnique({
      where: { spare_id: spareId },
    });

    if (!spare) throw new Error("Spare not found");
    if (spare.status !== "AVAILABLE") throw new Error("Spare not available");

    // Find or create part
    let part = await prisma.partList.findFirst({
      where: { partno: spare.partno, pgm_id: spare.pgm_id },
    });

    if (!part) {
      part = await prisma.partList.create({
        data: {
          partno: spare.partno, pgm_id: spare.pgm_id,
          
          ins_by: assetData.userId,
          ins_date: new Date(),
        },
      });
    }

    // Create asset from spare
    const asset = await prisma.asset.create({
      data: {
        
        partno_id: part.partno_id,
        serno: spare.serno,
        status_cd: "FMC",
        nha_asset_id: assetData.nhaAssetId,
        loc_ida: assetData.locationId,
        loc_idc: assetData.locationId,
        active: true,
        ins_by: assetData.userId,
        ins_date: new Date(),
      },
      include: { part: true, currentLocation: true },
    });

    // Mark spare as issued
    await prisma.spare.update({
      where: { spare_id: spareId },
      data: { 
        status: "ISSUED",
        chg_by: assetData.userId,
        chg_date: new Date(),
      },
    });

    console.log(`[SPARES] Issued spare ${spare.serno} as asset ${asset.asset_id}`);
    return asset;
  }

  /**
   * Search spares
   */
  async searchSpares(params: {
    pgmId?: number;
    locationId?: number;
    partno?: string;
    serno?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ spares: any[]; total: number }> {
    const whereClause: any = { active: true };

    if (params.pgmId) whereClause.pgm_id = params.pgmId;
    if (params.locationId) whereClause.loc_id = params.locationId;
    if (params.status) whereClause.status = params.status;
    if (params.partno) {
      whereClause.partno = { contains: params.partno, mode: "insensitive" };
    }
    if (params.serno) {
      whereClause.serno = { contains: params.serno, mode: "insensitive" };
    }

    const [spares, total] = await Promise.all([
      prisma.spare.findMany({
        where: whereClause,
        include: { program: true, location: true },
        orderBy: { partno: "asc" },
        take: params.limit || 50,
        skip: params.offset || 0,
      }),
      prisma.spare.count({ where: whereClause }),
    ]);

    return { spares, total };
  }

  /**
   * Get available spares for a part number
   */
  async getAvailableSpares(partno: string, locationId?: number): Promise<any[]> {
    const whereClause: any = {
      partno,
      status: "AVAILABLE",
      active: true,
    };

    if (locationId) whereClause.loc_id = locationId;

    return prisma.spare.findMany({
      where: whereClause,
      include: { location: true },
      orderBy: { ins_date: "asc" },
    });
  }

  /**
   * Get spare by ID
   */
  async getSpare(spareId: number): Promise<any> {
    return prisma.spare.findUnique({
      where: { spare_id: spareId },
      include: { program: true, location: true },
    });
  }

  /**
   * Get spares inventory summary by location
   */
  async getSparesSummary(locationId: number): Promise<any[]> {
    const spares = await prisma.spare.groupBy({
      by: ["partno", "status"],
      where: { loc_id: locationId, active: true },
      _count: { spare_id: true },
    });

    const summaryMap = new Map<string, any>();
    for (const row of spares) {
      if (!summaryMap.has(row.partno)) {
        summaryMap.set(row.partno, {
          partno: row.partno,
          available: 0,
          reserved: 0,
          issued: 0,
          total: 0,
        });
      }
      const summary = summaryMap.get(row.partno);
      summary.total += row._count.spare_id;
      if (row.status === "AVAILABLE") summary.available = row._count.spare_id;
      if (row.status === "RESERVED") summary.reserved = row._count.spare_id;
      if (row.status === "ISSUED") summary.issued = row._count.spare_id;
    }

    return Array.from(summaryMap.values()).sort((a, b) => a.partno.localeCompare(b.partno));
  }

  /**
   * Reserve a spare for an order
   */
  async reserveSpare(spareId: number, orderId: number, userId: string): Promise<any> {
    const spare = await prisma.spare.findUnique({ where: { spare_id: spareId } });
    
    if (!spare) throw new Error("Spare not found");
    if (spare.status !== "AVAILABLE") throw new Error("Spare not available");

    return prisma.spare.update({
      where: { spare_id: spareId },
      data: {
        status: "RESERVED",
        remarks: `Reserved for order ${orderId}`,
        chg_by: userId,
        chg_date: new Date(),
      },
    });
  }

  /**
   * Unreserve a spare
   */
  async unreserveSpare(spareId: number, userId: string): Promise<any> {
    return prisma.spare.update({
      where: { spare_id: spareId },
      data: {
        status: "AVAILABLE",
        remarks: null,
        chg_by: userId,
        chg_date: new Date(),
      },
    });
  }
}

export const sparesService = new SparesService();
