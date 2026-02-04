/**
 * Software API Routes
 * ===================
 * Software configuration tracking.
 */

import { Router, Request, Response } from "express";
import { softwareService } from "./SoftwareService";

export const softwareRouter = Router();

/**
 * POST / - Add a software record
 */
softwareRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { sw_number, sw_type, revision, sw_title, sw_desc } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!sw_number) {
      return res.status(400).json({ error: "sw_number required" });
    }

    const software = await softwareService.addSoftware({
      swNumber: sw_number,
      swType: sw_type,
      revision,
      swTitle: sw_title,
      swDesc: sw_desc,
      userId,
    });

    res.status(201).json({ message: "Software added", software });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET / - Get all software records
 */
softwareRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const software = await softwareService.getAllSoftware();
    res.json({ software, count: software.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /install - Install software on asset
 */
softwareRouter.post("/install", async (req: Request, res: Response) => {
  try {
    const { sw_id, asset_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!sw_id || !asset_id) {
      return res.status(400).json({ error: "sw_id and asset_id required" });
    }

    const result = await softwareService.installOnAsset(
      parseInt(sw_id),
      parseInt(asset_id),
      userId
    );

    res.status(201).json({ message: "Software installed", result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /asset/:assetId - Get software on an asset
 */
softwareRouter.get("/asset/:assetId", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const software = await softwareService.getAssetSoftware(assetId);
    res.json({ software, count: software.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /:swId/assets - Get assets with specific software
 */
softwareRouter.get("/:swId/assets", async (req: Request, res: Response) => {
  try {
    const swId = parseInt(req.params.swId);
    const assets = await softwareService.getAssetsWithSoftware(swId);
    res.json({ assets, count: assets.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /asset/:swAssetId - Remove software from asset
 */
softwareRouter.delete("/asset/:swAssetId", async (req: Request, res: Response) => {
  try {
    const swAssetId = parseInt(req.params.swAssetId);
    await softwareService.removeFromAsset(swAssetId);
    res.json({ message: "Software removed from asset" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
