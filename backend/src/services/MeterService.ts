/**
 * MeterService
 * ============
 * Track ETI (Elapsed Time Indicator) hours, cycles, and other meters.
 * Critical for PMI scheduling and lifecycle management.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface MeterReadingData {
  assetId: number;
  repairId?: number;
  meterType: string;  // ETI, CYCLES, ROUNDS, etc.
  reading: number;
  readingDate?: Date;
  source?: string;    // MAINTENANCE, SORTIE, MANUAL
  remarks?: string;
  userId: string;
}

export class MeterService {

  /**
   * Record a meter reading
   */
  async recordReading(data: MeterReadingData): Promise<any> {
    // Get current reading for comparison
    const currentReading = await this.getCurrentReading(data.assetId, data.meterType);

    // Validate reading is not going backwards (unless meter replaced)
    if (currentReading && data.reading < currentReading.reading) {
      console.log(`[METER] Warning: New reading ${data.reading} < current ${currentReading.reading}`);
    }

    const meterHist = await prisma.meterHist.create({
      data: {
        asset_id: data.assetId,
        repair_id: data.repairId,
        meter_type: data.meterType,
        reading: data.reading,
        reading_date: data.readingDate || new Date(),
        source: data.source || "MANUAL",
        remarks: data.remarks,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: {
        asset: { include: { part: true } },
        repair: true,
      },
    });

    // Update asset ETI if this is ETI type
    if (data.meterType === "ETI") {
      await prisma.asset.update({
        where: { asset_id: data.assetId },
        data: {
          eti_hours: data.reading,
          chg_by: data.userId,
          chg_date: new Date(),
        },
      });
    }

    console.log(`[METER] Recorded ${data.meterType} = ${data.reading} for asset ${meterHist.asset.serno}`);
    return meterHist;
  }

  /**
   * Get current meter reading for an asset
   */
  async getCurrentReading(assetId: number, meterType: string): Promise<any> {
    return prisma.meterHist.findFirst({
      where: { asset_id: assetId, meter_type: meterType },
      orderBy: { reading_date: "desc" },
    });
  }

  /**
   * Get all current meter readings for an asset
   */
  async getAssetMeters(assetId: number): Promise<any[]> {
    // Get latest reading for each meter type
    const allReadings = await prisma.meterHist.findMany({
      where: { asset_id: assetId },
      orderBy: { reading_date: "desc" },
    });

    // Get unique latest by meter_type
    const latestByType = new Map<string, any>();
    for (const reading of allReadings) {
      if (!latestByType.has(reading.meter_type)) {
        latestByType.set(reading.meter_type, reading);
      }
    }

    return Array.from(latestByType.values());
  }

  /**
   * Get meter history for an asset
   */
  async getMeterHistory(assetId: number, meterType?: string, limit: number = 50): Promise<any[]> {
    const whereClause: any = { asset_id: assetId };
    if (meterType) whereClause.meter_type = meterType;

    return prisma.meterHist.findMany({
      where: whereClause,
      include: { repair: { include: { event: true } } },
      orderBy: { reading_date: "desc" },
      take: limit,
    });
  }

  /**
   * Calculate usage between dates
   */
  async calculateUsage(assetId: number, meterType: string, fromDate: Date, toDate: Date): Promise<{
    startReading: number | null;
    endReading: number | null;
    usage: number | null;
  }> {
    const startReading = await prisma.meterHist.findFirst({
      where: {
        asset_id: assetId,
        meter_type: meterType,
        reading_date: { lte: fromDate },
      },
      orderBy: { reading_date: "desc" },
    });

    const endReading = await prisma.meterHist.findFirst({
      where: {
        asset_id: assetId,
        meter_type: meterType,
        reading_date: { lte: toDate },
      },
      orderBy: { reading_date: "desc" },
    });

    return {
      startReading: startReading?.reading || null,
      endReading: endReading?.reading || null,
      usage: startReading && endReading ? endReading.reading - startReading.reading : null,
    };
  }

  /**
   * Get high-usage assets
   */
  async getHighUsageAssets(pgmId: number, meterType: string, days: number = 30, threshold: number = 0): Promise<any[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // Get all assets for program
    const assets = await prisma.asset.findMany({
      where: { pgm_id: pgmId, active: true },
      select: { asset_id: true, serno: true, eti_hours: true },
    });

    const results = [];
    for (const asset of assets) {
      const usage = await this.calculateUsage(asset.asset_id, meterType, fromDate, new Date());
      if (usage.usage !== null && usage.usage > threshold) {
        results.push({
          assetId: asset.asset_id,
          serno: asset.serno,
          currentReading: usage.endReading,
          usage: usage.usage,
          avgPerDay: Math.round((usage.usage / days) * 10) / 10,
        });
      }
    }

    return results.sort((a, b) => b.usage - a.usage);
  }

  /**
   * Record meter at repair start/stop
   */
  async recordRepairMeter(params: {
    repairId: number;
    assetId: number;
    reading: number;
    phase: "START" | "STOP";
    userId: string;
  }): Promise<any> {
    return this.recordReading({
      assetId: params.assetId,
      repairId: params.repairId,
      meterType: "ETI",
      reading: params.reading,
      source: `REPAIR_${params.phase}`,
      remarks: `Repair ${params.phase.toLowerCase()} reading`,
      userId: params.userId,
    });
  }

  /**
   * Get assets approaching meter-based PMI
   */
  async getAssetsApproachingMeterPmi(pgmId: number, hoursThreshold: number = 50): Promise<any[]> {
    // Get assets with meter-based PMIs
    const pmis = await prisma.assetInspection.findMany({
      where: {
        complete_date: null,
        valid: true,
        interval_hours: { not: null },
        asset: { pgm_id: pgmId, active: true },
      },
      include: {
        asset: { include: { part: true } },
      },
    });

    const results = [];
    for (const pmi of pmis) {
      const currentReading = await this.getCurrentReading(pmi.asset_id, "ETI");
      if (!currentReading) continue;

      const lastPmiReading = pmi.meter_reading || 0;
      const intervalHours = pmi.interval_hours || 0;
      const nextDueAt = lastPmiReading + intervalHours;
      const hoursRemaining = nextDueAt - currentReading.reading;

      if (hoursRemaining <= hoursThreshold) {
        results.push({
          pmiId: pmi.hist_id,
          pmiType: pmi.pmi_type,
          asset: pmi.asset,
          currentHours: currentReading.reading,
          nextDueAt,
          hoursRemaining,
          overdue: hoursRemaining < 0,
        });
      }
    }

    return results.sort((a, b) => a.hoursRemaining - b.hoursRemaining);
  }

  /**
   * Bulk update meters from sortie data
   */
  async updateFromSortie(params: {
    assetId: number;
    sortieId: number;
    etiDelta: number;
    userId: string;
  }): Promise<any> {
    const current = await this.getCurrentReading(params.assetId, "ETI");
    const newReading = (current?.reading || 0) + params.etiDelta;

    return this.recordReading({
      assetId: params.assetId,
      meterType: "ETI",
      reading: newReading,
      source: "SORTIE",
      remarks: `Sortie ${params.sortieId}: +${params.etiDelta} hours`,
      userId: params.userId,
    });
  }
}

export const meterService = new MeterService();
