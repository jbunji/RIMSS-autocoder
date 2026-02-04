/**
 * PMI API Routes
 * ==============
 * Preventive Maintenance Inspection endpoints.
 */

import { Router, Request, Response } from "express";
import { pmiService } from "./PmiService";

export const pmiRouter = Router();

/**
 * POST / - Schedule a PMI
 */
pmiRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { asset_id, pmi_type, next_due_date, next_due_etm, wuc_cd } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id || !pmi_type) {
      return res.status(400).json({ error: "asset_id and pmi_type required" });
    }

    const pmi = await pmiService.schedulePmi({
      assetId: parseInt(asset_id),
      pmiType: pmi_type,
      nextDueDate: next_due_date ? new Date(next_due_date) : undefined,
      nextDueEtm: next_due_etm ? parseFloat(next_due_etm) : undefined,
      wucCd: wuc_cd,
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
    const { repair_id } = req.body;
    const userId = (req as any).user?.username || "system";

    const pmi = await pmiService.completePmi(histId, userId, repair_id ? parseInt(repair_id) : undefined);
    res.json({ message: "PMI completed", pmi });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /:id/reschedule - Reschedule a PMI
 */
pmiRouter.put("/:id/reschedule", async (req: Request, res: Response) => {
  try {
    const histId = parseInt(req.params.id);
    const { next_due_date } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!next_due_date) {
      return res.status(400).json({ error: "next_due_date required" });
    }

    const pmi = await pmiService.reschedulePmi(histId, new Date(next_due_date), userId);
    res.json({ message: "PMI rescheduled", pmi });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /location/:locationId/upcoming - Get upcoming PMIs
 */
pmiRouter.get("/location/:locationId/upcoming", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const days = parseInt(req.query.days as string) || 30;
    const pmis = await pmiService.getUpcomingPmis(locationId, days);
    res.json({ pmis, count: pmis.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /location/:locationId/overdue - Get overdue PMIs
 */
pmiRouter.get("/location/:locationId/overdue", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const pmis = await pmiService.getOverduePmis(locationId);
    res.json({ pmis, count: pmis.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /asset/:assetId - Get PMI history for an asset
 */
pmiRouter.get("/asset/:assetId", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const history = await pmiService.getAssetPmiHistory(assetId);
    res.json({ history, count: history.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /program/:pgmId/status - Get PMI status for a program
 */
pmiRouter.get("/program/:pgmId/status", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.params.pgmId);
    const status = await pmiService.getPmiStatusForProgram(pgmId);
    res.json({ status });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
