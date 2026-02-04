/**
 * Meter API Routes
 * ================
 * Asset meter tracking endpoints.
 */

import { Router, Request, Response } from "express";
import { meterService } from "./MeterService";

export const meterRouter = Router();

/**
 * POST / - Record a meter reading
 */
meterRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { asset_id, meter_type, meter_in, meter_out, repair_id, labor_id, event_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id || !meter_type) {
      return res.status(400).json({ error: "asset_id and meter_type required" });
    }

    const entry = await meterService.recordReading({
      assetId: parseInt(asset_id),
      meterType: meter_type,
      meterIn: meter_in ? parseFloat(meter_in) : undefined,
      meterOut: meter_out ? parseFloat(meter_out) : undefined,
      repairId: repair_id ? parseInt(repair_id) : undefined,
      laborId: labor_id ? parseInt(labor_id) : undefined,
      eventId: event_id ? parseInt(event_id) : undefined,
      userId,
    });

    res.status(201).json({ message: "Meter reading recorded", entry });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /asset/:assetId - Get meter history for an asset
 */
meterRouter.get("/asset/:assetId", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const meterType = req.query.meter_type as string | undefined;
    const history = await meterService.getAssetMeterHistory(assetId, meterType);
    res.json({ history, count: history.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /asset/:assetId/current - Get current meter value
 */
meterRouter.get("/asset/:assetId/current", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const meterType = req.query.meter_type as string || "ETI";
    const value = await meterService.getCurrentMeterValue(assetId, meterType);
    res.json({ meterType, value });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /location/:locationId/approaching-limits - Get assets approaching meter limits
 */
meterRouter.get("/location/:locationId/approaching-limits", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const threshold = parseInt(req.query.threshold as string) || 50;
    const assets = await meterService.getAssetsApproachingLimits(locationId, threshold);
    res.json({ assets, count: assets.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
