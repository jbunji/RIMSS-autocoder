/**
 * Shipping API Routes
 * ===================
 * Asset shipping and receiving workflow.
 */

import { Router, Request, Response } from "express";
import { shippingService } from "./ShippingService";

export const shippingRouter = Router();

// ============================================================================
// SHIPPING
// ============================================================================

/**
 * POST /ship - Ship assets to another location
 */
shippingRouter.post("/ship", async (req: Request, res: Response) => {
  try {
    const {
      asset_ids, from_location_id, to_location_id,
      shipper, tcn, expected_date, remarks
    } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!asset_ids?.length || !from_location_id || !to_location_id) {
      return res.status(400).json({ 
        error: "asset_ids, from_location_id, and to_location_id required" 
      });
    }

    const result = await shippingService.shipAssets({
      assetIds: asset_ids.map((id: any) => parseInt(id)),
      fromLocationId: parseInt(from_location_id),
      toLocationId: parseInt(to_location_id),
      shipper,
      tcn,
      expectedDate: expected_date ? new Date(expected_date) : undefined,
      remarks,
      userId,
    });

    res.status(201).json({
      message: `Shipped ${result.shipped} assets`,
      tcn: result.tcn,
      assets: result.assets,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /receive/:assetId - Receive a single asset
 */
shippingRouter.post("/receive/:assetId", async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId);
    const { condition, remarks } = req.body;
    const userId = (req as any).user?.username || "system";

    const asset = await shippingService.receiveAsset({
      assetId,
      condition,
      remarks,
      userId,
    });

    res.json({ message: "Asset received", asset });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /receive-shipment/:tcn - Receive all assets in a shipment
 */
shippingRouter.post("/receive-shipment/:tcn", async (req: Request, res: Response) => {
  try {
    const tcn = req.params.tcn;
    const userId = (req as any).user?.username || "system";

    const result = await shippingService.receiveShipment(tcn, userId);

    res.json({
      message: `Received ${result.received} assets`,
      assets: result.assets,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// QUERIES
// ============================================================================

/**
 * GET /in-transit - Get assets in transit
 */
shippingRouter.get("/in-transit", async (req: Request, res: Response) => {
  try {
    const locationId = req.query.location_id 
      ? parseInt(req.query.location_id as string) 
      : undefined;

    const assets = await shippingService.getInTransitAssets(locationId);
    res.json({ assets, count: assets.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /pending/:locationId - Get pending receipts for location
 */
shippingRouter.get("/pending/:locationId", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const shipments = await shippingService.getPendingReceipts(locationId);
    res.json({ shipments, count: shipments.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /shipment/:tcn - Get shipment details by TCN
 */
shippingRouter.get("/shipment/:tcn", async (req: Request, res: Response) => {
  try {
    const tcn = req.params.tcn;
    const shipment = await shippingService.getShipmentByTcn(tcn);

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.json({ shipment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /history/:locationId - Get shipment history for location
 */
shippingRouter.get("/history/:locationId", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const limit = parseInt(req.query.limit as string) || 50;
    const history = await shippingService.getLocationShipmentHistory(locationId, limit);
    res.json({ shipments: history });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /overdue - Get overdue shipments
 */
shippingRouter.get("/overdue", async (req: Request, res: Response) => {
  try {
    const shipments = await shippingService.getOverdueShipments();
    res.json({ shipments, count: shipments.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
