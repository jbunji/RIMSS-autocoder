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

// CRUD services  
export { MaintenanceService, maintenanceService } from "./MaintenanceService";
export { maintenanceData } from "./MaintenanceDataService";

// Routes
export { maintenanceRouter } from "./maintenanceRoutes";
export { partsOrderingRouter } from "./partsOrderingRoutes";
export { tctoRouter } from "./tctoRoutes";
export { pmiRouter } from "./pmiRoutes";
export { shippingRouter } from "./shippingRoutes";
