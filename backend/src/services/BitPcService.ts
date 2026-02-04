/**
 * BitPcService
 * ============
 * Built-in Test (BIT) and Power Check (PC) tracking.
 * Records test results during maintenance for quality assurance.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface BitPcCreateData {
  laborId: number;
  assetId?: number;
  testType: string;  // BIT, PC, FUNC, etc.
  testName: string;
  result: string;    // PASS, FAIL, INCOMPLETE
  reading?: string;
  minSpec?: string;
  maxSpec?: string;
  remarks?: string;
  userId: string;
}

export class BitPcService {

  /**
   * Record a BIT/PC test result
   */
  async recordTest(data: BitPcCreateData): Promise<any> {
    // Get next sequence for this labor
    const maxSeq = await prisma.laborBitPc.aggregate({
      where: { labor_id: data.laborId },
      _max: { seq: true },
    });
    const nextSeq = (maxSeq._max.seq || 0) + 1;

    const test = await prisma.laborBitPc.create({
      data: {
        labor_id: data.laborId,
        asset_id: data.assetId,
        seq: nextSeq,
        test_type: data.testType,
        test_name: data.testName,
        result: data.result,
        reading: data.reading,
        min_spec: data.minSpec,
        max_spec: data.maxSpec,
        remarks: data.remarks,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: {
        labor: true,
        asset: { include: { part: true } },
      },
    });

    console.log(`[BIT/PC] Recorded ${data.testType} test: ${data.testName} = ${data.result}`);
    return test;
  }

  /**
   * Update a test result
   */
  async updateTest(bitPcId: number, data: Partial<BitPcCreateData>): Promise<any> {
    return prisma.laborBitPc.update({
      where: { bit_pc_id: bitPcId },
      data: {
        result: data.result,
        reading: data.reading,
        remarks: data.remarks,
        chg_by: data.userId,
        chg_date: new Date(),
      },
    });
  }

  /**
   * Delete a test result
   */
  async deleteTest(bitPcId: number): Promise<void> {
    await prisma.laborBitPc.delete({
      where: { bit_pc_id: bitPcId },
    });
  }

  /**
   * Get tests for a labor record
   */
  async getTestsForLabor(laborId: number): Promise<any[]> {
    return prisma.laborBitPc.findMany({
      where: { labor_id: laborId },
      include: { asset: { include: { part: true } } },
      orderBy: { seq: "asc" },
    });
  }

  /**
   * Get tests for an asset
   */
  async getTestsForAsset(assetId: number, limit: number = 50): Promise<any[]> {
    return prisma.laborBitPc.findMany({
      where: { asset_id: assetId },
      include: {
        labor: {
          include: {
            repair: { include: { event: true } },
          },
        },
      },
      orderBy: { ins_date: "desc" },
      take: limit,
    });
  }

  /**
   * Get failed tests for a repair
   */
  async getFailedTestsForRepair(repairId: number): Promise<any[]> {
    return prisma.laborBitPc.findMany({
      where: {
        result: "FAIL",
        labor: { repair_id: repairId },
      },
      include: {
        asset: { include: { part: true } },
        labor: true,
      },
    });
  }

  /**
   * Get test statistics for an event
   */
  async getTestStatsForEvent(eventId: number): Promise<{
    total: number;
    passed: number;
    failed: number;
    incomplete: number;
  }> {
    const tests = await prisma.laborBitPc.findMany({
      where: { labor: { repair: { event_id: eventId } } },
      select: { result: true },
    });

    return {
      total: tests.length,
      passed: tests.filter(t => t.result === "PASS").length,
      failed: tests.filter(t => t.result === "FAIL").length,
      incomplete: tests.filter(t => t.result === "INCOMPLETE").length,
    };
  }

  /**
   * Get recent failed tests for a location
   */
  async getRecentFailures(locationId: number, days: number = 30): Promise<any[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.laborBitPc.findMany({
      where: {
        result: "FAIL",
        ins_date: { gte: since },
        labor: {
          repair: {
            event: { loc_id: locationId },
          },
        },
      },
      include: {
        asset: { include: { part: true } },
        labor: {
          include: {
            repair: { include: { event: true } },
          },
        },
      },
      orderBy: { ins_date: "desc" },
    });
  }

  /**
   * Copy tests from one labor to another (for retest)
   */
  async copyTestsForRetest(fromLaborId: number, toLaborId: number, userId: string): Promise<number> {
    const sourceTests = await prisma.laborBitPc.findMany({
      where: { labor_id: fromLaborId },
    });

    let copied = 0;
    for (const test of sourceTests) {
      await prisma.laborBitPc.create({
        data: {
          labor_id: toLaborId,
          asset_id: test.asset_id,
          seq: test.seq,
          test_type: test.test_type,
          test_name: test.test_name,
          result: "INCOMPLETE",  // Reset result for retest
          min_spec: test.min_spec,
          max_spec: test.max_spec,
          ins_by: userId,
          ins_date: new Date(),
        },
      });
      copied++;
    }

    return copied;
  }

  /**
   * Get test failure rate by part
   */
  async getFailureRateByPart(pgmId: number, days: number = 90): Promise<any[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const tests = await prisma.laborBitPc.findMany({
      where: {
        ins_date: { gte: since },
        asset: { pgm_id: pgmId },
      },
      include: { asset: { include: { part: true } } },
    });

    const partStats = new Map<number, { partno: string; noun: string; total: number; failed: number }>();

    for (const test of tests) {
      if (!test.asset?.part) continue;
      const partId = test.asset.part.partno_id;

      if (!partStats.has(partId)) {
        partStats.set(partId, {
          partno: test.asset.part.partno,
          noun: test.asset.part.noun || "",
          total: 0,
          failed: 0,
        });
      }

      const stat = partStats.get(partId)!;
      stat.total++;
      if (test.result === "FAIL") stat.failed++;
    }

    return Array.from(partStats.values())
      .map(s => ({ ...s, failureRate: s.total > 0 ? Math.round((s.failed / s.total) * 100) : 0 }))
      .sort((a, b) => b.failureRate - a.failureRate);
  }
}

export const bitPcService = new BitPcService();
