/**
 * Notification API Routes
 * =======================
 * User notification and alert management.
 */

import { Router, Request, Response } from "express";
import { notificationService } from "./NotificationService";

export const notificationRouter = Router();

// ============================================================================
// NOTIFICATION CRUD
// ============================================================================

/**
 * POST /notifications - Create a notification
 */
notificationRouter.post("/notifications", async (req: Request, res: Response) => {
  try {
    const { pgm_id, loc_id, message, priority, start_date, stop_date, to_user } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!message) {
      return res.status(400).json({ error: "message required" });
    }

    const notification = await notificationService.createNotification({
      pgmId: pgm_id ? parseInt(pgm_id) : undefined,
      locationId: loc_id ? parseInt(loc_id) : undefined,
      message,
      priority,
      startDate: start_date ? new Date(start_date) : undefined,
      stopDate: stop_date ? new Date(stop_date) : undefined,
      toUser: to_user,
      userId,
    });

    res.status(201).json({ message: "Notification created", notification });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /notifications - Get notifications for current user
 */
notificationRouter.get("/notifications", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.username || "system";
    const pgmId = req.query.pgm_id ? parseInt(req.query.pgm_id as string) : undefined;
    const locationId = req.query.loc_id ? parseInt(req.query.loc_id as string) : undefined;
    const unacknowledgedOnly = req.query.unacknowledged === "true";
    const limit = parseInt(req.query.limit as string) || 50;

    const notifications = await notificationService.getNotificationsForUser({
      userId,
      pgmId,
      locationId,
      unacknowledgedOnly,
      limit,
    });

    res.json({ notifications, count: notifications.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /notifications/count - Get unacknowledged count
 */
notificationRouter.get("/notifications/count", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.username || "system";
    const pgmId = req.query.pgm_id ? parseInt(req.query.pgm_id as string) : undefined;

    const count = await notificationService.getUnacknowledgedCount(userId, pgmId);
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /notifications/:id - Get single notification
 */
notificationRouter.get("/notifications/:id", async (req: Request, res: Response) => {
  try {
    const msgId = parseInt(req.params.id);
    const notification = await notificationService.getNotification(msgId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ notification });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /notifications/:id/acknowledge - Acknowledge notification
 */
notificationRouter.post("/notifications/:id/acknowledge", async (req: Request, res: Response) => {
  try {
    const msgId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";

    const notification = await notificationService.acknowledge(msgId, userId);
    res.json({ message: "Notification acknowledged", notification });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /notifications/:id - Delete/deactivate notification
 */
notificationRouter.delete("/notifications/:id", async (req: Request, res: Response) => {
  try {
    const msgId = parseInt(req.params.id);
    await notificationService.deleteNotification(msgId);
    res.json({ message: "Notification deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// QUERIES
// ============================================================================

/**
 * GET /notifications/location/:locId - Get notifications for a location
 */
notificationRouter.get("/notifications/location/:locId", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locId);
    const notifications = await notificationService.getLocationNotifications(locationId);
    res.json({ notifications, count: notifications.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /notifications/search - Search notifications
 */
notificationRouter.get("/notifications/search", async (req: Request, res: Response) => {
  try {
    const result = await notificationService.searchNotifications({
      pgmId: req.query.pgm_id ? parseInt(req.query.pgm_id as string) : undefined,
      locationId: req.query.loc_id ? parseInt(req.query.loc_id as string) : undefined,
      searchText: req.query.q as string,
      fromDate: req.query.from_date ? new Date(req.query.from_date as string) : undefined,
      toDate: req.query.to_date ? new Date(req.query.to_date as string) : undefined,
      limit: parseInt(req.query.limit as string) || 50,
      offset: parseInt(req.query.offset as string) || 0,
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
