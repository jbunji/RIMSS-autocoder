import cfc.utils.Datasource;

component displayname="ObjectFactory"  output="false" {
    variables.instance = {};
    variables.instance.objects = {};

    variables.instance.datasource = 0;

    public function init(required Datasource datasource) {
        variables.instance.datasource = arguments.datasource;
        createObjects();
        return this;
    }

    public function create(required string name) {
        //requested object was not found, then throw error
        if (!StructKeyExists(variables.instance.objects,arguments.name)) {
            throw (message="Cannot create object #arguments.name#");
        }

        //return service in services
        return variables.instance.objects[arguments.name];
    }

    private function createObjects() {
        var local = {};

        //Create CF Setting Library Object
        local.settingLib = createObject("component","cfc.utils.SettingLib").init();

        //Add CF Setting Library to the objects structure
        addObject("SettingLib",local.settingLib);

        //Create DAO objects
        local.dropDownDao = createObject("component","cfc.dao.DropDownDao").init(variables.instance.datasource);

        //Add DAO objects to objects structure
        addObject("DropDownDao",local.dropDownDao);

        //Create utility gateways
        local.dbUtils = createObject("component","cfc.dao.DBUtils").init(variables.instance.datasource);
        local.dbLookups = createObject("component","cfc.dao.DbLookups").init();

        //Add utility gateway to the objects structure
        addObject("DbLookups",local.dbLookups);
        addObject("DbUtils",local.dbUtils);

        //Create the services
        local.assetService = createObject("component", "cfc.service.AssetService").init(variables.instance.datasource);
        local.admVariableService = createObject("component", "cfc.service.AdmVariableService").init(variables.instance.datasource);
        local.assetInspectionService = createObject("component", "cfc.service.AssetInspectionService").init(variables.instance.datasource);
        local.attachmentsService = createObject("component", "cfc.service.AttachmentsService").init(variables.instance.datasource);
        local.auxAssetsSwService = createObject("component", "cfc.service.AuxAssetsSwService").init(variables.instance.datasource);
        local.auxAssetsTctoService = createObject("component", "cfc.service.AuxAssetsTctoService").init(variables.instance.datasource);
        local.badActorService = createObject("component", "cfc.service.BadActorService").init(variables.instance.datasource);
        local.cfgActsService = createObject("component", "cfc.service.CfgActsService").init(variables.instance.datasource);
        local.cfgListService = createObject("component", "cfc.service.CfgListService").init(variables.instance.datasource);
        local.cfgMetersService = createObject("component", "cfc.service.CfgMetersService").init(variables.instance.datasource);
        local.cfgSetService = createObject("component", "cfc.service.CfgSetService").init(variables.instance.datasource);
        local.codeByCodeService = createObject("component", "cfc.service.CodeByCodeService").init(variables.instance.datasource);
        local.codeByLocService = createObject("component", "cfc.service.CodeByLocService").init(variables.instance.datasource);
        local.codeGroupService = createObject("component", "cfc.service.CodeGroupService").init(variables.instance.datasource);
        local.codeService = createObject("component", "cfc.service.CodeService").init(variables.instance.datasource);
        local.eventService = createObject("component", "cfc.service.EventService").init(variables.instance.datasource);
      //  local.impulsService = createObject("component", "cfc.service.IMPULSService").init(variables.instance.datasource);
        local.invAssetsService = createObject("component", "cfc.service.InvAssetsService").init(variables.instance.datasource);
        local.invSoftwareService = createObject("component", "cfc.service.InvSoftwareService").init(variables.instance.datasource);
        local.invSystemsService = createObject("component", "cfc.service.InvSystemsService").init(variables.instance.datasource);
        local.invTctoService = createObject("component", "cfc.service.InvTctoService").init(variables.instance.datasource);
        local.laborBitPcService = createObject("component", "cfc.service.LaborBitPcService").init(variables.instance.datasource);
        local.laborPartService = createObject("component", "cfc.service.LaborPartService").init(variables.instance.datasource);
        local.laborService = createObject("component", "cfc.service.LaborService").init(variables.instance.datasource);
        local.laborStatusService = createObject("component", "cfc.service.LaborStatusService").init(variables.instance.datasource);
        local.locationService = createObject("component", "cfc.service.LocationService").init(variables.instance.datasource);
        local.locByLocService = createObject("component", "cfc.service.LocByLocService").init(variables.instance.datasource);
        local.locSetService = createObject("component", "cfc.service.LocSetService").init(variables.instance.datasource);
        local.meterHistService = createObject("component", "cfc.service.MeterHistService").init(variables.instance.datasource);
        local.metricsTrackService = createObject("component", "cfc.service.MetricsTrackService").init(variables.instance.datasource);
        local.msgTransmitService = createObject("component", "cfc.service.MsgTransmitService").init(variables.instance.datasource);
        local.partListService = createObject("component", "cfc.service.PartListService").init(variables.instance.datasource);
        local.partnoCodeService = createObject("component", "cfc.service.PartnoCodeService").init(variables.instance.datasource);
        local.partnoWucP2Service = createObject("component", "cfc.service.PartnoWucP2Service").init(variables.instance.datasource);
        local.repairService = createObject("component", "cfc.service.RepairService").init(variables.instance.datasource);
        local.repairStatusService = createObject("component", "cfc.service.RepairStatusService").init(variables.instance.datasource);
        local.softwareAssetService = createObject("component", "cfc.service.SoftwareAssetService").init(variables.instance.datasource);
        local.softwareService = createObject("component", "cfc.service.SoftwareService").init(variables.instance.datasource);
        local.sortiesService = createObject("component", "cfc.service.SortiesService").init(variables.instance.datasource);
        local.sruOrderService = createObject("component", "cfc.service.SruOrderService").init(variables.instance.datasource);
        local.tctoAssetService = createObject("component", "cfc.service.TctoAssetService").init(variables.instance.datasource);
        local.tctoService = createObject("component", "cfc.service.TctoService").init(variables.instance.datasource);
        local.testFailedService = createObject("component", "cfc.service.TestFailedService").init(variables.instance.datasource);
        local.userSettingService = createObject("component", "cfc.service.UserSettingService").init(variables.instance.datasource);

        local.newJobIdService = createObject("component", "cfc.service.NewJobIdService").init();

        //Add service to the objects structure
        addObject("AssetService",local.assetService);
        addObject("AdmVariableService",local.admVariableService);
        addObject("AssetInspectionService",local.assetInspectionService);
        addObject("AttachmentsService",local.attachmentsService);
        addObject("AuxAssetsSwService",local.auxAssetsSwService);
        addObject("AuxAssetsTctoService", local.auxAssetsTctoService);
        addObject("BadActorService", local.badActorService);
        addObject("CfgActsService",local.cfgActsService);
        addObject("CfgListService", local.cfgListService);
        addObject("CfgMetersService",local.cfgMetersService);
        addObject("CfgSetService", local.cfgSetService);
        addObject("CodeByCodeService",local.codeByCodeService);
        addObject("CodeByLocService", local.codeByLocService);
        addObject("CodeGroupService", local.codeGroupService);
        addObject("CodeService",local.codeService);
        addObject("EventService",local.eventService);
     //   addObject("IMPULSService",local.impulsService);
        addObject("InvAssetsService",local.invAssetsService);
        addObject("InvSoftwareService", local.invSoftwareService);
        addObject("InvSystemsService",local.invSystemsService);
        addObject("InvTctoService", local.invTctoService);
        addObject("LaborBitPcService", local.laborBitPcService);
        addObject("LaborPartService", local.laborPartService);
        addObject("LaborService", local.laborService);
        addObject("LaborStatusService", local.laborStatusService);
        addObject("LocationService",local.locationService);
        addObject("LocByLocService", local.locByLocService);
        addObject("LocSetService", local.locSetService);
        addObject("MeterHistService",local.meterHistService);
        addObject("MetricsTrackService", local.metricsTrackService);
        addObject("MsgTransmitService",local.msgTransmitService);
        addObject("PartListService",local.partListService);
        addObject("PartnoCodeService",local.partnoCodeService);
        addObject("PartnoWucP2Service", local.partnoWucP2Service);
        addObject("RepairService",local.repairService);
        addObject("RepairStatusService", local.repairStatusService);
        addObject("SoftwareAssetService", local.softwareAssetService);
        addObject("SoftwareService", local.softwareService);
        addObject("NewJobIdService",local.newJobIdService);
        addObject("SortiesService",local.sortiesService);
        addObject("SruOrderService", local.sruOrderService);
        addObject("TctoAssetService", local.tctoAssetService);
        addObject("TctoService", local.tctoService);
        addObject("TestFailedService",local.testFailedService);
        addObject("UserSettingService",local.userSettingService);
    }

    private function addObject(required string objName, required any object) {
        variables.instance.objects[arguments.objName] = arguments.object;
    }
}