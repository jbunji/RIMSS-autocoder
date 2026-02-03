/**
 * Configuration API Routes
 * ========================
 * Asset configuration management endpoints.
 */

import { Router, Request, Response } from "express";
import { configurationService } from "./ConfigurationService";

export const configurationRouter = Router();

// ============================================================================
// CONFIGURATION SET CRUD
// ============================================================================

/**
 * POST /configs - Create a new configuration set
 */
configurationRouter.post("/configs", async (req: Request, res: Response) => {
  try {
    const { pgm_id, cfg_name, cfg_type, partno_id, description } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!pgm_id || !cfg_name) {
      return res.status(400).json({ error: "pgm_id and cfg_name required" });
    }

    const cfgSet = await configurationService.createCfgSet({
      pgmId: parseInt(pgm_id),
      cfgName: cfg_name,
      cfgType: cfg_type,
      partnoId: partno_id ? parseInt(partno_id) : undefined,
      description,
      userId,
    });

    res.status(201).json({ message: "Configuration created", config: cfgSet });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /configs - List configurations for a program
 */
configurationRouter.get("/configs", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.query.pgm_id as string);
    if (!pgmId) {
      return res.status(400).json({ error: "pgm_id required" });
    }

    const configs = await configurationService.getCfgSetsForProgram(pgmId);
    res.json({ configs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /configs/:id - Get configuration with hierarchy
 */
configurationRouter.get("/configs/:id", async (req: Request, res: Response) => {
  try {
    const cfgSetId = parseInt(req.params.id);
    const config = await configurationService.getCfgSet(cfgSetId);

    if (!config) {
      return res.status(404).json({ error: "Configuration not found" });
    }

    res.json({ config });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /configs/:id - Update a configuration
 */
configurationRouter.put("/configs/:id", async (req: Request, res: Response) => {
  try {
    const cfgSetId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const config = await configurationService.updateCfgSet(cfgSetId, {
      ...req.body,
      userId,
    });

    res.json({ message: "Configuration updated", config });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /configs/:id - Delete a configuration
 */
configurationRouter.delete("/configs/:id", async (req: Request, res: Response) => {
  try {
    const cfgSetId = parseInt(req.params.id);
    await configurationService.deleteCfgSet(cfgSetId);
    res.json({ message: "Configuration deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /configs/:id/copy - Copy a configuration
 */
configurationRouter.post("/configs/:id/copy", async (req: Request, res: Response) => {
  try {
    const cfgSetId = parseInt(req.params.id);
    const { new_name } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!new_name) {
      return res.status(400).json({ error: "new_name required" });
    }

    const config = await configurationService.copyConfiguration(cfgSetId, new_name, userId);
    res.status(201).json({ message: "Configuration copied", config });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// CONFIGURATION ITEMS
// ============================================================================

/**
 * POST /configs/:id/items - Add part to configuration
 */
configurationRouter.post("/configs/:id/items", async (req: Request, res: Response) => {
  try {
    const cfgSetId = parseInt(req.params.id);
    const { parent_partno_id, child_partno_id, sort_order, qpa } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!parent_partno_id || !child_partno_id) {
      return res.status(400).json({ error: "parent_partno_id and child_partno_id required" });
    }

    const item = await configurationService.addConfigItem(cfgSetId, {
      parentPartnoId: parseInt(parent_partno_id),
      childPartnoId: parseInt(child_partno_id),
      sortOrder: sort_order ? parseInt(sort_order) : undefined,
      qpa: qpa ? parseInt(qpa) : undefined,
    }, userId);

    res.status(201).json({ message: "Item added", item });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /configs/items/:listId - Remove item from configuration
 */
configurationRouter.delete("/configs/items/:listId", async (req: Request, res: Response) => {
  try {
    const listId = parseInt(req.params.listId);
    await configurationService.removeConfigItem(listId);
    res.json({ message: "Item removed" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ASSET CONFIGURATION
// ============================================================================

/**
 * POST /assets/:assetId/assign-config - Assign asset to configuration
 */
configurationRouter.post("/assets/:assetId/assign-config", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const { cfg_set_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!cfg_set_id) {
      return res.status(400).json({ error: "cfg_set_id required" });
    }

    const asset = await configurationService.assignAssetToConfig(
      assetId, parseInt(cfg_set_id), userId
    );

    res.json({ message: "Asset assigned to configuration", asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:assetId/configuration - Get asset configuration
 */
configurationRouter.get("/assets/:assetId/configuration", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const config = await configurationService.getAssetConfiguration(assetId);

    if (!config) {
      return res.status(404).json({ error: "Asset has no configuration assigned" });
    }

    res.json({ config });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:assetId/compare-config - Compare actual vs configured
 */
configurationRouter.get("/assets/:assetId/compare-config", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const comparison = await configurationService.compareConfiguration(assetId);
    res.json({ comparison });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /configs/:id/assets - Get assets using a configuration
 */
configurationRouter.get("/configs/:id/assets", async (req: Request, res: Response) => {
  try {
    const cfgSetId = parseInt(req.params.id);
    const assets = await configurationService.getAssetsUsingConfig(cfgSetId);
    res.json({ assets, count: assets.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
