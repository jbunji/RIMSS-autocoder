/**
 * BIT/PC API Routes
 * =================
 * Built-in Test / Part Change tracking.
 */

import { Router, Request, Response } from "express";
import { bitPcService } from "./BitPcService";

export const bitPcRouter = Router();

/**
 * POST /entries - Record a BIT/PC entry
 */
bitPcRouter.post("/entries", async (req: Request, res: Response) => {
  try {
    const { labor_id, bit_partno, bit_name, bit_seq, bit_wuc, how_mal, bit_qty, fsc } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!labor_id) {
      return res.status(400).json({ error: "labor_id required" });
    }

    const entry = await bitPcService.recordBitPc({
      laborId: parseInt(labor_id),
      bitPartno: bit_partno,
      bitName: bit_name,
      bitSeq: bit_seq ? parseInt(bit_seq) : undefined,
      bitWuc: bit_wuc,
      howMal: how_mal,
      bitQty: bit_qty ? parseInt(bit_qty) : undefined,
      fsc,
      userId,
    });

    res.status(201).json({ message: "Entry recorded", entry });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /entries/:id - Update a BIT/PC entry
 */
bitPcRouter.put("/entries/:id", async (req: Request, res: Response) => {
  try {
    const laborBitId = parseInt(req.params.id);
    const { bit_partno, bit_name, bit_wuc, how_mal, bit_qty, fsc } = req.body;

    const entry = await bitPcService.updateBitPc(laborBitId, {
      bitPartno: bit_partno,
      bitName: bit_name,
      bitWuc: bit_wuc,
      howMal: how_mal,
      bitQty: bit_qty ? parseInt(bit_qty) : undefined,
      fsc,
      userId: (req as any).user?.username || "system",
    });
    res.json({ message: "Entry updated", entry });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /entries/:id - Delete a BIT/PC entry (soft delete)
 */
bitPcRouter.delete("/entries/:id", async (req: Request, res: Response) => {
  try {
    const laborBitId = parseInt(req.params.id);
    await bitPcService.deleteBitPc(laborBitId);
    res.json({ message: "Entry deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /entries/:id/validate - Validate a BIT/PC entry
 */
bitPcRouter.post("/entries/:id/validate", async (req: Request, res: Response) => {
  try {
    const laborBitId = parseInt(req.params.id);
    const userId = (req as any).user?.username || "system";
    const entry = await bitPcService.validateBitPc(laborBitId, userId);
    res.json({ message: "Entry validated", entry });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /labor/:laborId/entries - Get entries for a labor record
 */
bitPcRouter.get("/labor/:laborId/entries", async (req: Request, res: Response) => {
  try {
    const laborId = parseInt(req.params.laborId);
    const entries = await bitPcService.getEntriesForLabor(laborId);
    res.json({ entries, count: entries.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /repair/:repairId/unvalidated - Get unvalidated entries for a repair
 */
bitPcRouter.get("/repair/:repairId/unvalidated", async (req: Request, res: Response) => {
  try {
    const repairId = parseInt(req.params.repairId);
    const entries = await bitPcService.getUnvalidatedForRepair(repairId);
    res.json({ entries, count: entries.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /event/:eventId/entries - Get entries for an event
 */
bitPcRouter.get("/event/:eventId/entries", async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const entries = await bitPcService.getEntriesForEvent(eventId);
    res.json({ entries, count: entries.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /usage/:pgmId - Get part usage summary
 */
bitPcRouter.get("/usage/:pgmId", async (req: Request, res: Response) => {
  try {
    const pgmId = parseInt(req.params.pgmId);
    const days = parseInt(req.query.days as string) || 90;
    const usage = await bitPcService.getPartUsageSummary(pgmId, days);
    res.json({ usage, count: usage.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /labor/:laborId/copy - Copy entries to another labor
 */
bitPcRouter.post("/labor/:laborId/copy", async (req: Request, res: Response) => {
  try {
    const fromLaborId = parseInt(req.params.laborId);
    const { to_labor_id } = req.body;
    const userId = (req as any).user?.username || "system";

    if (!to_labor_id) {
      return res.status(400).json({ error: "to_labor_id required" });
    }

    const copied = await bitPcService.copyEntries(fromLaborId, parseInt(to_labor_id), userId);
    res.json({ message: `Copied ${copied} entries`, copied });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
