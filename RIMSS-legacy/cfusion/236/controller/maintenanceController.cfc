import 236.bo.MaintenanceBO;

import cfc.dao.DBUtils;

import cfc.model.CfgMeters;
import cfc.model.Event;
import cfc.model.Labor;
import cfc.model.LaborBitPc;
import cfc.model.LaborPart;
import cfc.model.MeterHist;
import cfc.model.Repair;
import cfc.model.Asset;
import cfc.model.Code;
import cfc.model.Labor;
import cfc.model.LaborBitPc;
import cfc.model.LaborPart;
import cfc.model.Attachments;
import cfc.model.Sorties;
import cfc.model.TestFailed;
import cfc.model.AssetInspection;
import cfc.model.TctoAsset;
import cfc.model.SruOrder;
import cfc.model.Tcto;

import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;
import cfc.utils.utilities;
import cfc.facade.SessionRequestFacade;
// new import - Kevin 05 Nov 2013
import cfc.facade.SessionFacade;
import cfc.utils.QueryIterator;
// now import - end
import cfc.service.IMPULSService;
import cfc.service.InvAssetService;
import cfc.service.InvSystemsService;
import cfc.service.AssetService;
import cfc.service.RepairService;
import cfc.service.CodeService;
import cfc.service.PartListService;
import cfc.service.LaborService;
import cfc.service.LaborPartService;
import cfc.service.AttachmentsService;
import cfc.service.SortiesService;
import cfc.service.TestFailedService;
import cfc.service.AssetInspectionService;
import cfc.service.MeterHistService;
import cfc.service.SruOrderService;
import cfc.service.LaborBitPcService;
import cfc.service.TctoAssetService;
import cfc.service.TctoService;

component extends="cfc.utils.Proxy" {
    variables.instance = {
        javaLoggerProxy = new  javaLoggerProxy(),
        utilities = new utilities(),
        sessionRequestFacade = new SessionRequestFacade(),
        newJobIdService = '',
        // new instance variable - Kevin 05 Nov 2013
        sessionFacade = new SessionFacade(),
        dbUtils = '',
        objectFactory = '',
        eventService = '',
        partListService = '',
        invAssetService = '',
        invSystemsService = '',
        assetService = '',
        repairService = '',
        laborService = '',
        laborBitPcService = '',
        attachmentsService = '',
        laborPartService = '',
        codeService = '',
        meterHistService = '',
        cfgMetersService = '',
        sortiesService = '',
        testFailedService = '',
        assetInspectionService = '',
        sruOrderService = '',
        tctoAssetService = '',
        tctoService = '',
        partListService = ''
        // new instance variable - end 
    };

    function init() {
        return this;
    }

    private any function getJavaLoggerProxy() {
       return variables.instance.javaLoggerProxy;      
    }
    
    private any function getComponentName(){
        var local = {};
        if(StructKeyexists(getMetaData(this),"name")) {
           variables.instance.componentName = getMetaData(this).name;   
        }
        return variables.instance.componentName;      
    }

    private any function getSessionRequestFacade(){
       return variables.instance.sessionRequestFacade;      
    }
    
    private any function getUtilities(){
       return variables.instance.utilities;      
    }
    

    
    private any function getRootPath(){
       return Application.rootPath;      
    }
    
    private any function getProgram(){
       return lcase(trim(application.sessionManager.getProgramSetting()));      
    }
    
    // getEventService add - Kevin Lovett 13 Nov 2013
    public any function getPartListService(){
       if(isSimpleValue(variables.instance.partListService)){
           variables.instance.partListService = getObjectFactory().create("PartListService");    
        }       
       return variables.instance.partListService;      
    }
    
    public any function getAssetService(){
       if(isSimpleValue(variables.instance.assetService)){
           variables.instance.assetService = getObjectFactory().create("AssetService");    
        }       
       return variables.instance.assetService;      
    }
    
    public any function getInvAssetService(){
       if(isSimpleValue(variables.instance.invAssetService)){
           variables.instance.invAssetService = getObjectFactory().create("InvAssetService");    
        }       
       return variables.instance.invAssetService;      
    }
    
    public any function getInvSystemsService(){
       if(isSimpleValue(variables.instance.invSystemsService)){
           variables.instance.invSystemsService = getObjectFactory().create("InvSystemsService");    
        }       
       return variables.instance.invSystemsService;      
    }
    
    public any function getLaborBitPcService(){
       if(isSimpleValue(variables.instance.laborBitPcService)){
           variables.instance.laborBitPcService = getObjectFactory().create("LaborBitPcService");    
        }       
       return variables.instance.laborBitPcService;      
    }
    
    public any function getRepairService(){
       if(isSimpleValue(variables.instance.repairService)){
           variables.instance.repairService = getObjectFactory().create("RepairService");    
        }       
       return variables.instance.repairService;      
    }
    
    public any function getLaborService(){
       if(isSimpleValue(variables.instance.laborService)){
           variables.instance.laborService = getObjectFactory().create("LaborService");    
        }       
       return variables.instance.laborService;      
    }
    
    public any function getAttachmentsService(){
       if(isSimpleValue(variables.instance.attachmentsService)){
           variables.instance.attachmentsService = getObjectFactory().create("AttachmentsService");    
        }       
       return variables.instance.attachmentsService;      
    }
    
    public any function getAssetInspectionService(){
       if(isSimpleValue(variables.instance.assetInspectionService)){
           variables.instance.assetInspectionService = getObjectFactory().create("AssetInspectionService");    
        }       
       return variables.instance.assetInspectionService;      
    }
    
    public any function getTctoAssetService(){
       if(isSimpleValue(variables.instance.tctoAssetService)){
           variables.instance.tctoAssetService = getObjectFactory().create("TctoAssetService");    
        }       
       return variables.instance.tctoAssetService;      
    }
    
     public any function getTctoService(){
       if(isSimpleValue(variables.instance.tctoService)){
           variables.instance.tctoService = getObjectFactory().create("TctoService");    
        }       
       return variables.instance.tctoService;      
    }
    
    public any function getSortiesService(){
       if(isSimpleValue(variables.instance.sortiesService)){
           variables.instance.sortiesService = getObjectFactory().create("SortiesService");    
        }       
       return variables.instance.sortiesService;      
    }
    
    public any function getTestFailedService(){
       if(isSimpleValue(variables.instance.testFailedService)){
           variables.instance.testFailedService = getObjectFactory().create("TestFailedService");    
        }       
       return variables.instance.testFailedService;      
    }
    
    public any function getLaborPartService(){
       if(isSimpleValue(variables.instance.laborPartService)){
           variables.instance.laborPartService = getObjectFactory().create("LaborPartService");    
        }       
       return variables.instance.laborPartService;      
    }
    
    public any function getSruOrderService(){
       if(isSimpleValue(variables.instance.sruOrderService)){
           variables.instance.sruOrderService = getObjectFactory().create("SruOrderService");    
        }       
       return variables.instance.sruOrderService;      
    }
    
    
    public any function getCodeService(){
       if(isSimpleValue(variables.instance.codeService)){
           variables.instance.codeService = getObjectFactory().create("CodeService");    
        }       
       return variables.instance.codeService;      
    }
    
    
    public any function getEventService(){
       if(isSimpleValue(variables.instance.eventService)){
           variables.instance.eventService = getObjectFactory().create("EventService");    
        }       
       return variables.instance.eventService;      
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
    // getEventService add - end

    remote string function getNewJobId() {
        variables.instance.newJobIdService = application.objectFactory.create("NewJobIdService");
        return variables.instance.newJobIdService.getNewJobId(application.sessionManager.getProgramSetting(),application.sessionManager.getLocIdSetting());
    }
    
    
    public void function insertEvent(required struct formRequest) {
        var local = {};
        var maintenanceBo = new MaintenanceBO();
        var impulsService = new IMPULSService(); 
        
        if(StructKeyExists(arguments.formRequest,"systype") && len(trim(arguments.formRequest.systype))){
        	getSessionFacade().setValue("systype", arguments.formRequest.systype);	
        }
        
        
        var event = populateEvent(arguments.formRequest);
        var cfgMeters = populateCfgMeters(arguments.formRequest);
        var meterHist = populateMeterHist(arguments.formRequest);
        validateEvent(local.event, local.meterHist);
        var asset = populateAsset(arguments.formRequest);
        validateAsset(local.asset);
       
        var local.page = getRootPath() & "/" & getProgram() & "/maintenance/updateMaintenance.cfm";


        /* increment meter sequence number if there's a meter change */
        if (StructKeyExists(arguments.formRequest, "meterchg")) {
	        if (hasMeterChanged(arguments.formRequest["meterchg"])) {
	            incrementMeterSequence(local.cfgMeters, local.meterHist);
	        } else {
	        	/*if (StructKeyExists(arguments.formRequest, "origEtmStart") and StructKeyExists(arguments.formRequest, "etmStart")) {
	        		if (arguments.formRequest["origEtmStart"] GT arguments.formRequest["etmStart"]) {
	        			throw(type="MeterException", message="ETM Start can only be less than the previously recorded value if the meter has been replaced. Previous Meter Reading (#arguments.formRequest["origEtmStart"]#) Supplied Meter Reading (#arguments.formRequest["etmStart"]#)", detail="Previous Reading Cannot be Greater than supplied reading: ");
	        			
	        			writeLog(file="maintenanceController" text="OrigEtmStart (#arguments.formRequest["origEtmStart"]#) was greater then EtmStart (#arguments.formRequest["etmStart"]#)");
	        		} else {
						local.meterHist.setSeqNum(getCurrentMeterHistSequenceNumber(local.meterHist.getAssetId()));
		        		local.cfgMeters.setMeterSeq(getCurrentCfgMetersSequenceNumber(local.cfgMeters.getAssetId()));
					}				
	        		
	        	} else {*/	        	   
		        	local.meterHist.setSeqNum(getCurrentMeterHistSequenceNumber(local.meterHist.getAssetId()));
		        	local.cfgMeters.setMeterSeq(getCurrentCfgMetersSequenceNumber(local.cfgMeters.getAssetId()));	
	        	/*}*/
            }
        } 
        getJavaLoggerProxy().info(message="#local.meterHist.getSeqNum()#",sourceClass=getUtilities().getComponentName(this), methodName="insertEvent",user=application.sessionManager.getUsername());
        getJavaLoggerProxy().info(message="#local.cfgMeters.getMeterSeq()#",sourceClass=getUtilities().getComponentName(this), methodName="insertEvent",user=application.sessionManager.getUsername());
        try {
        	
            
	        local.result = local.maintenanceBo.createEvent(local.event, local.cfgMeters, local.meterHist, local.asset);
	         if(StructKeyExists(arguments.formRequest, "ctassetid") && len(trim(arguments.formRequest.ctassetid))){
	        	var impulsForm = populateImpulsForm(arguments.formRequest);
				validateImpulsForm(impulsForm);
            	local.impulsService.send(local.impulsForm);
	        }
            
            addToRequest("success", {message="Insert successful for JOB NO: #local.event.getJobNo()#"});
                       
            addToFormRequest("eventId",local.result.getEventId());
            
            
            editEvent(local.result.getEventId());
            
            redirect(url=local.page, persist="true"); 
        } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertEvent",user=application.sessionManager.getUsername());
            
            addToRequest("error",{message="Insert failed for JOB NO: #local.event.getJobNo()#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
            
            redirect(url=getRootPath() & "/" & getProgram() & "/maintenance/createMaintenance.cfm", persist="true");
        }
    }
    
	public any function insertDepotEvent (required string asset, required string loc, Repair repair, LaborPart laborPart) {
    	writeLog(file="ACTS" text="maintenanceController - createDepotEvent (#arguments.asset#) Location (#arguments.loc#)");
    	var maintenanceBo = new MaintenanceBO(); 
		local.arg = {};
		
		local.event = populateDepotEvent(arguments.asset, arguments.loc, arguments.repair.getEventId());
		
		try{	
			local.result = local.maintenanceBo.createEventUID(local.event);	
		    local.args.eventId = local.result.getEventId(); 
	        local.args.seq=1;
			local.args.asset=arguments.asset;
			local.args.assetId=arguments.asset;
			local.args.howMalCodeId = arguments.repair.getHowMal();
			local.args.typeMaintCodeId = arguments.repair.getTypeMaint();
			local.args.whenDiscCodeId = arguments.repair.getWhenDisc();
			
			local.repair = populateRepair(local.args);
			
	    	local.labor = populateLabor(local.repair);
			
			local.args.remSraAssetId=arguments.asset;
			local.args.laborId=local.labor.getLaborId();
			local.laborPart = populateLaborPartRemoved(local.args);
	    	repairInsert = local.maintenanceBo.createRepairUID(local.repair, local.labor, local.laborPart);
	    	
			addToRequest("success", {message="A Depot job was created successfully"});
			
		}catch(any e){
        	addToRequest("error",e);
        }
    }
    
    public void function updateEvent(required struct formRequest) {
    	var maintenanceBo = new MaintenanceBO();
        var impulsService = new IMPULSService(); 
        
        var event = populateEvent(arguments.formRequest);
        /*if(arguments.formrequest.currETM NEQ ''){*/
        if(arguments.formrequest.etmStart GTE 0){
        	var cfgMeters = populateCfgMeters(arguments.formRequest);
        	var meterHist = populateMeterHist(arguments.formRequest);
        }else{
        	cfgMeters = '';
        	meterHist = '';
        }
        var asset = populateAsset(arguments.formRequest);
        if(StructKeyExists(arguments.formRequest,"systype") && len(trim(arguments.formRequest.systype))){
        	getSessionFacade().setValue("systype", arguments.formRequest.systype);	
        }
       
        // JJP 06/22/17 Added so that updating TCTO redirects properly
        if(StructKeyExists(session, "currentTab")){
        	if(session.currentTab eq 'BACKLOG'){
        		// JJP 10/20/17 Redirect to appropriate record TR: 12
        		if (StructKeyExists(form, 'encryptedEventId') and form.encryptedEventId NEQ ''){
        			var local.page = getRootPath() & "/" & getProgram() & "/maintenance/backlog.cfm##" & form.encryptedEventId;
        		}
        		else{
        			var local.page = getRootPath() & "/" & getProgram() & "/maintenance/backlog.cfm";
        		}	
        	}
        	else if(session.currentTab eq 'TCTO'){
        		var local.page = getRootPath() & "/" & getProgram() & "/maintenance/tcto.cfm";
        	}
        	else if(session.currentTab eq 'PMI'){
        		var local.page = getRootPath() & "/" & getProgram() & "/maintenance/pmi.cfm";
        	}
        }
        else{
        	// Default to backlog
        	var local.page = getRootPath() & "/" & getProgram() & "/maintenance/backlog.cfm";
        }
        
        /* Need to check to see if form values have changed from Db values and make appropriate changes */
        if(arguments.formrequest.etmStart GTE 0){        
	        try{
	        	var meterHistDB = getMeterHistService().getMeterHist(arguments.formRequest["meterId"]);
	        	
		        if(meterHistDB.getChanged() EQ 'N' && meterHist.getChanged() EQ 'Y'){
		        	incrementMeterSequence(cfgMeters, meterHist);
		        }else if(meterHistDB.getChanged() EQ 'Y' && meterHist.getChanged() EQ 'N'){
		        	decrementMeterSequence(cfgMeters, meterHist);
		        }
	        
	        }catch(any e){}
	        
	        try{        	
	        	var cfgMetersDB = getCfgMetersService().getCfgMeters(arguments.formRequest["eventId"]);
	        }catch(any e){}
        }
    	try{
    		if(arguments.formrequest.etmStart GTE 0){
    			local.maintenanceBo.updateEvent(local.event, local.cfgMeters, local.meterHist, local.asset);
    		}else{
    			local.maintenanceBo.updateEventNOETM(local.event,local.asset);
    		}
    		
    		if(StructKeyExists(arguments.formRequest, "ctassetid") && len(trim(arguments.formRequest.ctassetid))){
	        	var impulsForm = populateImpulsForm(arguments.formRequest);
				validateImpulsForm(impulsForm);
            	local.impulsService.send(local.impulsForm);
	        }
	        
            getSessionRequestFacade().addToRequest("success", {message="Insert successful for JOB NO: #local.event.getJobNo()#"});
            redirect(url=local.page, persist="true"); 
    		
            redirect(local.page,true);
    	} catch (any e){
    		addToRequest("error", {message="Update failed for JOB NO: #local.event.getJobNo()#"});
    		
    		/* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
                editEvent(arguments.formRequest["eventId"]);
            }
    	}
    	   redirect(url=getRootPath() & "/" & getProgram() & "/maintenance/updateMaintenance.cfm", persist="true");
    }
    
    public any function deleteEvent( string eventJob= "", string page = ""){
    	writelog(file="delete" text="#arguments.page#");
    	var local.page = getRootPath() & "/" & getProgram() & "/maintenance/backlog.cfm";
    	var maintenanceBo = new MaintenanceBO();
    	local.decryptEvent = getUtilities().decryptId(arguments.eventJob);
    	local.event = getEventService().getEvent(val(local.decryptEvent));
        local.asset = getAssetService().getAsset(val(local.event.getAssetId()));
    	local.repair = getDBUtils().getRepairByEventId(local.event.getEventId());
    	if(local.asset.getAssetType() EQ 'POD'){    	
    		try{
    			local.meterHist = getMeterHistService().getMeterEventHist(val(local.decryptEvent));
    		}catch(any e){}
    		    	
    		try{
    			local.cfgMeter = getDBUtils().getCfgMeterByEvent(local.event.getEventId(), local.asset.getCtAssetId());
    		}catch(any e){}    	
    	}
               
        transaction{
        	try{
        		// Delete Existing Repair Records
        		for (i = 1; i LTE local.repair.recordcount; i++) {
        			local.labor = getLaborService().getLaborByRepairId(val(local.repair.repairid[i]));
            		local.maintenanceBo.deleteRepair(local.repair.repairid[i], local.labor.getLaborId());
        		}
        		
        		//Delete MeterHist Record
        		if (local.asset.getAssetType() EQ 'POD'){
        			try{
        				local.maintenanceBo.deleteMeterHist(local.meterHist.getMeterId());
        			}catch(any e){}
        		}
        		
        		// Delete Cfg Meter Record
        		if (local.asset.getAssetType() EQ 'POD' ){
        			try{
						local.maintenanceBo.deleteCfgMeter(local.cfgMeter.asset_id, local.cfgMeter.event_id);        			
        			}catch(any e){}        			
        		}
        		
        		// Delete Event Record
        		local.maintenanceBo.deleteEvent(local.event.getEventId());     
        		
        		TransactionCommit();
        		
        		local.search = getDBUtils().searchBacklogs(getSessionFacade().getProgramSetting(),"",application.sessionManager.getLocIdSetting());
                local.search = getUtilities().addEncryptedColumn(local.search,"eventid");
        		local.search = getUtilities().addEncryptedColumn(local.search,"repairid");
        		
        		addToRequest("qSearch",new QueryIterator(local.search));
        		addToRequest("search",local.search);
        		addToRequest("success", {message="JOB No: #local.event.getJobNo()# was deleted successfully."});
        		redirect(local.page,true);
        	} catch(any e){
        		TransactionRollback();
        		addToRequest("error",e);
            	local.cause = getUtilities().getCause(e);
            	getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"editEventDetail",getUser());
        	
        	
            	if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                	local.page = rc.httpReferer;   
            	}
        	}
        }		
		
	}
    
    public void function exportBacklog(required struct formRequest){
    	
    	var local = {};
    	var local.page = getRootPath() & "/" & getProgram() & "/maintenance/backlogExport.cfm";
    	
       
        local.search = getDBUtils().searchBacklogs(getSessionFacade().getProgramSetting(),getSessionFacade().getValue("searchCriteria"),application.sessionManager.getLocIdSetting());
        
        local.search = getUtilities().addEncryptedColumn(local.search,"eventid");
        local.search = getUtilities().addEncryptedColumn(local.search,"repairid");
        
       // getJavaLoggerProxy().fine(message="Querying Backlog dbUtils.searchBacklog(#getSessionFacade().getProgramSetting()#,#ARGUMENTS.searchCriteria#)",sourceClass=getUtilities().getComponentName(this), methodName="searchBacklog");
        
        addToRequest("qSearch",new QueryIterator(local.search));
        addToRequest("search",local.search);
        addToRequest("exportType", arguments.formRequest.exportType);
        
        //local.jobno = getUtilities().listRemoveDupes(ValueList(local.search.eventid));
        //if(listlen(local.eventid) eq 1){
        //    addToFormRequest("backlogJobs",local.eventid);	
        //}
        
        //getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=getUtilities().getComponentName(this), methodName="searchBacklog");
       redirect(local.page,true); 
	   
    	
    }
    
    public void function exportPmi(required struct formRequest){
    	
    	var local = {};
    	var local.page = getRootPath() & "/" & getProgram() & "/maintenance/pmiExport.cfm";
    	
       
        local.search = getDBUtils().searchPmi(getSessionFacade().getProgramSetting(),getSessionFacade().getValue("searchCriteria"),application.sessionManager.getLocIdSetting(),getSessionFacade().getValue("dueDateInterval"));
        
        
       // getJavaLoggerProxy().fine(message="Querying Backlog dbUtils.searchBacklog(#getSessionFacade().getProgramSetting()#,#ARGUMENTS.searchCriteria#)",sourceClass=getUtilities().getComponentName(this), methodName="searchBacklog");
        
        addToRequest("qSearch",new QueryIterator(local.search));
        addToRequest("search",local.search);
        addToRequest("exportType", arguments.formRequest.exportType);
        
        //local.jobno = getUtilities().listRemoveDupes(ValueList(local.search.eventid));
        //if(listlen(local.eventid) eq 1){
        //    addToFormRequest("backlogJobs",local.eventid);	
        //}
        
        //getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=getUtilities().getComponentName(this), methodName="searchBacklog");
       redirect(local.page,true); 
	   
    	
    }
    
    
    public void function exportTcto(required struct formRequest){
    	
    	var local = {};
    	var local.page = getRootPath() & "/" & getProgram() & "/maintenance/backlogExport.cfm";
    	
       
        local.search = getDBUtils().searchTcto(getSessionFacade().getProgramSetting(),getSessionFacade().getValue("searchCriteria"),application.sessionManager.getLocIdSetting());
        
        local.search = getUtilities().addEncryptedColumn(local.search,"eventid");
        local.search = getUtilities().addEncryptedColumn(local.search,"repairid");
        
       // getJavaLoggerProxy().fine(message="Querying Backlog dbUtils.searchBacklog(#getSessionFacade().getProgramSetting()#,#ARGUMENTS.searchCriteria#)",sourceClass=getUtilities().getComponentName(this), methodName="searchBacklog");
        
        addToRequest("qSearch",new QueryIterator(local.search));
        addToRequest("search",local.search);
        addToRequest("exportType", arguments.formRequest.exportType);
        
        //local.jobno = getUtilities().listRemoveDupes(ValueList(local.search.eventid));
        //if(listlen(local.eventid) eq 1){
        //    addToFormRequest("backlogJobs",local.eventid);	
        //}
        
        //getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=getUtilities().getComponentName(this), methodName="searchBacklog");
       redirect(local.page,true); 
	   
    	
    }
    
    public void function exportPartOrdered(required struct formRequest){
    	
	   var local={};
    	local.page = getRootPath() & "/" & getProgram() & "/maintenance/partOrderedExport.cfm";
    	addToFormRequest("searchCriteria",ARGUMENTS.formRequest.searchCriteria);
        
        getSessionFacade().setValue("searchCriteria",ARGUMENTS.formRequest.searchCriteria);
        getSessionFacade().removeValue("partOredredJobs");

        local.search = getDBUtils().searchPartOrderByLoc(getSessionFacade().getProgramSetting(),ARGUMENTS.formRequest.searchCriteria,application.sessionManager.getLocIdSetting());
    	
    	addToRequest("qSearch",new QueryIterator(local.search));
        addToRequest("search",local.search);
    	
    	redirect(local.page,true);
    	
    }
    
    remote void function setMaintStatus(required String maintStatus){
    	getSessionFacade().setValue("maintStatus",ARGUMENTS.maintStatus);
    }
    
    remote void function setDueDateInterval(required String dueDateInterval){
    	getSessionFacade().setValue("dueDateInterval",ARGUMENTS.dueDateInterval);
    }
    
    private struct function populateImpulsForm(required struct formRequest){
    	/* TODO create implus form struct */
    	var local.asset = getInvAsset(arguments.formRequest.ctassetid);    	/* TODO Return InvAsset Model */
    	var local.impulsForm = {};
    	local.inTransit = "N";
    	if(asset.getInTransitShipDate() NEQ "" and asset.getInTransitRecvDate() EQ ""){
    		local.inTransit = "Y";
    	}
    	
    	local.impulsForm['action'] = "updateSingleAssetUpdateScreen";
        local.impulsForm['assetId'] = asset.getAssetId();
        local.impulsForm['assignedLocId'] = asset.getAssignedLocId();
        local.impulsForm['currentLocId'] = asset.getCurrentLocId();
        local.impulsForm['initialCurrentLocId'] = asset.getCurrentLocId();
        local.impulsForm['isInTransit'] = local.inTransit;
        local.impulsForm['remarks'] = asset.getRemarks();
        local.impulsForm['sentBy'] = getUtilities().getUser();
        local.impulsForm['serno'] = asset.getSerno();
        local.impulsForm['initialStatus'] =  asset.getStatus();
        local.impulsForm['status'] = arguments.formRequest.status_select;
        
    	return local.impulsForm;
    }
    
    private void function validateImpulsForm(required struct impulsForm){
    	
    	if (isNull(arguments.impulsForm['status']) or !len(trim(arguments.impulsForm['status']))) {
            throw (type="MaintenanceException" message="The Status field is required. Please select a Status", detail="Select a Status");
        }
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
    
    public struct function getRepairSeq(required struct formRequest){
    	var local = {};
    	local.page = getRootPath() & "/" & getProgram() & "/maintenance/createMaintenanceDetail.cfm";
    	
    	try{
    		local.repairSeq = getDBUtils().getRepairSeqByEventId(val(arguments.formRequest.eventId));
    		local.partList = getPartListService().getPartList(val(arguments.formRequest.partnoId));
    		local.event= getEventService().getEvent(val(arguments.formRequest.eventId));
    		local.asset = getAssetService().getAsset(local.event.getAssetId());
    		
    		local.cumHrs = getDBUtils().getCumulativeETM(local.asset.getCtAssetId());
            if (local.cumHrs.recordcount GT 0){
            	addToFormRequest("cumHrs", local.cumHrs.delta);
            }
    		
    		addToFormRequest("seq", local.repairSeq.repair_seq);
    		addToFormRequest("wucCd", local.partList.getWucCd());
    		addToFormRequest("partnoId", local.partList.getPartnoId());

    	    redirect(local.page,true);
    	}catch(any e){
        	addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"getRepairSeq",getUser());
        	
        	
            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            }
        }
        redirect(local.page,true);     	
    	
    }
    
    // editEvent add - Kevin added on 8 November 2013
	public any function editEvent( string eventJob= ""){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/maintenance/updateMaintenance.cfm"; 
        
        try{
           
            local.decryptEvent = getUtilities().decryptId(arguments.eventJob);     
            local.encryptEvent = getUtilities().encryptId(local.decryptEvent);         	
            local.event = getEventService().getEvent(val(local.decryptEvent));
            local.asset = getAssetService().getAsset(val(local.event.getAssetId()));
            local.partList = getPartListService().getPartList(val(local.asset.getPartNoId()));
            local.code = getCodeService().getCode(local.partList.getSysType());
            try{
            	local.meterHist = getMeterHistService().getMeterEventHist(val(local.event.getEventId()));	
            }catch(any e){
            	local.meterHist = new MeterHist();
            }
            
            local.repair = getDBUtils().getRepairByEventId(local.event.getEventId());
            
            if (local.event.getSortieId() NEQ "") {
            	local.sortie = getSortiesService().getSorties(val(local.event.getSortieId()));
            	
            	addToFormRequest("sortieId",local.event.getSortieId());
            	addToFormRequest("mission",local.sortie.getMissionId());
            }
            
            local.repair = getUtilities().addEncryptedColumn(local.repair,"repairid");
            
            rc.qRepair = local.repair;
            
            addToFormRequest("jobId",local.event.getJobNo());
            addToFormRequest("eventId",local.event.getEventId());
            addToFormRequest("encryptedEventId",encryptEvent);
            addToFormRequest("assetId",local.event.getAssetId());           
            addToFormRequest("ctAssetId",local.asset.getctAssetId());
            addToFormRequest("serno",local.asset.getSerNo());
            addToFormRequest("etmStart",local.meterHist.getMeterIn());
            local.maintStartDate = isDate(local.event.getStartJob()) ? UCASE(TRIM(DateFormat(local.event.getStartJob(),"dd-mmm-yyyy"))): local.event.getStartJob();
            addToFormRequest("maintStartDate",local.maintStartDate);
            local.maintStartTime = isDate(local.event.getStartJob()) ? UCASE(TRIM(TimeFormat(local.event.getStartJob(),"HH:mm"))): local.event.getStartJob();
            addToFormRequest("maintStartTime",local.maintStartTime);
            addToFormRequest("partno",local.partList.getPartno());
            addToFormRequest("partnoId",local.partList.getPartnoId());
            addToFormRequest("meterchg",local.meterHist.getChanged()); 
            addToFormRequest("meterId",local.meterHist.getMeterId()); 
            addToFormRequest("meterSeq",local.meterHist.getSeqNum()); 
            addToFormRequest("status_select",local.asset.getStatusCd()); 
            addToFormRequest("etmComp",local.meterHist.getMeterOut());
            local.maintCompDate = isDate(local.event.getStopJob()) ? UCASE(TRIM(DateFormat(local.event.getStopJob(),"dd-mmm-yyyy"))): local.event.getStopJob();
            addToFormRequest("maintCompDate",local.maintCompDate);
            local.maintCompTime = isDate(local.event.getStopJob()) ? UCASE(TRIM(TimeFormat(local.event.getStopJob(),"HH:mm"))): local.event.getStopJob();
            addToFormRequest("maintCompTime",local.maintCompTime);
            addToFormRequest("discrepancy",local.event.getDiscrepancy());
            addToFormRequest("noun",local.partList.getNoun());
            addToFormRequest("systype",local.code.getCodeValue());
            
            redirect(local.page,true); 
            
        }catch(any e){
        	addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"editEvent",getUser());
        	
        	
            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            }
        }
        redirect(local.page,true); 

    }
    // editEvent add - event
    
    public any function editEventDetail (string eventRepair= "") {
    	var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/maintenance/updateMaintenanceDetail.cfm"; 
        dbUtils = application.objectFactory.create("DBUtils");
           
        try{
            local.decryptRepair = getUtilities().decryptId(arguments.eventRepair);            
            local.repair = getRepairService().getRepair(val(local.decryptRepair));
            local.event = getEventService().getEvent(local.repair.getEventId());
            local.asset = getAssetService().getAsset(val(local.event.getAssetId()));
            local.sraAsset = getAssetService().getAsset(val(local.repair.getAssetId()));
            local.sraAssetPartList =  getPartListService().getPartList(val(local.sraAsset.getPartNoId()));
            local.labor = getLaborService().getLaborByRepairId(val(local.repair.getRepairId()));
            local.partList = getPartListService().getPartList(val(local.asset.getPartNoId()));
                        
            local.PartWorkedExist = dbUtils.searchPartLabor(local.labor.getLaborId(), "WORKED");
            if (StructKeyExists(local.PartWorkedExist, "assetId")){
            	if (local.PartWorkedExist.recordcount GT 0){
            		local.laborPart = getLaborPartService().getLaborPartByLaborId(val(local.labor.getLaborId()));
                    local.laborPartAsset = getAssetService().getAsset(val(local.laborPart.getAssetId()));
                    local.laborPartPartList = getPartListService().getPartList(val(local.laborPartAsset.getPartNoId()));   
            	}
            }
            
            local.PartRemovedExist = dbUtils.searchPartLabor(local.labor.getLaborId(), "REMOVED");
            if (StructKeyExists(local.PartRemovedExist, "assetId")){
            	if (local.PartRemovedExist.recordcount GT 0){
            			local.laborPartRemoved = getLaborPartService().getLaborPartByLaborIdPartAction(val(local.labor.getLaborId()), "REMOVED");
                        local.laborPartRemovedAsset = getAssetService().getAsset(val(local.laborPartRemoved.getAssetId()));
                        local.laborPartPartRemovedList = getPartListService().getPartList(val(local.laborPartRemovedAsset.getPartNoId()));   
            	} 
            }
            
            local.PartInstalledExist = dbUtils.searchPartLabor(local.labor.getLaborId(), "INSTALLED");
            if (StructKeyExists(local.PartInstalledExist, "assetId")){
            	if (local.PartInstalledExist.recordcount GT 0){
            		local.laborPartInstalled = getLaborPartService().getLaborPartByLaborIdPartAction(val(local.labor.getLaborId()), "INSTALLED");
                    local.laborPartInstalledAsset = getAssetService().getAsset(val(local.laborPartInstalled.getAssetId()));
                    local.laborPartPartInstalledList = getPartListService().getPartList(val(local.laborPartInstalledAsset.getPartNoId()));   
            	} 
            }
            
            local.nextPmiExist = dbUtils.searchAssetInspectionByRepairId(local.repair.getRepairId());
            if (StructKeyExists(local.nextPmiExist, "assetId")) {
            	if (local.nextPmiExist.recordcount GT 0){
            		local.nextPmi = getAssetInspectionService().getAssetInspectionByRepairId(local.repair.getRepairId());
            		local.nextPmiCode = getCodeService().getCode(val(local.nextPmi.getPmiType()));
            	}            	
            }
            
            local.partOrderedExist = dbUtils.searchPartOrderByRepairId(val(local.repair.getRepairId()));
            if (local.partOrderedExist.recordcount GT 0){
            	addToFormRequest("partOrderId",local.partOrderedExist.ORDER_ID);
            }
            
            local.partList = getPartListService().getPartList(val(local.asset.getPartNoId()));
            local.typeMaint = getCodeService().getCode(val(local.repair.getTypeMaint()));
            local.howMal = getCodeService().getCode(val(local.repair.getHowMal()));
            local.whenDisc = getCodeService().getCode(val(local.repair.getWhenDisc()));
            local.actionTaken = getCodeService().getCode(val(local.labor.getActionTaken()));
            local.failTest = getCodeService().getCode(val(local.labor.getTestFailNo()));
            
            // check to see if there are attachments for this repair
            local.attachments = dbUtils.getAttachmentsByRepairId(local.repair.getRepairId());
            if (local.attachments.recordcount GT 0) {
               dirMgr = CreateObject("component", "cfc.utils.Directory_Mgr");
        	   dirMgr.createDir(#application.sessionManager.getUserName()#);            	
     
               addToFormRequest("qAttachments", local.attachments);             
               
               path=#ExpandPath(#application.rootpath#&'/'&#application.sessionManager.getUserName()#)#;
               for (intRow = 1 ; intRow LTE local.attachments.RecordCount ; intRow = (intRow + 1)){
 
        			FileWrite(#path#&'/'&#local.attachments.name[intRow]#, #local.attachments.attachment[intRow]#);
        		}               
            }
            
            local.testFailed = dbUtils.getTestFailedByLaborId(local.labor.getLaborId());
            if (local.testFailed.recordcount GT 0) {
            	addToFormRequest("qTestFailed", local.testFailed);
            }
            
            local.cumHrs = dbUtils.getCumulativeETM(local.asset.getCtAssetId());
            if (local.cumHrs.recordcount GT 0){
            	addToFormRequest("cumHrs", local.cumHrs.delta);
            }
            
            local.qLaborBitPc = dbUtils.getLaborBitPcByLaborId(local.labor.getLaborId());
            
            local.qLaborBitPc = getUtilities().addEncryptedColumn(local.qLaborBitPc,"labor_bit_id");
            
            addToFormRequest("qLaborBitPc",local.qLaborBitPc);
            addToFormRequest("sraSerno",local.sraAsset.getSerno());
            addToFormRequest("sraNoun",local.sraAssetPartList.getNoun());
            addToFormRequest("sraPartno",local.sraAssetPartList.getPartno());
            addToFormRequest("eventRepair",arguments.eventRepair);
            addToFormRequest("partnoId", local.partList.getPartnoId());
            addToFormRequest("assetId",local.asset.getAssetId());  
            addToFormRequest("eventId", local.event.getEventId());
            addToFormRequest("repairId", local.decryptRepair); 
            addToFormRequest("seq", local.repair.getRepairSeq()); 
            addToFormRequest("laborId", local.labor.getLaborId());        
            addToFormRequest("nhaAssetId",local.asset.getAssetId());
            addToFormRequest("jobId",local.event.getJobNo());
            addToFormRequest("serno",local.asset.getSerNo());
            addToFormRequest("partno",local.partList.getPartno());
            addToFormRequest("wucCd",local.partList.getWucCd());
            addToFormRequest("typeMaintCodeId", local.repair.getTypeMaint());
            addToFormRequest("typeMaint", local.typeMaint.getCodeValue() & ' - ' & local.typeMaint.getDescription());
            addToFormRequest("howMalCodeId", local.repair.getHowMal());
            addToFormRequest("howMal", local.howMal.getCodeValue() & ' - ' & local.howMal.getDescription());
            local.repairStartDate = isDate(local.repair.getStartDate()) ? UCASE(TRIM(DateFormat(local.repair.getStartDate(),"dd-mmm-yyyy"))): local.repair.getStartDate();
            addToFormRequest("repairStartDate",local.repairStartDate);
            local.repairStartTime = isDate(local.repair.getStartDate()) ? UCASE(TRIM(TimeFormat(local.repair.getStartDate(),"HH:mm"))): local.repair.getStartDate();
            addToFormRequest("repairStartTime",local.repairStartTime);
            local.repairStopDate = isDate(local.repair.getStopDate()) ? UCASE(TRIM(DateFormat(local.repair.getStopDate(),"dd-mmm-yyyy"))): local.repair.getStopDate();
            addToFormRequest("repairCompDate",local.repairStopDate);
            local.repairStopTime = isDate(local.repair.getStopDate()) ? UCASE(TRIM(TimeFormat(local.repair.getStopDate(),"HH:mm"))): local.repair.getStopDate();
            addToFormRequest("repairCompTime",local.repairStopTime);
            if(local.whenDisc.getCodeId() NEQ 0) {
            addToFormRequest("whenDiscCodeId", local.repair.getWhenDisc());
            addToFormRequest("whenDisc", local.whenDisc.getCodeValue() & ' - ' & local.whenDisc.getDescription());
            }
            if(local.actionTaken.getCodeId() NEQ 0) {
	            addToFormRequest("actionTknCodeId", local.labor.getActionTaken());
	            addToFormRequest("actionTkn", local.actionTaken.getCodeValue() & ' - ' & local.actionTaken.getDescription());	
            }
            addToFormRequest("correctiveAction", local.labor.getCorrective());
            addToFormRequest("remarks", local.labor.getRemarks());
            if (local.labor.getTestFailNo() NEQ "")
            {
            	addToFormRequest("failTestId", local.labor.getTestFailNo());
				addToFormRequest("failTestName", local.failTest.getCodeValue());	
            }
			
            if (StructKeyExists(local.PartWorkedExist, "assetId")){
            	if (local.PartWorkedExist.recordcount GT 0){
	            	addToFormRequest("sraAssetId", local.laborPartAsset.getAssetId());
	            	addToFormRequest("sraNoun",local.laborPartPartList.getNoun());
	            	addToFormRequest("sraSerno", local.laborPartAsset.getSerno());
	            	addToFormRequest("sraPartno",local.laborPartPartList.getPartno());
	            	addToFormRequest("sraNsn",local.laborPartPartList.getNsn());	
                }
            }
            if (StructKeyExists(local.PartRemovedExist, "assetId")){
            	if (local.PartRemovedExist.recordcount GT 0){
            		addToFormRequest("remSraAssetId", local.laborPartRemovedAsset.getAssetId());
	            	addToFormRequest("remSraNoun", local.laborPartPartRemovedList.getNoun());
	            	addToFormRequest("remSraPartnoid", local.laborPartPartRemovedList.getPartnoId());
	            	addToFormRequest("remSraSerno", local.laborPartRemovedAsset.getSerno());
	            	addToFormRequest("remSraPartno", local.laborPartPartRemovedList.getPartno());
	            	addToFormRequest("remSraNsn", local.laborPartPartRemovedList.getNsn());
	            	addToFormRequest("remSraLaborPartId", local.laborPartRemoved.getLaborPartId());
	            	addToFormRequest("isPqdr", local.laborPartRemoved.getIsPqdr());
	            	addToFormRequest("drNum", local.laborPartRemoved.getDrNum());
            	}
            }
            if (StructKeyExists(local.PartInstalledExist, "assetId")){
            	if (local.PartInstalledExist.recordcount GT 0){
            		addToFormRequest("insSraAssetId", local.laborPartInstalledAsset.getAssetId());
	            	addToFormRequest("insSraNoun", local.laborPartPartInstalledList.getNoun());
	            	addToFormRequest("insSraSerno", local.laborPartInstalledAsset.getSerno());
	            	addToFormRequest("insSraPartno", local.laborPartPartInstalledList.getPartno());
	            	addToFormRequest("insSraNsn", local.laborPartPartInstalledList.getNsn());
            	}
            }
            if (StructKeyExists(local.nextPmiExist, "assetId")) {
            	if (local.nextPmiExist.recordcount GT 0){
            		addToFormRequest("assetInsId", local.nextPmi.getHistId());
            		addToFormRequest("nextPmiId", local.nextPmi.getPmiType());
            		addToFormRequest("nextPmi", local.nextPmiCode.getCodeValue() & ' - ' & local.nextPmiCode.getDescription());
            		local.nextPmiDate = isDate(local.nextPmi.getNextDueDate()) ? UCASE(TRIM(DateFormat(local.nextPmi.getNextDueDate(),"dd-mmm-yyyy"))): local.nextPmi.getNextDueDate();
            		addToFormRequest("nextPmiDate",local.nextPmiDate);
            		addToFormRequest("nextPmiEtm", local.nextPmi.getNextDueEtm());
            	}
            }
            
            addToFormRequest("crewChief",local.labor.getCrewChief());  
            addToFormRequest("crewSize", local.labor.getCrewSize());
            local.laborStartDate = isDate(local.labor.getStartDate()) ? UCASE(TRIM(DateFormat(local.labor.getStartDate(),"dd-mmm-yyyy"))): local.labor.getStartDate();
            addToFormRequest("laborStartDate",local.laborStartDate);
            local.laborStartTime = isDate(local.labor.getStartDate()) ? UCASE(TRIM(TimeFormat(local.labor.getStartDate(),"HH:mm"))): local.labor.getStartDate();
            addToFormRequest("laborStartTime",local.laborStartTime);
            local.laborStopDate = isDate(local.labor.getStopDate()) ? UCASE(TRIM(DateFormat(local.labor.getStopDate(),"dd-mmm-yyyy"))): local.labor.getStopDate();
            addToFormRequest("laborCompDate",local.laborStopDate);
            local.laborStopTime = isDate(local.labor.getStopDate()) ? UCASE(TRIM(TimeFormat(local.labor.getStopDate(),"HH:mm"))): local.labor.getStopDate();
            addToFormRequest("laborCompTime",local.laborStopTime);
            
            
            redirect(local.page,true);
        }catch(any e){
        	addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"editEventDetail",getUser());
        	
        	
            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            }
        }
        
         redirect(local.page,true); 
    }

    public void function insertRepair(required struct formRequest) {
        var maintenanceBo = new MaintenanceBO();
        var repair = populateRepair(arguments.formRequest);
        var labor = populateLabor(arguments.formRequest);
        var laborBitPc = populateLaborBitPc(arguments.formRequest);
        var workedPart = populateLaborPartWorked(arguments.formRequest);
        var removedPart = populateLaborPartRemoved(arguments.formRequest);
        var installedPart = populateLaborPartInstalled(arguments.formRequest);
        var pmi	= populateAssetInspection(arguments.formRequest);
        var tctoAsset = populateTctoAsset(arguments.formRequest);         
        
        try {
            repairInsert = local.maintenanceBo.createRepair(local.repair, local.labor, local.laborBitPc, local.workedPart, local.removedPart, local.installedPart);
            local.request = duplicate(arguments.formRequest);
            local.request.repairId = repairInsert.getRepairId();
            if (arguments.formRequest.imgCntr NEQ "0") {  
        	    attachment = loopAttachments(local.request);
        	    local.maintenanceBo.insertAttachment(attachment);
            }
            
            if (StructKeyExists(arguments.formRequest, "sraPartnoId")) {
	        	if (arguments.formRequest.sraPartnoId NEQ ""){
	        		
	        		local.sraAsset = getAssetService().getAsset(val(arguments.formRequest.sraAssetId));
	        		local.sraAsset.setPartnoId(arguments.formRequest.sraPartnoId);
	        		local.sraPart = getPartListService().getPartList(val(local.sraAsset.getPartnoId()));
	        		
	        		if (local.sraAsset.getCtAssetId() NEQ "") {
	        			
	        			local.ctSraAsset = getInvAssetService().getInvAssets(local.sraAsset.getCtAssetId());
	        			local.ctSraAsset.setSysId(local.sraPart.getCtSysId());
	        		}
	        	} 
	        	
	        	if (isDefined("local.sraAsset")){
					local.updateSraAsset = local.maintenanceBo.updateAsset(local.sraAsset);
					
					if (isDefined("local.ctSraAsset")) {
						local.updateCtAsset = local.maintenanceBo.updateCtAsset(local.ctSraAsset);
					}
				
				}			
			}
            
            if (arguments.formRequest.testFailCntr NEQ "0") {
            	local.request.laborId = repairInsert.LaborId;
        		testFail = loopTestFailed(local.request);
        		local.maintenanceBo.insertTestFailed(testFail);
        	}
        	
        	if (arguments.formRequest.tctoId NEQ "") {
        		local.tctoService = application.objectFactory.create("TctoService");
        		local.tcto = local.tctoService.getTcto(tctoAsset.getTctoId());
        		local.tcto.setEffDate(arguments.formRequest.effDate);
        		
        		local.tctoAsset.setRepairId(repairInsert.getRepairId());
        		local.maintenanceBO.insertTctoAsset(local.tctoAsset, local.tcto);
        	}
        	
        	if (arguments.formRequest.nextPmi NEQ "") {
        		local.pmi.setRepairId(local.request.repairId);
        		local.maintenanceBo.insertPmi(local.pmi);
        		
        		
        		if ((local.pmi.getNextDueDate() NEQ "") or (local.pmi.getNextDueEtm() NEQ "")) {
        				    
        					dbUtils = application.objectFactory.create("DBUtils");
        					
        						local.newJobIdService = application.objectFactory.create("NewJobIdService");        						       						
                       			local.newJobId = local.newJobIdService.getNewJobId(application.sessionManager.getProgramSetting(),application.sessionManager.getLocIdSetting());
                       		    
                       		    local.newEvent = getEventService().getEvent(local.request.eventId);
        							local.newEvent.setEventId('');
        							local.newEvent.setInsBy(application.sessionManager.getUserName());
        							local.newEvent.setInsDate(Now());
        							local.newEvent.setValBy('');
        							local.newEvent.setValDate('');
        							local.newEvent.setWucCd('');
        							local.newEvent.setWcCd('');
        							local.newEvent.setMaintTypeEe('');
        							local.newEvent.setSquad('');
        							local.newEvent.setJobNo(local.newJobId);
        							local.newEvent.setTailNo('');
        							local.newEvent.setDiscrepancy('');
        							if (arguments.formRequest.nextPmiDate NEQ "") {
        								local.newEvent.setStartJob(local.pmi.getNextDueDate());	
        							} else {
        								local.newEvent.setStartJob('');
        							}        							
        							local.newEvent.setStopJob('');
        							local.newEvent.setWhenDisc('');
        							local.newEvent.setPriority('');
        							local.newEvent.setSymbol('');
        							local.newEvent.setTctoId('');
        							local.newEvent.setEticDate('');
        							local.newEvent.setEditFlag('');
        							local.newEvent.setOldJob(local.newJobId);
        							local.newEvent.setChgBy('');
        							local.newEvent.setChgDate('');
        							local.newEvent.setHowMal('');
        							local.newEvent.setLruInd('');
        							local.newEvent.setSrd('');
        							local.newEvent.setPec('');
        							local.newEvent.setMti('');
        							local.newEvent.setEventType('');
        							local.newEvent.setSortieId('');
        							
        						local.newRepair = getRepairService().getRepair(local.request.repairId);
        							local.newRepair.setRepairId('');
        							local.newRepair.setRepairSeq('1');
        							local.newRepair.setEventId('');
        							local.newRepair.setInsBy(application.sessionManager.getUserName());
        							local.newRepair.setInsDate(Now());
        							local.newRepair.setValBy('');
        							local.newRepair.setValDate('');
        							local.newRepair.setPwc('');
        							local.newRepair.setWucCd('');
        						    local.newRepair.setWhenDisc('');
        							local.newRepair.setShopStatus('');
        							local.newRepair.setSrdCd('');
        							local.newRepair.setNarrative('');
									if (arguments.formRequest.nextPmiDate NEQ "") {
										local.newRepair.setStartDate(local.pmi.getNextDueDate());
        							} else {
        								local.newRepair.setStartDate('');
        							}    
        							local.newRepair.setStopDate('');
        							local.newRepair.setEticDate('');
        							local.newRepair.setRecvDate('');
        							local.newRepair.setTagNo('');
        							local.newRepair.setDocNo('');
        							local.newRepair.setSymbol('');
        							local.newRepair.setEquipId('');
        							local.newRepair.setFsc('');
        							local.newRepair.setEtiIn('');
        							local.newRepair.setEtiOut('');
        							local.newRepair.setEtiDelta('');
        							local.newRepair.setEtiDeltaNonCnd('');
        							local.newRepair.setDeferStatus('');
        							local.newRepair.setEditFlag('');
        							local.newRepair.setOldJob(local.newJobId);
        							local.newRepair.setChgBy('');
        							local.newRepair.setChgDate('');
        							local.newRepair.setLegacyPk('');
        							local.newRepair.setJobType('');
        							local.newRepair.setStationType('');
        							local.newRepair.setJstId('');        							
        							
        						local.newLabor = getLaborService().getLabor(repairInsert.LaborId);	
        							local.newLabor.setLaborId('');
        							local.newLabor.setRepairId('');
        							local.newLabor.setLaborSeq('1');
        							local.newLabor.setSentImds('N');
							        local.newLabor.setInsBy(application.sessionManager.getUserName());
							        local.newLabor.setInsDate(Now());
							        local.newLabor.setValid('N');
							        local.newLabor.setValBy('');
							        local.newLabor.setValDate('');
							        local.newLabor.setNewShopStatus('');
							        local.newLabor.setWucCd('');
							        local.newLabor.setActionTaken('');
							        local.newLabor.setWhenDisc('');
							        local.newLabor.setCatLabor('');
							        local.newLabor.setUnits('');
							        local.newLabor.setStartDate('');
							        local.newLabor.setStopDate('');
							        local.newLabor.setCrewChief('');
							        local.newLabor.setCrewSize('');
							        local.newLabor.setCorrective('');
							        local.newLabor.setDiscrepancy('');
							        local.newLabor.setRemarks('');
							        local.newLabor.setCorrectedBy('');
							        local.newLabor.setInspectedBy('');
							        local.newLabor.setHours('');
							        local.newLabor.setLaborAction('');
							        local.newLabor.setStationId('');
							        local.newLabor.setBitLog('');
							        local.newLabor.setEditFlag('');
							        local.newLabor.setOmitWce('');
							        local.newLabor.setChgBy(application.sessionManager.getUserName());
							        local.newLabor.setChgDate(Now());
							        local.newLabor.setDdrDocno('');
							        local.newLabor.setTimeOverrideFlag('');
							        local.newLabor.setTestGrp('');
							        local.newLabor.setTestFailNo('');
							        local.newLabor.setLegacyPk('');			 	
        							     						
        						local.newAssetInspection = getAssetInspectionService().getAssetInspectionByRepairId(local.request.repairId);
        							local.oldAssetInspection = local.newAssetInspection.getHistId();
        						    local.newAssetInspection.setHistId('');
        						    local.newAssetInspection.setInsBy(application.sessionManager.getUserName());
        						    local.newAssetInspection.setInsDate(Now());
        						    local.newAssetInspection.setJstId('');
        						    local.newAssetInspection.setWucCd('0');
        						    local.newAssetInspection.setValid('Y');
        						    local.newAssetInspection.setRepairId('');
        						    local.newAssetInspection.setCompleteDate('');
        						    local.newAssetInspection.setNextDueDate('');        						    
        						    local.newAssetInspection.setCompletedBy('');
        						    local.newAssetInspection.setChgBy('');
        						    local.newAssetInspection.setChgDate('');
        						    local.newAssetInspection.setCompletedEtm('');
        						    local.newAssetInspection.setNextDueEtm('');
        						    
        						try {
        							local.maintenanceBo.insertNextPmi(local.newEvent, local.newRepair, local.newLabor, local.newAssetInspection);
        							
        						} catch (any e) {
            						getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertEvent",user=application.sessionManager.getUsername());
	            
    			        			addToRequest("error",{message="Insert failed for JOB NO: #local.event.getJobNo()#"});
            						if(!getUtilities().isCFError(e)){
                						addToRequest("error",{message=e.message});  
            						}
            
            						//redirect(url=getRootPath() & "/" & getProgram() & "/maintenance/createMaintenance.cfm", persist="true");
        						}
        							
        					}
        			
        	}
        	addToRequest("success", {message="Repair inserted successfully"});
        } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
            
        }
        
        editEvent(arguments.formRequest["eventId"]);
    }
    
    
    
	public void function updateRepair(required struct formRequest) {
        var maintenanceBo = new MaintenanceBO();
        var repair = populateRepair(arguments.formRequest);
        var labor = populateLabor(arguments.formRequest);
        var laborBitPc = populateLaborBitPc(arguments.formRequest);
        
        var removedPart = populateLaborPartRemoved(arguments.formRequest);
        var installedPart = populateLaborPartInstalled(arguments.formRequest);
        var pmi	= populateAssetInspection(arguments.formRequest);
        var tctoAsset = populateTctoAsset(arguments.formRequest);
        var newrepairHowMal = local.repair.gethowmal(); 
        
        /* WO 4684 JJP - When the Inspection Type is an Annual Ruby Cal
        	Ensure that the Inspection goes against the POD and one isn't 
        	created for a sub-assy that doesn't have periodic inspections*/               
        if(local.pmi.getpmitype() EQ "38621"){
        	arguments.formrequest.sraAssetID = "";
        }  
		var workedPart = populateLaborPartWorked(arguments.formRequest);
		       
        /* WO 4684 JJP - Previously How Mal was being picked up from the previous inspection
           and added to the follow on job without any input from the user. Now if the user
           selects a 90 day as NEXT PMI DUE the follow on will be a 90 day. If the user
           selects a 180 day as NEXT PMI DUE the follow on will be 180 day. */
           
        // 90 day pmi type to 90 day inspection type
        if(local.pmi.getpmitype() EQ "35419"){
        	newRepairHowMal = "35466";
        }    
        // 180 day pmi type to 180 day inspection type
        if(local.pmi.getpmitype() EQ "35409"){
        	newRepairHowMal = "35459";
        }       
        
        if (StructKeyExists(arguments.formRequest, "sraPartnoId")) {
        	if (arguments.formRequest.sraPartnoId NEQ ""){
        		
        		local.sraAsset = getAssetService().getAsset(val(arguments.formRequest.sraAssetId));
        		local.sraAsset.setPartnoId(arguments.formRequest.sraPartnoId);
        		local.sraPart = getPartListService().getPartList(val(local.sraAsset.getPartnoId()));
        		
        		if (local.sraAsset.getCtAssetId() NEQ "") {
        			
        			local.ctSraAsset = getInvAssetService().getInvAssets(local.sraAsset.getCtAssetId());
        			local.ctSraAsset.setSysId(local.sraPart.getCtSysId());
        		}
        	} 			
		}
        
        if (arguments.formRequest.imgCntr NEQ "0") {  
        	attachment = loopAttachments(arguments.formRequest);
        }
        
        if (arguments.formRequest.testFailCntr NEQ "0") {
        	testFail = loopTestFailed(arguments.formRequest);
        }

        try {
            local.maintenanceBo.updateRepair(local.repair, local.labor, local.laborBitPc, local.workedPart, local.removedPart, local.installedPart);
            if (arguments.formRequest.imgCntr NEQ "0") {
            	local.maintenanceBo.insertAttachment(attachment);
            }
            if (isDefined("local.sraAsset")){
				local.updateSraAsset = local.maintenanceBo.updateAsset(local.sraAsset);
				
				if (isDefined("local.ctSraAsset")) {
					local.updateCtAsset = local.maintenanceBo.updateCtAsset(local.ctSraAsset);
				}
			
			}
            if (arguments.formRequest.testFailCntr NEQ "0") {
        		local.maintenanceBo.insertTestFailed(testFail);
        	}
        	if (arguments.formRequest.tctoId NEQ "") {
        		local.tctoService = application.objectFactory.create("TctoService");
        		local.tcto = local.tctoService.getTcto(tctoAsset.getTctoId());
        		local.tcto.setEffDate(arguments.formRequest.effDate);
        		
        		local.maintenanceBO.insertTctoAsset(tctoAsset, tcto);
        		
        	}
        	if (arguments.formRequest.deleteFailedTests NEQ "") {
        		local.maintenanceBO.deleteTestFailed(arguments.formRequest.deleteFailedTests);
        	}
        	if (arguments.formRequest.nextPmiId NEQ "") {
        		
        		if(arguments.formRequest.assetInsId NEQ "")
        		{
        			
        			local.maintenanceBo.updatePmi(local.pmi);
        			
        			if ((local.pmi.getNextDueDate() NEQ "") or (local.pmi.getNextDueEtm() NEQ "")) {
        					dbUtils = application.objectFactory.create("DBUtils");
        					
        					if (local.pmi.getNextDueDate() NEQ "") {
        						local.nextPmiJobExist = dbUtils.getEventbyAssetStartDate(local.pmi.getAssetId(), local.pmi.getNextDueDate(), local.pmi.getPmiType());
        					} else {
        						local.nextPmiJobExist = dbUtils.getEventbyAssetStartETM(local.pmi.getAssetId(), local.pmi.getHistId());
        					}
        					
        					
	        				// WO 4684 JJP - Removed logic that would prevent a duplicate inspection being created for
	        				//           the same asset as per requirement
	        				// WO 4785 JJP - Reverted logic that would prevent duplicate follow-on inspections but added
	        				//           the additional parameter of linking the event to the asset_inspection table
	        				//           and checking the PMI Type so that in order for the follow-on to be considered
	        				//           a "duplicate" it also had to have the same PMI Type in addition to asset_id and
	        				//           Next Due Date      					
        					if (local.nextPmiJobExist.recordcount EQ "0") {
        						local.newJobIdService = application.objectFactory.create("NewJobIdService");
                        		local.newJobId = local.newJobIdService.getNewJobId(application.sessionManager.getProgramSetting(),application.sessionManager.getLocIdSetting());
        						local.newEvent = getEventService().getEvent(local.repair.getEventId());
        							local.newEvent.setEventId('');
        							local.newEvent.setInsBy(application.sessionManager.getUserName());
        							local.newEvent.setInsDate(Now());
        							local.newEvent.setValBy('');
        							local.newEvent.setValDate('');
        							local.newEvent.setWucCd('');
        							local.newEvent.setWcCd('');
        							local.newEvent.setMaintTypeEe('');
        							local.newEvent.setSquad('');
        							local.newEvent.setJobNo(local.newJobId);
        							local.newEvent.setTailNo('');
        							local.newEvent.setDiscrepancy('');
        							if (local.pmi.getNextDueDate() NEQ "") {
        								local.newEvent.setStartJob(local.pmi.getNextDueDate());	
        							} else {
        								local.newEvent.setStartJob('');
        							}    								       							
        							local.newEvent.setStopJob('');
        							local.newEvent.setWhenDisc('');
        							local.newEvent.setPriority('');
        							local.newEvent.setSymbol('');
        							local.newEvent.setTctoId('');
        							local.newEvent.setEticDate('');
        							local.newEvent.setEditFlag('');
        							local.newEvent.setOldJob(local.newJobId);
        							local.newEvent.setChgBy('');
        							local.newEvent.setChgDate('');
        							local.newEvent.setHowMal('');
        							local.newEvent.setLruInd('');
        							local.newEvent.setSrd('');
        							local.newEvent.setPec('');
        							local.newEvent.setMti('');
        							local.newEvent.setEventType('');
        							local.newEvent.setSortieId('');
        							
        						local.newRepair = getRepairService().getRepair(local.repair.getRepairID());
        							local.newRepair.setRepairId('');
        							local.newRepair.setRepairSeq('1');
        							local.newRepair.setEventId('');
        							local.newRepair.setInsBy(application.sessionManager.getUserName());
        							local.newRepair.setInsDate(Now());
        							local.newRepair.setValBy('');
        							local.newRepair.setValDate('');
        							local.newRepair.setPwc('');
        							local.newRepair.setWucCd('');
        							local.newRepair.setWhenDisc('');
        							local.newRepair.setShopStatus('');
        							local.newRepair.setSrdCd('');
        							local.newRepair.setHowMal(newrepairHowMal);
        							local.newRepair.setNarrative('');        							
        							if (local.pmi.getNextDueDate() NEQ "") {
        								local.newRepair.setStartDate(local.pmi.getNextDueDate());
        							} else {
        								local.newRepair.setStartDate('');
        							}  									
        							local.newRepair.setStartDate('');
        							local.newRepair.setStopDate('');
        							local.newRepair.setEticDate('');
        							local.newRepair.setRecvDate('');
        							local.newRepair.setTagNo('');
        							local.newRepair.setDocNo('');
        							local.newRepair.setSymbol('');
        							local.newRepair.setEquipId('');
        							local.newRepair.setFsc('');
        							local.newRepair.setEtiIn('');
        							local.newRepair.setEtiOut('');
        							local.newRepair.setEtiDelta('');
        							local.newRepair.setEtiDeltaNonCnd('');
        							local.newRepair.setDeferStatus('');
        							local.newRepair.setEditFlag('');
        							local.newRepair.setOldJob(local.newJobId);
        							local.newRepair.setChgBy('');
        							local.newRepair.setChgDate('');
        							local.newRepair.setLegacyPk('');
        							local.newRepair.setJobType('');
        							local.newRepair.setStationType('');
        							local.newRepair.setJstId(''); 
        							
        						local.newLabor = getLaborService().getLabor(local.labor.getLaborId());	
        							local.newLabor.setLaborId('');
        							local.newLabor.setRepairId('');
        							local.newLabor.setLaborSeq('1');
        							local.newLabor.setSentImds('N');
							        local.newLabor.setInsBy(application.sessionManager.getUserName());
							        local.newLabor.setInsDate(Now());
							        local.newLabor.setValid('N');
							        local.newLabor.setValBy('');
							        local.newLabor.setValDate('');
							        local.newLabor.setNewShopStatus('');
							        local.newLabor.setWucCd('');
							        local.newLabor.setActionTaken('');
							        local.newLabor.setWhenDisc('');
							        local.newLabor.setCatLabor('');
							        local.newLabor.setUnits('');
							        local.newLabor.setStartDate('');
							        local.newLabor.setStopDate('');
							        local.newLabor.setCrewChief('');
							        local.newLabor.setCrewSize('');
							        local.newLabor.setCorrective('');
							        local.newLabor.setDiscrepancy('');
							        local.newLabor.setRemarks('');
							        local.newLabor.setCorrectedBy('');
							        local.newLabor.setInspectedBy('');
							        local.newLabor.setHours('');
							        local.newLabor.setLaborAction('');
							        local.newLabor.setStationId('');
							        local.newLabor.setBitLog('');
							        local.newLabor.setEditFlag('');
							        local.newLabor.setOmitWce('');
							        local.newLabor.setChgBy(application.sessionManager.getUserName());
							        local.newLabor.setChgDate(Now());
							        local.newLabor.setDdrDocno('');
							        local.newLabor.setTimeOverrideFlag('');
							        local.newLabor.setTestGrp('');
							        local.newLabor.setTestFailNo('');
							        local.newLabor.setLegacyPk('');							
        						
        						local.newAssetInspection = getAssetInspectionService().getAssetInspection(local.pmi.getHistId());
        							local.oldAssetInspection = local.newAssetInspection.getHistId();
        						    local.newAssetInspection.setHistId('');
        						    local.newAssetInspection.setInsBy(application.sessionManager.getUserName());
        						    local.newAssetInspection.setInsDate(Now());
        						    local.newAssetInspection.setJstId('');
        						    local.newAssetInspection.setWucCd('0');
        						    local.newAssetInspection.setValid('Y');
        						    local.newAssetInspection.setRepairId('');
        						    local.newAssetInspection.setCompleteDate('');
        						    local.newAssetInspection.setNextDueDate('');        						    
        						    local.newAssetInspection.setCompletedBy('');
        						    local.newAssetInspection.setChgBy('');
        						    local.newAssetInspection.setChgDate('');
        						    local.newAssetInspection.setCompletedEtm('');
        						    local.newAssetInspection.setNextDueEtm('');
        						    
        						
        						try {
        							
        							local.maintenanceBo.insertNextPmi(local.newEvent, local.newRepair, local.newLabor, local.newAssetInspection);
        							
        						} catch (any e) {
            						/* TODO pass error back to the createMaintenance.cfm */
            						getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertEvent",user=application.sessionManager.getUsername());
	            
    			        			addToRequest("error",{message="Insert failed for JOB NO: #local.event.getJobNo()#"});
            
            						/* Return custom error if e is not a generated CF error */
            						if(!getUtilities().isCFError(e)){
                						addToRequest("error",{message=e.message});  
            						}
            
            						//redirect(url=getRootPath() & "/" & getProgram() & "/maintenance/createMaintenance.cfm", persist="true");
        						}
        							
        					}
        			}
        			
        		} else {
        			if ((local.pmi.getNextDueDate() NEQ "") or (local.pmi.getNextDueEtm() NEQ "")) {
	        			local.create.pmi = local.maintenanceBo.insertPmi(local.pmi);
	        					dbUtils = application.objectFactory.create("DBUtils");
	        					
	        					if (local.pmi.getNextDueDate() NEQ "") {
	        						local.nextPmiJobExist = dbUtils.getEventbyAssetStartDate(local.pmi.getAssetId(), local.pmi.getNextDueDate(), local.pmi.getPmiType());
	        					} else {
	        						local.nextPmiJobExist = dbUtils.getEventbyAssetStartETM(local.pmi.getAssetId(), local.pmi.getHistId());
	        					}
								
		        				// WO 4684 JJP - Removed logic that would prevent a duplicate inspection being created for
		        				//           the same asset as per requirement
	        					// WO 4785 JJP - Reverted logic that would prevent duplicate follow-on inspections but added
	        					//           the additional parameter of linking the event to the asset_inspection table
	        					//           and checking the PMI Type so that in order for the follow-on to be considered
	        					//           a "duplicate" it also had to have the same PMI Type in addition to asset_id and
	        					//           Next Due Date 
	        					if (local.nextPmiJobExist.recordcount EQ "0") {
	        						local.newJobIdService = application.objectFactory.create("NewJobIdService");
	                        		local.newJobId = local.newJobIdService.getNewJobId(application.sessionManager.getProgramSetting(),application.sessionManager.getLocIdSetting());
	        						local.newEvent = getEventService().getEvent(local.repair.getEventId());
	        							local.newEvent.setEventId('');
	        							local.newEvent.setInsBy(application.sessionManager.getUserName());
	        							local.newEvent.setInsDate(Now());
	        							local.newEvent.setValBy('');
	        							local.newEvent.setValDate('');
	        							local.newEvent.setWucCd('');
	        							local.newEvent.setWcCd('');
	        							local.newEvent.setMaintTypeEe('');
	        							local.newEvent.setSquad('');
	        							local.newEvent.setJobNo(local.newJobId);
	        							local.newEvent.setTailNo('');
	        							local.newEvent.setDiscrepancy('');
	        							if (local.pmi.getNextDueDate() NEQ "") {
	        								local.newEvent.setStartJob(local.pmi.getNextDueDate());	
	        							} else {
	        								local.newEvent.setStartJob('');
	        							}
	        							local.newEvent.setStopJob('');
	        							local.newEvent.setWhenDisc('');
	        							local.newEvent.setPriority('');
	        							local.newEvent.setSymbol('');
	        							local.newEvent.setTctoId('');
	        							local.newEvent.setEticDate('');
	        							local.newEvent.setEditFlag('');
	        							local.newEvent.setOldJob(local.newJobId);
	        							local.newEvent.setChgBy('');
	        							local.newEvent.setChgDate('');
	        							local.newEvent.setHowMal('');
	        							local.newEvent.setLruInd('');
	        							local.newEvent.setSrd('');
	        							local.newEvent.setPec('');
	        							local.newEvent.setMti('');
	        							local.newEvent.setEventType('');
	        							local.newEvent.setSortieId('');
	        							
	        						local.newRepair = getRepairService().getRepair(local.repair.getRepairID());
	        							local.newRepair.setRepairId('');
	        							local.newRepair.setRepairSeq('1');
	        							local.newRepair.setEventId('');
	        							local.newRepair.setInsBy(application.sessionManager.getUserName());
	        							local.newRepair.setInsDate(Now());
	        							local.newRepair.setValBy('');
	        							local.newRepair.setValDate('');
	        							local.newRepair.setPwc('');
	        							local.newRepair.setWucCd('');
	        							local.newRepair.setWhenDisc('');
	        							local.newRepair.setShopStatus('');
	        							local.newRepair.setSrdCd('');
	        							local.newRepair.setHowMal(newrepairHowMal);
	        							local.newRepair.setNarrative('');
	        							local.newRepair.setStartDate('');
	        							local.newRepair.setStopDate('');
	        							local.newRepair.setEticDate('');
	        							local.newRepair.setRecvDate('');
	        							local.newRepair.setTagNo('');
	        							local.newRepair.setDocNo('');
	        							local.newRepair.setSymbol('');
	        							local.newRepair.setEquipId('');
	        							local.newRepair.setFsc('');
	        							local.newRepair.setEtiIn('');
	        							local.newRepair.setEtiOut('');
	        							local.newRepair.setEtiDelta('');
	        							local.newRepair.setEtiDeltaNonCnd('');
	        							local.newRepair.setDeferStatus('');
	        							local.newRepair.setEditFlag('');
	        							local.newRepair.setOldJob(local.newJobId);
	        							local.newRepair.setChgBy('');
	        							local.newRepair.setChgDate('');
	        							local.newRepair.setLegacyPk('');
	        							local.newRepair.setJobType('');
	        							local.newRepair.setStationType('');
	        							local.newRepair.setJstId('');  
	        							
	        						local.newLabor = getLaborService().getLabor(local.labor.getLaborId());	
	        							local.newLabor.setLaborId('');
	        							local.newLabor.setRepairId('');
	        							local.newLabor.setLaborSeq('1');
	        							local.newLabor.setSentImds('N');
								        local.newLabor.setInsBy(application.sessionManager.getUserName());
								        local.newLabor.setInsDate(Now());
								        local.newLabor.setValid('N');
								        local.newLabor.setValBy('');
								        local.newLabor.setValDate('');
								        local.newLabor.setNewShopStatus('');
								        local.newLabor.setWucCd('');
								        local.newLabor.setActionTaken('');
								        local.newLabor.setWhenDisc('');
								        local.newLabor.setCatLabor('');
								        local.newLabor.setUnits('');
								        local.newLabor.setStartDate('');
								        local.newLabor.setStopDate('');
								        local.newLabor.setCrewChief('');
								        local.newLabor.setCrewSize('');
								        local.newLabor.setCorrective('');
								        local.newLabor.setDiscrepancy('');
								        local.newLabor.setRemarks('');
								        local.newLabor.setCorrectedBy('');
								        local.newLabor.setInspectedBy('');
								        local.newLabor.setHours('');
								        local.newLabor.setLaborAction('');
								        local.newLabor.setStationId('');
								        local.newLabor.setBitLog('');
								        local.newLabor.setEditFlag('');
								        local.newLabor.setOmitWce('');
								        local.newLabor.setChgBy(application.sessionManager.getUserName());
								        local.newLabor.setChgDate(Now());
								        local.newLabor.setDdrDocno('');
								        local.newLabor.setTimeOverrideFlag('');
								        local.newLabor.setTestGrp('');
								        local.newLabor.setTestFailNo('');
								        local.newLabor.setLegacyPk('');		      							
	        							
	        						//local.newAssetInspection = getAssetInspectionService().getAssetInspection(local.pmi.getHistId());
	        						local.newAssetInspection = getAssetInspectionService().getAssetInspectionByRepairId(local.repair.getRepairID());
	        							local.oldAssetInspection = local.newAssetInspection.getHistId();
	        						    local.newAssetInspection.setHistId('');
	        						    local.newAssetInspection.setInsBy(application.sessionManager.getUserName());
	        						    local.newAssetInspection.setInsDate(Now());
	        						    local.newAssetInspection.setJstId('');
	        						    local.newAssetInspection.setWucCd('0');
	        						    local.newAssetInspection.setRepairId('');
	        						    local.newAssetInspection.setValid('Y');
	        						    local.newAssetInspection.setCompleteDate('');
	        						    local.newAssetInspection.setNextDueDate('');
	        							local.newAssetInspection.setJobNo(local.create.pmi.getHistId());
	        						    local.newAssetInspection.setCompletedBy('');
	        						    local.newAssetInspection.setChgBy('');
	        						    local.newAssetInspection.setChgDate('');
	        						    local.newAssetInspection.setCompletedEtm('');
	        						    local.newAssetInspection.setNextDueEtm('');
	        						    
	        						
	        						try {
	        							
	        							local.maintenanceBo.insertNextPmi(local.newEvent, local.newRepair, local.newLabor, local.newAssetInspection);
	        							
	        						} catch (any e) {
	            						/* TODO pass error back to the createMaintenance.cfm */
	            						getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertEvent",user=application.sessionManager.getUsername());
		            
	    			        			addToRequest("error",{message="Insert failed for JOB NO: #local.event.getJobNo()#"});
	            
	            						/* Return custom error if e is not a generated CF error */
	            						if(!getUtilities().isCFError(e)){
	                						addToRequest("error",{message=e.message});  
	            						}
	            
	            						//redirect(url=getRootPath() & "/" & getProgram() & "/maintenance/createMaintenance.cfm", persist="true");
	        						}
	        							
	        					}
	        		}
        			
        		}
        	}
        	
        	addToRequest("success", {message="Repair updated successfully."});
        	
        } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="updateRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
            
        }
        
        editEvent(arguments.formRequest["eventId"]);
    }
    
    public void function updateRepairBitPc(required struct formRequest) {
        var maintenanceBo = new MaintenanceBO();
        var repair = populateRepair(arguments.formRequest);
        var labor = populateLabor(arguments.formRequest);
        var laborBitPc = populateLaborBitPc(arguments.formRequest);
        var workedPart = populateLaborPartWorked(arguments.formRequest);
        var removedPart = populateLaborPartRemoved(arguments.formRequest);
        var installedPart = populateLaborPartInstalled(arguments.formRequest);
        var pmi	= populateAssetInspection(arguments.formRequest);
        dbUtils = application.objectFactory.create("DBUtils");
        
         if (arguments.formRequest.imgCntr NEQ "0") {  
        	attachment = loopAttachments(arguments.formRequest);
        }
        
        if (arguments.formRequest.testFailCntr NEQ "0") {
        	testFail = loopTestFailed(arguments.formRequest);
        }
        
        local.qLaborBitPc = dbUtils.getLaborBitPcByLaborId(local.labor.getLaborId());
            
        local.qLaborBitPc = getUtilities().addEncryptedColumn(local.qLaborBitPc,"labor_bit_id");
        
        addToFormRequest("qLaborBitPc",local.qLaborBitPc);
			

        try {
            local.maintenanceBo.updateRepair(local.repair, local.labor, local.laborBitPc, local.workedPart, local.removedPart, local.installedPart);
            if (arguments.formRequest.imgCntr NEQ "0") {
            	local.maintenanceBo.insertAttachment(attachment);
            }
            if (arguments.formRequest.testFailCntr NEQ "0") {
        		local.maintenanceBo.insertTestFailed(testFail);
        	}
        	if (arguments.formRequest.deleteFailedTests NEQ "") {
        		local.maintenanceBO.deleteTestFailed(arguments.formRequest.deleteFailedTests);
        	}
        	if (StructKeyExists(arguments.formRequest, "assetInsId")) {
        		if(arguments.formRequest.assetInsId NEQ "")
        		{
        			local.maintenanceBo.updatePmi(local.pmi);
        		} else {
        			local.maintenanceBo.insertPmi(local.pmi);
        		}
        	}
        } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="updateRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
            
        }
        
    }
    
    public void function insertRepairBitPc(required struct formRequest) {
        var maintenanceBo = new MaintenanceBO();
        var repair = populateRepair(arguments.formRequest);
        var labor = populateLabor(arguments.formRequest);
        var laborBitPc = populateLaborBitPc(arguments.formRequest);
        var workedPart = populateLaborPartWorked(arguments.formRequest);
        var removedPart = populateLaborPartRemoved(arguments.formRequest);
        var installedPart = populateLaborPartInstalled(arguments.formRequest);
        var pmi	= populateAssetInspection(arguments.formRequest);
        
        
        try {
            repairInsert = local.maintenanceBo.createRepair(local.repair, local.labor, local.laborBitPc, local.workedPart, local.removedPart, local.installedPart);
            local.request = duplicate(arguments.formRequest);
            local.request.repairId = repairInsert.getRepairId();
            addToFormRequest("repairId",local.request.repairId);
            
            addToFormRequest("eventRepair", local.request.repairId);
            addToFormRequest("laborId",repairInsert.LaborId);
            if (arguments.formRequest.imgCntr NEQ "0") {  
        	    attachment = loopAttachments(local.request);
        	    local.maintenanceBo.insertAttachment(attachment);
            }
            if (arguments.formRequest.testFailCntr NEQ "0") {
            	local.request.laborId = repairInsert.LaborId;
        		testFail = loopTestFailed(local.request);
        		local.maintenanceBo.insertTestFailed(testFail);
        	}
        	
        	if (StructKeyExists(arguments.formRequest, "nextPmi")) {
        		local.pmi.setRepairId(local.request.repairId);
        		local.maintenanceBo.insertPmi(local.pmi);
        	}
        } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
            
        }
    }
	
  
    public any function getLaborBitPc(required string labor_Bit_Id, required string eventRepair){
    	local = {};
    	
        local.page = getRootPath() & "/" & getProgram() & "/maintenance/createBitPc.cfm";
                    	
    	local.decryptLaborBitId = getUtilities().decryptId(arguments.labor_Bit_Id);    
    	local.laborBitPc = getLaborBitPcService().getLaborBitPc(local.decryptLaborBitId);
    	
    	addToFormRequest("laborBitPc",local.laborBitPc);
    	addToFormRequest("laborId", laborBitPc.getLaborId());
    	addToFormRequest("eventRepair", arguments.eventRepair);
    	redirect(local.page,true);   
    	
    }
    
    public void function insertBitPc(required struct formRequest){
    	local.page = getRootPath() & "/" & getProgram() & "/maintenance/updateMaintenanceDetail.cfm"; 
    	
        var laborBitPc = populateLaborBitPc(arguments.formRequest);
         try {
         	if(laborBitPc.getLaborBitId() NEQ ""){
         		getLaborBitPcService().updateLaborBitPc(laborBitPc);
           		addToRequest("success", {message="Bit Pc was successfully updated."});
         	} else {
         		getLaborBitPcService().createLaborBitPc(laborBitPc);
           		addToRequest("success", {message="Bit Pc was successfully inserted."});
         	}
           	
           editEventDetail(arguments.formRequest.eventRepair);
        } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="updateRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
            
        }
        
        redirect(local.page,true);    
    }
    
    public void function deleteLaborBitPc(required struct formRequest){
    	
    	local = {};
    	local.decryptLaborBitId = getUtilities().decryptId(arguments.formRequest.labor_Bit_Id);    
    	
    	try{    	
	    	var laborBitPc = getLaborBitPcService().getLaborBitPc(local.decryptLaborBitId);
	    	if(!isSimpleValue(laborBitPc)){
	    		getLaborBitPcService().deleteLaborBitPc(local.decryptLaborBitId);
	    		addToRequest("success", {message="Bit Pc was successfully deleted."});
	    		editEventDetail(arguments.formRequest.eventRepair);
	    	}
    	}catch(any e){
			 /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="updateRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
		}
    	
    }
	
	public any function deleteRepair( string eventRepair= ""){
        var maintenanceBo = new MaintenanceBO();
        //local.page = getRootPath() & "/" & getProgram() & "/maintenance/updateMaintenance.cfm";
		
		local.decryptRepair = getUtilities().decryptId(arguments.eventRepair);     
		local.repair = getRepairService().getRepair(val(local.decryptRepair));
		local.labor = getLaborService().getLaborByRepairId(val(local.repair.getRepairId()));
		
		 try {
            local.maintenanceBo.deleteRepair(local.repair.getRepairId(), local.labor.getLaborId());
            
            addToRequest("success", {message="Repair #local.repair.getRepairSeq()# was deleted successfully."});
            editEvent(local.repair.getEventId());
         } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="updateRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
            
        }
	}
	
        
    public any function editMaintenanceDetail( string repairId = ""){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/maintenance/updateMaintenanceDetail.cfm";
                
        local.decryptRepair = getUtilities().decryptId(arguments.repairId);
        local.repair = getRepairService().getRepair(val(local.decryptRepair));
        local.event = getEventService().getEvent(val(local.repair.getEventId()));
        local.asset = getAssetService().getAsset(val(local.event.getAssetId()));
        //local.labor = getLaborService().getLabor();
        local.partList = getPartListService().getPartList(val(local.asset.getPartNoId()));
        local.howMal = getCodeService().getCode(val(local.repair.getHowMal()));
        
        addToFormRequest("jobId",local.event.getJobNo());
        addToFormRequest("serno",local.asset.getSerNo());
        addToFormRequest("partno",local.partList.getPartno());
        addToFormRequest("seq",local.repair.getRepairSeq());
        addToFormRequest("typeMaintCodeId",local.repair.getTypeMaint());
        addToFormRequest("howMalCodeId",local.repair.getHowMal());
        addToFormRequest("howMal",local.howMal.getDescription());
        
        redirect(local.page,true);    
		
    } 
    
    remote any function partOrdered(string eventId1, string repairId1, string pOAssetId1){
    	var maintenanceBo = new MaintenanceBO();
    	local.asset = getAssetService().getAsset(val(arguments.pOAssetId1));
    	 var partOrder = populatePartOrdered(arguments.eventId1, arguments.repairId1, arguments.pOAssetId1, local.asset.getPartnoId());
       
        try {
             partOrderInsert = local.maintenanceBo.createPartOrder(local.partOrder);
             
             sendPartRequestEmail(partOrderInsert);
             
 	    } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
          }
    }
    
    remote any function partOrderedAcknowledged(string  orderId){
    	var maintenanceBo = new MaintenanceBO();
    	
    	try {
    		sruOrder = local.maintenanceBo.acknowledgePartOrder(arguments.orderId);
    		local.obj.ackDate = sruOrder.getAcknowledgeDate();
    		local.json = SerializeJSON(local.obj);
    		
    		//return sruOrder.getAcknowledgeDate();
			return json;
 	    } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
          }
    	
    }
    
public any function sendPartRequestEmail(required SruOrder partOrder){
    	try{
    	local.partList = getPartListService().getPartList(arguments.partOrder.getPartnoId());
    	local.locationService = application.objectFactory.create("LocationService");
    	local.location = local.locationService.getLocation(application.sessionManager.getLocIdSetting());
    	local.site = getCodeService().getCode(local.location.getSiteCd()).getCodeValue();
    	local.unit = getCodeService().getCode(local.location.getUnitCd()).getCodeValue();
    	
    	local.depotLoc = local.locationService.getLocation(local.partList.getLocIdr());
    	local.depotUnit = getCodeService().getCode(local.depotLoc.getUnitCd()).getCodeValue();
    	
    	local.event = getEventService().getEvent(arguments.partOrder.getEventId());
    	
    	local.fullPath = #mid(cgi.HTTP_REFERER, 1, REFind("/RIMSS/",cgi.HTTP_REFERER)-1)# & #application.rootpath# & "/"& #lcase(session.user.settings.program)# &"/maintenance/index.cfm?action=edit.maintenance.detail&eventRepair="& arguments.partOrder.getRepairId();
	   	
	   	var emails = getDbUtils().getPartRequestEmailByLocIdr(local.partList.getLocIdr());
	   
	    var eventId =  arguments.partOrder.getEventId();
	   var JobNo = local.event.getJobNo();
	   var removed_part_serno = "";
	   var is_PQDR = "";  
	   var sender = "";
	   var subject = "";
	  
	   
	   local.labor = getLaborService().getLaborByRepairId(val(#RC.REPAIRID1#));
	   	   
 
        //get labor_id
       var laborid = 0; 
       //writedump(local.labor.getLaborId());	
       laborid = local.labor.getLaborId();
	   
	  
	   
	 
	    //get is_PQDR
       
        var dbUtils = application.objectFactory.create("DBUtils");
        var sql= "select IS_PQDR from labor_part where labor_id =  '" & #laborid# & "'";
        var qry = new Query();
	  
	   qry = dbUtils.runSQL(sql,"GLOBALEYE");
	    if(qry.recordcount){          	
        	for(i=1; i LTE qry.recordcount; i=i+1){        		
        			is_PQDR = qry.IS_PQDR;                                     
	       		
        	}
        	 	       	      
        }
        
	 
	   
	   //get old part serno
	   sql= "select serno from asset where asset_id =  '" & #RC.POASSETID1# & "'";	   
	   qry = new Query();
	   qry = dbUtils.runSQL(sql,"GLOBALEYE");
	    if(qry.recordcount){          	
        	for(i=1; i LTE qry.recordcount; i=i+1){        		
        			removed_part_serno = qry.serno;                                     
	       		
        	}
        	 	       	      
        }
        
        //getting sender email address from globaleye.code
	    sql= "select code_value from globaleye.code where code_type = 'RIMSS_PARTS_ORDERED_SENDER'";	   
	    qry = new Query();
	    qry = dbUtils.runSQL(sql,"GLOBALEYE");
	    if(qry.recordcount == 1){          	
        	sender = qry.code_value;	 	       	      
        }
        else {
        	sender = 'RAMPOD.HelpDesk@us.af.mil';
        }
        
		if (#is_PQDR# == "Y")
		{
		   //getting PQDR subject from globaleye.code
		   sql= "select code_value from globaleye.code where code_type = 'RIMSS_PARTS_ORDERED_SUBJ_PQDR'";	   
		   qry = new Query();
		   qry = dbUtils.runSQL(sql,"GLOBALEYE");
		    if(qry.recordcount == 1){          	
	        	subject = qry.code_value;	 	       	      
	        }
	        else {
	        	subject = "RIMSS: A part has been requested, PQDR ";
	        }
			
		} 
		else
		{
		   //getting non-PQDR subject from globaleye.code
		   sql= "select code_value from globaleye.code where code_type = 'RIMSS_PARTS_ORDERED_SUBJ'";	   
		   qry = new Query();
		   qry = dbUtils.runSQL(sql,"GLOBALEYE");
		    if(qry.recordcount == 1){          	
	        	subject = qry.code_value;	 	       	      
	        }
	        else {
	        	subject = "RIMSS: A part has been requested";
	        }
		}
	   
	   	} catch(any e){
	   		writeLog(file="maintenanceController" text="ERROR: Error building email");
	   		writeLog(file="maintenanceController" text="Error:" & #e.message# );  
	   		return e.message;
	   	}
	   
	   
	   
	   	try{	
		  	for(email in emails){
		  		if (#is_PQDR# == "Y")
				{								  		
				   		savecontent variable="mailBody" {
						  writeOutput( email.user_name & " ("& local.depotUnit &")
						  <br/><br/>
						  ("& local.unit &", "& local.site &") has requested ("& local.partList.getNoun() &", "& local.partList.getPartno() &") 
						  for job number (Job Number (<a href='"& local.fullPath &"'>"& local.event.getJobNo() &"</a>)).  
						  <br/>				  
						  <strong>The removed part serno: " & removed_part_serno & "
						  <br/>
						  The part is PQDR </strong>
						  <br/>						  
						  To access the job, log into RAMPOD and access RIMSS, then click the Job Number link in this email. 
						  <br/><br/>
						  If the link above does not work, simply copy and paste the following into your browser URL address bar: "& local.fullPath & 
						  "
						  <br/><br/>
						  If you wish to no longer receive these emails, please contact the RAMPOD Helpdesk.");
						};
				
				} 
				else
				{
			   		savecontent variable="mailBody" {
					  writeOutput( email.user_name & " ("& local.depotUnit &")
					  <br/><br/>
					  ("& local.unit &", "& local.site &") has requested ("& local.partList.getNoun() &", "& local.partList.getPartno() &") 
					  for job number (Job Number (<a href='"& local.fullPath &"'>"& local.event.getJobNo() &"</a>)).  
					  <br/>				  
					  <strong>The removed part serno: " & removed_part_serno & "</strong>
					  <br/>
					  To access the job, log into RAMPOD and access RIMSS, then click the Job Number link in this email. 
					  <br/><br/>
					  If the link above does not work, simply copy and paste the following into your browser URL address bar: "& local.fullPath & 
					  "
					  <br/><br/>
					  If you wish to no longer receive these emails, please contact the RAMPOD Helpdesk.");
					};
											
				}
				
			//writedump(#email.email#);
			 writeLog(file="maintenanceController" text="email:" & #email.email# );  

			
			// Create and populate the mail object
				mailService = new mail(
				  to = "#email.email#",
				  from = #sender#,
				  subject =#subject#,
				  body = mailBody,
				  type="html",
				  debug="true"
				);
				
				
			// Send
				mailService.send();
		   		
		   	};
	   	
	   		return mailService;
	   	} catch(any e){
	   		return e.message;
	   	}
   }
   
        
    remote any function shipRecvAcknowledged(string  orderId) returnformat="plain"{
    	var maintenanceBo = new MaintenanceBO();
    	
    	try {
    		sruOrder = local.maintenanceBo.acknowledgeSruRecv(arguments.orderId);
    		local.obj.ackSruRecvDate = sruOrder.getReplSruRecvDate();
    		local.json = SerializeJSON(local.obj);
    		
    		//return sruOrder.getAcknowledgeDate();
			return json;
 	    } catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
          }
    	
    }
    remote any function partOrderedFilled(string  orderId, string  repAssetId){
    	var maintenanceBo = new MaintenanceBO();
    	
    	try
    		{
    			partOrderFill = local.maintenanceBo.fillPartOrder(arguments.orderId, arguments.repAssetId);
    		} catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
          }
    		
    }
    
	remote any function partOrderedShipped(string  sruOrderId, string  assetId, string  shipper, string tcn, string shipDate){
		
    	var maintenanceBo = new MaintenanceBO();
    	local.sruOrderShipped = getSruOrderService().getSruOrder(val(arguments.sruOrderId));
    	
    	try
			{
				local.sruOrderShipped.setChgBy(application.sessionManager.getUserName());
				local.sruOrderShipped.setChgDate(Now());
				local.sruOrderShipped.setReplSruShipDate(arguments.shipDate);
				local.sruOrderShipped.setFillDate(Now());
				sruOrderShip = local.maintenanceBo.sruShipPart(local.sruOrderShipped);
				// Get repair record location to set assets destination location
				local.repair = getRepairService().getRepair(sruOrderShip.getRepairId());
				local.event = getEventService().getEvent(local.repair.getEventId());
				partOrderShip = local.maintenanceBo.shipPartOrder(arguments.assetId, arguments.shipper, arguments.tcn, arguments.shipDate, local.event.getLocId());
			}  catch (any e) {
            /* TODO pass error back to the createMaintenance.cfm */
            getJavaLoggerProxy().warning(message="#getUtilities().getErrorMessage(e)#",sourceClass=getUtilities().getComponentName(this), methodName="insertRepair", user=application.sessionManager.getUsername());
            addToRequest("error", {message="Update failed #e.message#"});
            
            /* Return custom error if e is not a generated CF error */
            if(!getUtilities().isCFError(e)){
                addToRequest("error",{message=e.message});  
            }
          }
    }
	

    /* check to see if meter has changed and then increment the meter sequence if it has */
    private boolean function hasMeterChanged(required string meterChange) {
        if (FindNoCase("Y", meterChange)) {
            return true;
        } else if (FindNoCase("N", meterChange)) {
            return false;
        } else {
            return false;
        }
    }

    private void function incrementMeterSequence(required CfgMeters cfgMeters, required MeterHist meterHist) {
        var geAssetId = arguments.meterHist.getAssetId();
        var ctAssetId = arguments.cfgMeters.getAssetId();
        arguments.meterHist.setSeqNum(incrementMeterHistSequence(geAssetId));
        arguments.cfgMeters.setMeterSeq(incrementCfgMetersSequence(ctAssetId));
    }
    
    private void function decrementMeterSequence(required CfgMeters cfgMeters, required MeterHist meterHist) {
        var geAssetId = arguments.meterHist.getAssetId();
        var ctAssetId = arguments.cfgMeters.getAssetId();
        arguments.meterHist.setSeqNum(decrementMeterHistSequence(geAssetId));
        arguments.cfgMeters.setMeterSeq(decrementCfgMetersSequence(ctAssetId));
    }

    private string function getCurrentMeterHistSequenceNumber(required string assetId) {
        var dbUtils = application.objectFactory.create('DbUtils');

        return dbUtils.getCurrentMeterHistSequenceNumber(arguments.assetId);
    }

    private string function getCurrentCfgMetersSequenceNumber(required string assetId) {
        var dbUtils = application.objectFactory.create('DbUtils');

        return dbUtils.getCurrentCfgMetersSequenceNumber(arguments.assetId);
    }

    private string function incrementMeterHistSequence(required string assetId) {
        var seq = 0;

        local.seq = getCurrentMeterHistSequenceNumber(arguments.assetId);
        local.seq++;

        return local.seq;
    }

    private string function incrementCfgMetersSequence(required string assetId) {
        var seq = 0;

        local.seq = getCurrentCfgMetersSequenceNumber(arguments.assetId);
        local.seq++;

        return local.seq;
    }
    
    private string function decrementMeterHistSequence(required string assetId) {
        var seq = 0;

        local.seq = getCurrentMeterHistSequenceNumber(arguments.assetId);
        local.seq--;

        return local.seq;
    }

    private string function decrementCfgMetersSequence(required string assetId) {
        var seq = 0;

        local.seq = getCurrentCfgMetersSequenceNumber(arguments.assetId);
        local.seq--;

        return local.seq;
    }

    private string function nextSeqValue(required string assetId) {
        var seq = 0;
        var dbUtils = application.objectFactory.create('DbUtils');

        local.seq = dbUtils.getCurrentCfgMetersSequenceNumber(arguments.assetId);
        local.seq++;

        return local.seq;
    }
    
    private Asset function populateAsset(required struct formRequest){
    	var asset = getAssetService().getAsset(arguments.formRequest.assetId);
    	
    	if(StructKeyExists(arguments.formRequest, "status_select")){
    		local.asset.setStatusCd(arguments.formRequest["status_select"]);
    	}
    	
    	return asset;
    }

    /* populate Event bean from formRequest */
    private Event function populateEvent(required struct formRequest) {

        //JJP 11/13/17 Conditionally grab an existing event instead
        //             of initializing a new event every time
    	if (StructKeyExists(arguments.formRequest, "eventId")) {
        	var event = getEventService().getEvent(arguments.formRequest["eventId"]);  
        }else{
        	var event = new Event();
        }   

        if (StructKeyExists(arguments.formRequest, "jobId")) {
            local.event.setJobNo(arguments.formRequest["jobId"]);
        }

        if (StructKeyExists(arguments.formRequest, "assetId")) {
            local.event.setAssetId(arguments.formRequest["assetId"]);
        }
        //if (StructKeyExists(arguments.formRequest, "sortieId")) {
        //    local.event.setSortieId(arguments.formRequest["sortieId"]);
        //}

        if (StructKeyExists(arguments.formRequest, "maintStartDate") && isDate(arguments.formRequest["maintStartDate"])) {
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
        else{
        	//Re-open a closed job
        	local.event.setStopJob("");
        }        

        if (StructKeyExists(arguments.formRequest, "discrepancy")) {
            local.event.setDiscrepancy(arguments.formRequest["discrepancy"]);
        }

        local.event.setLocId(application.sessionManager.getLocIdSetting());
        local.event.setSourceCat(application.sessionManager.getSourceCatSetting());
        local.event.setInsBy(application.sessionManager.getUserName());
        local.event.setInsDate(Now());

        return local.event;
    }
    
    /* validate Event  */
    private void function validateEvent(required Event event, required MeterHist meterHist) {
        //Validating Job No
        if (IsNull(arguments.event.getJobNo()) or !len(trim(arguments.event.getJobNo()))) {
            throw (type="MaintenanceException" message="Missing Job ID", detail="Please enter the Job ID");
        } 
        
        // Validating Serno
        if (IsNull(arguments.event.getAssetId()) or !len(trim(arguments.event.getAssetId()))) {
            throw (type="MaintenanceException" message="Missing Serno", detail="Please enter in the Serno");
        } 
        
        // Validating ETM
        /*if (isNull(arguments.meterHist.getMeterIn()) or !len(trim(arguments.meterHist.getMeterIn()))) {
            throw (type="MaintenanceException" message="Missing ETM Start", detail="Please enter a value for ETM Start.");
        } else {
            if (!IsNumeric(arguments.meterHist.getMeterIn())) {
                throw (type="MaintenanceException" message="Invalid ETM Start", detail="Please enter in a valid ETM Start.");
            }
        }*/
		
        // Validating Maint Start
        if (IsNull(arguments.event.getStartJob()) or !len(trim(arguments.event.getStartJob()))) {
            throw (type="MaintenanceException" message="Missing Start Date", detail="Please enter in the Start Date");
        } else {
            if (!IsDate(arguments.event.getStartJob())) {
                throw (type="MaintenanceException" message="Invalid Maint Start", detail="Please enter in a valid Maint Start.");
            }
        }
    }

   /* validate Asset  */    
    private void function validateAsset(required Asset asset) {
               
        // Validating Status
		if (IsNull(arguments.asset.getStatusCd()) or !len(trim(arguments.asset.getStatusCd()))) {
            throw (type="MaintenanceException" message="Missing Status", detail="Please enter in the Status");
        } else {
            if (isNull(arguments.asset.getStatusCd()) or !len(trim(arguments.asset.getStatusCd()))) {
            	throw (type="MaintenanceException", message="Missing Status", detail="Please enter in the Status");
        	}
        }
        
    }

    /* populate Repair bean from formRequest */
    private Repair function populateRepair(required struct formRequest) {
        var repair = new Repair();

        if (StructKeyExists(arguments.formRequest, "repairId")) {
            local.repair.setRepairId(arguments.formRequest["repairId"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "eventId")) {
            local.repair.setEventId(arguments.formRequest["eventId"]);
        }

        if (StructKeyExists(arguments.formRequest, "howMalCodeId")) {
            local.repair.setHowMal(arguments.formRequest["howMalCodeId"]);
        }

        if (StructKeyExists(arguments.formRequest, "typeMaintCodeId")) {
            local.repair.setTypeMaint(arguments.formRequest["typeMaintCodeId"]);
        }

        if (StructKeyExists(arguments.formRequest, "whenDiscCodeId")) {
            local.repair.setWhenDisc(arguments.formRequest["whenDiscCodeId"]);
        }        

        if (StructKeyExists(arguments.formRequest, "shopStatus")) {
            local.repair.setShopStatus(arguments.formRequest["shopStatus"]);
        }

        if (StructKeyExists(arguments.formRequest, "assetId")) {
            local.repair.setAssetId(arguments.formRequest["assetId"]);
        }

        if (StructKeyExists(arguments.formRequest, "narrative")) {
            local.repair.setNarrative(arguments.formRequest["narrative"]);
        }

        if (StructKeyExists(arguments.formRequest, "repairStartDate")) {
        	
        	if(StructKeyExists(arguments.formRequest, "repairStartTime")){
        		local.repair.setStartDate(arguments.formRequest["repairStartDate"] & " " & arguments.formRequest["repairStartTime"]);
			}else{
				local.repair.setStartDate(arguments.formRequest["repairStartDate"]);
			}
        }
		
        if (StructKeyExists(arguments.formRequest, "repairCompDate")) {
            
            if(StructKeyExists(arguments.formRequest, "repairCompTime")){
        		local.repair.setStopDate(arguments.formRequest["repairCompDate"] & " " & arguments.formRequest["repairCompTime"]);
			}else{
				local.repair.setStopDate(arguments.formRequest["repairCompDate"]); 
			}
			
        }


        if (StructKeyExists(arguments.formRequest, "recvDate")) {
            local.repair.setRecvDate(arguments.formRequest["recvDate"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "seq")){
        	local.repair.setRepairSeq(arguments.formRequest["seq"]);
        }

        local.repair.setInsBy(application.sessionManager.getUserName());
        local.repair.setInsDate(Now());
        
        return local.repair;
    }

    /* populate Labor bean from formRequest */
    private Labor function populateLabor(required struct formRequest) {
        if (StructKeyExists(arguments.formRequest, "laborId")) {
        	var labor = getLaborService().getLabor(arguments.formRequest["laborId"]);        	
        }else{
        	var labor = new Labor();
        }
                      
        if (StructKeyExists(arguments.formRequest, "laborId")) {
        	local.labor.setLaborId(arguments.formRequest["laborId"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "actionTknCodeId")) {
        	local.labor.setActionTaken(arguments.formRequest["actionTknCodeId"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "correctiveAction")) {
            local.labor.setCorrective(arguments.formRequest["correctiveAction"]);
        }
       
        if (StructKeyExists(arguments.formRequest, "remarks")) {
            local.labor.setRemarks(arguments.formRequest["remarks"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "howMalCodeId")) {
            local.labor.setHowMal(arguments.formRequest["howMalCodeId"]);
        }

        if (StructKeyExists(arguments.formRequest, "typeMaintCodeId")) {
            local.labor.setTypeMaint(arguments.formRequest["typeMaintCodeId"]);
        }

        if (StructKeyExists(arguments.formRequest, "whenDiscCodeId")) {
            local.labor.setWhenDisc(arguments.formRequest["whenDiscCodeId"]);
        }        

        if (StructKeyExists(arguments.formRequest, "shopStatus")) {
            local.labor.setShopStatus(arguments.formRequest["shopStatus"]);
        }

        if (StructKeyExists(arguments.formRequest, "assetId")) {
            local.labor.setAssetId(arguments.formRequest["assetId"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "laborStartDate") && isDate(arguments.formRequest["laborStartDate"])) {
            if (StructKeyExists(arguments.formRequest, "laborStartTime") && isDate(arguments.formRequest["laborStartDate"] & " " & arguments.formRequest["laborStartTime"])) {
                local.labor.setStartDate(ParseDateTime(arguments.formRequest["laborStartDate"] & " " & arguments.formRequest["laborStartTime"]));
            } else {
                local.labor.setStartDate(ParseDateTime(arguments.formRequest["laborStartDate"] & " 00:00"));
            }
        }

        if (StructKeyExists(arguments.formRequest, "laborCompDate") && isDate(arguments.formRequest["laborCompDate"])) {
            if (StructKeyExists(arguments.formRequest, "laborCompTime") && isDate(arguments.formRequest["laborCompDate"] & " " & arguments.formRequest["laborCompTime"])) {
                local.labor.setStopDate(ParseDateTime(arguments.formRequest["laborCompDate"] & " " & arguments.formRequest["laborCompTime"]));
            } else {
                local.labor.setStopDate(ParseDateTime(arguments.formRequest["laborCompDate"] & " 00:00"));
            }
        }
        
        if (StructKeyExists(arguments.formRequest, "crewChief")) {
            local.labor.setCrewChief(arguments.formRequest["crewChief"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "crewSize")) {
            local.labor.setCrewSize(arguments.formRequest["crewSize"]);
        }		
        
        if (StructKeyExists(arguments.formRequest, "failTestId")) {
        	local.labor.setTestFailNo(arguments.formRequest["failTestId"]);
        }
        
        local.labor.setChgBy(application.sessionManager.getUserName());
        local.labor.setChgDate(Now());
        local.labor.setInsBy(application.sessionManager.getUserName());
        local.labor.setInsDate(Now());

        return local.labor;
    }
    
     /* populate Depot Event bean from formRequest */
    private Event function populateDepotEvent(required string asset, required string loc, string eventId) {
        var event = new Event();

       	local.newJobIdService = application.objectFactory.create("NewJobIdService");
        local.newJobId = local.newJobIdService.getNewJobId(application.sessionManager.getProgramSetting(),arguments.loc);
        
        local.event.setJobNo(local.newJobId);	
		local.event.setAssetId(arguments.asset);               
		local.event.setStartJob(Now());
        local.event.setLocId(arguments.loc);
        local.event.setSourceCat(application.sessionManager.getSourceCatSetting());
        local.event.setInsBy(application.sessionManager.getUserName());
        local.event.setInsDate(Now());
        
        local.oldEvent = getEventService().getEvent(val(arguments.eventId));
		local.event.setDiscrepancy(local.oldEvent.getDiscrepancy());
		local.event.setOldJob(val(arguments.eventId));
        return local.event;
    }
    
     /* populate Depot Repair bean from formRequest */
    private Repair function populateDepotRepair(required struct args) {
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
    
    /* populate Depot Labor bean from formRequest */
    private any function populateDepotLabor(required any repair) {
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
    
    private Attachments function populateAttachments(required struct formRequest) {
    	var attachments = new Attachments();
    	if (StructKeyExists(arguments.formRequest, "assetId")) {
            local.attachments.setAssetId(arguments.formRequest["assetId"]);
        }
        if (StructKeyExists(arguments.formRequest, "repairId")) {
        	local.attachments.setRepairId(arguments.formRequest["repairId"]);
        }
        if (StructKeyExists(arguments.formRequest, "fileUpload")) {
        	local.attachments.setName(arguments.formRequest["fileUpload"]);
        }  
              
        //local.cfgMeters.setChgBy(application.sessionManager.getUserName());
        //local.cfgMeters.setChgDate(Now());
        //local.labor.setInsBy(application.sessionManager.getUserName());
        //local.labor.setInsDate(Now());
        
        return local.attachments;
    	
    }    
    
    private Array function loopAttachments(required struct formRequest) {
    	attachArray = ArrayNew(1);
    	
    	for (loop=1; loop LE #formRequest.imgCntr#; loop = loop + 1)
    	{
    		if(StructKeyExists(arguments.formRequest, "fileName"&loop)){
    			var attachments = new Attachments();
    			
    			if (StructKeyExists(arguments.formRequest, "assetId")) {
            		local.attachments.setAssetId(arguments.formRequest["assetId"]);
        		}
        		if (StructKeyExists(arguments.formRequest, "repairId")) {
        			local.attachments.setRepairId(arguments.formRequest["repairId"]);
        		}
    			if (StructKeyExists(arguments.formRequest, "fileName"&loop)) {
    				local.attachments.setName(arguments.formRequest["fileName"&loop]);
    			}   
    			if (StructKeyExists(arguments.formRequest, "desc"&loop)) {
    				local.attachments.setDescription(arguments.formRequest["desc"&loop]);
    			}   
    		
    		   ArrayAppend(attachArray, local.attachments);
    		  }    		 	
    	}
    	
    	return attachArray;
    }
    
    private Array function loopTestFailed(required struct formRequest) {
    	testFailedArray = ArrayNew(1);
    	
    	for (loop=1; loop LE #formRequest.testFailCntr#; loop = loop + 1)
    	{
    		
    		if(StructKeyExists(arguments.formRequest, "failTestName"&loop)){
    			var testFailed = new TestFailed();
    			
    			if (StructKeyExists(arguments.formRequest, "laborId")) {
            		local.testFailed.setLaborId(arguments.formRequest["laborId"]);
        		}
        		if (StructKeyExists(arguments.formRequest, "failTestId"&loop)) {
        			local.testFailed.setTestFailCd(arguments.formRequest["failTestId"&loop]);
        		}
        		
        		local.testFailed.setInsBy(application.sessionManager.getUserName());
        		local.testFailed.setInsDate(Now());
        		local.testFailed.setChgBy(application.sessionManager.getUserName());
        		local.testFailed.setChgDate(Now());
    			
    		
    		   ArrayAppend(testFailedArray, local.testFailed);
    		  }    		 	
    	}
    	
    	return testFailedArray;
    }
 	

    /* populate LaborBitPc bean from formRequest */
    private LaborBitPc function populateLaborBitPc(required struct formRequest) {
    	if(StructKeyExists(arguments.formRequest, "laborBitId") AND arguments.formRequest.laborBitId NEQ ""){
    		local.decryptLaborBitId = getUtilities().decryptId(arguments.formRequest.laborBitId);    
    	  	
	    	var laborBitPc = getLaborBitPcService().getLaborBitPc(local.decryptLaborBitId);

    	}else{
    		var laborBitPc = new LaborBitPc();
    	}
        
        if (StructKeyExists(arguments.formRequest, "bPartno")) {
            local.laborBitPc.setBitPartno(arguments.formRequest["bPartno"]);
        }
        if (StructKeyExists(arguments.formRequest, "bName")) {
            local.laborBitPc.setBitName(arguments.formRequest["bName"]);
        }
        if (StructKeyExists(arguments.formRequest, "bQty")) {
            local.laborBitPc.setBitQty(arguments.formRequest["bQty"]);
        }
        if (StructKeyExists(arguments.formRequest, "laborId")) {
            local.laborBitPc.setLaborId(arguments.formRequest["laborId"]);
        }
		

        return local.laborBitPc;
    }
                              
    private SruOrder function populatePartOrdered(required string eventId, required string repairId, required string assetId, required string partNumber) {
        var SruOrder = new SruOrder();
              
        if (arguments.eventId) {
            local.SruOrder.setEventId(arguments.eventId);
        }
        if (arguments.repairId) {
            local.SruOrder.setRepairId(arguments.repairId);
        }
        if (arguments.partNumber) {
            local.SruOrder.setPartnoId(arguments.partNumber);
        }  
        local.SruOrder.setOrderDate(Now());
        local.SruOrder.setInsBy(application.sessionManager.getUserName());
        local.SruOrder.setInsDate(Now());
        local.SruOrder.setActive("Y");

        return local.SruOrder;
    }
    
    /* populate LaborPart bean from formRequest */
    private LaborPart function populateLaborPartWorked(required struct formRequest) {
        var laborPart = new LaborPart();
              
        if (StructKeyExists(arguments.formRequest, "laborId")) {
            local.laborPart.setLaborId(arguments.formRequest["laborId"]);
        }
        if (StructKeyExists(arguments.formRequest, "sraAssetId")) {
            local.laborPart.setAssetId(arguments.formRequest["sraAssetId"]);
        }  
        local.laborPart.setInsBy(application.sessionManager.getUserName());
        local.laborPart.setInsDate(Now());
        local.laborPart.setPartAction("WORKED");
        if (StructKeyExists(arguments.formRequest, "howMalCodeId")) {
            local.laborPart.setHowMal(arguments.formRequest["howMalCodeId"]);
        }

        return local.laborPart;
    }

    /* populate LaborPart bean from formRequest */
    private LaborPart function populateLaborPartRemoved(required struct formRequest) {
        var laborPart = new LaborPart();

              
        if (StructKeyExists(arguments.formRequest, "laborId")) {
            local.laborPart.setLaborId(arguments.formRequest["laborId"]);
        }
        if (StructKeyExists(arguments.formRequest, "remSraAssetId")) {
            local.laborPart.setAssetId(arguments.formRequest["remSraAssetId"]);
        }  
        local.laborPart.setInsBy(application.sessionManager.getUserName());
        local.laborPart.setInsDate(Now());
        local.laborPart.setPartAction("REMOVED");
        if (StructKeyExists(arguments.formRequest, "howMalCodeId")) {
            local.laborPart.setHowMal(arguments.formRequest["howMalCodeId"]);
        }
        
        if(StructKeyExists(arguments.formRequest, "isPqdr")){
        	local.laborPart.setIsPqdr(arguments.formRequest.isPqdr);	
        }
        
        if(StructKeyExists(arguments.formRequest, "drNum")){
        	local.laborPart.setDrNum(arguments.formRequest.drNum);	
        }
        
        return local.laborPart;
    }

    /* populate LaborPart bean from formRequest */
    private LaborPart function populateLaborPartInstalled(required struct formRequest) {
        var laborPart = new LaborPart();

        
        if (StructKeyExists(arguments.formRequest, "laborId")) {
            local.laborPart.setLaborId(arguments.formRequest["laborId"]);
        }
        if (StructKeyExists(arguments.formRequest, "insSraAssetId")) {
            local.laborPart.setAssetId(arguments.formRequest["insSraAssetId"]);
        }
        local.laborPart.setInsBy(application.sessionManager.getUserName());
        local.laborPart.setInsDate(Now());
        local.laborPart.setPartAction("INSTALLED");

        return local.laborPart;
    }
    
    private AssetInspection function populateAssetInspection(required struct formRequest) {
    	var assetInspection = new AssetInspection();
    	
    	if (StructKeyExists(arguments.formRequest, "assetInsId")) {
    		local.assetInspection.setHistId(arguments.formRequest["assetInsId"]);
    	}
    	if (StructKeyExists(arguments.formRequest, "assetId")) {
    		local.assetInspection.setAssetId(arguments.formRequest["assetId"]);
    	}
    	if (StructKeyExists(arguments.formRequest, "repairId")) {
    		local.assetInspection.setRepairId(arguments.formRequest["repairId"]);
    	}
    	if (StructKeyExists(arguments.formRequest, "nextPmiDate")) {
    		local.assetInspection.setNextDueDate(arguments.formRequest["nextPmiDate"]);
    	}
    	if (StructKeyExists(arguments.formRequest, "nextPmiEtm")) {
    		local.assetInspection.setNextDueEtm(arguments.formRequest["nextPmiEtm"]);
    	}
    	if (StructKeyExists(arguments.formRequest, "nextPmiId")) {
    		local.assetInspection.setPmiType(arguments.formRequest["nextPmiId"]);
    	}
    	if (StructKeyExists(arguments.formRequest, "wucCd")) {
    		local.assetInspection.setWucCd(arguments.formRequest["wucCd"]);
    	}
    	if (StructKeyExists(arguments.formRequest, "repairCompDate")) {
            local.assetInspection.setCompleteDate(arguments.formRequest["repairCompDate"]);
        }
    	local.assetInspection.setValid("Y");
    	local.assetInspection.setInsBy(application.sessionManager.getUserName());
        local.assetInspection.setInsDate(Now());
    
    	return local.assetInspection;
    }
    
    private TctoAsset function populateTctoAsset(required struct formRequest) {
    	var tctoAsset = new TctoAsset();
    	
    	if (StructKeyExists(arguments.formRequest, "tctoId")) {
    		local.tctoAsset.setTctoId(arguments.formRequest["tctoId"]);
    	}
    	if (StructKeyExists(arguments.formRequest, "assetId")) {
    		local.tctoAsset.setAssetId(arguments.formRequest["assetId"]);
    	}
    	if (StructKeyExists(arguments.formRequest, "tctoCompDate")) {
            local.tctoAsset.setCompleteDate(arguments.formRequest["tctoCompDate"]);
        }
    	if (StructKeyExists(arguments.formRequest, "repairId")) {
            local.tctoAsset.setRepairId(arguments.formRequest["repairId"]);
        }
    	local.tctoAsset.setValid("Y");
    	local.tctoAsset.setInsBy(application.sessionManager.getUserName());
    	local.tctoAsset.setInsDate(Now());
    	
    	return local.tctoAsset;
    	
    }

    /* populate CfgMeters bean from formRequest */
    private CfgMeters function populateCfgMeters(required struct formRequest) {
    	
    	if (StructKeyExists(arguments.formRequest, "eventId")) {
            try{
            	var cfgMeters = getCfgMetersService().getCfgMeters(arguments.formRequest["eventId"]);
            }catch(any e){
            	var cfgMeters = new CfgMeters();
            	//local.cfgMeters.setMeterSeq(1);
            	if (StructKeyExists(arguments.formRequest, "etmStart")) {
            		local.cfgMeters.setMeterSeq(getCurrentCfgMetersSequenceNumber(arguments.formRequest["ctAssetId"]));
            		local.cfgMeters.setEventId(arguments.formRequest["eventId"]);
            	}
            }
        }else{
            var cfgMeters = new CfgMeters();
        }
        

        
        if (StructKeyExists(arguments.formRequest, "ctAssetId")) {
            local.cfgMeters.setAssetId(arguments.formRequest["ctAssetId"]);
        }

        if (StructKeyExists(arguments.formRequest, "serno") and StructKeyExists(arguments.formRequest, "partno")) {
        }

        if (StructKeyExists(arguments.formRequest, "etmStart")) {
            local.cfgMeters.setValueIn(arguments.formRequest["etmStart"]);
        }

        if (StructKeyExists(arguments.formRequest, "etmComp")) {
            local.cfgMeters.setValueOut(arguments.formRequest["etmComp"]);
        }

        if (StructKeyExists(arguments.formRequest, "meterChg")) {
            local.cfgMeters.setIsMeterChg(arguments.formRequest["meterChg"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "meterSeq")){
            local.cfgMeters.setMeterSeq(arguments.formRequest["meterSeq"]);
        }

        local.cfgMeters.setCreatedBy(application.sessionManager.getUserName());
        local.cfgMeters.setCreateDate(Now());
        local.cfgMeters.setChgBy(application.sessionManager.getUserName());
        local.cfgMeters.setChgDate(Now());

        return local.cfgMeters;
    }

    /* populate MeterHist bean from formRequest */
    private MeterHist function populateMeterHist(required struct formRequest) {
    	
    	if (StructKeyExists(arguments.formRequest, "meterId") and len(arguments.formRequest["meterId"])) {
            var meterHist = getMeterHistService().getMeterHist(arguments.formRequest["meterId"]);
        }else{
            var meterHist = new MeterHist();
            if (StructKeyExists(arguments.formRequest, "etmStart")) {
            	local.meterHist.setSeqNum(getCurrentMeterHistSequenceNumber(arguments.formRequest["assetId"]));
            }
        }

        if (StructKeyExists(arguments.formRequest, "eventId")) {
            local.meterHist.setEventId(arguments.formRequest["eventId"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "assetId")) {
            local.meterHist.setAssetId(arguments.formRequest["assetId"]);
        }

        if (StructKeyExists(arguments.formRequest, "etmStart")) {
            local.meterHist.setMeterIn(arguments.formRequest["etmStart"]);
        }

        if (StructKeyExists(arguments.formRequest, "etmComp")) {
            local.meterHist.setMeterOut(arguments.formRequest["etmComp"]);
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
    
    
    // function add -  - Kevin Added on 05 November 2013
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
    
    public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }    
    
    public any function searchBacklog( string searchCriteria= ""){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/maintenance/backlog.cfm"; 
        addToFormRequest("searchCriteria",ARGUMENTS.searchCriteria);
        
        getSessionFacade().setValue("searchCriteria",ARGUMENTS.searchCriteria);
        session.workload = "backlog.cfm";
        session.workloadredirect = "Workload";
        getSessionFacade().removeValue("backlogJobs");

		if(ARGUMENTS.searchCriteria EQ ""){
        	getSessionFacade().removeValue("maintStatus");
        }
        
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            //local.page = getDirectoryFromPath(rc.httpReferer) & "backlog.cfm";
            local.page = getRootPath() & "/" & getProgram() & "/maintenance/backlog.cfm";
        }
        
        local.search = getDBUtils().searchBacklogs(getSessionFacade().getProgramSetting(),ARGUMENTS.searchCriteria,application.sessionManager.getLocIdSetting());
        
        local.search = getUtilities().addEncryptedColumn(local.search,"eventid");
        local.search = getUtilities().addEncryptedColumn(local.search,"repairid");
        
        getJavaLoggerProxy().fine(message="Querying Backlog dbUtils.searchBacklog(#getSessionFacade().getProgramSetting()#,#ARGUMENTS.searchCriteria#)",sourceClass=getUtilities().getComponentName(this), methodName="searchBacklog");
        addToRequest("qSearch",new QueryIterator(local.search));
        		addToRequest("search",local.search);
        
        
        //getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=getUtilities().getComponentName(this), methodName="searchBacklog");
       redirect(local.page,true); 
    }
    // function add - end
    
    public any function searchPmi (string searchCriteria="", string dueDateInterval="60"){
    	var local={};
    	local.page = getRootPath() & "/" & getProgram() & "/maintenance/pmi.cfm"; 
    	addToFormRequest("searchCriteria",ARGUMENTS.searchCriteria);
        addToFormRequest("dueDateInterval",ARGUMENTS.dueDateInterval);
        getSessionFacade().setValue("searchCriteria",ARGUMENTS.searchCriteria);
        getSessionFacade().setValue("dueDateInterval",ARGUMENTS.dueDateInterval);
        
        getSessionFacade().setValue("searchCriteria",ARGUMENTS.searchCriteria);
        session.workload = "pmi.cfm";
        session.workloadredirect = "PMI";
        getSessionFacade().removeValue("pmiJobs");

		if(ARGUMENTS.searchCriteria EQ ""){
        	getSessionFacade().removeValue("maintStatus");
        }
        
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            //local.page = getDirectoryFromPath(rc.httpReferer) & "backlog.cfm";
            local.page = getRootPath() & "/" & getProgram() & "/maintenance/pmi.cfm";
        }
        
        local.search = getDBUtils().searchPmi(getSessionFacade().getProgramSetting(),ARGUMENTS.searchCriteria,application.sessionManager.getLocIdSetting(),ARGUMENTS.dueDateInterval);
        
        local.search = getUtilities().addEncryptedColumn(local.search,"eventid");
        local.search = getUtilities().addEncryptedColumn(local.search,"repairid");
        
        getJavaLoggerProxy().fine(message="Querying PMI dbUtils.searchPmi(#getSessionFacade().getProgramSetting()#,#ARGUMENTS.searchCriteria#,#ARGUMENTS.dueDateInterval#)",sourceClass=getUtilities().getComponentName(this), methodName="searchPmi");
        
        addToRequest("qSearch",new QueryIterator(local.search));
        		addToRequest("search",local.search);
    	
    	redirect(local.page,true);
    }
    
    public any function searchPartOrdered (string searchCriteria=""){
    	var local={};
    	local.page = getRootPath() & "/" & getProgram() & "/maintenance/partOrdered.cfm";
    	addToFormRequest("searchCriteria",ARGUMENTS.searchCriteria);
        
        getSessionFacade().setValue("searchCriteria",ARGUMENTS.searchCriteria);
        getSessionFacade().removeValue("partOredredJobs");     

		if(ARGUMENTS.searchCriteria EQ ""){
        	getSessionFacade().removeValue("maintStatus");
        }
        
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            //local.page = getDirectoryFromPath(rc.httpReferer) & "backlog.cfm";
            local.page = getRootPath() & "/" & getProgram() & "/maintenance/partOrdered.cfm";
        }
        
        //writeoutput(application.sessionManager.getLocIdSetting());
        //abort;
        
        local.search = getDBUtils().searchPartOrderByLoc(getSessionFacade().getProgramSetting(),ARGUMENTS.searchCriteria,application.sessionManager.getLocIdSetting());
    	
    	addToRequest("qSearch",new QueryIterator(local.search));
        		addToRequest("search",local.search);
    	
    	redirect(local.page,true);
    }
    
    public any function searchTcto (string searchCriteria=""){
    	var local={};
    	local.page = getRootPath() & "/" & getProgram() & "/maintenance/tcto.cfm"; 
    	addToFormRequest("searchCriteria",ARGUMENTS.searchCriteria);
        
        getSessionFacade().setValue("searchCriteria",ARGUMENTS.searchCriteria);
        session.workload = "tcto.cfm";
        session.workloadredirect = "TCTO";
        getSessionFacade().removeValue("tctoJobs");

		if(ARGUMENTS.searchCriteria EQ ""){
        	getSessionFacade().removeValue("maintStatus");
        }
        
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            //local.page = getDirectoryFromPath(rc.httpReferer) & "backlog.cfm";
            local.page = getRootPath() & "/" & getProgram() & "/maintenance/tcto.cfm";
        }
        
        local.search = getDBUtils().searchTcto(getSessionFacade().getProgramSetting(),ARGUMENTS.searchCriteria,application.sessionManager.getLocIdSetting());
        
        local.search = getUtilities().addEncryptedColumn(local.search,"eventid");
        local.search = getUtilities().addEncryptedColumn(local.search,"repairid");
        
        getJavaLoggerProxy().fine(message="Querying TCTO dbUtils.searchTcto(#getSessionFacade().getProgramSetting()#,#ARGUMENTS.searchCriteria#)",sourceClass=getUtilities().getComponentName(this), methodName="searchTcto");
        
        addToRequest("qSearch",new QueryIterator(local.search));
        		addToRequest("search",local.search);
    	
    	redirect(local.page,true);
    }
}