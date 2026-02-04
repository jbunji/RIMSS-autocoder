/**
 * MeterService
 * ============
 * Meter reading tracking for assets (ETI, flight hours, cycles, etc.)
 * TODO: Full implementation pending schema review
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MeterService {

  /**
   * Record a meter reading
   */
  async recordReading(data: {
    assetId: number;
    meterType: string;
    meterIn?: number;
    meterOut?: number;
    repairId?: number;
    laborId?: number;
    eventId?: number;
    userId: string;
  }): Promise<any> {
    return prisma.meterHist.create({
      data: {
        asset_id: data.assetId,
        meter_type: data.meterType,
        meter_in: data.meterIn,
        meter_out: data.meterOut,
        repair_id: data.repairId,
        labor_id: data.laborId,
        event_id: data.eventId,
        ins_by: data.userId,
        ins_date: new Date(),
      },
    });
  }

  /**
   * Get meter history for an asset
   */
  async getAssetMeterHistory(assetId: number, meterType?: string): Promise<any[]> {
    const where: any = { asset_id: assetId };
    if (meterType) where.meter_type = meterType;

    return prisma.meterHist.findMany({
      where,
      orderBy: { ins_date: "desc" },
      take: 100,
    });
  }

  /**
   * Get current meter value for an asset
   */
  async getCurrentMeterValue(assetId: number, meterType: string): Promise<number | null> {
    const latest = await prisma.meterHist.findFirst({
      where: { asset_id: assetId, meter_type: meterType },
      orderBy: { ins_date: "desc" },
    });
    return latest?.meter_out ? Number(latest.meter_out) : null;
  }

  /**
   * Get assets approaching meter limits
   */
  async getAssetsApproachingLimits(_locationId: number, _thresholdHours: number = 50): Promise<any[]> {
    // Simplified - would need asset meter limits from config
    console.log("[METER] getAssetsApproachingLimits not fully implemented");
    return [];
  }
}

export const meterService = new MeterService();
