/**
 * Meter API Routes
 * ================
 * ETI hours, cycles, and meter tracking.
 */

import { Router, Request, Response } from "express";
import { meterService } from "./MeterService";

export const meterRouter = Router();

/**
 * POST /readings - Record a meter reading
 */
meterRouter.post("/readings", async (req: Request, res: Response) => {
  try {
    const { asset_id, repair_id, meter_type, reading, reading_date, source, remarks } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id || !meter_type || reading === undefined) {
      return res.status(400).json({ error: "asset_id, meter_type, and reading required" });
    }

    const meterReading = await meterService.recordReading({
      assetId: parseInt(asset_id),
      repairId: repair_id ? parseInt(repair_id) : undefined,
      meterType: meter_type,
      reading: parseFloat(reading),
      readingDate: reading_date ? new Date(reading_date) : undefined,
      source,
      remarks,
      userId,
    });

    res.status(201).json({ message: "Reading recorded", reading: meterReading });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:assetId/meters - Get current meters for asset
 */
meterRouter.get("/assets/:assetId/meters", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const meters = await meterService.getAssetMeters(assetId);
    res.json({ meters });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:assetId/meter-history - Get meter history
 */
meterRouter.get("/assets/:assetId/meter-history", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const meterType = req.query.meter_type as string;
    const limit = parseInt(req.query.limit as string) || 50;

    const history = await meterService.getMeterHistory(assetId, meterType, limit);
    res.json({ history });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:assetId/usage - Calculate usage between dates
 */
meterRouter.get("/assets/:assetId/usage", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const meterType = (req.query.meter_type as string) || "ETI";
    const fromDate = new Date(req.query.from_date as string);
    const toDate = new Date(req.query.to_date as string);

    if (!req.query.from_date || !req.query.to_date) {
      return res.status(400).json({ error: "from_date and to_date required" });
    }

    const usage = await meterService.calculateUsage(assetId, meterType, fromDate, toDate);
    res.json({ usage });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /high-usage - Get high-usage assets
 */
meterRouter.get("/high-usage", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);
    const meterType = (req.query.meter_type as string) || "ETI";
    const days = parseInt(req.query.days as string) || 30;
    const threshold = parseFloat(req.query.threshold as string) || 0;

    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const assets = await meterService.getHighUsageAssets(pgmId, meterType, days, threshold);
    res.json({ assets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /repair/:repairId/meter - Record repair meter
 */
meterRouter.post("/repair/:repairId/meter", async (req: Request, res: Response) => {
  try {
    const repairId = parseInt(req.params.repairId);
    const { asset_id, reading, phase } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id || reading === undefined || !phase) {
      return res.status(400).json({ error: "asset_id, reading, and phase (START/STOP) required" });
    }

    const meterReading = await meterService.recordRepairMeter({
      repairId,
      assetId: parseInt(asset_id),
      reading: parseFloat(reading),
      phase: phase.toUpperCase(),
      userId,
    });

    res.json({ message: "Repair meter recorded", reading: meterReading });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /approaching-pmi - Get assets approaching meter-based PMI
 */
meterRouter.get("/approaching-pmi", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);
    const threshold = parseInt(req.query.hours_threshold as string) || 50;

    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const assets = await meterService.getAssetsApproachingMeterPmi(pgmId, threshold);
    res.json({ assets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /sortie-update - Update meters from sortie
 */
meterRouter.post("/sortie-update", async (req: Request, res: Response) => {
  try {
    const { asset_id, sortie_id, eti_delta } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id || !sortie_id || eti_delta === undefined) {
      return res.status(400).json({ error: "asset_id, sortie_id, and eti_delta required" });
    }

    const reading = await meterService.updateFromSortie({
      assetId: parseInt(asset_id),
      sortieId: parseInt(sortie_id),
      etiDelta: parseFloat(eti_delta),
      userId,
    });

    res.json({ message: "Meter updated from sortie", reading });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
