/**
 * TCTO API Routes
 * ================
 * REST endpoints for Time Compliance Technical Order management.
 */

import { Router, Request, Response } from "express";
import { tctoService } from "./TctoService";

export const tctoRouter = Router();

// ============================================================================
// TCTO MANAGEMENT
// ============================================================================

/**
 * GET /tctos - List TCTOs for a program with compliance stats
 */
tctoRouter.get("/tctos", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);
    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const tctos = await tctoService.getTctosForProgram(pgmId);
    res.json({ tctos });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /tctos - Create new TCTO
 */
tctoRouter.post("/tctos", async (req: Request, res: Response) => {
  try {
    const {
      pgm_id, tcto_no, tcto_type, tcto_code, wuc_cd,
      sys_type, station_type, old_partno_id, new_partno_id,
      eff_date, remarks
    } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!pgm_id || !tcto_no) {
      return res.status(400).json({ error: "pgm_id and tcto_no required" });
    }

    const tcto = await tctoService.createTcto({
      pgmId: parseInt(pgm_id),
      tctoNo: tcto_no,
      tctoType: tcto_type,
      tctoCode: tcto_code,
      wucCd: wuc_cd,
      sysType: sys_type,
      stationType: station_type,
      oldPartnoId: old_partno_id ? parseInt(old_partno_id) : undefined,
      newPartnoId: new_partno_id ? parseInt(new_partno_id) : undefined,
      effDate: eff_date ? new Date(eff_date) : undefined,
      remarks,
      userId,
    });

    res.status(201).json({ message: "TCTO created", tcto });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /tctos/:id/assign-applicable - Auto-assign applicable assets
 */
tctoRouter.post("/tctos/:id/assign-applicable", async (req: Request, res: Response) => {
  try {
    const tctoId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const result = await tctoService.assignApplicableAssets(tctoId, userId);
    res.json({
      message: `Assigned ${result.assigned} assets`,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /tctos/:id/assign - Manually assign an asset
 */
tctoRouter.post("/tctos/:id/assign", async (req: Request, res: Response) => {
  try {
    const tctoId = parseInt(req.params.id);
    const { asset_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id required" });
    }

    const assignment = await tctoService.assignAsset(tctoId, parseInt(asset_id), userId);
    res.status(201).json({ message: "Asset assigned", assignment });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /tctos/:id/complete - Record compliance for an asset
 */
tctoRouter.post("/tctos/:id/complete", async (req: Request, res: Response) => {
  try {
    const tctoId = parseInt(req.params.id);
    const { asset_id, repair_id, remarks } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id required" });
    }

    const result = await tctoService.recordCompliance({
      tctoId,
      assetId: parseInt(asset_id),
      repairId: repair_id ? parseInt(repair_id) : undefined,
      remarks,
      userId,
    });

    res.json({ message: "Compliance recorded", assignment: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /tctos/:id/validate - Supervisor validates completion
 */
tctoRouter.post("/tctos/:id/validate", async (req: Request, res: Response) => {
  try {
    const tctoId = parseInt(req.params.id);
    const { asset_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id required" });
    }

    const result = await tctoService.validateCompletion(tctoId, parseInt(asset_id), userId);
    res.json({ message: "Validation complete", assignment: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /tctos/:id/create-event - Create maintenance event for TCTO work
 */
tctoRouter.post("/tctos/:id/create-event", async (req: Request, res: Response) => {
  try {
    const tctoId = parseInt(req.params.id);
    const { asset_id, location_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id required" });
    }

    const result = await tctoService.createTctoEvent({
      tctoId,
      assetId: parseInt(asset_id),
      locationId: parseInt(location_id) || 154,
      userId,
    });

    res.status(201).json({
      message: "TCTO event created",
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
 * GET /assets/:id/pending-tctos - Get pending TCTOs for an asset
 */
tctoRouter.get("/assets/:id/pending-tctos", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    const pending = await tctoService.getPendingTctosForAsset(assetId);
    res.json({ pending });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /overdue - Get overdue TCTOs for a program
 */
tctoRouter.get("/overdue", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);
    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const overdue = await tctoService.getOverdueTctos(pgmId);
    res.json({ overdue, count: overdue.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /location/:id/compliance - Get TCTO compliance for a location
 */
tctoRouter.get("/location/:id/compliance", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.id);
    const compliance = await tctoService.getLocationCompliance(locationId);
    res.json({ compliance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
