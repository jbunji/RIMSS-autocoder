/**
 * Maintenance API Routes (Database-Backed)
 * =========================================
 * These routes use Prisma and the MaintenanceService/WorkflowService
 * to provide real database-backed maintenance operations.
 * 
 * To use: Import and mount in index.ts
 *   import { maintenanceRouter } from "./services/maintenanceRoutes";
 *   app.use("/api/v2/maintenance", maintenanceRouter);
 */

import { Router, Request, Response } from "express";
import { maintenanceService } from "./MaintenanceService";

export const maintenanceRouter = Router();

// ============================================================================
// EVENT ROUTES
// ============================================================================

/**
 * GET /events - List events for user's location
 */
maintenanceRouter.get("/events", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.query.location_id as string) || 154; // Default location
    const status = req.query.status as "open" | "closed" | undefined;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await maintenanceService.getEventsForLocation({
      locationId,
      status,
      limit,
      offset,
    });

    res.json({
      events: result.events,
      total: result.total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error fetching events:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /events/:id - Get single event with repairs
 */
maintenanceRouter.get("/events/:id", async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await maintenanceService.getEvent(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ event });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error fetching event:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /events - Create new maintenance event
 */
maintenanceRouter.post("/events", async (req: Request, res: Response) => {
  try {
    const { asset_id, location_id, job_no, discrepancy, start_job } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id is required" });
    }

    const event = await maintenanceService.createEvent({
      assetId: parseInt(asset_id),
      locationId: parseInt(location_id) || 154,
      jobNo: job_no,
      discrepancy,
      startJob: start_job ? new Date(start_job) : undefined,
      userId,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error creating event:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /events/:id/close - Close an event
 */
maintenanceRouter.post("/events/:id/close", async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const event = await maintenanceService.closeEvent(eventId, userId);

    res.json({
      message: "Event closed successfully",
      event,
    });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error closing event:", error);
    res.status(400).json({ error: error.message });
  }
});

// ============================================================================
// REPAIR ROUTES
// ============================================================================

/**
 * GET /events/:eventId/repairs - Get repairs for an event
 */
maintenanceRouter.get("/events/:eventId/repairs", async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const repairs = await maintenanceService.getRepairsForEvent(eventId);

    res.json({ repairs });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error fetching repairs:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /events/:eventId/repairs - Create repair for event
 */
maintenanceRouter.post("/events/:eventId/repairs", async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { asset_id, type_maint, how_mal, when_disc, narrative, start_date } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!type_maint) {
      return res.status(400).json({ error: "type_maint is required" });
    }

    const repair = await maintenanceService.createRepair({
      eventId,
      assetId: asset_id ? parseInt(asset_id) : undefined,
      typeMaint: type_maint,
      howMal: how_mal,
      whenDisc: when_disc,
      narrative,
      startDate: start_date ? new Date(start_date) : undefined,
      userId,
    });

    res.status(201).json({
      message: "Repair created successfully",
      repair,
    });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error creating repair:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /repairs/:id/close - Close a repair
 */
maintenanceRouter.post("/repairs/:id/close", async (req: Request, res: Response) => {
  try {
    const repairId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const repair = await maintenanceService.closeRepair(repairId, userId);

    res.json({
      message: "Repair closed successfully",
      repair,
    });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error closing repair:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// LABOR ROUTES
// ============================================================================

/**
 * POST /repairs/:repairId/labor - Create labor record for repair
 */
maintenanceRouter.post("/repairs/:repairId/labor", async (req: Request, res: Response) => {
  try {
    const repairId = parseInt(req.params.repairId);
    const {
      asset_id, action_taken, how_mal, when_disc,
      corrective, remarks, crew_chief, crew_size, start_date
    } = req.body;
    const userId = (req as any).user?.username || "system";

    const labor = await maintenanceService.createLabor({
      repairId,
      assetId: asset_id ? parseInt(asset_id) : undefined,
      actionTaken: action_taken,
      howMal: how_mal,
      whenDisc: when_disc,
      corrective,
      remarks,
      crewChief: crew_chief,
      crewSize: crew_size ? parseInt(crew_size) : undefined,
      startDate: start_date ? new Date(start_date) : undefined,
      userId,
    });

    res.status(201).json({
      message: "Labor record created successfully",
      labor,
    });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error creating labor:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// LABOR PARTS ROUTES - These trigger the workflow cascade!
// ============================================================================

/**
 * POST /labor/:laborId/removed-parts - Add removed part (TRIGGERS CASCADE)
 */
maintenanceRouter.post("/labor/:laborId/removed-parts", async (req: Request, res: Response) => {
  try {
    const laborId = parseInt(req.params.laborId);
    const { asset_id, how_mal, is_pqdr, dr_num } = req.body;
    const userId = (req as any).user?.username || "system";
    const userLocationId = parseInt(req.body.location_id) || 154;

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id is required" });
    }

    const result = await maintenanceService.addRemovedPart({
      laborId,
      assetId: parseInt(asset_id),
      howMal: how_mal,
      isPqdr: is_pqdr === true,
      drNum: dr_num,
      userId,
      userLocationId,
    });

    res.status(201).json({
      message: "Removed part recorded successfully",
      labor_part: result.laborPart,
      workflow_actions: result.workflow,
    });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error adding removed part:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /labor/:laborId/installed-parts - Add installed part (TRIGGERS CASCADE)
 */
maintenanceRouter.post("/labor/:laborId/installed-parts", async (req: Request, res: Response) => {
  try {
    const laborId = parseInt(req.params.laborId);
    const { asset_id } = req.body;
    const userId = (req as any).user?.username || "system";
    const userLocationId = parseInt(req.body.location_id) || 154;

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id is required" });
    }

    const result = await maintenanceService.addInstalledPart({
      laborId,
      assetId: parseInt(asset_id),
      userId,
      userLocationId,
    });

    res.status(201).json({
      message: "Installed part recorded successfully",
      labor_part: result.laborPart,
      workflow_actions: result.workflow,
    });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error adding installed part:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /labor/:laborId/worked-parts - Add worked part (no cascade)
 */
maintenanceRouter.post("/labor/:laborId/worked-parts", async (req: Request, res: Response) => {
  try {
    const laborId = parseInt(req.params.laborId);
    const { asset_id, how_mal } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id is required" });
    }

    const result = await maintenanceService.addWorkedPart({
      laborId,
      assetId: parseInt(asset_id),
      howMal: how_mal,
      userId,
    });

    res.status(201).json({
      message: "Worked part recorded successfully",
      labor_part: result.laborPart,
    });
  } catch (error: any) {
    console.error("[MAINTENANCE] Error adding worked part:", error);
    res.status(500).json({ error: error.message });
  }
});
