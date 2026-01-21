import criis.bo.MaintenanceBO;

import cfc.facade.SessionFacade;
import cfc.factory.ObjectFactory;
import cfc.utils.javaLoggerProxy;
import cfc.utils.utilities;
import cfc.model.Event;
import cfc.model.Repair;
import cfc.model.MeterHist;
import cfc.model.Labor;
import cfc.model.LaborPart;
import cfc.utils.QueryIterator;


component  output="false" extends="cfc.utils.Proxy" 
{
	
	variables.instance = {
		objectfactory='',
		assetService = '',
		invAssetsService = '',
        meterHistService = '',
        cfgMetersService = '',
		utilities = new utilities(),
		componentName = "maintenanceUIDController",
       javaLoggerProxy = new  javaLoggerProxy(),
       sessionFacade = new SessionFacade()

	};
	
	public any function init(){
	   return this;
	}
	
	public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }
	
	public any function getComponentName(){
        var local = {};
        if(StructKeyexists(getMetaData(this),"name")){
           variables.instance.componentName = getMetaData(this).name;   
        }
       return variables.instance.componentName;      
    }
    
    public any function getUser(){
       return getSessionFacade().getUserName();      
    }
	
	public any function getRootPath(){
       return Application.rootPath;      
    }
    
    public any function getProgram(){
       return lcase(trim(application.sessionManager.getProgramSetting()));      
    }
	
	public any function getObjectFactory(){
        if(isSimpleValue(variables.instance.objectFactory)){
           variables.instance.objectFactory = APPLICATION.objectFactory;    
        }   
        return variables.instance.objectFactory;      
    }
	
	public any function getDBUtils(){
       return getObjectFactory().create("DBUtils");      
    }
	
	public any function getAssetService(){
       if(isSimpleValue(variables.instance.assetService)){
           variables.instance.assetService = APPLICATION.objectFactory.create("AssetService");    
        }       
       return variables.instance.assetService;      
    }
    
    public any function getInvAssetsService(){
       if(isSimpleValue(variables.instance.invAssetsService)){
           variables.instance.invAssetsService = APPLICATION.objectFactory.create("InvAssetsService");    
        }       
       return variables.instance.invAssetsService;      
    }
    
    public any function getMeterHistService(){
       if(isSimpleValue(variables.instance.meterHistService)){
           variables.instance.meterHistService = getObjectFactory().create("meterHistService");    
        }       
       return variables.instance.meterHistService;      
    }
    
    public any function getCfgMetersService(){
       if(isSimpleValue(variables.instance.CfgMetersService)){
           variables.instance.cfgMetersService = getObjectFactory().create("CfgMetersService");    
        }       
       return variables.instance.cfgMetersService;      
    }

	public string function UIIDecode(string uid){
		return CreateObject("java","mil.af.robins.rampod.uii_scanner.UII_Decode").init(ARGUMENTS.uid);
	}
	
    private any function getUtilities(){
       return variables.instance.utilities;      
    }
	
	public void function readUII(required string uids){
	
	   var local = {};
	   local.convertedUIDs = [];
	   local.assets = [];
	   local.assetIds = [];
	   local.maintAssets = [];
	   local.uidsArray = ARGUMENTS.uids.split("\n");
	   local.utils = new utilities();
	   local.page = getRootPath() & "/" & getProgram() & "/maintenance/createMaintenanceUID.cfm";

	   for(local.uid = 1;local.uid<=ArrayLen(local.uidsArray);local.uid++){
	   	  try{
	   	  	   local.decodedUII = UIIDecode(local.uidsArray[local.uid]).getConcatenatedUII();
	   	  	   if(isDefined("local.decodedUII")){
		   	       ArrayAppend(local.convertedUIDs,local.decodedUII);
		   	       
		   	       local.assetObj = getAssetService().getAssetByUII(local.decodedUII);
		   	       
		   	       ArrayAppend(local.assets,local.assetObj);
		   	       if(!isNull(local.assetObj.getAssetId()) && isNumeric(local.assetObj.getAssetId())){
		   	          ArrayAppend(local.assetIds,local.assetObj.getAssetId());	  
		   	       }
		   	       
		   	       
	   	       }
	   	  }catch(RecordNotFoundException e){
		       local.utils.recordError(e,utils.getComponentName(this),"readUII",getUser()); 
		       continue;
	   	  }catch(any e){
	   	  	if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
			     local.page = trim(rc.httpreferer);      
			} 
	   	  	local.utils.recordError(e,utils.getComponentName(this),"readUII",getUser());     
            addToRequest("error",{message='There was an error reading the UII codes'});
	   	  }    
	   }

	   addToFormRequest("convertedUIDs",local.convertedUIDs);
	   addToFormRequest("assets",local.assets);
	   
	   //local.UIIAssets = getDBUtils().getAssetsById(ArrayToList(local.assetIds));
	   
	   switch (ucase(trim(getSessionFacade().getSourceCatSetting()))) {
        case "I": 
            local.UIIAssets = getDBUtils().readLevelsByAssetId(ArrayToList(local.assetIds));
            addToRequest("qAssetLevels",local.UIIAssets);
        break;
        case "D": 
            local.UIIAssets = getDBUtils().getAssetsById(ArrayToList(local.assetIds)); 
            addToRequest("qUIIAssets",local.UIIAssets); 
        break; 
        }

	   redirect(local.page,true);
	}
	
	public any function insertEvents(required string assetIds){
		try{
			local.page = getRootPath() & "/" & getProgram() & "/maintenance/backlog.cfm";
	        
			
			local.assetsArray = ARGUMENTS.assetIds.split(",");
			local.assetsObjArray = [];
			local.topLevelArray = [];
			local.subLevelArray = [];
			local.otherArray = [];
			local.assets = [];
			local.UIIAssets = getDBUtils().readLevelsByAssetId(ARGUMENTS.assetIds);
			var codeService = APPLICATION.objectFactory.create("CodeService");
			
			var maintenanceBo = new MaintenanceBO();	
			
				    
				    
			
			local.code = local.codeService.findByCodeTypeCodeValue("STATUS", "NMCM");		
			
			// Split query into config'd / non-config'd arrays
			for(local.asset = 1; local.asset<=local.UIIAssets.recordcount;local.asset++){
				
				local.assetObj = getAssetService().getAsset(local.UIIAssets.ASSET_ID[local.asset]);
				local.assetObj.setStatusCd(local.code.getCodeId());
			    getAssetService().updateAsset(local.assetObj);
			    
			    try{
					local.invAsset = getInvAssetsService().getInvAssets(local.assetObj.getCtAssetId());
		            local.invAsset.setStatus(local.code.getCtCodeId());
				    getInvAssetsService().updateInvAssets(local.invAsset); 
		    	}catch(any e){}
				
				switch (ucase(trim(getSessionFacade().getSourceCatSetting()))) {
		        case "I": 
		            if(local.UIIAssets.SYS_TYPE[asset] EQ "PART" and local.UIIAssets.NHA_ASSET[asset] NEQ local.UIIAssets.ASSET_ID[asset]){
						ArrayAppend(local.subLevelArray, local.assetObj);
					}else if(local.UIIAssets.SYS_TYPE[asset] EQ "POD"){
						ArrayAppend(local.topLevelArray, local.assetObj);
					}else{
						ArrayAppend(local.otherArray, local.assetObj);
					}
		        break;
		        case "D": 
		            ArrayAppend(local.otherArray, local.assetObj);
		        break; 
		        }
	        
				
				
				
			}
			
			// Insert config'd arrays
			for(top=1; top<=ArrayLen(local.topLevelArray);top++){
				
	        	local.args = {};
	        	
	        	local.event = populateEvent(local.topLevelArray[top]);
	        	
				local.cfgMeters = populateCfgMeters(local.topLevelArray[top]);
	        	local.meterHist = populateMeterHist(local.cfgMeters);
		        local.asset = populateAsset(local.event.getAssetId());
	        	
	        	
	        	//local.result = local.maintenanceBo.createEventUID(local.event);
	        	
	        	getSessionFacade().setValue("systype", local.asset.getAssetType());	
	        	
	        	local.result = local.maintenanceBo.createEvent(local.event, local.cfgMeters, local.meterHist, local.asset);
	        	local.args.eventId = local.result.getEventId(); 
	        	local.args.seq=1;
	        	//local.args.asset=local.topLevelArray[top];
	        	
	        	for(sub=1;sub<=ArrayLen(local.subLevelArray);sub++){       
	        		local.args.asset=local.subLevelArray[sub]; 		
	        		local.repair = populateRepair(local.args);
	        		local.labor = populateLabor(local.repair);
	        		local.laborPart = populateLaborPartWorked(local.args);
	        		repairInsert = local.maintenanceBo.createRepairUID(local.repair, local.labor, local.laborPart);
	        		local.args.seq++;
	        	}
	        	
			}
			
			// Insert non-config'd arrays
			for(other=1;other<=ArrayLen(local.otherArray);other++){
				
	        	local.args = {};
	        	
	        	local.event = populateEvent(local.otherArray[other]);
	        	
	        	//local.result = local.maintenanceBo.createEventUID(local.event);
	        	local.result = local.maintenanceBo.createEventUID(local.event);
	        	
			}
			
    		addToRequest("success", {message="UID job(s) were created successfully"});
			
        }catch(any e){
        	addToRequest("error",e);
        }
        
        local.search = getDBUtils().searchBacklogs(getSessionFacade().getProgramSetting(),"",application.sessionManager.getLocIdSetting());
        
        local.search = getUtilities().addEncryptedColumn(local.search,"eventid");
        local.search = getUtilities().addEncryptedColumn(local.search,"repairid");
        
    	addToRequest("qSearch",new QueryIterator(local.search));
    	addToRequest("search",local.search);
        	
        redirect(local.page,true);
        
	}
	
	private any function populateAsset(required assetId){
    	var asset = getAssetService().getAsset(arguments.assetId);
    	/*
    	if(StructKeyExists(arguments.formRequest, "status_select")){
    		//local.asset.setStatusCd(arguments.formRequest["status_select"]);
    	}*/
    	
    	return asset;
    }
	
	 private LaborPart function populateLaborPartWorked(required struct args) {
        var laborPart = new LaborPart();
              
        if (!isSimpleValue(arguments.args.asset)) {
            local.laborPart.setAssetId(arguments.args.asset.getAssetId());
        }  
        
        local.laborPart.setInsBy(application.sessionManager.getUserName());
        local.laborPart.setInsDate(Now());
        local.laborPart.setPartAction("WORKED");
        
        return local.laborPart;
    }
    
	
	 /* populate Event bean from formRequest */
    private Event function populateEvent(required any asset) {
        var event = new Event();

       	local.newJobIdService = application.objectFactory.create("NewJobIdService");
        local.newJobId = local.newJobIdService.getNewJobId(application.sessionManager.getProgramSetting(),application.sessionManager.getLocIdSetting());
        local.event.setJobNo(local.newJobId);	
		local.event.setAssetId(arguments.asset.getAssetId());
       
        /*if (StructKeyExists(arguments.formRequest, "maintStartDate") && isDate(arguments.formRequest["maintStartDate"])) {
            if (StructKeyExists(arguments.formRequest, "maintStartTime") && isDate(arguments.formRequest["maintStartDate"] & " " & arguments.formRequest["maintStartTime"])) {
                local.event.setStartJob(ParseDateTime(arguments.formRequest["maintStartDate"] & " " & arguments.formRequest["maintStartTime"]));
            } else {
                local.event.setStartJob(ParseDateTime(arguments.formRequest["maintStartDate"] & " 00:00"));
            }
        }

        if (StructKeyExists(arguments.formRequest, "maintCompDate") && isDate(arguments.formRequest["maintCompDate"])) {
            if (StructKeyExists(arguments.formRequest, "maintCompTime") && isDate(arguments.formRequest["maintCompDate"] & " " & arguments.formRequest["maintCompTime"])) {
                local.event.setStopJob(ParseDateTime(arguments.formRequest["maintCompDate"] & " " & arguments.formRequest["maintCompTime"]));
            } else {
                local.event.setStopJob(ParseDateTime(arguments.formRequest["maintCompDate"] & " 00:00"));
            }
        }

        if (StructKeyExists(arguments.formRequest, "discrepancy")) {
            local.event.setDiscrepancy(arguments.formRequest["discrepancy"]);
        }*/
		local.event.setStartJob(Now());
        local.event.setLocId(application.sessionManager.getLocIdSetting());
        local.event.setSourceCat(application.sessionManager.getSourceCatSetting());
        local.event.setInsBy(application.sessionManager.getUserName());
        local.event.setInsDate(Now());

        return local.event;
    }
    
     /* populate Repair bean from formRequest */
    private Repair function populateRepair(required struct args) {
        var repair = new Repair();

        if (StructKeyExists(arguments.args, "eventId")) {
            local.repair.setEventId(arguments.args["eventId"]);
        }

        if (!isSimpleValue(arguments.args.asset)) {
            local.repair.setAssetId(arguments.args.asset.getAssetId());
        }
        
        if (StructKeyExists(arguments.args, "seq")){
        	local.repair.setRepairSeq(arguments.args["seq"]);
        }

        local.repair.setInsBy(application.sessionManager.getUserName());
        local.repair.setInsDate(Now());
        
        return local.repair;
    }
    
    /* populate CfgMeters bean from formRequest */
    private any function populateCfgMeters(required any asset) {
    	
    	
    	local = {};	
    	if (isSimpleValue(arguments.asset)) {
            throw(type="MeterException", message="Asset obj does not exist.", detail="");
        }else{
        	local.cfgMeters = getCfgMetersService().getCfgMetersCurrentMeter(arguments.asset.getCtAssetId());	
        }
        
        local.cfgMeters.setIsMeterChg("N");
        local.cfgMeters.setCreatedBy(application.sessionManager.getUserName());
        local.cfgMeters.setCreateDate(Now());
        local.cfgMeters.setChgBy(application.sessionManager.getUserName());
        local.cfgMeters.setChgDate(Now());

        return local.cfgMeters;
    }

    /* populate MeterHist bean from formRequest */
    private any function populateMeterHist(required any cfgMeters) {
    	
    	local = {};
    	if (isSimpleValue(arguments.cfgMeters)) {
            throw(type="MeterException", message="CFG Meters obj does not exist.", detail="");
        }
        
        local.meterHist = new MeterHist();
        local.meterHist.setAssetId(arguments.cfgMeters.getAssetId());
        local.meterHist.setMeterIn(arguments.cfgMeters.getValueIn());
        local.meterHist.setMeterOut(arguments.cfgMeters.getValueOut());
        local.meterHist.setSeqNum(arguments.cfgMeters.getMeterSeq());
        

        local.meterHist.setInsBy(application.sessionManager.getUserName());
        local.meterHist.setInsDate(Now());

        return local.meterHist;
    }
    
    /* populate Labor bean from formRequest */
    private any function populateLabor(required any repair) {
        var labor = new Labor();
        
        if(isSimpleValue(arguments.repair)){
        	throw(type="MeterException", message="Repair obj does not exist.", detail="");
        }
        
        local.labor.setLaborSeq(1);
        
        
        local.labor.setChgBy(application.sessionManager.getUserName());
        local.labor.setChgDate(Now());
        local.labor.setInsBy(application.sessionManager.getUserName());
        local.labor.setInsDate(Now());

        return local.labor;
    }
    
    	
}