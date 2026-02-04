/**
 * Reports API Routes
 * ==================
 * Dashboard and reporting endpoints.
 */

import { Router, Request, Response } from "express";
import { reportsService } from "./ReportsService";

export const reportsRouter = Router();

/**
 * GET /dashboard/:locationId - Get location dashboard
 */
reportsRouter.get("/dashboard/:locationId", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const dashboard = await reportsService.getLocationDashboard(locationId);
    res.json({ dashboard });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /program/:pgmId/status - Get program status report
 */
reportsRouter.get("/program/:pgmId/status", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.params.pgmId);
    const report = await reportsService.getProgramStatusReport(pgmId);
    res.json({ report });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /backlog - Get maintenance backlog
 */
reportsRouter.get("/backlog", async (req: Request, res: Response) => {
  try {
    const backlog = await reportsService.getBacklogReport({
      locationId: req.query.loc_id ? parseInt(req.query.loc_id as string) : undefined,
      pgmId: req.query.pgm_id ? parseInt(req.query.pgm_id as string) : undefined,
      fromDate: req.query.from_date ? new Date(req.query.from_date as string) : undefined,
      toDate: req.query.to_date ? new Date(req.query.to_date as string) : undefined,
    });
    res.json({ backlog, count: backlog.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /pmi-compliance/:locationId - Get PMI compliance report
 */
reportsRouter.get("/pmi-compliance/:locationId", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const report = await reportsService.getPmiComplianceReport(locationId);
    res.json({ report });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /tcto-compliance/:pgmId - Get TCTO compliance report
 */
reportsRouter.get("/tcto-compliance/:pgmId", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.params.pgmId);
    const report = await reportsService.getTctoComplianceReport(pgmId);
    res.json({ report });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /parts-orders/:locationId - Get parts ordering summary
 */
reportsRouter.get("/parts-orders/:locationId", async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const report = await reportsService.getPartsOrderingSummary(locationId);
    res.json({ report });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
