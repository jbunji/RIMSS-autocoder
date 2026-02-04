/**
 * PartsOrderingService
 * ====================
 * Implements the RIMSS parts ordering workflow from legacy ColdFusion.
 * 
 * 5-Step Lifecycle:
 * 1. REQUESTED - Tech requests part
 * 2. APPROVED - Supervisor approves
 * 3. ORDERED - Supply orders from vendor
 * 4. RECEIVED - Part arrives at location
 * 5. ISSUED - Part issued to technician for install
 * 
 * Also handles:
 * - MICAP priority escalation
 * - Auto-reorder at min stock levels
 * - Part substitution tracking
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export type OrderStatus = "REQUESTED" | "APPROVED" | "ORDERED" | "RECEIVED" | "ISSUED" | "CANCELLED";

export interface PartsOrderData {
  orderId?: number;
  partnoId: number;
  quantity: number;
  eventId?: number;      // Associated maintenance event
  repairId?: number;     // Associated repair
  requestedBy: string;
  locationId: number;
  priority?: "ROUTINE" | "URGENT" | "MICAP";
  notes?: string;
  substitutePartnoId?: number;  // If ordering substitute
}

// ============================================================================
// SERVICE
// ============================================================================

export class PartsOrderingService {

  /**
   * Create a new parts order request
   */
  async createOrder(data: PartsOrderData): Promise<any> {
    // Get the part info
    const part = await prisma.partList.findUnique({
      where: { partno_id: data.partnoId },
    });

    if (!part) throw new Error("Part not found");

    // Check current stock at location
    const stockCount = await prisma.asset.count({
      where: {
        partno_id: data.partnoId,
        loc_idc: data.locationId,
        status_cd: "FMC",
        active: true,
      },
    });

    // Generate order number
    const orderNo = await this.generateOrderNumber(data.locationId);

    // Create the order
    const order = await prisma.partsOrder.create({
      data: {
        order_no: orderNo,
        partno_id: data.partnoId,
        quantity: data.quantity,
        event_id: data.eventId,
        repair_id: data.repairId,
        loc_id: data.locationId,
        status: "REQUESTED",
        priority: data.priority || "ROUTINE",
        notes: data.notes,
        substitute_partno_id: data.substitutePartnoId,
        requested_by: data.requestedBy,
        requested_date: new Date(),
        current_stock: stockCount,
        ins_by: data.requestedBy,
        ins_date: new Date(),
      },
      include: {
        part: true,
        location: true,
        event: true,
      },
    });

    // Log the order creation
    await this.logOrderHistory(order.order_id, "REQUESTED", data.requestedBy, "Order created");

    // Auto-approve if MICAP priority
    if (data.priority === "MICAP") {
      return this.approveOrder(order.order_id, "SYSTEM", "Auto-approved: MICAP priority");
    }

    return order;
  }

  /**
   * Approve a parts order (moves to APPROVED status)
   */
  async approveOrder(orderId: number, approvedBy: string, notes?: string): Promise<any> {
    const order = await prisma.partsOrder.findUnique({
      where: { order_id: orderId },
    });

    if (!order) throw new Error("Order not found");
    if (order.status !== "REQUESTED") {
      throw new Error(`Cannot approve order in ${order.status} status`);
    }

    const updated = await prisma.partsOrder.update({
      where: { order_id: orderId },
      data: {
        status: "APPROVED",
        approved_by: approvedBy,
        approved_date: new Date(),
        chg_by: approvedBy,
        chg_date: new Date(),
      },
      include: { part: true, location: true },
    });

    await this.logOrderHistory(orderId, "APPROVED", approvedBy, notes || "Order approved");

    return updated;
  }

  /**
   * Mark order as ordered from vendor (moves to ORDERED status)
   */
  async markOrdered(orderId: number, orderedBy: string, vendorInfo?: {
    vendorName?: string;
    vendorOrderNo?: string;
    expectedDate?: Date;
    unitCost?: number;
  }): Promise<any> {
    const order = await prisma.partsOrder.findUnique({
      where: { order_id: orderId },
    });

    if (!order) throw new Error("Order not found");
    if (order.status !== "APPROVED") {
      throw new Error(`Cannot mark as ordered from ${order.status} status`);
    }

    const updated = await prisma.partsOrder.update({
      where: { order_id: orderId },
      data: {
        status: "ORDERED",
        ordered_by: orderedBy,
        ordered_date: new Date(),
        vendor_name: vendorInfo?.vendorName,
        vendor_order_no: vendorInfo?.vendorOrderNo,
        expected_date: vendorInfo?.expectedDate,
        unit_cost: vendorInfo?.unitCost,
        chg_by: orderedBy,
        chg_date: new Date(),
      },
      include: { part: true, location: true },
    });

    await this.logOrderHistory(orderId, "ORDERED", orderedBy, 
      `Ordered from ${vendorInfo?.vendorName || "vendor"}`);

    return updated;
  }

  /**
   * Mark order as received (moves to RECEIVED status)
   */
  async markReceived(orderId: number, receivedBy: string, receiptInfo?: {
    quantityReceived?: number;
    tcn?: string;  // Transportation Control Number
    notes?: string;
  }): Promise<any> {
    const order = await prisma.partsOrder.findUnique({
      where: { order_id: orderId },
    });

    if (!order) throw new Error("Order not found");
    if (order.status !== "ORDERED") {
      throw new Error(`Cannot mark as received from ${order.status} status`);
    }

    const qtyReceived = receiptInfo?.quantityReceived || order.quantity;

    const updated = await prisma.partsOrder.update({
      where: { order_id: orderId },
      data: {
        status: "RECEIVED",
        received_by: receivedBy,
        received_date: new Date(),
        quantity_received: qtyReceived,
        tcn: receiptInfo?.tcn,
        chg_by: receivedBy,
        chg_date: new Date(),
      },
      include: { part: true, location: true },
    });

    await this.logOrderHistory(orderId, "RECEIVED", receivedBy, 
      `Received ${qtyReceived} of ${order.quantity} ordered. ${receiptInfo?.notes || ""}`);

    // If associated with a repair, notify (future: could trigger notification)
    if (order.repair_id) {
      console.log(`[PARTS_ORDER] Parts received for repair ${order.repair_id}`);
    }

    return updated;
  }

  /**
   * Issue parts to technician (moves to ISSUED status - terminal)
   */
  async issueParts(orderId: number, issuedTo: string, issuedBy: string): Promise<any> {
    const order = await prisma.partsOrder.findUnique({
      where: { order_id: orderId },
      include: { part: true },
    });

    if (!order) throw new Error("Order not found");
    if (order.status !== "RECEIVED") {
      throw new Error(`Cannot issue parts from ${order.status} status`);
    }

    const updated = await prisma.partsOrder.update({
      where: { order_id: orderId },
      data: {
        status: "ISSUED",
        issued_to: issuedTo,
        issued_by: issuedBy,
        issued_date: new Date(),
        chg_by: issuedBy,
        chg_date: new Date(),
      },
      include: { part: true, location: true },
    });

    await this.logOrderHistory(orderId, "ISSUED", issuedBy, 
      `Parts issued to ${issuedTo}`);

    return updated;
  }

  /**
   * Cancel an order (can only cancel before RECEIVED)
   */
  async cancelOrder(orderId: number, cancelledBy: string, reason: string): Promise<any> {
    const order = await prisma.partsOrder.findUnique({
      where: { order_id: orderId },
    });

    if (!order) throw new Error("Order not found");
    if (["RECEIVED", "ISSUED"].includes(order.status)) {
      throw new Error(`Cannot cancel order in ${order.status} status`);
    }

    const updated = await prisma.partsOrder.update({
      where: { order_id: orderId },
      data: {
        status: "CANCELLED",
        cancelled_by: cancelledBy,
        cancelled_date: new Date(),
        cancel_reason: reason,
        chg_by: cancelledBy,
        chg_date: new Date(),
      },
    });

    await this.logOrderHistory(orderId, "CANCELLED", cancelledBy, reason);

    return updated;
  }

  /**
   * Check stock levels and create auto-reorder if below minimum
   * NOTE: Disabled - PartList doesn't have min_stock/max_stock fields
   */
  async checkAndAutoReorder(_partnoId: number, _locationId: number, _userId: string): Promise<any | null> {
    console.log('[PARTS_ORDER] checkAndAutoReorder not implemented - no stock level config in schema');
    return null;
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  async getOrdersForLocation(locationId: number, status?: OrderStatus): Promise<any[]> {
    return prisma.partsOrder.findMany({
      where: {
        loc_id: locationId,
        ...(status && { status }),
      },
      include: {
        part: true,
        location: true,
        event: true,
      },
      orderBy: [
        { priority: "desc" },
        { requested_date: "desc" },
      ],
    });
  }

  async getOrdersForRepair(repairId: number): Promise<any[]> {
    return prisma.partsOrder.findMany({
      where: { repair_id: repairId },
      include: { part: true },
      orderBy: { requested_date: "desc" },
    });
  }

  async getOrderHistory(orderId: number): Promise<any[]> {
    return prisma.partsOrderHistory.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: "asc" },
    });
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private async generateOrderNumber(locationId: number): Promise<string> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    
    const count = await prisma.partsOrder.count({
      where: {
        loc_id: locationId,
        ins_date: { gte: new Date(now.getFullYear(), now.getMonth(), 1) },
      },
    });

    return `PO-${locationId}-${year}${month}-${(count + 1).toString().padStart(4, "0")}`;
  }

  private async logOrderHistory(
    orderId: number, 
    status: string, 
    userId: string, 
    notes: string
  ): Promise<void> {
    await prisma.partsOrderHistory.create({
      data: {
        order_id: orderId,
        status,
        changed_by: userId,
        notes,
        created_at: new Date(),
      },
    });
  }
}

// Export singleton
export const partsOrderingService = new PartsOrderingService();
