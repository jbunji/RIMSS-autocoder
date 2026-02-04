/**
 * Inventory API Routes
 * ====================
 * Asset inventory search, export, and management.
 */

import { Router, Request, Response } from "express";
import { inventoryService } from "./InventoryService";

export const inventoryRouter = Router();

/**
 * GET /assets - Search inventory
 */
inventoryRouter.get("/assets", async (req: Request, res: Response) => {
  try {
    const result = await inventoryService.searchInventory({
      pgmId: req.query.pgm_id ? parseInt(req.query.pgm_id as string) : undefined,
      locationId: req.query.loc_id ? parseInt(req.query.loc_id as string) : undefined,
      partnoId: req.query.partno_id ? parseInt(req.query.partno_id as string) : undefined,
      serno: req.query.serno as string,
      partno: req.query.partno as string,
      statusCd: req.query.status_cd as string,
      inTransit: req.query.in_transit === "true" ? true : req.query.in_transit === "false" ? false : undefined,
      limit: parseInt(req.query.limit as string) || 50,
      offset: parseInt(req.query.offset as string) || 0,
      sortBy: req.query.sort_by as string,
      sortOrder: req.query.sort_order as "asc" | "desc",
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/export - Export inventory to CSV
 */
inventoryRouter.get("/assets/export", async (req: Request, res: Response) => {
  try {
    const csv = await inventoryService.exportInventory({
      pgmId: req.query.pgm_id ? parseInt(req.query.pgm_id as string) : undefined,
      locationId: req.query.loc_id ? parseInt(req.query.loc_id as string) : undefined,
      statusCd: req.query.status_cd as string,
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=inventory.csv");
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:id - Get asset details
 */
inventoryRouter.get("/assets/:id", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    const asset = await inventoryService.getAssetDetails(assetId);

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.json({ asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:id/children - Get child assets
 */
inventoryRouter.get("/assets/:id/children", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    const children = await inventoryService.getChildAssets(assetId);
    res.json({ children, count: children.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /assets/:id/validate - Validate an asset
 */
inventoryRouter.post("/assets/:id/validate", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const asset = await inventoryService.validateAsset(assetId, userId);
    res.json({ message: "Asset validated", asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /assets/:id/status - Update asset status
 */
inventoryRouter.put("/assets/:id/status", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    const { status_cd } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!status_cd) {
      return res.status(400).json({ error: "status_cd required" });
    }

    const asset = await inventoryService.updateAssetStatus(assetId, status_cd, userId);
    res.json({ message: "Status updated", asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /assets/:id/move - Move asset to new location
 */
inventoryRouter.put("/assets/:id/move", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    const { loc_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!loc_id) {
      return res.status(400).json({ error: "loc_id required" });
    }

    const asset = await inventoryService.moveAsset(assetId, parseInt(loc_id), userId);
    res.json({ message: "Asset moved", asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /stock-levels - Get stock levels by part
 */
inventoryRouter.get("/stock-levels", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.query.loc_id as string);
    const pgmId = req.query.pgm_id ? parseInt(req.query.pgm_id as string) : undefined;

    if (!locationId) {
      return res.status(400).json({ error: "loc_id required" });
    }

    const stockLevels = await inventoryService.getStockLevels(locationId, pgmId);
    res.json({ stockLevels });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /reconciliation - Get assets needing reconciliation
 */
inventoryRouter.get("/reconciliation", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.query.loc_id as string);
    const days = parseInt(req.query.days as string) || 90;

    if (!locationId) {
      return res.status(400).json({ error: "loc_id required" });
    }

    const assets = await inventoryService.getAssetsNeedingReconciliation(locationId, days);
    res.json({ assets, count: assets.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
