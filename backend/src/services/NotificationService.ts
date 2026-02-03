/**
 * NotificationService
 * ===================
 * User notification and alert management.
 * Uses existing notification table schema.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export interface NotificationCreateData {
  pgmId?: number;
  locationId?: number;
  message: string;
  priority?: string;
  startDate?: Date;
  stopDate?: Date;
  fromUser?: string;
  toUser?: string;
  userId: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export class NotificationService {

  /**
   * Create a notification
   */
  async createNotification(data: NotificationCreateData): Promise<any> {
    const notification = await prisma.notification.create({
      data: {
        pgm_id: data.pgmId,
        loc_id: data.locationId,
        msg_text: data.message,
        priority: data.priority || "NORMAL",
        start_date: data.startDate || new Date(),
        stop_date: data.stopDate,
        from_user: data.fromUser || data.userId,
        to_user: data.toUser,
        acknowledged: false,
        active: true,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: {
        program: true,
        location: true,
      },
    });

    console.log(`[NOTIFICATION] Created notification ${notification.msg_id}`);

    return notification;
  }

  /**
   * Create system notification
   */
  async createSystemNotification(params: {
    pgmId?: number;
    locationId?: number;
    message: string;
    priority?: string;
    toUser?: string;
  }): Promise<any> {
    return this.createNotification({
      pgmId: params.pgmId,
      locationId: params.locationId,
      message: params.message,
      priority: params.priority || "NORMAL",
      toUser: params.toUser,
      fromUser: "SYSTEM",
      userId: "SYSTEM",
    });
  }

  /**
   * Acknowledge a notification
   */
  async acknowledge(msgId: number, userId: string): Promise<any> {
    return prisma.notification.update({
      where: { msg_id: msgId },
      data: {
        acknowledged: true,
        ack_by: userId,
        ack_date: new Date(),
      },
    });
  }

  /**
   * Delete/deactivate a notification
   */
  async deleteNotification(msgId: number): Promise<any> {
    return prisma.notification.update({
      where: { msg_id: msgId },
      data: { active: false },
    });
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Get notifications for a user
   */
  async getNotificationsForUser(params: {
    userId: string;
    pgmId?: number;
    locationId?: number;
    unacknowledgedOnly?: boolean;
    limit?: number;
  }): Promise<any[]> {
    const whereClause: any = {
      active: true,
      OR: [
        { to_user: params.userId },
        { to_user: null },
      ],
    };

    if (params.pgmId) {
      whereClause.pgm_id = params.pgmId;
    }

    if (params.locationId) {
      whereClause.loc_id = params.locationId;
    }

    if (params.unacknowledgedOnly) {
      whereClause.acknowledged = false;
    }

    // Only show active (within date range)
    const now = new Date();
    whereClause.AND = [
      { OR: [{ start_date: null }, { start_date: { lte: now } }] },
      { OR: [{ stop_date: null }, { stop_date: { gte: now } }] },
    ];

    return prisma.notification.findMany({
      where: whereClause,
      include: {
        program: true,
        location: true,
      },
      orderBy: [
        { priority: "desc" },
        { ins_date: "desc" },
      ],
      take: params.limit || 50,
    });
  }

  /**
   * Get unacknowledged count
   */
  async getUnacknowledgedCount(userId: string, pgmId?: number): Promise<number> {
    return prisma.notification.count({
      where: {
        active: true,
        acknowledged: false,
        OR: [
          { to_user: userId },
          { to_user: null },
        ],
        ...(pgmId && { pgm_id: pgmId }),
      },
    });
  }

  /**
   * Get notification by ID
   */
  async getNotification(msgId: number): Promise<any> {
    return prisma.notification.findUnique({
      where: { msg_id: msgId },
      include: {
        program: true,
        location: true,
      },
    });
  }

  /**
   * Get all active notifications for a location
   */
  async getLocationNotifications(locationId: number): Promise<any[]> {
    const now = new Date();

    return prisma.notification.findMany({
      where: {
        active: true,
        loc_id: locationId,
        OR: [
          { stop_date: null },
          { stop_date: { gte: now } },
        ],
      },
      orderBy: { ins_date: "desc" },
    });
  }

  /**
   * Search notifications
   */
  async searchNotifications(params: {
    pgmId?: number;
    locationId?: number;
    searchText?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ notifications: any[]; total: number }> {
    const whereClause: any = { active: true };

    if (params.pgmId) whereClause.pgm_id = params.pgmId;
    if (params.locationId) whereClause.loc_id = params.locationId;

    if (params.searchText) {
      whereClause.msg_text = { contains: params.searchText, mode: "insensitive" };
    }

    if (params.fromDate || params.toDate) {
      whereClause.ins_date = {};
      if (params.fromDate) whereClause.ins_date.gte = params.fromDate;
      if (params.toDate) whereClause.ins_date.lte = params.toDate;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        include: { program: true, location: true },
        orderBy: { ins_date: "desc" },
        take: params.limit || 50,
        skip: params.offset || 0,
      }),
      prisma.notification.count({ where: whereClause }),
    ]);

    return { notifications, total };
  }

  // ============================================================================
  // SYSTEM NOTIFICATION HELPERS
  // ============================================================================

  async notifyOverduePmi(pgmId: number, assetSerno: string, pmiType: string, locId: number): Promise<any> {
    return this.createSystemNotification({
      pgmId,
      locationId: locId,
      message: `OVERDUE PMI: ${pmiType} inspection overdue for asset ${assetSerno}`,
      priority: "HIGH",
    });
  }

  async notifyTctoOverdue(pgmId: number, tctoNo: string, assetSerno: string, locId: number): Promise<any> {
    return this.createSystemNotification({
      pgmId,
      locationId: locId,
      message: `TCTO OVERDUE: ${tctoNo} requires compliance for asset ${assetSerno}`,
      priority: "URGENT",
    });
  }

  async notifyPartsReceived(pgmId: number, orderNo: string, partName: string, locId: number): Promise<any> {
    return this.createSystemNotification({
      pgmId,
      locationId: locId,
      message: `PARTS RECEIVED: Order ${orderNo} (${partName}) ready for pickup`,
      priority: "NORMAL",
    });
  }
}

// Export singleton
export const notificationService = new NotificationService();
