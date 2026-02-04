/**
 * Spares API Routes
 * =================
 * Spare parts pool management.
 */

import { Router, Request, Response } from "express";
import { sparesService } from "./SparesService";

export const sparesRouter = Router();

/**
 * POST /spares - Create a spare
 */
sparesRouter.post("/spares", async (req: Request, res: Response) => {
  try {
    const { pgm_id, partno, serno, status, loc_id, warranty_exp, mfg_date, unit_price, remarks } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!pgm_id || !partno || !serno) {
      return res.status(400).json({ error: "pgm_id, partno, and serno required" });
    }

    const spare = await sparesService.createSpare({
      pgmId: parseInt(pgm_id),
      partno,
      serno,
      status,
      locationId: loc_id ? parseInt(loc_id) : undefined,
      warrantyExp: warranty_exp ? new Date(warranty_exp) : undefined,
      mfgDate: mfg_date ? new Date(mfg_date) : undefined,
      unitPrice: unit_price ? parseFloat(unit_price) : undefined,
      remarks,
      userId,
    });

    res.status(201).json({ message: "Spare created", spare });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /spares - Search spares
 */
sparesRouter.get("/spares", async (req: Request, res: Response) => {
  try {
    const result = await sparesService.searchSpares({
      pgmId: req.query.pgm_id ? parseInt(req.query.pgm_id as string) : undefined,
      locationId: req.query.loc_id ? parseInt(req.query.loc_id as string) : undefined,
      partno: req.query.partno as string,
      serno: req.query.serno as string,
      status: req.query.status as string,
      limit: parseInt(req.query.limit as string) || 50,
      offset: parseInt(req.query.offset as string) || 0,
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /spares/:id - Get spare by ID
 */
sparesRouter.get("/spares/:id", async (req: Request, res: Response) => {
  try {
    const spareId = parseInt(req.params.id);
    const spare = await sparesService.getSpare(spareId);

    if (!spare) {
      return res.status(404).json({ error: "Spare not found" });
    }

    res.json({ spare });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /spares/:id - Update a spare
 */
sparesRouter.put("/spares/:id", async (req: Request, res: Response) => {
  try {
    const spareId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const spare = await sparesService.updateSpare(spareId, { ...req.body, userId });
    res.json({ message: "Spare updated", spare });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /spares/:id - Delete a spare
 */
sparesRouter.delete("/spares/:id", async (req: Request, res: Response) => {
  try {
    const spareId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    await sparesService.deleteSpare(spareId, userId);
    res.json({ message: "Spare deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /spares/:id/issue - Issue spare as asset
 */
sparesRouter.post("/spares/:id/issue", async (req: Request, res: Response) => {
  try {
    const spareId = parseInt(req.params.id);
    const { nha_asset_id, loc_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!loc_id) {
      return res.status(400).json({ error: "loc_id required" });
    }

    const asset = await sparesService.issueSpare(spareId, {
      nhaAssetId: nha_asset_id ? parseInt(nha_asset_id) : undefined,
      locationId: parseInt(loc_id),
      userId,
    });

    res.json({ message: "Spare issued as asset", asset });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /spares/:id/reserve - Reserve a spare
 */
sparesRouter.post("/spares/:id/reserve", async (req: Request, res: Response) => {
  try {
    const spareId = parseInt(req.params.id);
    const { order_id } = req.body;
    const userId = (req as any).user?.username || "system";

    const spare = await sparesService.reserveSpare(spareId, order_id || 0, userId);
    res.json({ message: "Spare reserved", spare });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /spares/:id/unreserve - Unreserve a spare
 */
sparesRouter.post("/spares/:id/unreserve", async (req: Request, res: Response) => {
  try {
    const spareId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const spare = await sparesService.unreserveSpare(spareId, userId);
    res.json({ message: "Spare unreserved", spare });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /spares/available/:partno - Get available spares for a part
 */
sparesRouter.get("/spares/available/:partno", async (req: Request, res: Response) => {
  try {
    const partno = req.params.partno;
    const locationId = req.query.loc_id ? parseInt(req.query.loc_id as string) : undefined;

    const spares = await sparesService.getAvailableSpares(partno, locationId);
    res.json({ spares, count: spares.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /spares/summary/:locationId - Get spares summary
 */
sparesRouter.get("/spares/summary/:locationId", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const summary = await sparesService.getSparesSummary(locationId);
    res.json({ summary });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
