/**
 * ShippingService
 * ===============
 * Asset shipping and receiving workflow management.
 * 
 * Tracks assets in transit between locations:
 * - Ship assets from one location to another
 * - Track in-transit status
 * - Receive assets at destination
 * - Generate shipping documents (TCN tracking)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export interface ShipmentData {
  assetIds: number[];
  fromLocationId: number;
  toLocationId: number;
  shipper?: string;        // Carrier name
  tcn?: string;            // Transportation Control Number
  expectedDate?: Date;
  remarks?: string;
  userId: string;
}

export interface ReceiptData {
  assetId: number;
  condition?: string;      // SERVICEABLE, UNSERVICEABLE, DAMAGED
  remarks?: string;
  userId: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export class ShippingService {

  /**
   * Ship assets to another location
   */
  async shipAssets(data: ShipmentData): Promise<{
    shipped: number;
    assets: any[];
    tcn: string;
  }> {
    // Generate TCN if not provided
    const tcn = data.tcn || await this.generateTcn(data.fromLocationId);

    const shippedAssets = [];

    for (const assetId of data.assetIds) {
      const asset = await prisma.asset.update({
        where: { asset_id: assetId },
        data: {
          in_transit: true,
          ship_date: new Date(),
          loc_idc: null,  // No longer at current location
          shipper: data.shipper,
          tcn,
          chg_by: data.userId,
          chg_date: new Date(),
        },
        include: { part: true },
      });

      shippedAssets.push(asset);

      console.log(`[SHIPPING] Asset ${asset.serno} shipped via TCN ${tcn}`);
    }

    // Create shipment record
    await prisma.shipment.create({
      data: {
        tcn,
        from_loc_id: data.fromLocationId,
        to_loc_id: data.toLocationId,
        shipper: data.shipper,
        ship_date: new Date(),
        expected_date: data.expectedDate,
        asset_count: data.assetIds.length,
        status: "IN_TRANSIT",
        remarks: data.remarks,
        ins_by: data.userId,
        ins_date: new Date(),
      },
    });

    return {
      shipped: shippedAssets.length,
      assets: shippedAssets,
      tcn,
    };
  }

  /**
   * Receive a shipped asset at destination
   */
  async receiveAsset(data: ReceiptData): Promise<any> {
    const asset = await prisma.asset.findUnique({
      where: { asset_id: data.assetId },
    });

    if (!asset) throw new Error("Asset not found");
    if (!asset.in_transit) throw new Error("Asset is not in transit");

    // Get destination from shipment record
    const shipment = await prisma.shipment.findFirst({
      where: {
        tcn: asset.tcn,
        status: "IN_TRANSIT",
      },
    });

    const toLocationId = shipment?.to_loc_id || asset.loc_ida;

    // Update asset
    const received = await prisma.asset.update({
      where: { asset_id: data.assetId },
      data: {
        in_transit: false,
        recv_date: new Date(),
        loc_idc: toLocationId,
        status_cd: data.condition === "DAMAGED" ? "NMCM" : asset.status_cd,
        chg_by: data.userId,
        chg_date: new Date(),
      },
      include: {
        part: true,
        currentLocation: true,
      },
    });

    // Check if all assets in shipment received
    if (shipment) {
      const stillInTransit = await prisma.asset.count({
        where: { tcn: shipment.tcn, in_transit: true },
      });

      if (stillInTransit === 0) {
        await prisma.shipment.update({
          where: { shipment_id: shipment.shipment_id },
          data: {
            status: "RECEIVED",
            recv_date: new Date(),
            chg_by: data.userId,
            chg_date: new Date(),
          },
        });
      }
    }

    console.log(`[SHIPPING] Asset ${received.serno} received at location ${toLocationId}`);

    return received;
  }

  /**
   * Receive all assets in a shipment
   */
  async receiveShipment(tcn: string, userId: string): Promise<{
    received: number;
    assets: any[];
  }> {
    const assets = await prisma.asset.findMany({
      where: { tcn, in_transit: true },
    });

    const receivedAssets = [];
    for (const asset of assets) {
      const received = await this.receiveAsset({
        assetId: asset.asset_id,
        userId,
      });
      receivedAssets.push(received);
    }

    return {
      received: receivedAssets.length,
      assets: receivedAssets,
    };
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Get assets in transit
   */
  async getInTransitAssets(locationId?: number): Promise<any[]> {
    const whereClause: any = { in_transit: true };

    if (locationId) {
      whereClause.loc_ida = locationId;
    }

    return prisma.asset.findMany({
      where: whereClause,
      include: {
        part: true,
        assignedLocation: true,
      },
      orderBy: { ship_date: "asc" },
    });
  }

  /**
   * Get pending receipts for a location
   */
  async getPendingReceipts(locationId: number): Promise<any[]> {
    return prisma.shipment.findMany({
      where: {
        to_loc_id: locationId,
        status: "IN_TRANSIT",
      },
      orderBy: { expected_date: "asc" },
    });
  }

  /**
   * Get shipment by TCN
   */
  async getShipmentByTcn(tcn: string): Promise<any> {
    const shipment = await prisma.shipment.findFirst({
      where: { tcn },
      include: {
        fromLocation: true,
        toLocation: true,
      },
    });

    if (!shipment) return null;

    // Get assets in this shipment
    const assets = await prisma.asset.findMany({
      where: { tcn },
      include: { part: true },
    });

    return { ...shipment, assets };
  }

  /**
   * Get shipment history for a location
   */
  async getLocationShipmentHistory(locationId: number, limit: number = 50): Promise<any[]> {
    return prisma.shipment.findMany({
      where: {
        OR: [
          { from_loc_id: locationId },
          { to_loc_id: locationId },
        ],
      },
      include: {
        fromLocation: true,
        toLocation: true,
      },
      orderBy: { ship_date: "desc" },
      take: limit,
    });
  }

  /**
   * Get overdue shipments
   */
  async getOverdueShipments(): Promise<any[]> {
    const now = new Date();

    return prisma.shipment.findMany({
      where: {
        status: "IN_TRANSIT",
        expected_date: { lt: now },
      },
      include: {
        fromLocation: true,
        toLocation: true,
      },
      orderBy: { expected_date: "asc" },
    });
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private async generateTcn(locationId: number): Promise<string> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
    );

    const count = await prisma.shipment.count({
      where: {
        from_loc_id: locationId,
        ins_date: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
      },
    });

    return `TCN-${locationId}-${year}${dayOfYear.toString().padStart(3, "0")}-${(count + 1).toString().padStart(4, "0")}`;
  }
}

// Export singleton
export const shippingService = new ShippingService();
