import cfc.model.CfgMeters;
import cfc.model.Event;
import cfc.model.Labor;
import cfc.model.LaborBitPc;
import cfc.model.LaborPart;
import cfc.model.MeterHist;
import cfc.model.Repair;
import cfc.model.Attachments;
import cfc.model.AssetInspection;
import cfc.model.TctoAsset;
import cfc.model.Tcto;
import cfc.model.SruOrder;
import cfc.model.Asset;
import cfc.model.InvAssets;
import cfc.service.IMPULSService;
import cfc.utils.utilities;

import cfc.dao.DBUtils;   

import acts.controller.maintenanceController;

component  displayname="MaintenanceBO" hint="Maintenance Business Object" accessors="true" {

    /* init */
    public function init() {
        /* return success */
        return this;
    }

    /* Update Asset */
    public Asset function updateAsset(required Asset asset) {
    	var assetService = application.objectFactory.create("AssetService");
    	
    	transaction {
    		try {
    			local.result = local.assetService.updateAsset(arguments.asset);
    			
    			// commit transcation
                TransactionCommit();
                return local.result;
    		} catch (any e) {
                TransactionRollback();
                throw(type="UpdateAssetException", message=e.message, detail=e.detail);
            }
    	}
    }
    
    /* Update CT Asset */
    public InvAssets function updateCtAsset(required InvAssets invAsset) {
    	var invAssetsService = application.objectFactory.create("InvAssetsService");
    	
    	transaction {
    		try {
    			local.result = local.assetService.updateInvAssets(arguments.invAsset);
    			
    			// commit transcation
                TransactionCommit();
                return local.result;
    		} catch (any e) {
                TransactionRollback();
                throw(type="UpdateCtAssetException", message=e.message, detail=e.detail);
            }
    	}
    }
    
    /* Create Event */
    public Event function createEvent(required Event event, required CfgMeters cfgMeters, required MeterHist meterHist, required any asset) {
        var eventService = application.objectFactory.create("EventService");
        var meterHistService = application.objectFactory.create("MeterHistService");
        var cfgMetersService = application.objectFactory.create("CfgMetersService");
        var assetService = application.objectFactory.create("AssetService");

        /* TO-DO Create IMPULSService */
        
		/* validate Event related objects before insert */
        validateEvent(arguments.event);
        
        if (application.sessionManager.getSubSection() EQ 'AIRBORNE' && StructKeyExists(session,"systype") && session.systype NEQ "PART") {
        	validateMeterHist(arguments.meterHist);
        	validateCfgMeters(arguments.cfgMeters);	
        }
        validateAsset(arguments.asset);

		/* perform Event create transaction */    
        transaction {
            try {
                // insert event
                local.result = local.eventService.createEvent(arguments.event); 
				
				if (application.sessionManager.getSubSection() EQ 'AIRBORNE' && StructKeyExists(session,"systype") && session.systype NEQ "PART") {
					// insert meter_hist
	                arguments.meterHist.setEventId(local.result.getEventId());
    	            local.meterHistService.createMeterHist(arguments.meterHist);

        	        // insert cfg_meters
            	    arguments.cfgMeters.setEventId(local.result.getEventId());
                	local.cfgMetersService.createCfgMeters(arguments.cfgMeters);
	
				}
                        
                local.assetService.updateAsset(arguments.asset);        
                /* TO-DO Send to IMPULS */

                // commit transcation
                TransactionCommit();
                return local.result;
            } catch (any e) {
                TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            }
        }
    }
    
    /* Create Event */
    public Event function createEventUID(required Event event) {
        var eventService = application.objectFactory.create("EventService");

        /* TO-DO Create IMPULSService */
        
		/* validate Event related objects before insert */
       // validateEvent(arguments.event);

		/* perform Event create transaction */    
        transaction {
            try {
                // insert event
                local.result = local.eventService.createEvent(arguments.event);

                // commit transcation
                TransactionCommit();
                return local.result;
            } catch (any e) {
                TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            }
        }
    }
    

    /* Update Event */
    public Event function updateEvent(required Event event, required CfgMeters cfgMeters, required MeterHist meterHist, required any asset) {
        var eventService = application.objectFactory.create("EventService");
        var meterHistService = application.objectFactory.create("MeterHistService");
        var cfgMetersService = application.objectFactory.create("CfgMetersService");	
        var assetService = application.objectFactory.create("AssetService");
   
		/* validate Event related objects before update */
        validateEvent(arguments.event);
        
        if (application.sessionManager.getSubSection() EQ 'AIRBORNE' && StructKeyExists(session,"systype") && session.systype NEQ "PART") {
	        validateMeterHist(arguments.meterHist);
	        validateCfgMeters(arguments.cfgMeters);
	    }
        validateAsset(arguments.asset);
    
		/* perform Event update transaction */    
        transaction {
            try {
                local.result = local.eventService.updateEvent(arguments.event);
                if (application.sessionManager.getSubSection() EQ 'AIRBORNE' && StructKeyExists(session,"systype") && session.systype NEQ "PART") {
                	if(len(arguments.meterHist.getMeterId()) neq 0){
                		local.meterHistService.updateMeterHist(arguments.meterHist);	
                	}else{
                		local.meterHistService.createMeterHist(arguments.meterHist);
                	}
                	
                	try{
                		local.cfgMetersService.updateCfgMeters(arguments.cfgMeters);	
                	}catch(any e){
                		local.cfgMetersService.createCfgMeters(arguments.cfgMeters);                		
                	}
                	
                	
                }
                
                local.assetService.updateAsset(arguments.asset);
                TransactionCommit();
                return local.result;
            } catch (any e) {
                TransactionRollback();
                throw(type="UpdateException", message=e.message, detail=e.detail);
            }
        }
    }

    /* Delete Maintenance */
    public void function deleteEvent(eventId) {
        var eventService = application.objectFactory.create("EventService");
        
        local.event = local.eventService.deleteEvent(arguments.eventId);
        
    }

    /* Create Repair */
    public Repair function createRepair(required Repair repair, required Labor labor, required LaborBitPc laborBitPc, required LaborPart workedPart, required LaborPart removedPart, required LaborPart installedPart) {
        var eventService = application.objectFactory.create("EventService");
        var repairService = application.objectFactory.create("RepairService");
        var laborService = application.objectFactory.create("LaborService");
        var laborBitPcService = application.objectFactory.create("LaborBitPcService");
        var laborPartService = application.objectFactory.create("LaborPartService");
        var attachmentsService = application.objectFactory.create("AttachmentsService");
        var removedAssetService = APPLICATION.objectFactory.create("AssetService");
        var codeService = APPLICATION.objectFactory.create("CodeService");
        var invAssetService = APPLICATION.objectFactory.create("InvAssetsService");
        var partService = APPLICATION.objectFactory.create("PartListService");        
        var impulsService = new IMPULSService(); 
        var dbUtils = application.objectFactory.create("DBUtils");
        
        //RWR 02/06/2019 CR 609
        		/*
		When a part is removed during a maintenance action, the asset becomes a spare, 
		the status of the asset is changed to NMCM and a new work order is pushed to the assigned repair depot for that asset.
		 In scenarios where the part is removed and is not faulty, 
		 such as when the CRIIS ECU is removed and replaced with an ECU Bypass, 
		the status must be revised and the Depot work order must be removed.
		
		When a part is removed and there is no defect, 
		as indicated by HOW_MAL code, 
		do not change the status of the spare asset and do not push a Depot work order. 
		The specific HOW MAL codes to be exempt from the current process are: 
		any code that is a - No Defect, or in the group code 44811 
		
		
		Technical Requirement: When a part is removed and there is no defect, as indicated by HOW_MAL code,
		 do not change the status of the spare asset and do not push a Depot work order. 
		 The specific HOW MAL codes to be exempt from the current process are: ### - No Defect, and code in group code 44811
		 Action take ‘T’ should also prevent the status of the spare from changing and prevent a Depot work order.
		  Conditional logic will have to be applied around these actions with the aforementioned criteria to achieve the desired functionality.
		*/

        
      

        var addDepotWO = "True"; 
		
		
		var removedforCann = findNoCase("T - REMOVED FOR CANN",form.ACTIONTKN,0);

		//REMOVED FOR CANN
		if(removedforCann GT 0){
			//SET status of spare to FMC
			addDepotWO = "False";
		}
		
						
		var in_code_value = Left(form.HOWMAL,3);				
		var qry = new Query();
		var sql = "SELECT count(1) as cnt FROM CODE_GROUP_VIEW WHERE group_name = 'HOW_MAL_TYPE_6'  and code_value = '" & in_code_value & "'";
		//runSQL
		
		qry = dbUtils.runSQL(sql,"GLOBALEYE");
		
 	
        
         if(qry.recordcount){  
        	var cnt = 0;
        	for(i=1; i LTE qry.recordcount; i=i+1){
        		if (qry.cnt GT 0){
        			addDepotWO = "False";                     
                }
	       		
        	}
        	 	       	      
        }
        
        
        local.event = local.eventService.getEvent(val(arguments.repair.getEventId()));
        local.endItemAsset = local.removedAssetService.getAsset(local.event.getAssetId());
        local.endItemPart = local.partService.getPartList(local.endItemAsset.getPartnoId());
        
        //Gets the top level asset

		if((arguments.workedPart.getAssetId() NEQ "") OR (arguments.removedPart.getAssetId() NEQ "")){
			if(arguments.workedPart.getAssetId() NEQ ""){
				arguments.repair.setAssetId(arguments.workedPart.getAssetId());
			} else {
				arguments.repair.setAssetId(arguments.removedPart.getAssetId());
			}			
		}
        
        transaction {
            try {
                validateRepair(arguments.repair);
                local.result = local.repairService.createRepair(arguments.repair);
                arguments.labor.setRepairId(local.result.getRepairId());
                
		        validateLabor(arguments.labor);                
                local.labor = local.laborService.createLabor(arguments.labor);
                arguments.workedPart.setLaborId(local.labor.getLaborId());
                arguments.removedPart.setLaborId(local.labor.getLaborId());
                arguments.laborBitPc.setLaborId(local.labor.getLaborId());
                arguments.installedPart.setLaborId(local.labor.getLaborId());
                local.result.laborId = local.labor.getLaborId();                
               
                if(arguments.workedPart.getAssetId() NEQ ""){
		        	local.laborPartService.createLaborPart(arguments.workedPart);
		        }
               
                if(arguments.removedPart.getAssetId() NEQ ""){
                    local.laborPartService.createLaborPart(arguments.removedPart);	
                    
                    local.code = local.codeService.findByCodeTypeCodeValue("STATUS", "NMCM");

					//RWR find FMC code 
					var FMCcode = local.codeService.findByCodeTypeCodeValue("STATUS", "FMC");	 
					var FMCcodeID = FMCcode.getCodeId();
				
					
	 
					local.removedAsset = local.removedAssetService.getAsset(arguments.removedPart.getAssetId());
					local.part = local.partService.getPartList(local.removedAsset.getPartnoId());
					/*if(local.removedAsset.getCtAssetId() GT 0){
					 	 local.invAsset = local.invAssetService.getInvAssets(local.removedAsset.getCtAssetId());
					 	 
					}*/
					
					//RWR Here is where the removed part gets its new status
					
					if(addDepotWO EQ "False"){
						local.removedAsset.setStatusCd(FMCcodeID);
					}
					else{
						local.removedAsset.setStatusCd(local.code.getCodeId());
					}
					
					local.removedAsset.setChgBy(arguments.removedPart.getInsBy());
				    local.removedAsset.setNHAAssetID('');
				    local.removedAsset.setLocIdA(application.sessionManager.getLocIdSetting());
				    local.removedAsset.setLocIdC(application.sessionManager.getLocIdSetting());
				    local.removedAssetService.updateAsset(local.removedAsset);
                    
                    if(local.removedAsset.getCtAssetId() GT 0){
                    	var impulsForm = populateImpulsForm(local.removedAsset.getCtAssetId(),local.code.getCtCodeId());
						//validateImpulsForm(impulsForm);
		            	local.impulsService.send(local.impulsForm);
            	
				       	/*local.invAsset.setStatus(local.code.getCtCodeId());
				       	local.invAssetService.updateInvAssets(local.invAsset); */
				    }
                    
                    // need to create a DRS job for the maintenance 
                    if (local.part.getLocIdr() NEQ ""){
                    	
                		validateLaborPart(arguments.removedPart);
            			writeLog(file="ACTS" text="Depot Location - #local.part.getLocIdr()#");	
                		local.maintenanceController = new maintenanceController();
                		//RWR TESt for CR 609... do not create Depot Event if removed for cann 
                		if (addDepotWO EQ "True"){
                			local.maintenanceController.insertDepotEvent(local.removedAsset.getAssetId(), local.part.getLocIdr(), arguments.repair, arguments.removedPart);
                		} 
                		
                	} else {
                		writeLog(file="ACTS" text="The part you are working with does not have a Depot Location associated");
                	}
                }

                
                if(arguments.installedPart.getAssetId() NEQ ""){
                    local.laborPartService.createLaborPart(arguments.installedPart); 
                    
                    var local.installedAssetService = APPLICATION.objectFactory.create("AssetService");
                                                            
                    local.installedAsset = local.installedAssetService.getAsset(arguments.installedPart.getAssetId());
                    local.installedAsset.setChgBy(arguments.installedPart.getInsBy());
                    local.installedAsset.setChgDate(Now());
                    
                    // TODO: DONT SET NHA IF PART IS CONFIGED TO PARENT
					local.installedAsset.setNHAAssetID(findNhaInBom(local.event.getAssetId(), local.installedAsset.getPartnoId()).getAssetId());
					
					if (local.installedAsset.getInTransit() EQ "Y") {
						local.installedAsset.setInTransit('N');
						local.installedAsset.setRecvDate(Now()); 	
					}
					
				    local.installedAssetService.updateAsset(local.installedAsset);
                    
                }                
                 
               // TODO: Check and create NRTS job if Action Taken code is 0-9
               
               if(local.labor.getActionTaken() NEQ ''){
	               var actionTaken = local.codeService.getCode(local.labor.getActionTaken());
		               if(local.endItemPart.getLocIdr() NEQ "" && isNumeric(actionTaken.getCodeValue()) && (actionTaken.getCodeValue() GTE 0) && (actionTaken.getCodeValue() LTE 9)){               		
		               		createNrtsJob(local.event, local.result, local.labor, arguments.workedPart);
		               }
	               }
	                TransactionCommit();
	                return local.result;
                
                
            } catch (any e) {
            	TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            }
        }
    }
    
    private any function createNrtsJob(Event event, Repair repair, Labor labor, LaborPart laborPart){
    	var eventService = application.objectFactory.create("EventService");
        var repairService = application.objectFactory.create("RepairService");
    	var laborPartService = application.objectFactory.create("LaborPartService");
        var laborService = application.objectFactory.create("LaborService");
        
        var assetService = APPLICATION.objectFactory.create("AssetService");
        var partService = APPLICATION.objectFactory.create("PartListService");   

		transaction {
    	try{
    		local.nrtsEvent = Duplicate(arguments.event);
       		local.nrtsRepair = Duplicate(arguments.repair);
       		local.nrtsLabor = Duplicate(arguments.labor);
       		local.nrtsLaborPart = Duplicate(arguments.laborPart);
       		
       		// Event	
       		local.nrtsEvent.setEventId("");
       		local.nrtsEvent.setStartJob("");
       		local.asset = local.assetService.getAsset(local.nrtsEvent.getAssetId());
			local.part = local.partService.getPartList(local.asset.getPartnoId());
			
        	local.newJobIdService = application.objectFactory.create("NewJobIdService");
       		local.newJobId = local.newJobIdService.getNewJobId(application.sessionManager.getProgramSetting(),local.part.getLocIdr());        					
       		local.nrtsEvent.setJobNo(local.newJobId);
       		local.nrtsEvent.setLocId(local.part.getLocIdr());
       		local.nrtsEvent.setOldJob(arguments.event.getEventId());
	        local.nrtsEvent.setInsBy(application.sessionManager.getUserName());
	        local.nrtsEvent.setInsDate(Now());
	        local.nrtsEvent.setChgBy(application.sessionManager.getUserName());
	        local.nrtsEvent.setChgDate(Now());
	        local.newEvent = local.eventService.createEvent(local.nrtsEvent);
	        
	        // Repair
	        local.nrtsRepair.setRepairId("");
			local.nrtsRepair.setStartDate("");
			local.nrtsRepair.setRepairSeq("1");
	        local.nrtsRepair.setEventId(local.newEvent.getEventId());
	        local.nrtsRepair.setInsBy(application.sessionManager.getUserName());
	        local.nrtsRepair.setInsDate(Now());
	        local.nrtsRepair.setChgBy(application.sessionManager.getUserName());
	        local.nrtsRepair.setChgDate(Now());	        
            local.newRepair = local.repairService.createRepair(local.nrtsRepair);
            
            // Labor
            local.nrtsLabor.setLaborId("");
        	local.nrtsLabor.setLaborSeq("1");
            local.nrtsLabor.setRepairId(local.newRepair.getRepairId());
            local.nrtsLabor.setInsBy(application.sessionManager.getUserName());
	        local.nrtsLabor.setInsDate(Now());
	        local.nrtsLabor.setChgBy(application.sessionManager.getUserName());
	        local.nrtsLabor.setChgDate(Now());
	        local.newLabor = local.laborService.createLabor(local.nrtsLabor);
	        
	        
	        // Labor Part
	        // If no Part Worked is selected ignore
	        if(arguments.laborpart.getassetid() NEQ ""){
		        local.nrtsLaborPart.setLaborPartId("");
		        local.nrtsLaborPart.setLaborId(local.newLabor.getLaborId());
		        local.nrtsLaborPart.setInsBy(application.sessionManager.getUserName());
		        local.nrtsLaborPart.setInsDate(Now());
		        local.nrtsLaborPart = local.laborPartService.createLaborPart(local.nrtsLaborPart);
	        }
             
            TransactionCommit();   
    	}catch (any e){
            TransactionRollback();
        	throw(type="CreateException", message=e.message, detail=e.detail);
    	}
    	}
    }
    
    private any function findNhaInBom(required any endItemAssetId, required any installedPartnoId){
    	
    	dbUtils = application.objectFactory.create("DBUtils");
    	assetService = APPLICATION.objectFactory.create("AssetService");
    	asset = assetService.getAsset(ARGUMENTS.endItemAssetId);
    	
		/*partService = APPLICATION.objectFactory.create("PartListService");
		part = partService.getPartList(ARGUMENTS.parPartnoId);*/
    	
    	
    	try{
    		local.queryService = new query();
			local.queryService.setName("myQuery");
			local.queryService.setDBType("query");
			local.queryService.setAttributes(sourceQuery=dbUtils.getAssetConfig(ARGUMENTS.endItemAssetId).res);
			local.objQueryResult = local.queryService.execute(sql="SELECT partno_p FROM sourceQuery WHERE partno_c=#ARGUMENTS.installedPartnoId# ");
			local.queryResult = local.objQueryResult.getResult();
			local.queryResultList = ValueList(local.queryResult.PARTNO_P);
			
			// If the 'endItemAsset' PartNo configuration was not found, return the 'endItemAsset' to be used for the NHA
			if(ListLen(local.queryResultList) EQ 0){				
				parAsset = asset;	
				return parAsset; 
			}
					
			local.objQueryResult2 = local.queryService.execute(sql="SELECT * FROM sourceQuery WHERE partno_C IN (#local.queryResultList#) AND ASSET_ID IS NOT NULL ");
			local.queryResult2 = local.objQueryResult2.getResult();	

			if(listcontains(local.queryResultList,asset.getPartnoId())){
				parAsset = asset;	
				return parAsset;
			}else if(local.queryResult2.asset_id EQ ""){
				throw(type="ConfigException", message="ERROR: #asset.getSerno()# does not have an asset configured for part number #queryResult2.partno#. " , detail="");
			}else{
				parAsset = assetService.getAsset(local.queryResult2.asset_id);
				return parAsset;
			}
			
    	}catch(ConfigException e){
    		throw(type="ConfigException", message=e.message, detail=e.detail);
    		 
    	}
    	
    	return assetId;
    }
    
    private struct function populateImpulsForm(required any assetId, required any statusCd){
    	/* TODO create implus form struct */
    	
        var invAssetService = APPLICATION.objectFactory.create("InvAssetsService");
        utilities = new utilities();
    	var local.asset = local.invAssetService.getInvAssets(arguments.assetId);   	/* TODO Return InvAsset Model */
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
        local.impulsForm['sentBy'] = utilities.getUser();
        local.impulsForm['serno'] = asset.getSerno();
        local.impulsForm['initialStatus'] =  asset.getStatus();
        local.impulsForm['status'] = arguments.statusCd;
        
    	return local.impulsForm;
    }
    
    
     /* Create Repair */
    public Repair function createRepairUID(required Repair repair, required Labor labor, LaborPart laborPart){
        var repairService = application.objectFactory.create("RepairService");
        var laborService = application.objectFactory.create("LaborService");
        var laborPartService = application.objectFactory.create("LaborPartService");

        
        transaction {
            try {
               // validateRepair(arguments.repair);
                local.result = local.repairService.createRepair(arguments.repair);
                arguments.labor.setRepairId(local.result.getRepairId());
                
                validateLabor(arguments.labor);                
                local.labor = local.laborService.createLabor(arguments.labor);
                
                arguments.laborPart.setLaborId(local.labor.getLaborId());        
                local.laborPart = local.laborpartService.createLaborPart(arguments.laborPart);	
               
                
                
                TransactionCommit();
                return local.result;
            } catch (any e) {
            	TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            }
        }
    }
    
     /* Create Repair */
     // WO 4767 Create a Depot job but don't include labor_part entry from orignal removal action
    public Repair function createDepotRepairUID(required Repair repair, required Labor labor){
        var repairService = application.objectFactory.create("RepairService");
        var laborService = application.objectFactory.create("LaborService");
        //var laborPartService = application.objectFactory.create("LaborPartService");

        
        transaction {
            try {
               // validateRepair(arguments.repair);
                local.result = local.repairService.createRepair(arguments.repair);
                arguments.labor.setRepairId(local.result.getRepairId());
                
                validateLabor(arguments.labor);                
                local.labor = local.laborService.createLabor(arguments.labor);
                
                //arguments.laborPart.setLaborId(local.labor.getLaborId());        
                //local.laborPart = local.laborpartService.createLaborPart(arguments.laborPart);	
               
                
                
                TransactionCommit();
                return local.result;
            } catch (any e) {
            	TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            }
        }
    }
    
    public any function deleteRepair(repair, labor) {
    	dbUtils = application.objectFactory.create("DBUtils");
    	var testFailedService = application.objectFactory.create("TestFailedService");
    	var attachmentsService = application.objectFactory.create("AttachmentsService");
    	var assetInspectionService = application.objectFactory.create("AssetInspectionService");
    	var laborPartService = application.objectFactory.create("LaborPartService");
    	var repairService = application.objectFactory.create("RepairService");
        var laborService = application.objectFactory.create("LaborService");
        var laborBitPcService = application.objectFactory.create("LaborBitPcService");
    	var sruOrderService = application.objectFactory.create("SruOrderService");    
    	var tctoService = application.objectFactory.create("TctoService");
    	var tctoAssetService = application.objectFactory.create("TctoAssetService");
    	
    	 transaction {
            try {            	
            		local.testFailed = dbUtils.getTestFailedByLaborId(arguments.labor);
            		if (local.testFailed.recordcount GT 0) {
            			for(i = 1; i LTE local.testFailed.recordcount; i = i + 1) {
    						local.testFailedDelete = local.testFailedService.deleteTestFailed(local.testFailed.test_fail_id[i]);
    					}
            		}
            			
            		local.nextPmiExist = dbUtils.searchAssetInspectionByRepairId(arguments.repair);
            		if (StructKeyExists(local.nextPmiExist, "assetId")) {
            			if (local.nextPmiExist.recordcount GT 0){
            				// delete nextPmi record
            				for(i = 1; i LTE local.nextPmiExist.recordcount; i = i + 1) {
    							local.nextPmiExistDelete = local.assetInspectionService.deleteAssetInspection(local.nextPmiExist.hist_id[i]);
    						}
            			}
            		}
            		
            		local.attachments = dbUtils.getAttachmentsByRepairId(arguments.repair);
            		if (local.attachments.recordcount GT 0) {
            			// delete attachment records
            			for(i = 1; i LTE local.attachments.recordcount; i = i + 1) {
    						local.attachmentsDelete = local.attachmentsService.deleteAttachments(local.attachments.attId[i]);
    					}
            		}
            		            		           		
            		local.PartExist = dbUtils.searchPartLabor(arguments.labor, "%");
            		if (StructKeyExists(local.PartExist, "assetId")){
            			if (local.PartExist.recordcount GT 0){
            				// delete Part Labor
            				for(i = 1; i LTE local.PartExist.recordcount; i = i + 1) {
    							local.PartExistDelete = local.laborPartService.deleteLaborPart(local.PartExist.laborPartId[i]);
    						}
            			}
            		}
            		
            		local.laborBitPc = dbUtils.getLaborBitPcByLaborId(arguments.labor);
            		if (local.laborBitPc.recordcount GT 0) {
            			// delete labor bit pc records
            			for(i = 1; i LTE local.laborBitPc.recordcount; i = i + 1) {
    						local.laborBitPcDelete = local.laborBitPcService.deleteLaborBitPc(local.laborBitPc.LABOR_BIT_ID[i]);
    					}
            		}
            		
            		local.sruOrder = dbUtils.getSruOrderByRepairId(arguments.repair);
            		if(local.sruOrder.recordcount GT 0){
            			for(i = 1; i LTE local.sruOrder.recordcount; i = i + 1) {
    						local.sruOrderDelete = local.sruOrderService.deleteSruOrder(local.sruOrder.ORDER_ID[i]);
    					}
            		}
            		
            		
            		local.laborRepair = dbUtils.getLaborByRepairId(arguments.repair);
            		if(local.laborRepair.recordcount GT 0){
            			for(i = 1; i LTE local.laborRepair.recordcount; i = i + 1) {
    						local.laborRepairDelete = local.laborService.deleteLabor(local.laborRepair.LABOR_ID[i]);
    					}
            		}
            		
            		local.tcto = dbUtils.getTctoByRepairId(arguments.repair);
            		if(local.tcto.recordcount GT 0){
            			for(i = 1; i LTE local.tcto.recordcount; i = i + 1) {
    						local.tctoDelete = local.tctoAssetService.deleteTctoAsset(local.tcto.TCTO_ID[i], local.tcto.ASSET_ID[i]);
    					}
            		}
            		
            		
            		
            		//local.labor = local.laborService.deleteLabor(arguments.labor);
            		local.repair = local.repairService.deleteRepair(arguments.repair);
            	
            	TransactionCommit();
            } catch (any e) {
            	TransactionRollback();
                throw(type="DeleteException", message=e.message, detail=e.detail);
            }
         }
    }
    
    public any function deleteMeterHist(required meterId){
    	var meterHistService = application.objectFactory.create("MeterHistService");
    	
    	 try {
    	 	local.deleteMeter = local.meterHistService.deleteMeterHist(arguments.meterId);
    	 } catch (any e) {
            	TransactionRollback();
                throw(type="DeleteException", message=e.message, detail=e.detail);
            }
    }
    
    public any function deleteCfgMeter(required assetId, required eventId){
    	var cfgMeterService = application.objectFactory.create("CfgMetersService");
    	
    	try {
    		local.deleteCfgMeter = local.cfgMeterService.deleteEventMeter(arguments.assetId, arguments.eventId);
    	} catch (any e) {
            	TransactionRollback();
                throw(type="DeleteException", message=e.message, detail=e.detail);
            }
    }
    
    /* public any function deleteRepair(repair, labor) {
    	dbUtils = application.objectFactory.create("DBUtils");
    	var testFailedService = application.objectFactory.create("TestFailedService");
    	var attachmentsService = application.objectFactory.create("AttachmentsService");
    	var assetInspectionService = application.objectFactory.create("AssetInspectionService");
    	var laborPartService = application.objectFactory.create("LaborPartService");
    	var repairService = application.objectFactory.create("RepairService");
        var laborService = application.objectFactory.create("LaborService");
    	
    	 transaction {
            try {            	
            		local.testFailed = dbUtils.getTestFailedByLaborId(arguments.labor);
            		if (local.testFailed.recordcount GT 0) {
            			for(i = 1; i LTE local.testFailed.recordcount; i = i + 1) {
    						local.testFailedDelete = local.testFailedService.deleteTestFailed(local.testFailed.test_fail_id[i]);
    					}
            		}
            			
            		local.nextPmiExist = dbUtils.searchAssetInspectionByRepairId(arguments.repair);
            		if (StructKeyExists(local.nextPmiExist, "assetId")) {
            			if (local.nextPmiExist.recordcount GT 0){
            				// delete nextPmi record
            				for(i = 1; i LTE local.nextPmiExist.recordcount; i = i + 1) {
    							local.nextPmiExistDelete = local.assetInspectionService.deleteAssetInspection(local.nextPmiExist.hist_id[i]);
    						}
            			} 
            		}
            		
            		local.attachments = dbUtils.getAttachmentsByRepairId(arguments.repair);
            		if (local.attachments.recordcount GT 0) {
            			// delete attachment records
            			for(i = 1; i LTE local.attachments.recordcount; i = i + 1) {
    						local.attachmentsDelete = local.attachmentsService.deleteAttachments(local.attachments.attId[i]);
    					}
            		}
            		            		           		
            		local.PartExist = dbUtils.searchPartLabor(arguments.labor, "%");
            		if (StructKeyExists(local.PartExist, "assetId")){
            			if (local.PartExist.recordcount GT 0){
            				// delete Part Labor
            				for(i = 1; i LTE local.PartExist.recordcount; i = i + 1) {
    							local.PartExistDelete = local.laborPartService.deleteLaborPart(local.PartExist.laborPartId[i]);
    						}
            			}
            		}
            		
            		local.labor = local.laborService.deleteLabor(arguments.labor);
            		local.repair = local.repairService.deleteRepair(arguments.repair);            		
            	
            	TransactionCommit();
            } catch (any e) {
            	TransactionRollback();
                throw(type="DeleteException", message=e.message, detail=e.detail);
            }
         }
    }*/
    
   /* public any function deleteMeterHist(required meterId){
    	var meterHistService = application.objectFactory.create("MeterHistService");
    	
    	 try {
    	 	local.deleteMeter = local.meterHistService.deleteMeterHist(arguments.meterId);
    	 } catch (any e) {
            	TransactionRollback();
                throw(type="DeleteException", message=e.message, detail=e.detail);
            }
    }*/
    
   /* public any function deleteCfgMeter(required assetId, required eventId){
    	var cfgMeterService = application.objectFactory.create("CfgMetersService");
    	
    	try {
    		local.deleteCfgMeter = local.cfgMeterService.deleteEventMeter(arguments.assetId, arguments.eventId);
    	} catch (any e) {
            	TransactionRollback();
                throw(type="DeleteException", message=e.message, detail=e.detail);
            }
    }*/
    
    public Array function insertAttachment(required Array attachment) {
    	var attachmentsService = application.objectFactory.create("AttachmentsService");
    	
    	//
    	for(i = 1; i LTE ArrayLen(arguments.attachment); i = i + 1) {
    		
    		local.attachmentsService.createAttachments(arguments.attachment[i]);
    		};
    	
    	return arguments.attachment;
    }
    
    public AssetInspection function insertPmi(required AssetInspection pmi) {
    	var assetInspectionService = application.objectFactory.create("AssetInspectionService");
    	
    	local.results = local.assetInspectionService.createAssetInspection(arguments.pmi);
    	
    	return local.results;
    }
    
        
    public Event function insertNextPmi(required Event event, required Repair repair, required Labor labor, required AssetInspection assetInspection) {
    	var eventService = application.objectFactory.create("EventService");
    	var repairService = application.objectFactory.create("RepairService");
    	var laborService = application.objectFactory.create("LaborService");
    	var assetInspectionService = application.objectFactory.create("AssetInspectionService");
    	
    	/* validate Event related objects before insert */
        //validateEvent(arguments.event);	
        
        transaction {
            try {     
            	
            	local.eventResult = local.eventService.createEvent(arguments.event);
            	arguments.repair.setEventId(local.eventResult.getEventId());
            	validateRepair(arguments.repair);
            	local.repairResult = local.repairService.createRepair(arguments.repair);
            	arguments.assetInspection.setAssetId(local.repairResult.getAssetId());
            	arguments.assetInspection.setRepairId(local.repairResult.getRepairId());
            	arguments.labor.setRepairId(local.repairResult.getRepairId());
            	local.laborResult = local.laborService.createLabor(arguments.labor);
            	local.assetInspectionResult = local.assetInspectionService.createAssetInspection(arguments.assetInspection);
            	
                TransactionCommit();
                return local.eventResult;
            } catch (any e) {
            	TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            }
        }
    }
    
    public AssetInspection function updatePmi(required AssetInspection pmi) {
    	var assetInspectionService = application.objectFactory.create("AssetInspectionService");
    	
    	local.results = local.assetInspectionService.updateAssetInspection(arguments.pmi);
    	
    	return local.results;
    }
    
    
    public Array function insertTestFailed(required Array failTest) {
    	var testFailedService = application.objectFactory.create("TestFailedService");
    	
    	//
    	for(i = 1; i LTE ArrayLen(arguments.failTest); i = i + 1) {
    		
    		//validateTestFailed(arguments.failTest[i]);
    		local.testFailedService.createTestFailed(arguments.failTest[i]);
    		};
    	
    	return arguments.failTest;
    }
    
    public TctoAsset function insertTctoAsset(required TctoAsset tctoAsset, required Tcto tcto) {
    	var tctoAssetService = application.objectFactory.create("TctoAssetService");
    	var tctoService = application.objectFactory.create("TctoService");
    	
    	local.exist = local.tctoAssetService.getTctoAssetByRepairId(arguments.tctoAsset.getRepairId());
    	
    	if (local.exist.getTctoId() NEQ "")
    	{
    		try { 		
    		local.results = local.tctoAssetService.updateTctoAssetByRepairId(arguments.tctoAsset);
            } catch (any e) {
            	local.results = arguments.tctoAsset;
            }  
    	} else {
    		local.results = local.tctoAssetService.createTctoAsset(arguments.tctoAsset);
    	}
    	
    	local.TctoResults = local.tctoService.updateTcto(arguments.tcto);
    	
    	return local.results;
    }
    
    public function deleteTestFailed(required failTest) {
    	var testFailedService = application.objectFactory.create("TestFailedService");
    	
    	for(i = 1; i LTE ListLen(arguments.failTest); i = i + 1) {
    		local.testFailedService.deleteTestFailed(listgetat(arguments.failTest, i));
    		};
    }
    
    public SruOrder function createPartOrder(required partOrdered) {
    	var sruOrderService = application.objectFactory.create("SruOrderService");    	
    	
    	transaction {
            try {
            	//validatePartOrdred(arguments.partOrdered);
            	local.result = local.sruOrderService.createSruOrder(arguments.partOrdered);
            	
            	TransactionCommit();
                return local.result;
            } catch (any e) {
            	TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            }
       }  
    }    
    
    public any function acknowledgePartOrder(required any orderId, required remAssetId) {
    	var sruOrderService = application.objectFactory.create("SruOrderService");
    	var assetService = application.objectFactory.create("AssetService");
    	
    	transaction {
            try {
            	local.sruOrder = local.sruOrderService.getSruOrder(arguments.orderId);
            	local.sruOrder.setAcknowledgeDate(Now());
            	local.result = local.sruOrderService.updateSruOrder(local.sruOrder);
            	
		        var dbUtils = application.objectFactory.create('DbUtils');
		        isNSP = dbUtils.isNSP(arguments.remAssetID);     
		        
            	// Only update ASSET table if part IS NOT an NSP
            	if(NOT isNSP.recordcount GT 0){
	            	local.asset = local.assetService.getAsset(arguments.remAssetID);            	
	            	//local.asset.setRecvDate(Now());
	            	local.asset.setInTransit('N');
	            	local.asset.setChgBy(application.sessionManager.getUserName());
	        		local.asset.setChgDate(Now());
	        		local.assetService.updateAsset(local.asset);
        		}		                	
            	
            	TransactionCommit();
                return local.result;
                
            } catch (any e) {
            	TransactionRollback();
            	throw(type="CreateException", message=e.message, detail=e.detail);
            }
       }             
    }
    
    public any function acknowledgeSruRecv(required any orderId) {
    	var sruOrderService = application.objectFactory.create("SruOrderService");
    	var assetService = application.objectFactory.create("AssetService");
    	transaction {
            try {
            	local.sruOrder = local.sruOrderService.getSruOrder(arguments.orderId);
            	local.sruOrder.setReplSruRecvDate(Now());
            	local.result = local.sruOrderService.updateSruOrder(local.sruOrder);
            	
            	// Update inbound asset record
            	
		    	// Determine if the specified asset is a NSP
		        var dbUtils = application.objectFactory.create('DbUtils');
		        isNSP = dbUtils.isNSP(local.sruOrder.getAssetId());              	
            	
            	// Only update ASSET table if part IS NOT an NSP
            	if(NOT isNSP.recordcount GT 0){
	            	local.asset = local.assetService.getAsset(local.sruOrder.getAssetId());            	
	            	local.asset.setRecvDate(Now());
	            	local.asset.setInTransit('N');
	            	local.asset.setChgBy(application.sessionManager.getUserName());
	        		local.asset.setChgDate(Now());
	        		local.assetService.updateAsset(local.asset);
        		}
        		
            	TransactionCommit();
                return local.result;
            } catch (any e) {
            	TransactionRollback();
            	throw(type="CreateException", message=e.message, detail=e.detail);
            }
       }  
    }
    
    public any function fillPartOrder(required orderId, required repAssetId) {
    	var sruOrderService = application.objectFactory.create("SruOrderService");
        var dbUtils = application.objectFactory.create('DbUtils');
    	var assetService = application.objectFactory.create("AssetService");
    	
    	transaction {
            try {
		        isNSP = dbUtils.isNSP(arguments.repAssetId);              	
            	
            	// Only update ASSET table if part IS NOT an NSP
            	if(NOT isNSP.recordcount GT 0){
	            	local.asset = local.assetService.getAsset(arguments.repAssetId);           	
	            	local.asset.setTcn("");          	
	            	local.asset.setShipper("");             	
	            	local.asset.setShipDate("");        	
	            	local.asset.setRecvDate("");
	            	local.asset.setInTransit('N');
	            	local.asset.setChgBy(application.sessionManager.getUserName());
	        		local.asset.setChgDate(Now());
	        		local.assetService.updateAsset(local.asset);
        		}
        		
            	local.sruOrder = local.sruOrderService.getSruOrder(arguments.orderId);
            	local.sruOrder.setAssetId(arguments.repAssetId);
            	//local.sruOrder.setFillDate(Now());
            	local.result = local.sruOrderService.updateSruOrder(local.sruOrder);
            	
            	TransactionCommit();
                return local.result;
            } catch (any e) {
            	TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            }
       }  
    }
    
    public SruOrder function sruShipPart(required  SruOrder  sruOrder) {
    	var sruOrderService = application.objectFactory.create("SruOrderService");
    	transaction {
            try {
        		local.result = local.sruOrderService.updateSruOrder(arguments.sruOrder);
        		
        		return local.result;
            } catch (any e) {
            	TransactionRollback();
            	throw(type="CreateException", message=e.message, detail=e.detail);
            }
       }  
            	
    }
    
    public any function shipPartOrder(required  assetId, required  shipper, required  tcn, required shipDate, required locId) {
    	var assetService = application.objectFactory.create("AssetService");
    	
    	transaction {
            try {
            	local.asset = local.assetService.getAsset(arguments.assetId);
            	local.asset.setShipper(arguments.shipper);
            	local.asset.setTcn(arguments.tcn);
            	local.asset.setShipDate(arguments.shipDate);
            	local.asset.setRecvDate('');
            	local.asset.setInTransit('Y');
            	local.asset.setLocIdc(arguments.locId);
            	local.asset.setChgBy(application.sessionManager.getUserName());
        		local.asset.setChgDate(Now());
        		local.result = local.assetService.updateAsset(local.asset);
            } catch (any e) {
            	TransactionRollback();
            	throw(type="CreateException", message=e.message, detail=e.detail);
            }
       }  
            	
    }
    
   /* public any function shipPartRequest(required  assetId, required  shipper, required  tcn, required shipDate, required locId) {
    	var assetService = application.objectFactory.create("AssetService");
    	
    	transaction {
            try {
            	local.asset = local.assetService.getAsset(arguments.assetId);
            	local.asset.setShipper(arguments.shipper);
            	local.asset.setTcn(arguments.tcn);
            	local.asset.setShipDate(arguments.shipDate);
            	local.asset.setRecvDate('');
            	local.asset.setInTransit('Y');
            	local.asset.setLocIdc(arguments.locId);
            	local.asset.setChgBy(application.sessionManager.getUserName());
        		local.asset.setChgDate(Now());
        		local.result = local.assetService.updateAsset(local.asset);
            } catch (any e) {
            	TransactionRollback();
            	throw(type="CreateException", message=e.message, detail=e.detail);
            }
       }  
            	
    }  */  
    
    public Repair function updateRepair(required Repair repair, required Labor labor, required LaborBitPc laborBitPc, required LaborPart workedPart, required LaborPart removedPart, required LaborPart installedPart) {
        var eventService = application.objectFactory.create("EventService");
       	var repairService = application.objectFactory.create("RepairService");
        var laborService = application.objectFactory.create("LaborService");
        var laborBitPcService = application.objectFactory.create("LaborBitPcService");
        var laborPartService = application.objectFactory.create("LaborPartService");
		var assetService = application.objectFactory.create("AssetService");
		var codeService = APPLICATION.objectFactory.create("CodeService");
		var invAssetService = APPLICATION.objectFactory.create("InvAssetsService");
		var partService = APPLICATION.objectFactory.create("PartListService");
		//var attachmentsService = application.objectFactory.create("AttachmentsService");
		
		dbUtils = application.objectFactory.create("DBUtils");
		
        local.event = local.eventService.getEvent(val(arguments.repair.getEventId()));  
        
        if((arguments.workedPart.getAssetId() NEQ "") OR (arguments.removedPart.getAssetId() NEQ "")){
			if(arguments.workedPart.getAssetId() NEQ ""){
				arguments.repair.setAssetId(arguments.workedPart.getAssetId());
			} else {
				arguments.repair.setAssetId(arguments.removedPart.getAssetId());
			}			
		} 
        
        transaction {
            try {
            	validateRepair(arguments.repair);
                validateRepairUpdate(arguments.repair);
                
                local.result = local.repairService.updateRepair(arguments.repair);
                arguments.labor.setRepairId(local.result.getRepairId());

		        validateLabor(arguments.labor);                
                validateLaborUpdate(arguments.labor);
                local.labor = local.laborService.updateLabor(arguments.labor);
                
                
                //arguments.laborBitPc.setLaborId(local.labor.getLaborId());
                
		        //validateBitPc(arguments.laborBitPc);
		        //local.laborBitPcService.createLaborBitPc(arguments.laborBitPc);
		        
		        //if(arguments.workedPart.getAssetId() NEQ ""){
		        //	local.laborPartService.createLaborPart(arguments.workedPart);
		        //}

                //If a part is being removed AND another part is NOT being installed
                if(arguments.removedPart.getAssetId() NEQ "" and arguments.installedPart.getAssetId() EQ ""){
                	local.LaborPartExistResult = dbUtils.searchPartLabor(arguments.removedPart.getLaborId(), arguments.removedPart.getPartAction());
                	
                	if (local.LaborPartExistResult.recordcount GT 0) {
                		if (local.LaborPartExistResult.assetId NEQ arguments.removedPart.getAssetId()) {
					     	throw(type="CreateException", message="An SRA has already been removed per this Maintenance Detail.  If the wrong SRA was removed please contact RIMSS application administrator.");
					    }
					} else {
						 local.laborPartService.createLaborPart(arguments.removedPart);
						 
						 local.code = local.codeService.findByCodeTypeCodeValue("STATUS", "NMCM");
						 
						 local.removedAsset = local.assetService.getAsset(arguments.removedPart.getAssetId());
						 local.part = local.partService.getPartList(local.removedAsset.getPartnoId());
						 if(local.removedAsset.getCtAssetId() GT 0){
						 	 local.invAsset = local.invAssetService.getInvAssets(local.asset.getCtAssetId());
						 }						 
						 
						 local.removedAsset.setStatusCd(local.code.getCodeId());
						 local.removedAsset.setChgBy(arguments.removedPart.getInsBy());
				         local.removedAsset.setNHAAssetID('');
				         local.assetService.updateAsset(local.removedAsset);
				         
				         if(local.removedAsset.getCtAssetId() GT 0){
				         	local.invAsset.setStatus(local.code.getCtCodeId());
				         	local.invAssetService.updateInvAssets(local.invAsset); 
				         }
				           
                    // need to create a DRS job for the maintenance 
                    if (local.part.getLocIdr() NEQ ""){
                    	
                			validateLaborPart(arguments.removedPart);
                    		writeLog(file="ACTS" text="Depot Location - #local.part.getLocIdr()#");	
                    		local.maintenanceController = new maintenanceController();
                    		local.maintenanceController.insertDepotEvent(local.removedAsset.getAssetId(), local.part.getLocIdr(), arguments.repair, arguments.removedPart); 
                    		
                    	} else {
                    		writeLog(file="ACTS" text="The part you are working with does not have a Depot Location associated");
                    	}
                    	
					}
                }
                
                if(arguments.workedPart.getAssetId() NEQ ""){
                	local.LaborPartWorkedExistResult = dbUtils.searchPartLabor(arguments.workedPart.getLaborId(), arguments.workedPart.getPartAction());
                	
                	if (local.LaborPartWorkedExistResult.recordcount GT 0) {
                		if (local.LaborPartWorkedExistResult.assetId NEQ arguments.workedPart.getAssetId()) {
					     	throw(type="CreateException", message="An SRA has already been worked per this Maintenance Detail.  If the wrong SRA was worked please contact RIMSS application administrator.");
					    }
					} else {
						 local.laborPartService.createLaborPart(arguments.workedPart);
					}
                }
                
                if(arguments.installedPart.getAssetId() NEQ "" and arguments.removedPart.getAssetId() EQ ""){
                	local.LaborPartInstalledExistResult = dbUtils.searchPartLabor(arguments.installedPart.getLaborId(), arguments.installedPart.getPartAction());
                	
                	if (local.LaborPartInstalledExistResult.recordcount GT 0) {
                		 if (local.LaborPartInstalledExistResult.assetId NEQ arguments.installedPart.getAssetId()) {
					     	throw(type="CreateException", message="An SRA has already been installed per this Maintenance Detail.  If the wrong SRA was installed please contact RIMSS application administrator.");
					     }
					} else {
						  	  	local.laborPartService.createLaborPart(arguments.installedPart);
						  	  	
                    			var local.installedAssetService = APPLICATION.objectFactory.create("AssetService");
                                                            	
                    			local.installedAsset = local.installedAssetService.getAsset(arguments.installedPart.getAssetId());
                    			local.installedAsset.setChgBy(application.sessionManager.getUserName());
        						local.installedAsset.setChgDate(Now());          
								/*local.installedAsset.setNHAAssetID(ARGUMENTS.repair.getAssetId());*/
								
								local.installedAsset.setNHAAssetID(findNhaInBom(ARGUMENTS.repair.getAssetId(), local.installedAsset.getPartnoId()).getAssetId());

								
								if (local.installedAsset.getInTransit() EQ "Y") {
									local.installedAsset.setInTransit('N');
									local.installedAsset.setRecvDate(Now()); 	
								}
				    			local.installedAssetService.updateAsset(local.installedAsset); 
                    	  
					}
                }
                
                // REMOVE and INSTALL
                if(arguments.installedPart.getAssetId() NEQ "" and arguments.removedPart.getAssetId() NEQ ""){
                	
                	local.LaborPartRemovedExistResult = dbUtils.searchPartLabor(arguments.removedPart.getLaborId(), arguments.removedPart.getPartAction());
                	local.LaborPartInstalledExistResult = dbUtils.searchPartLabor(arguments.installedPart.getLaborId(), arguments.installedPart.getPartAction());
                	
                	if (local.LaborPartRemovedExistResult.recordcount EQ 0 or local.LaborPartInstalledExistResult.recordcount EQ 0)
                	{
                		if(local.LaborPartRemovedExistResult.recordcount EQ 0){
                			local.laborPartService.createLaborPart(arguments.removedPart);
                			
                			var local.codeService = APPLICATION.objectFactory.create("CodeService");
                			var local.invAssetService = APPLICATION.objectFactory.create("InvAssetsService");
                			
                			local.code = local.codeService.findByCodeTypeCodeValue("STATUS", "NMCM");
						 
						    local.removedAsset = local.assetService.getAsset(arguments.removedPart.getAssetId());
						    local.part = local.partService.getPartList(local.removedAsset.getPartnoId());
						    if(local.removedAsset.getCtAssetId() GT 0){
						 	 		local.invAsset = local.invAssetService.getInvAssets(local.removedAsset.getCtAssetId());
						 	}
						 	
				            local.removedAsset.setStatusCd(local.code.getCodeId());
				            local.removedAsset.setChgBy(arguments.removedPart.getInsBy());
				            local.removedAsset.setNHAAssetID('');
				            local.assetService.updateAsset(local.removedAsset);
				            
				            if(local.removedAsset.getCtAssetId() GT 0){
				         		local.invAsset.setStatus(local.code.getCtCodeId());
				         		local.invAssetService.updateInvAssets(local.invAsset); 
				         	}
                			 
                   
                    		// need to create a DRS job for the maintenance 
                    		if (local.part.getLocIdr() NEQ ""){
                				validateLaborPart(arguments.removedPart);
	                    		writeLog(file="ACTS" text="Depot Location - #local.part.getLocIdr()#");	
	                    		local.maintenanceController = new maintenanceController();
	                    		local.maintenanceController.insertDepotEvent(local.removedAsset.getAssetId(), local.part.getLocIdr(), arguments.repair, arguments.removedPart); 
	                    		
	                    	} else {
	                    		writeLog(file="ACTS" text="The part you are working with does not have a Depot Location associated");
	                    	}                   		
                    
                		}
                		
                		if(local.LaborPartInstalledExistResult.recordcount EQ 0){
                			local.laborPartService.createLaborPart(arguments.installedPart);
                			 var local.installedAssetService = APPLICATION.objectFactory.create("AssetService");
                                                            	
                    		 local.installedAsset = local.installedAssetService.getAsset(arguments.installedPart.getAssetId());
                    		 local.installedAsset.setChgBy(arguments.installedPart.getInsBy());
                    		 local.installedAsset.setChgDate(Now());
							 /*local.installedAsset.setNHAAssetID(local.event.getAssetId());*/
							 
							 local.installedAsset.setNHAAssetID(findNhaInBom(local.event.getAssetId(), local.installedAsset.getPartnoId()).getAssetId());

				    		 
							 if (local.installedAsset.getInTransit() EQ "Y") {
								local.installedAsset.setInTransit('N');
								local.installedAsset.setRecvDate(Now()); 	
							 }
				    		 
				    		 local.installedAssetService.updateAsset(local.installedAsset);
                		}
                	} else {
                		
                		if (local.LaborPartRemovedExistResult.assetId NEQ arguments.removedPart.getAssetId() or local.LaborPartInstalledExistResult.assetId NEQ arguments.installedPart.getAssetId()) {
                			throw(type="CreateException", message="An SRA has already been removed and installed per this Maintenance Detail.  If the wrong SRA was removed and installed please contact RIMSS application administrator.");	
                		}
                		
                	}
                	
                }
                
                local.result = arguments.repair;
                TransactionCommit();
                return local.result;
            } catch (any e) {
            	TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            }
       } 
   }
    
    
    
    private void function validateAsset(required any asset){
    	if(isNull(arguments.asset.getStatusCd())){
    		throw (type="MaintenanceException" message="Missing Status", detail="Please select a Status.");
    	}
    	
    }

    /* Validate Event Object */
    private void function validateEvent(required Event event) {
        arguments.event.validate();
        dbUtils = application.objectFactory.create("DBUtils");
        
        if (IsNull(arguments.event.getStartJob()) or !len(trim(arguments.event.getStartJob()))) {
            throw (type="MaintenanceException" message="Missing Start Date", detail="Please enter in the Start Date");
        } else {
            if (!IsDate(arguments.event.getStartJob())) {
                throw (type="MaintenanceException" message="Invalid Start Date", detail="Please enter in a valid Start Date.");
            }
        }

        if (!IsNull(arguments.event.getStopJob()) or len(trim(arguments.event.getStopJob()))) {
        	
        	 if(len(trim(arguments.event.getStopJob())) && dbUtils.openRepairsExist(ARGUMENTS.event.getEventId())){
	        	throw (type="MaintenanceException" message="You cannot close an event that has open jobs", detail="You must first close all repairs");
	        }
		        
            if (len(trim(arguments.event.getStopJob())) && !IsDate(arguments.event.getStopJob())) {		       
                throw (type="MaintenanceException" message="Invalid Stop Date", detail="Please enter in a valid Stop Date.");
            }
            
            if (isDate(arguments.event.getStartJob()) && isDate(arguments.event.getStopJob())  && DateCompare(arguments.event.getStopJob(), arguments.event.getStartJob()) lt 0) {
                throw (type="MaintenanceException" message="Stop Date earlier than Start Date", detail="Stop Date may not be earlier than the Start Date.");
            }
        }
    }
    
    /* Validate MeterHist Object */
    private void function validateMeterHist(required MeterHist meterHist) {
        arguments.meterHist.validate();
        
        if (isNull(arguments.meterHist.getMeterIn()) or !len(trim(arguments.meterHist.getMeterIn()))) {
            throw (type="MaintenanceException" message="Missing ETM Start", detail="Please enter a value for ETM Start.");
        } else {
            if (!IsNumeric(arguments.meterHist.getMeterIn())) {
                throw (type="MaintenanceException" message="Invalid ETM Start", detail="Please enter in a valid ETM Start.");
            }
        }

        if (!IsNull(arguments.meterHist.getMeterOut()) and len(trim(arguments.meterHist.getMeterOut()))) {
            if (!IsNumeric(arguments.meterHist.getMeterOut())) {
                throw (type="MaintenanceException" message="Invalid ETM Comp [#arguments.cfgMeters.getValueOut()#]", detail="Please enter in a valid ETM Comp.");
            }
            
            if (arguments.meterHist.getChanged() neq 'Y' and lsparsenumber(arguments.meterHist.getMeterOut()) lt lsparsenumber(arguments.meterHist.getMeterIn())) {
                throw (type="MaintenanceException" message="ETM Comp is less than ETM Start1", detail="ETM Comp may not be less than the ETM Start.");
            }
        }
    }

    /* Validate CfgMeters Object */
    private void function validateCfgMeters(required CfgMeters cfgMeters) {
        arguments.cfgMeters.validate();
        
        if (isNull(arguments.cfgMeters.getValueIn()) or !len(trim(arguments.cfgMeters.getValueIn()))) {
            throw (type="MaintenanceException" message="Missing ETM Start", detail="Please enter a value for ETM Start.");
        } else {
            if (!IsNumeric(arguments.cfgMeters.getValueIn())) {
                throw (type="MaintenanceException" message="Invalid ETM Start", detail="Please enter in a valid ETM Start.");
            }
        }

        if (!IsNull(arguments.cfgMeters.getValueOut()) and len(trim(arguments.cfgMeters.getValueOut()))) {
            if (!IsNumeric(arguments.cfgMeters.getValueOut())) {
                throw (type="MaintenanceException" message="Invalid ETM Comp [#arguments.cfgMeters.getValueOut()#]", detail="Please enter in a valid ETM Comp.");
            }
            
            if (arguments.cfgMeters.getIsMeterChg() neq 'Y'  and lsparsenumber(arguments.cfgMeters.getValueOut()) lt lsparsenumber(arguments.cfgMeters.getValueIn())) {
                throw (type="MaintenanceException" message="ETM Comp is less than ETM Start2", detail="ETM Comp may not be less than the ETM Start.");
            }
        }
    }

    /* Validate Repair Object */
    private void function validateRepair(required Repair repair) {
        var event = "";
        var eventService = application.objectFactory.create("EventService");        
        arguments.repair.validate();
        event = eventService.getEvent(arguments.repair.getEventId());
        
        if (!IsNull(arguments.repair.getStopDate()) or len(trim(arguments.repair.getStopDate()))) {
            if (len(trim(arguments.repair.getStopDate())) && !IsDate(arguments.repair.getStopDate())) {
                throw (type="RepairException" message="Invalid Repair Comp Date", detail="Please enter in a valid Repair Comp Date.");
            }
            
            if (isDate(arguments.repair.getStartDate()) && isDate(arguments.repair.getStopDate())  && DateCompare(arguments.repair.getStopDate(), arguments.repair.getStartDate()) lt 0) {
                throw (type="RepairException" message="Repair Comp earlier than Repair Start", detail="Repair Comp may not be earlier than the Repair Start.");
            }
        }
    }
    
    private void function validateRepairUpdate(required Repair repair) {        
        arguments.repair.validateRepair();
    }
    
    private void function validateLabor(required Labor labor){
	   arguments.labor.validate();
	   
	   if (!IsNull(arguments.labor.getStopDate()) or len(trim(arguments.labor.getStopDate()))) {
            if (len(trim(arguments.labor.getStopDate())) && !IsDate(arguments.labor.getStopDate())) {
                throw (type="LaborException" message="Invalid Labor Comp Date", detail="Please enter in a valid Labor Comp Date.");
            }
            
            if (isDate(arguments.labor.getStartDate()) && isDate(arguments.labor.getStopDate())  && DateCompare(arguments.labor.getStopDate(), arguments.labor.getStartDate()) lt 0) {
                throw (type="LaborException" message="Labor Comp earlier than Labor Start", detail="Labor Comp may not be earlier than the Labor Start.");
            }
        }
	}
	
	private void function validateLaborPart(required LaborPart laborPart){
		arguments.laborPart.validate();
	}
	
	private void function validatePartOrdred (required SruOrder sruOrder) {
		arguments.sruOrder.validate();
	}
	
	private void function validateLaborUpdate(required Labor labor) {        
        arguments.labor.validateLabor();
    }
	
    private void function validateBitPc(required LaborBitPc laborBitPc){
    	arguments.laborBitPc.validate();
	}
	
	private void function validateTestFailed(required TestFailed failedTest){
		arguments.failedTest.validate();
	}
}