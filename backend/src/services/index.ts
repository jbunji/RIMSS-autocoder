/**
 * RIMSS Backend Services
 * ======================
 * Business logic services for database-backed operations.
 */

// Workflow services
export { MaintenanceWorkflowService, maintenanceWorkflow } from "./MaintenanceWorkflowService";
export { PartsOrderingService, partsOrderingService } from "./PartsOrderingService";
export { TctoService, tctoService } from "./TctoService";
export { PmiService, pmiService } from "./PmiService";
export { ShippingService, shippingService } from "./ShippingService";
export { SortieService, sortieService } from "./SortieService";
export { ConfigurationService, configurationService } from "./ConfigurationService";
export { NotificationService, notificationService } from "./NotificationService";

// CRUD services  
export { MaintenanceService, maintenanceService } from "./MaintenanceService";
export { maintenanceData } from "./MaintenanceDataService";

// Routes
export { maintenanceRouter } from "./maintenanceRoutes";
export { partsOrderingRouter } from "./partsOrderingRoutes";
export { tctoRouter } from "./tctoRoutes";
export { pmiRouter } from "./pmiRoutes";
export { shippingRouter } from "./shippingRoutes";
export { sortieRouter } from "./sortieRoutes";
export { configurationRouter } from "./configurationRoutes";
export { notificationRouter } from "./notificationRoutes";
export { InventoryService, inventoryService } from "./InventoryService";
export { inventoryRouter } from "./inventoryRoutes";
export { ReportsService, reportsService } from "./ReportsService";
export { reportsRouter } from "./reportsRoutes";
export { SparesService, sparesService } from "./SparesService";
export { sparesRouter } from "./sparesRoutes";
export { BitPcService, bitPcService } from "./BitPcService";
export { bitPcRouter } from "./bitPcRoutes";
