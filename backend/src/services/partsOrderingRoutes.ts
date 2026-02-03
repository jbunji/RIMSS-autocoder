/**
 * Parts Ordering API Routes
 * =========================
 * REST endpoints for the 5-step parts ordering workflow.
 */

import { Router, Request, Response } from "express";
import { partsOrderingService } from "./PartsOrderingService";

export const partsOrderingRouter = Router();

// ============================================================================
// ORDER LIFECYCLE
// ============================================================================

/**
 * POST /orders - Create new parts order
 */
partsOrderingRouter.post("/orders", async (req: Request, res: Response) => {
  try {
    const {
      partno_id, quantity, event_id, repair_id, location_id,
      priority, notes, substitute_partno_id
    } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!partno_id || !quantity) {
      return res.status(400).json({ error: "partno_id and quantity required" });
    }

    const order = await partsOrderingService.createOrder({
      partnoId: parseInt(partno_id),
      quantity: parseInt(quantity),
      eventId: event_id ? parseInt(event_id) : undefined,
      repairId: repair_id ? parseInt(repair_id) : undefined,
      locationId: parseInt(location_id) || 154,
      priority: priority || "ROUTINE",
      notes,
      substitutePartnoId: substitute_partno_id ? parseInt(substitute_partno_id) : undefined,
      requestedBy: userId,
    });

    res.status(201).json({ message: "Order created", order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /orders - List orders for location
 */
partsOrderingRouter.get("/orders", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.query.location_id as string) || 154;
    const status = req.query.status as any;

    const orders = await partsOrderingService.getOrdersForLocation(locationId, status);
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /orders/:id/history - Get order history
 */
partsOrderingRouter.get("/orders/:id/history", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const history = await partsOrderingService.getOrderHistory(orderId);
    res.json({ history });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /orders/:id/approve - Approve order
 */
partsOrderingRouter.post("/orders/:id/approve", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";
    const { notes } = req.body;

    const order = await partsOrderingService.approveOrder(orderId, userId, notes);
    res.json({ message: "Order approved", order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /orders/:id/order - Mark as ordered from vendor
 */
partsOrderingRouter.post("/orders/:id/order", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";
    const { vendor_name, vendor_order_no, expected_date, unit_cost } = req.body;

    const order = await partsOrderingService.markOrdered(orderId, userId, {
      vendorName: vendor_name,
      vendorOrderNo: vendor_order_no,
      expectedDate: expected_date ? new Date(expected_date) : undefined,
      unitCost: unit_cost ? parseFloat(unit_cost) : undefined,
    });

    res.json({ message: "Order marked as ordered", order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /orders/:id/receive - Mark as received
 */
partsOrderingRouter.post("/orders/:id/receive", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";
    const { quantity_received, tcn, notes } = req.body;

    const order = await partsOrderingService.markReceived(orderId, userId, {
      quantityReceived: quantity_received ? parseInt(quantity_received) : undefined,
      tcn,
      notes,
    });

    res.json({ message: "Order received", order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /orders/:id/issue - Issue parts to technician
 */
partsOrderingRouter.post("/orders/:id/issue", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";
    const { issued_to } = req.body;

    if (!issued_to) {
      return res.status(400).json({ error: "issued_to required" });
    }

    const order = await partsOrderingService.issueParts(orderId, issued_to, userId);
    res.json({ message: "Parts issued", order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /orders/:id/cancel - Cancel order
 */
partsOrderingRouter.post("/orders/:id/cancel", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "reason required" });
    }

    const order = await partsOrderingService.cancelOrder(orderId, userId, reason);
    res.json({ message: "Order cancelled", order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /repairs/:repairId/orders - Get orders for a repair
 */
partsOrderingRouter.get("/repairs/:repairId/orders", async (req: Request, res: Response) => {
  try {
    const repairId = parseInt(req.params.repairId);
    const orders = await partsOrderingService.getOrdersForRepair(repairId);
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
