import cfc.facade.SessionFacade;
import cfc.facade.SessionRequestFacade;
import cfc.factory.ObjectFactory;
import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;
import cfc.utils.QueryIterator;
import cfc.utils.utilities;
import criis.bo.InventoryBO;
import cfc.service.IMPULSService;
import cfc.service.InvAssetService;
import cfc.service.AssetService;
import cfc.model.CfgMeters;
import cfc.model.MeterHist;

component hint="Controller for processing inventory" output="false" extends="cfc.utils.Proxy"
{
	
	property any sessionRequestFacade;
	
	variables.instance = {
		sessionRequestFacade = new SessionRequestFacade(),
       	sessionFacade = new SessionFacade(), 
        javaLoggerProxy = new  javaLoggerProxy(),
       	objectFactory = '',
       	assetService = '',
       	invAssetService = '',
        locationService = '',
       	dbUtils = '',
       	dropDownDao = '',
       	program = '',
       	assetService = '',
       	utilities = new utilities()       
	};
	
	
    variables.instance.program = lcase(trim(getSessionFacade().getProgramSetting()));
    
    public any function init(){
       return this; 
    }
    
    public any function getComponentName(){
        var local = {};
       return getUtilities().getComponentName(this);      
    }
    
    public any function getJavaLoggerProxy(){
       return variables.instance.javaLoggerProxy;      
    }
    
    public any function getRootPath(){
     return Application.rootPath;      
    }
    
    public any function getProgram(){
       //return lcase(trim(getSessionFacade().getProgramSetting()));  
       return lcase(trim(variables.instance.program));    
    }
    
    public any function getObjectFactory(){
        if(isSimpleValue(variables.instance.objectFactory)){
           variables.instance.objectFactory = APPLICATION.objectFactory;    
        }   
        return variables.instance.objectFactory;      
    }
    
    public any function getDBUtils(){
       if(isSimpleValue(variables.instance.dbUtils)){
           variables.instance.dbUtils = getObjectFactory().create("DbUtils");    
        }       
       return variables.instance.dbUtils;      
    }
    
    public any function getDropDownDao(){
       if(isSimpleValue(variables.instance.dropDownDao)){
           variables.instance.dropDownDao = getObjectFactory().create("DropDownDao");    
        }       
       return variables.instance.dropDownDao;      
    }
    
     public any function getUtilities(){
       return variables.instance.utilities;      
    }
    
    public any function getAssetService(){
       if(isSimpleValue(variables.instance.assetService)){
           variables.instance.assetService = getObjectFactory().create("AssetService");    
        }       
       return variables.instance.assetService;      
    }
    
        
    public any function getInvAssetService(){
       if(isSimpleValue(variables.instance.invAssetService)){
           variables.instance.invAssetService = getObjectFactory().create("InvAssetsService");    
        }       
       return variables.instance.invAssetService;      
    }
    
    public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }
    

    public any function getUser(){
       return getSessionFacade().getUserName();      
    }
    
    private any function getSessionRequestFacade(){
       return variables.instance.sessionRequestFacade;      
    }
    
    
    public any function getLocationService(){
       if(isSimpleValue(variables.instance.locationService)){
           variables.instance.locationService = getObjectFactory().create("LocationService");    
        }       
       return variables.instance.locationService;      
    }
	
    
    
    public any function searchAssets(required struct formRequest){
    	
    	local = {};
    	local.page = getRootPath() & "/" & getProgram() & "/inventory/inventory.cfm";
    	
    	getSessionFacade().setValue("system",arguments.formRequest.system);
    	try{
    		local.arguments = {
    			programId=application.sessionManager.getProgramIdSetting(), 
				unit = application.sessionManager.getLocIdSetting(),
				system = "#arguments.formRequest.system#",
				criteria=arguments.formRequest.searchCriteria
    		};
       		local.search = getDbUtils().getAssetsByProgram(argumentCollection=local.arguments);
       		
       		local.search = getUtilities().addEncryptedColumn(local.search,"ASSET_ID");
       		
       		addToRequest("qAssets",local.search);
       		redirect(local.page,true); 
    	}catch(any e){
    		addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"getAsset",getUser());

            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
       			redirect(local.page,true); 
            }
    	}
    }
    
    public void function exportInventory(required struct formRequest){
    	
    	local = {};
    	local.page = getRootPath() & "/" & getProgram() & "/inventory/exportInventory.cfm";
    	
    	try{
    		local.args = {
    			programId=application.sessionManager.getProgramIdSetting(), 
				unit = application.sessionManager.getLocIdSetting(),
				system = "#arguments.formRequest.system#"
    		};
       		local.search = getDbUtils().getAssetsByProgram(argumentCollection=local.args);
       		
       		local.search = getUtilities().addEncryptedColumn(local.search,"ASSET_ID");
       		
       		addToRequest("qAssets",local.search);
       		addToRequest("search",local.search);
        	addToRequest("exportType", arguments.formRequest.exportType);
       		redirect(local.page,true); 
    	}catch(any e){
    		addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"getAsset",getUser());

            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
       			redirect(local.page,true); 
            }
    	}
    }
    
    
    
    public void function getAsset(required String assetId){
    	    	
		local = {};
		local.page = getRootPath() & "/" & getProgram() & "/inventory/editInventory.cfm";
    	try{
    		local.decryptAsset = getUtilities().decryptId(arguments.assetId);
    		local.qAsset = getDbUtils().getAssetsByProgram(application.sessionManager.getProgramIdSetting(),application.sessionManager.getLocIdSetting(),local.decryptAsset);
    		local.asset = getAssetService().getAsset(val(local.decryptAsset));
    		local.invAsset = getInvAssetService().getInvAssets(local.asset.getCtAssetId());
    		
    		addToFormRequest("asset_Id",local.qAsset.asset_id);
    		addToFormRequest("serno",local.qAsset.serno);
    		addToFormRequest("status_cd",local.qAsset.status_cd);
    		addToFormRequest("etm",local.qAsset.etm);
    		addToFormRequest("curr_id",local.qAsset.curr_id);
    		addToFormRequest("assign_id",local.qAsset.assign_id);
    		addToFormRequest("ct_asset_id",local.qAsset.ct_asset_id);
    		addToFormRequest("meter_Type",local.qAsset.meter_type);
    		if(len(trim(local.qAsset.meter_seq)))
    			addToFormRequest("meter_Seq",local.qAsset.meter_seq);
    		else
    			addToFormRequest("meter_Seq","1");
    		addToFormRequest("in_transit",local.qAsset.in_transit);
    		addToFormRequest("loc_ida",local.qAsset.loc_ida);
    		addToFormRequest("loc_idc",local.qAsset.loc_idc);
    		addToFormRequest("shipper",local.qAsset.shipper);
    		addToFormRequest("tcn",local.qAsset.tcn);
    		addToFormRequest("remarks",local.qAsset.remarks);
    		
    		addToFormRequest("site_a_cd",local.qAsset.site_a_cd);
    		addToFormRequest("site_c_cd",local.qAsset.site_c_cd);
    		
       		redirect(local.page,true); 
    	}catch(any e){
    		addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"getAsset",getUser());

            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            }
    	}
    	
       redirect(local.page,true); 
    }
    
    public void function updateAsset(required struct formRequest){    	
    	 //default page
       local.page = getRootPath() & "/" & getProgram() & "/inventory/inventory.cfm"; 
       
       /*if(isDefined("request.httpReferer") and len(trim(request.httpReferer))){
            local.page = request.httpReferer;      
       }*/
    	
    	//addToFormRequest("system",arguments.formRequest.SYSTEM);
    		
        var impulsService = new IMPULSService(); 
        var inventoryBo = new InventoryBO();
        
       
    	
    	try{
    		
    		var impulsForm = populateImpulsForm(arguments.formRequest);
    		local.impulsService.send(local.impulsForm);
    		
    		var cfgMeters = populateCfgMeters(arguments.formRequest);
	        var meterHist = populateMeterHist(arguments.formRequest);
	        var asset = populateAsset(arguments.formRequest);
	        var invAsset = populateInvAsset(arguments.formRequest);
        
    		if(arguments.formRequest.SYSTEM EQ "POD" OR arguments.formRequest.SYSTEM EQ "IM")
    			local.inventoryBo.updateAsset(local.asset, local.invAsset, local.cfgMeters, local.meterHist, true);
    		else
    			local.inventoryBo.updateAsset(local.asset, local.invAsset, local.cfgMeters, local.meterHist, false);
    		
    		
    		
            getSessionRequestFacade().addToRequest("success", {message="Update successful!"});
            redirect(url=local.page, persist="true"); 
    		
    	} catch (any e){
    		addToRequest("error", {message=e.message});
    		
    		/* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
    	}
    	   redirect(url=local.page, persist="true");    	
    }
    
    
    private struct function populateImpulsForm(required struct formRequest){
    	/* TODO create implus form struct */
    	var local.asset = getInvAsset(arguments.formRequest.ctAssetId);    	/* TODO Return InvAsset Model */
    	var local.impulsForm = {}; 	
	    var	local.inTransitShipDate = DateFormat(asset.getInTransitShipDate(), "dd-mmm-yyyy");
    	var local.inTransitRecvDate=DateFormat(asset.getInTransitRecvDate(), "dd-mmm-yyyy");
    	
    	
    	if(StructKeyExists(arguments.formRequest,"inTransit_select")){
    		local.inTransit = arguments.formRequest.inTransit_select;
	    	var assignLoc = getLocationService().getLocation(formRequest.assign_id);
	    	var currLoc = getLocationService().getLocation(formRequest.curr_id);	    	
	    	//local.inTransitShipDate = asset.getInTransitShipDate();
	    		
	    	if(local.inTransit EQ "N"){
	    		local.inTransitRecvDate =  DateFormat(Now(), "dd-mmm-yyyy"); // Pass Recv Date
	    	}
    	}else{
    		var currLoc1 = getLocationService().getLocation(arguments.formRequest.curr_id);
    		var incomingLoc = getLocationService().getLocation(arguments.formRequest.curr_select);
	    	local.inTransit = "N";
	    	if(currLoc1.getSiteCd() != incomingLoc.getSiteCd()){
	    		local.inTransit = "Y";
	    		local.inTransitShipDate = DateFormat(Now(), "dd-mmm-yyyy"); // Pass Ship Date
	    		local.inTransitRecvDate="";
	    	}
	    	
	    	var assignLoc = getLocationService().getLocation(formRequest.assign_select);
	    	var currLoc = getLocationService().getLocation(formRequest.curr_select);
    	}
		
    	
    	local.impulsForm['action'] = "updateSingleAssetUpdateScreen";
        local.impulsForm['assetId'] = asset.getAssetId();
        local.impulsForm['assignedLocId'] = assignLoc.getCtLocId();
        local.impulsForm['currentLocId'] = currLoc.getCtLocId();
        local.impulsForm['initialCurrentLocId'] = asset.getCurrentLocId();
        local.impulsForm['isInTransit'] = local.inTransit;
        local.impulsForm['remarks'] = asset.getRemarks();
        local.impulsForm['sentBy'] = getUtilities().getUser();
        local.impulsForm['serno'] = asset.getSerno();
        local.impulsForm['initialStatus'] =  asset.getStatus();
        local.impulsForm['status'] = (StructKeyExists(arguments.formRequest,"status_select")) ? arguments.formRequest.status_select : arguments.formRequest.status_cd;
        local.impulsForm['inTransitShipDate'] = local.inTransitShipDate;
        local.impulsForm['inTransitRecvDate'] = local.inTransitRecvDate;
        
    	return local.impulsForm;
    }
    
    private any function getInvAsset(required string assetId){
    	var invAssetsService = application.objectFactory.create("InvAssetsService");
        var local = {};
        local.result = "";
        try{
           local.asset = invAssetsService.getInvAssets(val(ARGUMENTS.assetId));                   
        }catch(any e){
            
        }
        
        return local.asset;
    }
    
    
    /* populate CfgMeters bean from formRequest */
    private CfgMeters function populateCfgMeters(required struct formRequest) {
    	
    	if (StructKeyExists(arguments.formRequest, "eventId")) {
            var cfgMeters = getCfgMetersService().getCfgMeters(arguments.formRequest["eventId"]);
        }else{
            var cfgMeters = new CfgMeters();
        }
        
        if (StructKeyExists(arguments.formRequest, "ctAssetId")) {
            local.cfgMeters.setAssetId(arguments.formRequest["ctAssetId"]);
        }

        if (StructKeyExists(arguments.formRequest, "serno") and StructKeyExists(arguments.formRequest, "partno")) {
        }

        if (StructKeyExists(arguments.formRequest, "etm")) {
            local.cfgMeters.setValueIn(arguments.formRequest["etm"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "etm")) {
            local.cfgMeters.setValueOut(arguments.formRequest["etm"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "meterType")) {
            local.cfgMeters.setMeterType("183");
        }
        
        if (StructKeyExists(arguments.formRequest, "meterSeq")) {
			local.cfgMeters.setMeterSeq(arguments.formRequest["meterSeq"]);
        
        }
        local.cfgMeters.setIsMeterChg("N");
        local.cfgMeters.setCreatedBy(application.sessionManager.getUserName());
        local.cfgMeters.setCreateDate(Now());
        local.cfgMeters.setChgBy(application.sessionManager.getUserName());
        local.cfgMeters.setChgDate(Now());

        return local.cfgMeters;
    }

    /* populate MeterHist bean from formRequest */
    private MeterHist function populateMeterHist(required struct formRequest) {
    	
    	if (StructKeyExists(arguments.formRequest, "meterId")) {
            var meterHist = getMeterHistService().getMeterHist(arguments.formRequest["meterId"]);
        }else{
            var meterHist = new MeterHist();
        }

        if (StructKeyExists(arguments.formRequest, "assetId")) {
            local.meterHist.setAssetId(arguments.formRequest["assetId"]);
        }

        if (StructKeyExists(arguments.formRequest, "etm")) {
            local.meterHist.setMeterIn(arguments.formRequest["etm"]);
        }

        if (StructKeyExists(arguments.formRequest, "etm")) {
            local.meterHist.setMeterOut(arguments.formRequest["etm"]);
        }

        if (StructKeyExists(arguments.formRequest, "meterChg")) {
            local.meterHist.setChanged(arguments.formRequest["meterChg"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "meterSeq")){
            local.meterHist.setSeqNum(arguments.formRequest["meterSeq"]);
        }

        local.meterHist.setInsBy(application.sessionManager.getUserName());
        local.meterHist.setInsDate(Now());

        return local.meterHist;
    }
    
    
    private any function populateAsset(required struct formRequest){
    	var asset = getAssetService().getAsset(arguments.formRequest.assetId);
    	
    	
    	if(StructKeyExists(arguments.formRequest,"inTransit_select")){
    		local.inTransit = arguments.formRequest.inTransit_select;	
    	}else{
    		
    		var currLoc = getLocationService().getLocation(arguments.formRequest.curr_id);
    		var incomingCurrLoc = getLocationService().getLocation(arguments.formRequest.curr_select);
	    	local.inTransit = "N";
	    	if(currLoc.getSiteCd() NEQ incomingCurrLoc.getSiteCd()){
	    		local.inTransit = "Y";
	    	}
	    	/*
	    	var assignLoc = getLocationService().getLocation(arguments.formRequest.assign_id);
    		var incomingAssignLoc = getLocationService().getLocation(arguments.formRequest.assign_select);
	    	if(assignLoc.getSiteCd() NEQ incomingAssignLoc.getSiteCd()){
	    		local.inTransit = "Y";
	    	}*/
	    	
		}
    	
    	var local.invAsset = getInvAsset(arguments.formRequest.ctAssetId);    	/* TODO Return InvAsset Model */
    	
    	asset.setInTransit(local.inTransit);
    	
    	if(StructKeyExists(arguments.formRequest, "status_select")){
    		local.asset.setStatusCd(arguments.formRequest["status_select"]);
    	}
    	
    	if(StructKeyExists(arguments.formRequest, "assign_select")){
    		local.asset.setLocIda(arguments.formRequest["assign_select"]);
    	}
    	    	
    	if(StructKeyExists(arguments.formRequest, "curr_select")){
    		local.asset.setLocIdc(arguments.formRequest["curr_select"]);
    	}
    	
    	if(StructKeyExists(arguments.formRequest, "remarks")){
    		local.asset.setRemarks(arguments.formRequest["remarks"]);
    	}
    	    	
    	if(inTransit EQ 'Y' and StructKeyExists(arguments.formRequest, "shipper")){
    		local.asset.setShipper(arguments.formRequest["shipper"]);
    	}else{
    		local.asset.setShipper("");    	
    	}
    		  	
    	if(inTransit EQ 'Y' and StructKeyExists(arguments.formRequest, "tcn")){
    		local.asset.setTcn(arguments.formRequest["tcn"]);
    	}else{
    		local.asset.setTcn("");
    	}
    	
    	return asset;
    }
    
    private any function populateInvAsset(required struct formRequest){
    	
    	var local.invAsset = getInvAsset(arguments.formRequest.ctAssetId);
    	    	
    	if(StructKeyExists(arguments.formRequest, "shipper")){
    		local.invAsset.setShipper(arguments.formRequest["shipper"]);
    	}
    	    	
    	if(StructKeyExists(arguments.formRequest, "tcn")){
    		local.invAsset.setTcn(arguments.formRequest["tcn"]);
    	}
    	local.invAsset.setChgDate(Now());
    	
    	return invAsset;
    }
    
}