/**
 * Software API Routes
 * ===================
 * Software/firmware version tracking.
 */

import { Router, Request, Response } from "express";
import { softwareService } from "./SoftwareService";

export const softwareRouter = Router();

/**
 * POST /software - Create software version
 */
softwareRouter.post("/software", async (req: Request, res: Response) => {
  try {
    const { pgm_id, sw_name, sw_version, sw_type, partno_id, release_date, remarks } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!pgm_id || !sw_name || !sw_version) {
      return res.status(400).json({ error: "pgm_id, sw_name, and sw_version required" });
    }

    const software = await softwareService.createSoftware({
      pgmId: parseInt(pgm_id),
      swName: sw_name,
      swVersion: sw_version,
      swType: sw_type,
      partnoId: partno_id ? parseInt(partno_id) : undefined,
      releaseDate: release_date ? new Date(release_date) : undefined,
      remarks,
      userId,
    });

    res.status(201).json({ message: "Software created", software });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /software - List software for program
 */
softwareRouter.get("/software", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);
    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const software = await softwareService.getSoftwareForProgram(pgmId);
    res.json({ software });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /software/:id - Get software by ID
 */
softwareRouter.get("/software/:id", async (req: Request, res: Response) => {
  try {
    const swId = parseInt(req.params.id);
    const software = await softwareService.getSoftware(swId);

    if (!software) {
      return res.status(404).json({ error: "Software not found" });
    }

    res.json({ software });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /software/:id/assets - Get assets with this software
 */
softwareRouter.get("/software/:id/assets", async (req: Request, res: Response) => {
  try {
    const swId = parseInt(req.params.id);
    const assets = await softwareService.getAssetsWithSoftware(swId);
    res.json({ assets, count: assets.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /software/:id/install - Install on asset
 */
softwareRouter.post("/software/:id/install", async (req: Request, res: Response) => {
  try {
    const swId = parseInt(req.params.id);
    const { asset_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id required" });
    }

    const installation = await softwareService.installOnAsset(swId, parseInt(asset_id), userId);
    res.status(201).json({ message: "Software installed", installation });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /software/:id/uninstall - Uninstall from asset
 */
softwareRouter.post("/software/:id/uninstall", async (req: Request, res: Response) => {
  try {
    const swId = parseInt(req.params.id);
    const { asset_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_id) {
      return res.status(400).json({ error: "asset_id required" });
    }

    await softwareService.uninstallFromAsset(swId, parseInt(asset_id), userId);
    res.json({ message: "Software uninstalled" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /assets/:assetId/update-software - Update software on asset
 */
softwareRouter.post("/assets/:assetId/update-software", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const { old_sw_id, new_sw_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!new_sw_id) {
      return res.status(400).json({ error: "new_sw_id required" });
    }

    const installation = await softwareService.updateSoftwareOnAsset({
      assetId,
      oldSwId: old_sw_id ? parseInt(old_sw_id) : undefined,
      newSwId: parseInt(new_sw_id),
      userId,
    });

    res.json({ message: "Software updated", installation });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /assets/:assetId/software - Get software on asset
 */
softwareRouter.get("/assets/:assetId/software", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const software = await softwareService.getAssetSoftware(assetId);
    res.json({ software });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:assetId/software-history - Get installation history
 */
softwareRouter.get("/assets/:assetId/software-history", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const history = await softwareService.getInstallationHistory(assetId);
    res.json({ history });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /software/needs-update - Find assets needing update
 */
softwareRouter.get("/software/needs-update", async (req: Request, res: Response) => {
  try {
    const oldSwId = parseInt(req.query.old_sw_id as string);
    const newSwId = parseInt(req.query.new_sw_id as string);

    if (!oldSwId || !newSwId) {
      return res.status(400).json({ error: "old_sw_id and new_sw_id required" });
    }

    const assets = await softwareService.findAssetsNeedingUpdate(oldSwId, newSwId);
    res.json({ assets, count: assets.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /software/compliance - Get compliance summary
 */
softwareRouter.get("/software/compliance", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);
    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const summary = await softwareService.getSoftwareComplianceSummary(pgmId);
    res.json({ summary });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
