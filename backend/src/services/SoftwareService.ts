/**
 * SoftwareService
 * ===============
 * Track software/firmware versions installed on assets.
 * Important for configuration management and TCTO compliance.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SoftwareCreateData {
  pgmId: number;
  swName: string;
  swVersion: string;
  swType?: string;  // FIRMWARE, APPLICATION, OS, CONFIG
  partnoId?: number;
  releaseDate?: Date;
  remarks?: string;
  userId: string;
}

export class SoftwareService {

  /**
   * Create a software version record
   */
  async createSoftware(data: SoftwareCreateData): Promise<any> {
    const software = await prisma.software.create({
      data: {
        pgm_id: data.pgmId,
        sw_name: data.swName,
        sw_version: data.swVersion,
        sw_type: data.swType,
        partno_id: data.partnoId,
        release_date: data.releaseDate,
        remarks: data.remarks,
        active: true,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: { program: true, part: true },
    });

    console.log(`[SOFTWARE] Created ${software.sw_name} v${software.sw_version}`);
    return software;
  }

  /**
   * Install software on an asset
   */
  async installOnAsset(swId: number, assetId: number, userId: string): Promise<any> {
    // Check if already installed
    const existing = await prisma.softwareAsset.findFirst({
      where: { sw_id: swId, asset_id: assetId, uninstall_date: null },
    });

    if (existing) {
      throw new Error("Software already installed on this asset");
    }

    const installation = await prisma.softwareAsset.create({
      data: {
        sw_id: swId,
        asset_id: assetId,
        install_date: new Date(),
        ins_by: userId,
        ins_date: new Date(),
      },
      include: {
        software: true,
        asset: { include: { part: true } },
      },
    });

    console.log(`[SOFTWARE] Installed ${installation.software.sw_name} on asset ${installation.asset.serno}`);
    return installation;
  }

  /**
   * Uninstall software from an asset
   */
  async uninstallFromAsset(swId: number, assetId: number, userId: string): Promise<any> {
    const installation = await prisma.softwareAsset.findFirst({
      where: { sw_id: swId, asset_id: assetId, uninstall_date: null },
    });

    if (!installation) {
      throw new Error("Software not installed on this asset");
    }

    return prisma.softwareAsset.update({
      where: { sw_asset_id: installation.sw_asset_id },
      data: {
        uninstall_date: new Date(),
        chg_by: userId,
        chg_date: new Date(),
      },
    });
  }

  /**
   * Update software on asset (uninstall old, install new)
   */
  async updateSoftwareOnAsset(params: {
    assetId: number;
    oldSwId?: number;
    newSwId: number;
    userId: string;
  }): Promise<any> {
    // Uninstall old version if specified
    if (params.oldSwId) {
      await this.uninstallFromAsset(params.oldSwId, params.assetId, params.userId);
    }

    // Install new version
    return this.installOnAsset(params.newSwId, params.assetId, params.userId);
  }

  /**
   * Get software installed on an asset
   */
  async getAssetSoftware(assetId: number): Promise<any[]> {
    return prisma.softwareAsset.findMany({
      where: { asset_id: assetId, uninstall_date: null },
      include: { software: true },
      orderBy: { software: { sw_name: "asc" } },
    });
  }

  /**
   * Get assets with a specific software version
   */
  async getAssetsWithSoftware(swId: number): Promise<any[]> {
    return prisma.softwareAsset.findMany({
      where: { sw_id: swId, uninstall_date: null },
      include: {
        asset: { include: { part: true, currentLocation: true } },
      },
    });
  }

  /**
   * Get all software versions for a program
   */
  async getSoftwareForProgram(pgmId: number): Promise<any[]> {
    return prisma.software.findMany({
      where: { pgm_id: pgmId, active: true },
      include: {
        part: true,
        _count: { select: { softwareAssets: true } },
      },
      orderBy: [{ sw_name: "asc" }, { sw_version: "desc" }],
    });
  }

  /**
   * Get software by ID
   */
  async getSoftware(swId: number): Promise<any> {
    return prisma.software.findUnique({
      where: { sw_id: swId },
      include: { program: true, part: true },
    });
  }

  /**
   * Get software installation history for an asset
   */
  async getInstallationHistory(assetId: number): Promise<any[]> {
    return prisma.softwareAsset.findMany({
      where: { asset_id: assetId },
      include: { software: true },
      orderBy: { install_date: "desc" },
    });
  }

  /**
   * Find assets needing software update
   */
  async findAssetsNeedingUpdate(oldSwId: number, newSwId: number): Promise<any[]> {
    // Get assets with old version
    const assetsWithOld = await prisma.softwareAsset.findMany({
      where: { sw_id: oldSwId, uninstall_date: null },
      include: {
        asset: { include: { part: true, currentLocation: true } },
      },
    });

    // Filter out those already having new version
    const assetsWithNew = await prisma.softwareAsset.findMany({
      where: { sw_id: newSwId, uninstall_date: null },
      select: { asset_id: true },
    });
    const hasNewVersion = new Set(assetsWithNew.map(a => a.asset_id));

    return assetsWithOld.filter(a => !hasNewVersion.has(a.asset_id));
  }

  /**
   * Get software compliance summary
   */
  async getSoftwareComplianceSummary(pgmId: number): Promise<any[]> {
    const software = await prisma.software.findMany({
      where: { pgm_id: pgmId, active: true },
      include: {
        softwareAssets: {
          where: { uninstall_date: null },
          select: { asset_id: true },
        },
      },
    });

    // Group by sw_name to find latest version
    const byName = new Map<string, any[]>();
    for (const sw of software) {
      if (!byName.has(sw.sw_name)) byName.set(sw.sw_name, []);
      byName.get(sw.sw_name)!.push(sw);
    }

    const summary = [];
    for (const [name, versions] of byName) {
      // Sort by version desc (simple string sort - might need semver)
      versions.sort((a, b) => b.sw_version.localeCompare(a.sw_version));
      const latest = versions[0];
      const latestCount = latest.softwareAssets.length;
      const olderCount = versions.slice(1).reduce((sum, v) => sum + v.softwareAssets.length, 0);

      summary.push({
        swName: name,
        latestVersion: latest.sw_version,
        latestSwId: latest.sw_id,
        assetsOnLatest: latestCount,
        assetsOnOlder: olderCount,
        compliancePercent: latestCount + olderCount > 0 
          ? Math.round((latestCount / (latestCount + olderCount)) * 100) 
          : 100,
      });
    }

    return summary.sort((a, b) => a.compliancePercent - b.compliancePercent);
  }
}

export const softwareService = new SoftwareService();
