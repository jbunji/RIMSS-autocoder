/**
 * ConfigurationService
 * ====================
 * Asset configuration management - defines what parts make up an asset.
 * 
 * CfgSet = Configuration template (e.g., "Pod Type A Standard Config")
 * CfgList = Parent-child part relationships within a config
 * 
 * Features:
 * - Create/edit configuration sets
 * - Define part hierarchy (BOM-like structure)
 * - Assign assets to configurations
 * - Compare actual vs configured parts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export interface CfgSetCreateData {
  pgmId: number;
  cfgName: string;
  cfgType?: string;
  partnoId?: number;
  description?: string;
  userId: string;
}

export interface CfgListItem {
  parentPartnoId: number;
  childPartnoId: number;
  sortOrder?: number;
  qpa?: number;  // Quantity per assembly
}

// ============================================================================
// SERVICE
// ============================================================================

export class ConfigurationService {

  /**
   * Create a new configuration set
   */
  async createCfgSet(data: CfgSetCreateData): Promise<any> {
    const cfgSet = await prisma.cfgSet.create({
      data: {
        cfg_name: data.cfgName,
        cfg_type: data.cfgType,
        pgm_id: data.pgmId,
        partno_id: data.partnoId,
        description: data.description,
        active: true,
        ins_by: data.userId,
        ins_date: new Date(),
      },
      include: {
        program: true,
        part: true,
      },
    });

    console.log(`[CONFIG] Created configuration set: ${cfgSet.cfg_name}`);

    return cfgSet;
  }

  /**
   * Update a configuration set
   */
  async updateCfgSet(cfgSetId: number, data: Partial<CfgSetCreateData>): Promise<any> {
    return prisma.cfgSet.update({
      where: { cfg_set_id: cfgSetId },
      data: {
        cfg_name: data.cfgName,
        cfg_type: data.cfgType,
        partno_id: data.partnoId,
        description: data.description,
        chg_by: data.userId,
        chg_date: new Date(),
      },
      include: {
        program: true,
        part: true,
      },
    });
  }

  /**
   * Delete a configuration set
   */
  async deleteCfgSet(cfgSetId: number): Promise<void> {
    // Check if any assets are using this config
    const assetsUsingConfig = await prisma.asset.count({
      where: { cfg_set_id: cfgSetId },
    });

    if (assetsUsingConfig > 0) {
      throw new Error(`Cannot delete - ${assetsUsingConfig} asset(s) using this configuration`);
    }

    // Delete cascades to cfg_list
    await prisma.cfgSet.delete({
      where: { cfg_set_id: cfgSetId },
    });
  }

  /**
   * Add a part to the configuration (parent-child relationship)
   */
  async addConfigItem(cfgSetId: number, item: CfgListItem, userId: string): Promise<any> {
    // Check for duplicate
    const existing = await prisma.cfgList.findFirst({
      where: {
        cfg_set_id: cfgSetId,
        partno_p: item.parentPartnoId,
        partno_c: item.childPartnoId,
      },
    });

    if (existing) {
      throw new Error("This parent-child relationship already exists in this configuration");
    }

    // Get max sort order
    const maxSort = await prisma.cfgList.aggregate({
      where: { cfg_set_id: cfgSetId, partno_p: item.parentPartnoId },
      _max: { sort_order: true },
    });

    return prisma.cfgList.create({
      data: {
        cfg_set_id: cfgSetId,
        partno_p: item.parentPartnoId,
        partno_c: item.childPartnoId,
        sort_order: item.sortOrder ?? ((maxSort._max.sort_order || 0) + 1),
        qpa: item.qpa || 1,
        active: true,
        ins_by: userId,
        ins_date: new Date(),
      },
      include: {
        parentPart: true,
        childPart: true,
      },
    });
  }

  /**
   * Remove a part from the configuration
   */
  async removeConfigItem(listId: number): Promise<void> {
    await prisma.cfgList.delete({
      where: { list_id: listId },
    });
  }

  /**
   * Update sort order for config items
   */
  async reorderConfigItems(cfgSetId: number, parentPartnoId: number, itemIds: number[]): Promise<void> {
    for (let i = 0; i < itemIds.length; i++) {
      await prisma.cfgList.update({
        where: { list_id: itemIds[i] },
        data: { sort_order: i + 1 },
      });
    }
  }

  /**
   * Assign an asset to a configuration
   */
  async assignAssetToConfig(assetId: number, cfgSetId: number, userId: string): Promise<any> {
    return prisma.asset.update({
      where: { asset_id: assetId },
      data: {
        cfg_set_id: cfgSetId,
        chg_by: userId,
        chg_date: new Date(),
      },
      include: {
        cfgSet: true,
      },
    });
  }

  /**
   * Copy a configuration to create a variant
   */
  async copyConfiguration(cfgSetId: number, newName: string, userId: string): Promise<any> {
    const original = await prisma.cfgSet.findUnique({
      where: { cfg_set_id: cfgSetId },
      include: { cfgLists: true },
    });

    if (!original) throw new Error("Configuration not found");

    // Create new config set
    const newCfgSet = await prisma.cfgSet.create({
      data: {
        cfg_name: newName,
        cfg_type: original.cfg_type,
        pgm_id: original.pgm_id,
        partno_id: original.partno_id,
        description: `Copy of ${original.cfg_name}`,
        active: true,
        ins_by: userId,
        ins_date: new Date(),
      },
    });

    // Copy all config items
    for (const item of original.cfgLists) {
      await prisma.cfgList.create({
        data: {
          cfg_set_id: newCfgSet.cfg_set_id,
          partno_p: item.partno_p,
          partno_c: item.partno_c,
          sort_order: item.sort_order,
          qpa: item.qpa,
          active: true,
          ins_by: userId,
          ins_date: new Date(),
        },
      });
    }

    console.log(`[CONFIG] Copied configuration ${original.cfg_name} to ${newName}`);

    return this.getCfgSet(newCfgSet.cfg_set_id);
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Get a configuration set with its parts hierarchy
   */
  async getCfgSet(cfgSetId: number): Promise<any> {
    const cfgSet = await prisma.cfgSet.findUnique({
      where: { cfg_set_id: cfgSetId },
      include: {
        program: true,
        part: true,
        cfgLists: {
          where: { active: true },
          include: {
            parentPart: true,
            childPart: true,
          },
          orderBy: [
            { partno_p: "asc" },
            { sort_order: "asc" },
          ],
        },
      },
    });

    if (!cfgSet) return null;

    // Build hierarchical tree
    const tree = this.buildConfigTree(cfgSet.cfgLists, cfgSet.partno_id);

    return {
      ...cfgSet,
      tree,
    };
  }

  /**
   * Get all configurations for a program
   */
  async getCfgSetsForProgram(pgmId: number): Promise<any[]> {
    return prisma.cfgSet.findMany({
      where: { pgm_id: pgmId, active: true },
      include: {
        part: true,
        _count: {
          select: {
            cfgLists: true,
            assets: true,
          },
        },
      },
      orderBy: { cfg_name: "asc" },
    });
  }

  /**
   * Get configuration for an asset
   */
  async getAssetConfiguration(assetId: number): Promise<any> {
    const asset = await prisma.asset.findUnique({
      where: { asset_id: assetId },
      include: {
        cfgSet: {
          include: {
            cfgLists: {
              where: { active: true },
              include: {
                parentPart: true,
                childPart: true,
              },
            },
          },
        },
      },
    });

    if (!asset?.cfgSet) return null;

    return this.getCfgSet(asset.cfg_set_id!);
  }

  /**
   * Compare actual asset children vs configured parts
   */
  async compareConfiguration(assetId: number): Promise<{
    configured: any[];
    actual: any[];
    missing: any[];
    extra: any[];
  }> {
    const asset = await prisma.asset.findUnique({
      where: { asset_id: assetId },
      include: {
        cfgSet: {
          include: { cfgLists: { include: { childPart: true } } },
        },
        part: true,
      },
    });

    if (!asset) throw new Error("Asset not found");

    // Get actual child assets
    const actualChildren = await prisma.asset.findMany({
      where: { nha_asset_id: assetId, active: true },
      include: { part: true },
    });

    // Get configured parts for this asset's part number
    const configuredParts = asset.cfgSet?.cfgLists
      .filter(cl => cl.partno_p === asset.part_id)
      .map(cl => cl.childPart) || [];

    const actualPartIds = new Set(actualChildren.map(a => a.part_id));
    const configuredPartIds = new Set(configuredParts.map(p => p.partno_id));

    const missing = configuredParts.filter(p => !actualPartIds.has(p.partno_id));
    const extra = actualChildren.filter(a => !configuredPartIds.has(a.part_id));

    return {
      configured: configuredParts,
      actual: actualChildren,
      missing,
      extra,
    };
  }

  /**
   * Get assets using a configuration
   */
  async getAssetsUsingConfig(cfgSetId: number): Promise<any[]> {
    return prisma.asset.findMany({
      where: { cfg_set_id: cfgSetId, active: true },
      include: {
        part: true,
        currentLocation: true,
      },
      orderBy: { serno: "asc" },
    });
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private buildConfigTree(cfgLists: any[], rootPartnoId?: number | null): any[] {
    // Build a map of parent -> children
    const childrenMap = new Map<number, any[]>();

    for (const item of cfgLists) {
      const parentId = item.partno_p;
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }
      childrenMap.get(parentId)!.push({
        listId: item.list_id,
        part: item.childPart,
        qpa: item.qpa,
        sortOrder: item.sort_order,
        children: [],
      });
    }

    // Recursively build tree
    const buildSubtree = (partnoId: number): any[] => {
      const children = childrenMap.get(partnoId) || [];
      for (const child of children) {
        child.children = buildSubtree(child.part.partno_id);
      }
      return children;
    };

    if (rootPartnoId) {
      return buildSubtree(rootPartnoId);
    }

    // If no root, return all top-level items
    const allChildIds = new Set(cfgLists.map(cl => cl.partno_c));
    const topLevel = cfgLists.filter(cl => !allChildIds.has(cl.partno_p));
    
    return topLevel.map(item => ({
      listId: item.list_id,
      part: item.parentPart,
      qpa: 1,
      sortOrder: item.sort_order,
      children: buildSubtree(item.partno_p),
    }));
  }
}

// Export singleton
export const configurationService = new ConfigurationService();
