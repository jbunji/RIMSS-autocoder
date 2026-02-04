/**
 * InventoryService
 * ================
 * Asset inventory management - search, export, validation.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface InventorySearchParams {
  pgmId?: number;
  locationId?: number;
  partnoId?: number;
  serno?: string;
  partno?: string;
  statusCd?: string;
  nhaAssetId?: number;
  inTransit?: boolean;
  active?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export class InventoryService {

  async searchInventory(params: InventorySearchParams): Promise<{
    assets: any[];
    total: number;
    stats: { fmc: number; nmcm: number; nmcs: number; inTransit: number };
  }> {
    const whereClause: any = {};

    if (params.pgmId) whereClause.part = { pgm_id: params.pgmId };
    if (params.locationId) {
      whereClause.OR = [
        { loc_ida: params.locationId },
        { loc_idc: params.locationId },
      ];
    }
    if (params.partnoId) whereClause.partno_id = params.partnoId;
    if (params.nhaAssetId) whereClause.nha_asset_id = params.nhaAssetId;
    if (params.statusCd) whereClause.status_cd = params.statusCd;
    if (params.inTransit !== undefined) whereClause.in_transit = params.inTransit;
    if (params.active !== undefined) whereClause.active = params.active;
    else whereClause.active = true;

    if (params.serno) {
      whereClause.serno = { contains: params.serno, mode: "insensitive" };
    }
    if (params.partno) {
      whereClause.part = { ...whereClause.part, partno: { contains: params.partno, mode: "insensitive" } };
    }

    const orderBy: any = {};
    if (params.sortBy) {
      orderBy[params.sortBy] = params.sortOrder || "asc";
    } else {
      orderBy.serno = "asc";
    }

    const [assets, total, fmc, nmcm, nmcs, inTransit] = await Promise.all([
      prisma.asset.findMany({
        where: whereClause,
        include: {
          part: true,
          assignedLocation: true,
          currentLocation: true,
          nhaAsset: { include: { part: true } },
          cfgSet: true,
        },
        orderBy,
        take: params.limit || 50,
        skip: params.offset || 0,
      }),
      prisma.asset.count({ where: whereClause }),
      prisma.asset.count({ where: { ...whereClause, status_cd: "FMC" } }),
      prisma.asset.count({ where: { ...whereClause, status_cd: "NMCM" } }),
      prisma.asset.count({ where: { ...whereClause, status_cd: "NMCS" } }),
      prisma.asset.count({ where: { ...whereClause, in_transit: true } }),
    ]);

    return { assets, total, stats: { fmc, nmcm, nmcs, inTransit } };
  }

  async exportInventory(params: InventorySearchParams): Promise<string> {
    const { assets } = await this.searchInventory({ ...params, limit: 10000, offset: 0 });

    const fields = ["serno", "partno", "noun", "status_cd", "location", "nha_serno", "in_transit", "eti"];
    const header = fields.join(",");

    const rows = assets.map(asset => {
      return fields.map(field => {
        let value: any;
        switch (field) {
          case "partno": value = asset.part?.partno; break;
          case "noun": value = asset.part?.noun; break;
          case "location": value = asset.currentLocation?.display_name || asset.assignedLocation?.display_name; break;
          case "nha_serno": value = asset.nhaAsset?.serno; break;
          default: value = asset[field];
        }
        if (value === null || value === undefined) return "";
        const str = String(value);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(",");
    });

    return [header, ...rows].join("\n");
  }

  async getAssetDetails(assetId: number): Promise<any> {
    return prisma.asset.findUnique({
      where: { asset_id: assetId },
      include: {
        part: true,
        assignedLocation: true,
        currentLocation: true,
        nhaAsset: { include: { part: true } },
        cfgSet: true,
        sraAssets: { include: { part: true } },
        events: { take: 10, orderBy: { ins_date: "desc" }, include: { repairs: true } },
        sorties: { take: 10, orderBy: { sortie_date: "desc" } },
        inspections: { where: { complete_date: null } },
        tctoAssets: { where: { complete_date: null }, include: { tcto: true } },
      },
    });
  }

  async validateAsset(assetId: number, userId: string): Promise<any> {
    return prisma.asset.update({
      where: { asset_id: assetId },
      data: {
        valid: true,
        val_by: userId,
        val_date: new Date(),
        chg_by: userId,
        chg_date: new Date(),
      },
    });
  }

  async updateAssetStatus(assetId: number, statusCd: string, userId: string): Promise<any> {
    const asset = await prisma.asset.findUnique({ where: { asset_id: assetId } });
    const oldStatus = asset?.status_cd;

    const updated = await prisma.asset.update({
      where: { asset_id: assetId },
      data: { status_cd: statusCd, chg_by: userId, chg_date: new Date() },
      include: { part: true },
    });

    console.log(`[INVENTORY] Asset ${updated.serno} status: ${oldStatus} -> ${statusCd}`);
    return updated;
  }

  async getStockLevels(locationId: number, pgmId?: number): Promise<any[]> {
    const whereClause: any = {
      active: true,
      OR: [{ loc_ida: locationId }, { loc_idc: locationId }],
    };
    if (pgmId) whereClause.part = { pgm_id: pgmId };

    const stockByPart = await prisma.asset.groupBy({
      by: ["partno_id", "status_cd"],
      where: whereClause,
      _count: { asset_id: true },
    });

    const partIds = [...new Set(stockByPart.map(s => s.partno_id))];
    const parts = await prisma.partList.findMany({ where: { partno_id: { in: partIds } } });
    const partMap = new Map(parts.map(p => [p.partno_id, p]));

    const stockMap = new Map<number, any>();
    for (const row of stockByPart) {
      if (!stockMap.has(row.partno_id)) {
        const part = partMap.get(row.partno_id);
        stockMap.set(row.partno_id, {
          partnoId: row.partno_id,
          partno: part?.partno,
          noun: part?.noun,
          total: 0, fmc: 0, nmcm: 0, nmcs: 0,
        });
      }
      const stock = stockMap.get(row.partno_id);
      stock.total += row._count.asset_id;
      if (row.status_cd === "FMC") stock.fmc = row._count.asset_id;
      if (row.status_cd === "NMCM") stock.nmcm = row._count.asset_id;
      if (row.status_cd === "NMCS") stock.nmcs = row._count.asset_id;
    }

    return Array.from(stockMap.values()).sort((a, b) => a.partno?.localeCompare(b.partno || "") || 0);
  }

  async getAssetsNeedingReconciliation(locationId: number, daysSinceValidation: number = 90): Promise<any[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceValidation);

    return prisma.asset.findMany({
      where: {
        active: true,
        OR: [{ loc_ida: locationId }, { loc_idc: locationId }],
        AND: [{ OR: [{ val_date: null }, { val_date: { lt: cutoffDate } }] }],
      },
      include: { part: true, currentLocation: true },
      orderBy: { val_date: "asc" },
    });
  }

  async getChildAssets(assetId: number): Promise<any[]> {
    return prisma.asset.findMany({
      where: { nha_asset_id: assetId, active: true },
      include: { part: true, sraAssets: { include: { part: true } } },
      orderBy: { serno: "asc" },
    });
  }

  async moveAsset(assetId: number, newLocationId: number, userId: string): Promise<any> {
    return prisma.asset.update({
      where: { asset_id: assetId },
      data: { loc_idc: newLocationId, chg_by: userId, chg_date: new Date() },
      include: { currentLocation: true, part: true },
    });
  }
}

export const inventoryService = new InventoryService();
