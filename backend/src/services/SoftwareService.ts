/**
 * SoftwareService
 * ===============
 * Software configuration tracking for assets.
 * Simplified - actual schema differs from initial assumptions.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SoftwareService {

  /**
   * Add a software record
   */
  async addSoftware(data: {
    swNumber: string;
    swType?: string;
    revision?: string;
    swTitle?: string;
    swDesc?: string;
    userId: string;
  }): Promise<any> {
    return prisma.software.create({
      data: {
        sw_number: data.swNumber,
        sw_type: data.swType,
        revision: data.revision,
        sw_title: data.swTitle,
        sw_desc: data.swDesc,
        ins_by: data.userId,
        ins_date: new Date(),
      },
    });
  }

  /**
   * Install software on an asset
   */
  async installOnAsset(swId: number, assetId: number, userId: string): Promise<any> {
    return prisma.softwareAsset.create({
      data: {
        sw_id: swId,
        asset_id: assetId,
        eff_date: new Date(),
        ins_by: userId,
        ins_date: new Date(),
      },
    });
  }

  /**
   * Get software installed on an asset
   */
  async getAssetSoftware(assetId: number): Promise<any[]> {
    return prisma.softwareAsset.findMany({
      where: { asset_id: assetId },
      include: { software: true },
    });
  }

  /**
   * Get all software records
   */
  async getAllSoftware(): Promise<any[]> {
    return prisma.software.findMany({
      where: { active: true },
      orderBy: { sw_number: "asc" },
    });
  }

  /**
   * Get assets with specific software
   */
  async getAssetsWithSoftware(swId: number): Promise<any[]> {
    return prisma.softwareAsset.findMany({
      where: { sw_id: swId },
      include: {
        asset: { include: { part: true, currentLocation: true } },
      },
    });
  }

  /**
   * Remove software from asset
   */
  async removeFromAsset(swAssetId: number): Promise<void> {
    await prisma.softwareAsset.delete({
      where: { sw_asset_id: swAssetId },
    });
  }
}

export const softwareService = new SoftwareService();
