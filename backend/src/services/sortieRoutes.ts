/**
 * Sortie API Routes
 * =================
 * Flight sortie management endpoints.
 */

import { Router, Request, Response } from "express";
import { sortieService } from "./SortieService";

export const sortieRouter = Router();

// ============================================================================
// SORTIE CRUD
// ============================================================================

/**
 * POST /sorties - Create a new sortie
 */
sortieRouter.post("/sorties", async (req: Request, res: Response) => {
  try {
    const {
      pgm_id, asset_id, mission_id, serno, ac_tailno, sortie_date,
      sortie_effect, ac_station, ac_type, current_unit, assigned_unit,
      range, reason, remarks, source_data, is_non_podded, is_debrief, is_live_monitor
    } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!pgm_id) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const sortie = await sortieService.createSortie({
      pgmId: parseInt(pgm_id),
      assetId: asset_id ? parseInt(asset_id) : undefined,
      missionId: mission_id,
      serno,
      acTailno: ac_tailno,
      sortieDate: sortie_date ? new Date(sortie_date) : undefined,
      sortieEffect: sortie_effect,
      acStation: ac_station,
      acType: ac_type,
      currentUnit: current_unit,
      assignedUnit: assigned_unit,
      range,
      reason,
      remarks,
      sourceData: source_data,
      isNonPodded: is_non_podded === true,
      isDebrief: is_debrief === true,
      isLiveMonitor: is_live_monitor === true,
      userId,
    });

    res.status(201).json({ message: "Sortie created", sortie });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /sorties/:id - Get sortie by ID
 */
sortieRouter.get("/sorties/:id", async (req: Request, res: Response) => {
  try {
    const sortieId = parseInt(req.params.id);
    const sortie = await sortieService.getSortie(sortieId);

    if (!sortie) {
      return res.status(404).json({ error: "Sortie not found" });
    }

    res.json({ sortie });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /sorties/:id - Update a sortie
 */
sortieRouter.put("/sorties/:id", async (req: Request, res: Response) => {
  try {
    const sortieId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const sortie = await sortieService.updateSortie(sortieId, {
      ...req.body,
      userId,
    });

    res.json({ message: "Sortie updated", sortie });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /sorties/:id - Delete a sortie
 */
sortieRouter.delete("/sorties/:id", async (req: Request, res: Response) => {
  try {
    const sortieId = parseInt(req.params.id);
    await sortieService.deleteSortie(sortieId);
    res.json({ message: "Sortie deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================================================
// SORTIE ACTIONS
// ============================================================================

/**
 * POST /sorties/:id/validate - Validate a sortie
 */
sortieRouter.post("/sorties/:id/validate", async (req: Request, res: Response) => {
  try {
    const sortieId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const sortie = await sortieService.validateSortie(sortieId, userId);
    res.json({ message: "Sortie validated", sortie });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /sorties/:id/link-event - Link sortie to maintenance event
 */
sortieRouter.post("/sorties/:id/link-event", async (req: Request, res: Response) => {
  try {
    const sortieId = parseInt(req.params.id);
    const { event_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!event_id) {
      return res.status(400).json({ error: "event_id required" });
    }

    const event = await sortieService.linkToEvent(sortieId, parseInt(event_id), userId);
    res.json({ message: "Sortie linked to event", event });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /sorties/import - Import sorties from data
 */
sortieRouter.post("/sorties/import", async (req: Request, res: Response) => {
  try {
    const { pgm_id, sorties } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!pgm_id || !sorties?.length) {
      return res.status(400).json({ error: "pgm_id and sorties array required" });
    }

    const result = await sortieService.importSorties({
      pgmId: parseInt(pgm_id),
      sorties,
      userId,
    });

    res.json({
      message: `Imported ${result.imported} sorties`,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// QUERIES
// ============================================================================

/**
 * GET /sorties - Search sorties
 */
sortieRouter.get("/sorties", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);
    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const result = await sortieService.searchSorties({
      pgmId,
      serno: req.query.serno as string,
      missionId: req.query.mission_id as string,
      acTailno: req.query.ac_tailno as string,
      dateFrom: req.query.date_from ? new Date(req.query.date_from as string) : undefined,
      dateTo: req.query.date_to ? new Date(req.query.date_to as string) : undefined,
      locId: req.query.loc_id ? parseInt(req.query.loc_id as string) : undefined,
      isNonPodded: req.query.is_non_podded === "true" ? true : 
                   req.query.is_non_podded === "false" ? false : undefined,
      limit: parseInt(req.query.limit as string) || 50,
      offset: parseInt(req.query.offset as string) || 0,
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /sorties/recent - Get recent sorties
 */
sortieRouter.get("/sorties/recent", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);
    const days = parseInt(req.query.days as string) || 30;

    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const sorties = await sortieService.getRecentSorties(pgmId, days);
    res.json({ sorties, count: sorties.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /sorties/unvalidated - Get sorties needing validation
 */
sortieRouter.get("/sorties/unvalidated", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);

    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const sorties = await sortieService.getUnvalidatedSorties(pgmId);
    res.json({ sorties, count: sorties.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /sorties/stats - Get sortie statistics
 */
sortieRouter.get("/sorties/stats", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);

    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const stats = await sortieService.getSortieStats(
      pgmId,
      req.query.date_from ? new Date(req.query.date_from as string) : undefined,
      req.query.date_to ? new Date(req.query.date_to as string) : undefined
    );

    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:assetId/sorties - Get sorties for an asset
 */
sortieRouter.get("/assets/:assetId/sorties", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const limit = parseInt(req.query.limit as string) || 50;

    const sorties = await sortieService.getSortiesForAsset(assetId, limit);
    res.json({ sorties, count: sorties.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
