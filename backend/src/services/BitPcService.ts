/**
 * BitPcService
 * ============
 * BIT/PC (Built-in Test / Part Change) tracking.
 * Records parts changed during labor for maintenance tracking.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface BitPcCreateData {
  laborId: number;
  bitPartno?: string;
  bitName?: string;
  bitSeq?: number;
  bitWuc?: string;
  howMal?: string;
  bitQty?: number;
  fsc?: string;
  userId: string;
}

export class BitPcService {

  /**
   * Record a BIT/PC entry
   */
  async recordBitPc(data: BitPcCreateData): Promise<any> {
    // Get next sequence for this labor
    const maxSeq = await prisma.laborBitPc.aggregate({
      where: { labor_id: data.laborId },
      _max: { bit_seq: true },
    });
    const nextSeq = data.bitSeq ?? ((maxSeq._max?.bit_seq || 0) + 1);

    const entry = await prisma.laborBitPc.create({
      data: {
        labor_id: data.laborId,
        bit_partno: data.bitPartno,
        bit_name: data.bitName,
        bit_seq: nextSeq,
        bit_wuc: data.bitWuc,
        how_mal: data.howMal,
        bit_qty: data.bitQty,
        fsc: data.fsc,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: { labor: true },
    });

    console.log(`[BIT/PC] Recorded entry: ${data.bitPartno} - ${data.bitName}`);
    return entry;
  }

  /**
   * Update a BIT/PC entry
   */
  async updateBitPc(laborBitId: number, data: Partial<BitPcCreateData>): Promise<any> {
    return prisma.laborBitPc.update({
      where: { labor_bit_id: laborBitId },
      data: {
        bit_partno: data.bitPartno,
        bit_name: data.bitName,
        bit_wuc: data.bitWuc,
        how_mal: data.howMal,
        bit_qty: data.bitQty,
        fsc: data.fsc,
      },
    });
  }

  /**
   * Delete a BIT/PC entry (soft delete)
   */
  async deleteBitPc(laborBitId: number): Promise<void> {
    await prisma.laborBitPc.update({
      where: { labor_bit_id: laborBitId },
      data: { bit_delete: true },
    });
  }

  /**
   * Get BIT/PC entries for a labor record
   */
  async getEntriesForLabor(laborId: number): Promise<any[]> {
    return prisma.laborBitPc.findMany({
      where: { labor_id: laborId, bit_delete: false },
      orderBy: { bit_seq: "asc" },
    });
  }

  /**
   * Validate a BIT/PC entry
   */
  async validateBitPc(laborBitId: number, userId: string): Promise<any> {
    return prisma.laborBitPc.update({
      where: { labor_bit_id: laborBitId },
      data: {
        valid: true,
        val_by: userId,
        val_date: new Date(),
      },
    });
  }

  /**
   * Get unvalidated BIT/PC entries for a repair
   */
  async getUnvalidatedForRepair(repairId: number): Promise<any[]> {
    return prisma.laborBitPc.findMany({
      where: {
        valid: false,
        bit_delete: false,
        labor: { repair_id: repairId },
      },
      include: { labor: true },
      orderBy: { ins_date: "asc" },
    });
  }

  /**
   * Get BIT/PC entries for an event
   */
  async getEntriesForEvent(eventId: number): Promise<any[]> {
    return prisma.laborBitPc.findMany({
      where: {
        bit_delete: false,
        labor: { repair: { event_id: eventId } },
      },
      include: {
        labor: {
          include: {
            repair: true,
          },
        },
      },
      orderBy: [{ labor_id: "asc" }, { bit_seq: "asc" }],
    });
  }

  /**
   * Get part usage summary for a program
   * Note: Simplified - Event doesn't have direct program relation
   */
  async getPartUsageSummary(_pgmId: number, days: number = 90): Promise<any[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Get recent entries across all programs (simplified query)
    const entries = await prisma.laborBitPc.findMany({
      where: {
        bit_delete: false,
        ins_date: { gte: since },
      },
      select: {
        bit_partno: true,
        bit_name: true,
        bit_qty: true,
      },
      take: 1000,
    });

    const partStats = new Map<string, { partno: string; name: string; count: number; qty: number }>();

    for (const entry of entries) {
      if (!entry.bit_partno) continue;
      const key = entry.bit_partno;

      if (!partStats.has(key)) {
        partStats.set(key, {
          partno: entry.bit_partno,
          name: entry.bit_name || "",
          count: 0,
          qty: 0,
        });
      }

      const stat = partStats.get(key)!;
      stat.count++;
      stat.qty += entry.bit_qty || 1;
    }

    return Array.from(partStats.values())
      .sort((a, b) => b.qty - a.qty);
  }

  /**
   * Copy BIT/PC entries from one labor to another
   */
  async copyEntries(fromLaborId: number, toLaborId: number, userId: string): Promise<number> {
    const sourceEntries = await prisma.laborBitPc.findMany({
      where: { labor_id: fromLaborId, bit_delete: false },
    });

    let copied = 0;
    for (const entry of sourceEntries) {
      await prisma.laborBitPc.create({
        data: {
          labor_id: toLaborId,
          bit_partno: entry.bit_partno,
          bit_name: entry.bit_name,
          bit_seq: entry.bit_seq,
          bit_wuc: entry.bit_wuc,
          how_mal: entry.how_mal,
          bit_qty: entry.bit_qty,
          fsc: entry.fsc,
          ins_by: userId,
          ins_date: new Date(),
        },
      });
      copied++;
    }

    return copied;
  }
}

export const bitPcService = new BitPcService();
