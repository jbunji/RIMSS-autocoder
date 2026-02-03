/**
 * PMI API Routes
 * ==============
 * Preventive Maintenance Inspection scheduling and tracking.
 */

import { Router, Request, Response } from "express";
import { pmiService } from "./PmiService";

export const pmiRouter = Router();

// ============================================================================
// PMI MANAGEMENT
// ============================================================================

/**
 * POST /schedule - Schedule a new PMI
 */
pmiRouter.post("/schedule", async (req: Request, res: Response) => {
  try {
    const {
      asset_id, pmi_type, interval_days, interval_hours,
      wuc_cd, remarks
    } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id || !pmi_type) {
      return res.status(400).json({ error: "asset_id and pmi_type required" });
    }

    const pmi = await pmiService.schedulePmi({
      assetId: parseInt(asset_id),
      pmiType: pmi_type,
      intervalDays: interval_days ? parseInt(interval_days) : undefined,
      intervalHours: interval_hours ? parseFloat(interval_hours) : undefined,
      wucCd: wuc_cd,
      remarks,
      userId,
    });

    res.status(201).json({ message: "PMI scheduled", pmi });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /:id/complete - Complete a PMI
 */
pmiRouter.post("/:id/complete", async (req: Request, res: Response) => {
  try {
    const histId = parseInt(req.params.id);
    const { repair_id, meter_reading, findings } = req.body;
    const userId = (req as any).user?.username || "system";

    const pmi = await pmiService.completePmi({
      histId,
      repairId: repair_id ? parseInt(repair_id) : undefined,
      meterReading: meter_reading ? parseFloat(meter_reading) : undefined,
      findings,
      userId,
    });

    res.json({ message: "PMI completed", pmi });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /:id/create-event - Create maintenance event for PMI
 */
pmiRouter.post("/:id/create-event", async (req: Request, res: Response) => {
  try {
    const histId = parseInt(req.params.id);
    const { location_id } = req.body;
    const userId = (req as any).user?.username || "system";

    const result = await pmiService.createPmiEvent({
      histId,
      locationId: parseInt(location_id) || 154,
      userId,
    });

    res.status(201).json({
      message: "PMI event created",
      event: result.event,
      repair: result.repair,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// QUERIES
// ============================================================================

/**
 * GET /upcoming - Get upcoming PMIs for a location
 */
pmiRouter.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.query.location_id as string) || 154;
    const daysAhead = parseInt(req.query.days as string) || 30;

    const pmis = await pmiService.getUpcomingPmis(locationId, daysAhead);
    res.json({ pmis, count: pmis.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /overdue - Get overdue PMIs
 */
pmiRouter.get("/overdue", async (req: Request, res: Response) => {
  try {
    const locationId = req.query.location_id 
      ? parseInt(req.query.location_id as string) 
      : undefined;

    const pmis = await pmiService.getOverduePmis(locationId);
    res.json({ pmis, count: pmis.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /location/:id/stats - Get PMI stats for a location
 */
pmiRouter.get("/location/:id/stats", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.id);
    const stats = await pmiService.getLocationPmiStats(locationId);
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /asset/:id/schedule - Get PMI schedule for an asset
 */
pmiRouter.get("/asset/:id/schedule", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    const schedule = await pmiService.getAssetPmiSchedule(assetId);
    res.json({ schedule });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /asset/:id/history - Get PMI history for an asset
 */
pmiRouter.get("/asset/:id/history", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit as string) || 20;
    const history = await pmiService.getPmiHistory(assetId, limit);
    res.json({ history });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
