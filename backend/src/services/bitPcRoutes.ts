/**
 * BIT/PC API Routes
 * =================
 * Built-in Test and Power Check tracking.
 */

import { Router, Request, Response } from "express";
import { bitPcService } from "./BitPcService";

export const bitPcRouter = Router();

/**
 * POST /tests - Record a test result
 */
bitPcRouter.post("/tests", async (req: Request, res: Response) => {
  try {
    const { labor_id, asset_id, test_type, test_name, result, reading, min_spec, max_spec, remarks } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!labor_id || !test_type || !test_name || !result) {
      return res.status(400).json({ error: "labor_id, test_type, test_name, and result required" });
    }

    const test = await bitPcService.recordTest({
      laborId: parseInt(labor_id),
      assetId: asset_id ? parseInt(asset_id) : undefined,
      testType: test_type,
      testName: test_name,
      result,
      reading,
      minSpec: min_spec,
      maxSpec: max_spec,
      remarks,
      userId,
    });

    res.status(201).json({ message: "Test recorded", test });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /tests/:id - Update a test result
 */
bitPcRouter.put("/tests/:id", async (req: Request, res: Response) => {
  try {
    const bitPcId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const test = await bitPcService.updateTest(bitPcId, { ...req.body, userId });
    res.json({ message: "Test updated", test });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /tests/:id - Delete a test
 */
bitPcRouter.delete("/tests/:id", async (req: Request, res: Response) => {
  try {
    const bitPcId = parseInt(req.params.id);
    await bitPcService.deleteTest(bitPcId);
    res.json({ message: "Test deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /labor/:laborId/tests - Get tests for a labor record
 */
bitPcRouter.get("/labor/:laborId/tests", async (req: Request, res: Response) => {
  try {
    const laborId = parseInt(req.params.laborId);
    const tests = await bitPcService.getTestsForLabor(laborId);
    res.json({ tests, count: tests.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /asset/:assetId/tests - Get tests for an asset
 */
bitPcRouter.get("/asset/:assetId/tests", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const limit = parseInt(req.query.limit as string) || 50;
    const tests = await bitPcService.getTestsForAsset(assetId, limit);
    res.json({ tests, count: tests.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /repair/:repairId/failures - Get failed tests for a repair
 */
bitPcRouter.get("/repair/:repairId/failures", async (req: Request, res: Response) => {
  try {
    const repairId = parseInt(req.params.repairId);
    const failures = await bitPcService.getFailedTestsForRepair(repairId);
    res.json({ failures, count: failures.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /event/:eventId/stats - Get test stats for an event
 */
bitPcRouter.get("/event/:eventId/stats", async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const stats = await bitPcService.getTestStatsForEvent(eventId);
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /location/:locationId/failures - Get recent failures
 */
bitPcRouter.get("/location/:locationId/failures", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const days = parseInt(req.query.days as string) || 30;
    const failures = await bitPcService.getRecentFailures(locationId, days);
    res.json({ failures, count: failures.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /labor/:laborId/copy-tests - Copy tests for retest
 */
bitPcRouter.post("/labor/:laborId/copy-tests", async (req: Request, res: Response) => {
  try {
    const fromLaborId = parseInt(req.params.laborId);
    const { to_labor_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!to_labor_id) {
      return res.status(400).json({ error: "to_labor_id required" });
    }

    const copied = await bitPcService.copyTestsForRetest(fromLaborId, parseInt(to_labor_id), userId);
    res.json({ message: `Copied ${copied} tests`, copied });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /failure-rate/:pgmId - Get failure rate by part
 */
bitPcRouter.get("/failure-rate/:pgmId", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.params.pgmId);
    const days = parseInt(req.query.days as string) || 90;
    const rates = await bitPcService.getFailureRateByPart(pgmId, days);
    res.json({ rates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
