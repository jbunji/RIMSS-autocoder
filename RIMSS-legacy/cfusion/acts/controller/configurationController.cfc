import acts.bo.ConfigBO;
import cfc.facade.SessionFacade;
import cfc.facade.SessionRequestFacade;
import cfc.utils.import.importSortie;
import cfc.utils.javaLoggerProxy;
import cfc.utils.utilities;
import cfc.dao.DBUtils;
import cfc.utils.Datasource;
import cfc.model.Asset;
import cfc.model.SoftwareAsset;
import cfc.model.Attachments;


import cfc.service.AssetService;
import cfc.service.PartListService;

component  hint="Controller for Configuration processes" output="false" extends="cfc.utils.Proxy"
{
	
	property any sessionRequestFacade;



	variables.instance={
	   program = 'acts',
	   objectFactory = '',
	   sessionFacade = new SessionFacade(), 
	   sessionRequestFacade = new SessionRequestFacade(),
	   componentName = "configurationController",
	   javaLoggerProxy = new  javaLoggerProxy(),
	   dbUtils = '',
       swAsset = ""
	};
	
	
	
	
	
	public any function init(){
	   addToRequest("util",new utilities());
	   return this;	
	}
	
	
	public any function getComponentName(){
        var local = {};
        if(StructKeyexists(getMetaData(this),"name")){
           variables.instance.componentName = getMetaData(this).name;   
        }
       return variables.instance.componentName;      
    }
    
    public any function getJavaLoggerProxy(){
       return variables.instance.javaLoggerProxy;      
    }
    
    public any function getRootPath(){
       return Application.rootPath;      
    }
    
    public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
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
    
    public any function getUser(){
       return getSessionFacade().getUserName();      
    }
    
    public any function getProgram(){
    	return variables.instance.program;
    }
    
    public void function setProgram(Required String program){
    	variables.instance.program = trim(ARGUMENTS.program);
    }
    
    public any function createSwAsset(){
       variables.instance.swAsset = new SoftwareAsset();
       return variables.instance.swAsset;      
    }
    
    remote any function newConfig(Required String assetId, numeric configSet){
    	var local = {};
		local.page = getRootPath() & "/" & getProgram() & "/configuration/createConfiguration.cfm";
		/*local.qConfigs = variables.instance.dbUtils.readByAssetId(ARGUMENTS.assetId); */ 
		
		//rc.util = new utilities();
		
		try{ 
			ARGUMENTS.assetid = rc.util.decryptId(ARGUMENTS.assetId);
			if(isNumeric(ARGUMENTS.assetid) && ARGUMENTS.assetid > 0){
				
			local.assetService = APPLICATION.objectFactory.create("AssetService");
			local.partListService = APPLICATION.objectFactory.create("PartListService");
			local.codeService = APPLICATION.objectFactory.create("CodeService");
				
			rc.assetObj = local.assetService.getAsset(ARGUMENTS.assetId);
			if(isNumeric(rc.assetObj.getNHAAssetID())){
				rc.nhaassetObj = local.assetService.getAsset(rc.assetObj.getNHAAssetID());
				rc.nhaassetObj.setAssetID(rc.assetObj.getNHAAssetID());
			}else{
				rc.nhaassetObj = local.assetService.getAsset(rc.assetObj.getAssetID());
				rc.nhaassetObj.setAssetID(rc.assetObj.getAssetID());
			}
			
			rc.partListObj = local.partListService.getPartList(rc.assetObj.getPartNoId());
			rc.nhaPartListObj = local.partListService.getPartList(rc.nhaassetObj.getPartNoId());
			rc.codeObj = local.codeService.getCode(rc.nhaPartListObj.getSysType());
			rc.configSet = arguments.configSet;
		
		
			//rc.assetObj = local.assetService.getAsset(ARGUMENTS.assetId);*/
			//rc.partListObj = local.partListService.getPartList(rc.assetObj.getPartNoId());
			//rc.nhaPartListObj = local.partListService.getPartList(rc.nhaassetObj.getPartNoId());
			//rc.codeObj = local.codeService.getCode(rc.nhaPartListObj.getSysType());	
			}
			redirect(url=local.page, persist="true");
			
         }catch(any e){
       	
			getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="newConfig");
	
			request.context.errorType = e.type;
			request.context.error = e;
			redirect(url=local.page,persist=true);  
       	   
       } 
    
    }
    
    
    
    remote any function listConfig(Required String assetId){
       
       var local = {};
	   local.result = {};
	   //rc.util = new utilities();
       local.page = getRootPath() & "/" & getProgram() & "/configuration/configuration.cfm"; 
      
       try{ 
       	   local.aid = rc.util.decryptId(ARGUMENTS.assetId);
			local.assetService = APPLICATION.objectFactory.create("AssetService");
			local.partListService = APPLICATION.objectFactory.create("PartListService");
			local.codeService = APPLICATION.objectFactory.create("CodeService");
			local.qConfigs = getDBUtils().readByNhaAssetId(local.aid); 
			local.qConfigs = rc.util.addEncryptedColumn(local.qConfigs,'asset_id');
			rc.qConfigs = local.qConfigs;
			
			local.nhaAsset = local.assetService.getAsset(local.aid);
			
			if(!len(trim(local.nhaAsset.getNHAAssetID()))){
				getSessionFacade().setValue("topAssetID",local.nhaAsset.getAssetID());
			}
			
			rc.serno = local.nhaAsset.getSerno();
			rc.assetid = rc.util.encryptId(local.aid);
			rc.nhaassetid = rc.util.encryptId(local.aid);
			rc.partno = local.partListService.getPartList(local.nhaAsset.getPartNoId()).getPartNo();
			
		    getJavaLoggerProxy().info(message="Redirecting to #local.page#",sourceClass=getComponentName(), methodName="forward");
		    
		   redirect(url=local.page,persist=true);
       	   
       }catch(any e){
       	
		getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="listConfig");

		request.context.errorType = e.type;
		request.context.error = e;

		redirect(url=local.page,persist=true);  
       	   
       }
    	
        return   local.result;
    }
	
	public function editConfig(Required String assetId,Required String attId){
		
		var local = {};
		local.page = getRootPath() & "/" & getProgram() & "/configuration/editConfiguration.cfm";
		//rc.util = new utilities();
		   
		 try{ 
			local.id = rc.util.decryptId(ARGUMENTS.assetId);
			local.result = {};
			local.qConfigs = getDBUtils().readByAssetId(local.id);  
			local.assetService = APPLICATION.objectFactory.create("AssetService");
			local.partListService = APPLICATION.objectFactory.create("PartListService");
			local.codeService = APPLICATION.objectFactory.create("CodeService");
			local.qConfigs = getDBUtils().readByNhaAssetId(local.id); 	
			dbUtils = application.objectFactory.create("DBUtils");								
			
			local.getSoftware = getDBUtils().getSoftwareByAssetId(local.id);
            local.getSoftware = rc.util.addEncryptedColumn(local.getSoftware,"sw_id");
            addToRequest("qSpareSoftware",local.getSoftware);
            
			rc.assetObj = local.assetService.getAsset(local.id);
			rc.nhaassetObj = local.assetService.getAsset(rc.assetObj.getNHAAssetID());
			rc.partListObj = local.partListService.getPartList(rc.assetObj.getPartNoId());
			rc.nhaPartListObj = local.partListService.getPartList(rc.nhaassetObj.getPartNoId());
			rc.codeObj = local.codeService.getCode(rc.nhaPartListObj.getSysType());
			rc.qConfigs = local.qConfigs;
			
			//delete attachments if requested
			if(arguments.attId NEQ 0){
				deleteATT = dbUtils.deleteAtt(arguments.attId);
				//local.configBo.insertAttachment(attachment);
			}			
			
            // check to see if there are attachments for this asset
            local.attachments = dbUtils.getAttachmentsByAssetId(local.id);
            if (local.attachments.recordcount GT 0) {
              dirMgr = CreateObject("component", "cfc.utils.Directory_Mgr");
        	   dirMgr.createDir(#application.sessionManager.getUserName()#);         	
     
               addToFormRequest("qAttachments", local.attachments);             
               
               path=#ExpandPath(#application.rootpath#&'/'&#application.sessionManager.getUserName()#)#;
               //path = getTempDirectory();
               for (intRow = 1 ; intRow LTE local.attachments.RecordCount ; intRow = (intRow + 1)){
 
        			FileWrite(#path#&'/'&#UCase(local.attachments.name[intRow])#, #local.attachments.attachment[intRow]#);
        		}               
            }				
			
			//rc.topAssetID = getDBUtils().getTopLevelAssetID(ARGUMENTS.assetid);
			
			local.topID = getSessionFacade().getValue("topAssetID");
			if(!len(trim(local.topID))){
				getSessionFacade().setValue("topAssetID",getDBUtils().getTopLevelAssetID(local.id));
			}
			rc.topAssetID = getSessionFacade().getValue("topAssetID");
	        redirect(url=local.page, persist="true"); 
         }catch(any e){
       	
			getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="editConfig");
	
			request.context.errorType = e.type;
			request.context.error = e;
			redirect(url=local.page,persist=true);  
       	   
       }
		
	}
	
	public function addSubConfig(required String assetId, numeric configSet){
		var local = {};
		local.page = getRootPath() & "/" & getProgram() & "/configuration/addSubConfiguration.cfm";
		//rc.util = new utilities();
		   
		 try{ 
			local.id = rc.util.decryptId(ARGUMENTS.assetId);
			local.result = {};
			local.assetService = APPLICATION.objectFactory.create("AssetService");
			local.partListService = APPLICATION.objectFactory.create("PartListService");
			local.codeService = APPLICATION.objectFactory.create("CodeService");
			local.qConfigs = getDBUtils().readByNhaAssetId(local.id); 
			
			rc.assetObj = local.assetService.getAsset(local.id);
			rc.nhaassetObj = local.assetService.getAsset(rc.assetObj.getNHAAssetID());
			rc.partListObj = local.partListService.getPartList(rc.assetObj.getPartNoId());
			rc.nhaPartListObj = local.partListService.getPartList(rc.nhaassetObj.getPartNoId());
			rc.codeObj = local.codeService.getCode(rc.partListObj.getSysType());
			//WriteDump(arguments.configSet);
			
			rc.configSet = arguments.configSet;
			
			local.getSoftware = getDBUtils().getSoftwareByAssetId(arguments.assetId);
            local.getSoftware = rc.util.addEncryptedColumn(local.getSoftware,"sw_id");
            addToRequest("qSpareSoftware",local.getSoftware);
                
			
			
			local.topID = getSessionFacade().getValue("topAssetID");
			if(!len(trim(local.topID))){
				getSessionFacade().setValue("topAssetID",getDBUtils().getTopLevelAssetID(ARGUMENTS.assetid));
			}
			rc.topAssetID = getSessionFacade().getValue("topAssetID");
	        redirect(url=local.page, persist="true"); 
         }catch(any e){
       	
			getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="editConfig");
	
			request.context.errorType = e.type;
			request.context.error = e;
			redirect(url=local.page,persist=true);  
       	   
       }		
	}
	
	
	public function editSubConfig(required String assetId, required String attId){
		var local = {};
		local.page = getRootPath() & "/" & getProgram() & "/configuration/editSubConfiguration.cfm";
		//rc.util = new utilities();
		   
		 try{ 
			local.id = rc.util.decryptId(ARGUMENTS.assetId);
			local.result = {};
			local.assetService = APPLICATION.objectFactory.create("AssetService");
			local.partListService = APPLICATION.objectFactory.create("PartListService");
			local.codeService = APPLICATION.objectFactory.create("CodeService");
			local.qConfigs = getDBUtils().readByNhaAssetId(local.id); 	
			dbUtils = application.objectFactory.create("DBUtils");	
			var configBo = new ConfigBO();	
			
			
			
			rc.assetObj = local.assetService.getAsset(local.id);
			rc.nhaassetObj = local.assetService.getAsset(rc.assetObj.getNHAAssetID());
			rc.partListObj = local.partListService.getPartList(rc.assetObj.getPartNoId());
			rc.nhaPartListObj = local.partListService.getPartList(rc.nhaassetObj.getPartNoId());
			rc.codeObj = local.codeService.getCode(rc.partListObj.getSysType());
			
			
			//delete attachments if requested
			if(arguments.attId NEQ 0){
				deleteATT = dbUtils.deleteAtt(arguments.attId);
				//local.configBo.insertAttachment(attachment);
			}
			
			
			
            // check to see if there are attachments for this asset
            local.attachments = dbUtils.getAttachmentsByAssetId(local.id);
            if (local.attachments.recordcount GT 0) {
              dirMgr = CreateObject("component", "cfc.utils.Directory_Mgr");
        	   dirMgr.createDir(#application.sessionManager.getUserName()#);         	
     
               addToFormRequest("qAttachments", local.attachments);             
               
               path=#ExpandPath(#application.rootpath#&'/'&#application.sessionManager.getUserName()#)#;
               //path = getTempDirectory();
               for (intRow = 1 ; intRow LTE local.attachments.RecordCount ; intRow = (intRow + 1)){
 
        			FileWrite(#path#&'/'&#UCase(local.attachments.name[intRow])#, #local.attachments.attachment[intRow]#);
        		}               
            }					
			
			local.getSoftware = getDBUtils().getSoftwareByAssetId(local.id);
            local.getSoftware = rc.util.addEncryptedColumn(local.getSoftware,"sw_id");
            addToRequest("qSpareSoftware",local.getSoftware);
            
			local.topID = getSessionFacade().getValue("topAssetID");
			if(!len(trim(local.topID))){
				getSessionFacade().setValue("topAssetID",getDBUtils().getTopLevelAssetID(ARGUMENTS.assetid));
			}
			rc.topAssetID = getSessionFacade().getValue("topAssetID");

	        redirect(url=local.page, persist="true"); 
         }catch(any e){
       	
			getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="editConfig");
	
			request.context.errorType = e.type;
			request.context.error = e;
			
			
			redirect(url=local.page,persist=true);  
       	   
       }		
	}
	
	
	/*TODO: Refactor updateConfig() logic to service component*/
	public any function updateConfig(Required String assetid, Required String nhaassetid , Required noun,required struct formRequest){
		
		var local = {};
		local.result= {'success'=false,'message'=''};
		local.dbUtils = getDBUtils();
		
		var configBo = new ConfigBO();
		
		local.page = getRootPath() & "/" & getProgram() & "/configuration/configuration.cfm";
		//local.page = getRootPath() & "/" & getProgram() & "/configuration/editConfiguration.cfm";
		//local.page = getRootPath() & "/" & getProgram() & "/configuration/index.cfm?action=edit.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(arguments.nhaassetid))#&error=test";
		
		if(isDefined("request.httpReferer") and len(trim(request.httpReferer))){
	            local.page = request.httpReferer;      
	       }

		//rc.util = new utilities();
		
		transaction {
			
			try{				
				local.request = duplicate(arguments.formRequest);
	            if (arguments.formRequest.imgCntr NEQ "0") {  
	        	    attachment = loopAttachments(local.request);
	        	    local.configBo.insertAttachment(attachment);
	            }					
				
				if(isNumeric(ARGUMENTS.assetId) && ARGUMENTS.assetId > 0){
					
					local.assetService = APPLICATION.objectFactory.create("AssetService");
					local.nhaasset = local.assetService.getAsset(ARGUMENTS.nhaassetid);
					//CreateObject("component", "cfc.utils.Directory_Mgr");
					//local.PROCEDURES = createObject("component", "#getRootPath()#.acts.configuration.procedures");
					local.PROCEDURES = createObject("component", "acts.configuration.procedures");
					
					local.asset = local.assetService.getAsset(ARGUMENTS.assetid);
					
					topassetid = getDBUtils().getTopLevelAssetID(ARGUMENTS.nhaassetid);
					
					//Redmine #1957 06-12-22 JJP - Check to see if there are available slots in the config for this partno
					availableQPA = PROCEDURES.getAvailable(topassetid,local.asset.getpartnoid());
					
					//Redmine #1957 06-12-22 JJP - If the QPA is exceeded throw error and cancel the config update
					if(availableQPA < 1){						
						addToRequest("error",{message='QPA exceeded for ' & ARGUMENTS.noun});
						//Redmine #1960 06-12-22 JJP - Redirect to NHA page if on a lower level asset
						if(StructKeyExists(rc, "LRU") and rc.LRU){
							editConfig(ARGUMENTS.nhaassetid,0);
						}else{
							redirect(url=local.page,persist=true);	
						}						
						//redirect(url=local.page,persist=false);
					}
					
					if(isNumeric(ARGUMENTS.nhaassetid) && ARGUMENTS.nhaassetid > 0){
										
						if(StructKeyExists(rc, "LRU") and !rc.LRU){
							//check if sra is already on asset
							local.exists = local.dbUtils.countPartByAsset(ARGUMENTS.nhaassetid,ARGUMENTS.noun);
							
							if(local.exists){
								throw(type="ConfigurationUpdateException", message="Configuration Exists", detail="SRA " & ARGUMENTS.noun & " exists on asset " & local.nhaasset.getSerno());
							}
							
						}
						
						//local.asset = local.assetService.getAsset(ARGUMENTS.assetid);
						//set nha_asset_id for asset
						local.asset.setNHAAssetID(ARGUMENTS.nhaassetid);
						//update asset
						local.assetService.updateAsset(local.asset);						                        
						
						TransactionCommit();
						
						try{
							//Update Software Asset Table
			                if(Structkeyexists(form,"spareSoftwareId")){
			                    updateSWByAsset(local.asset.getAssetId(),trim(form.spareSoftwareId));
			                }
			                TransactionCommit();
		                }catch(any e){}
						//redirect to edit screen
						addToRequest("success",{message='Configuration Added!!'});
						//Redmine #1960 06-12-22 JJP - Redirect to NHA page if on a lower level asset
						if(StructKeyExists(rc, "LRU") and rc.LRU){
							editConfig(ARGUMENTS.nhaassetid,0);
						}else{
							redirect(url=local.page,persist=true);	
						}
						//redirect(url=local.page,persist=true);
					}
				}else{
					//throw(type="ConfigurationUpdateException", message="Configuration Error", detail="Please enter required fields");
					local.assetService = APPLICATION.objectFactory.create("AssetService");
					rc.assetObj = local.assetService.getAsset(ARGUMENTS.nhaassetid);
					addToRequest("rc.assetObj",rc.assetObj);
					addToRequest("error",{message='Please enter required fields'});
					redirect(url=local.page,persist=true);  
				}
				
				
			}catch(any e) {
				//rollback transaction
				TransactionRollback();
				addToRequest("error",e);
				if(StructKeyExists(rc, "LRU") and rc.LRU){
					editConfig(ARGUMENTS.nhaassetid,0);
				}else{
					listConfig(ARGUMENTS.nhaassetid);	
				}
				listConfig(ARGUMENTS.nhaassetid);
				
			}	
			
			
		}
		
		
		
	}
	
	
    public any function updateSWByAsset(required string assetId, required string swId){
        var local = {};
        local.softwareAsset = getObjectFactory().create("SoftwareAssetService");
        local.effDate = now();

        local.swIds = ListToArray(rc.util.decryptIdList(ARGUMENTS.swId));
        local.currentSw = getDBUtils().getSoftwareByAssetId(val(ARGUMENTS.assetId));
        local.asset = rc.util.decryptId(trim(ARGUMENTS.assetId));
        
        
        
        transaction{
            try{

            	for (local.row = 1 ;local.row <= local.currentSw.RecordCount ;local.row++){
            	   local.softwareAsset.deleteSoftwareAsset(val(ARGUMENTS.assetId),val(local.currentSw['sw_id'][local.row]));   	
            	}
            	
                for(local.s = 1;local.s<=ArrayLen(local.swIds);local.s++){
                	
                		local.currentSwAsset = createSwAsset();
                        local.currentSwAsset.setAssetId(val(local.asset));
                        local.currentSwAsset.setSwId(val(local.swIds[local.s]));
                        local.currentSwAsset.setEffDate(local.effDate);   
                        local.currentSwAsset.setInsBy(getUser());                      
                        local.softwareAsset.createSoftwareAsset(local.currentSwAsset);
                    
                    
                        //local.cause = getUtilities().getCause(e);
                        //getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"updateSWByAsset",getUser());               	
                    
               }
            }catch(any e){
                transactionRollback();
                //local.cause = getUtilities().getCause(e);
                //getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"updateSWByAsset",getUser());
                rethrow;
            }
        } 
        
        
        	
    }
    
	public query function getPartsById(numeric partnoid=0){
		return getDBUtils().getPartsById(ARGUMENTS.partnoid);
	}
	
	/*TODO: Refactor moveConfig() logic to service component*/
	public any function moveConfig(Required String assetId, Required String newassetId, Required struct formRequest,required String attId){
		
		var local = {};
		local.page = getRootPath() & "/" & getProgram() & "/configuration/editconfiguration.cfm"; 
		local.result= {'success'=false,'message'=''};
		local.dbUtils = getDBUtils();
		var configBo = new ConfigBO();
		rc.util = new utilities();
		
		//this will move an nha assetid from one asset to another asset
		if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = rc.httpReferer;      
        }
        
		local.request = duplicate(arguments.formRequest);
        if (arguments.formRequest.imgCntr NEQ "0") {  
    	    attachment = loopAttachments(local.request);
    	    local.configBo.insertAttachment(attachment);
        }	
        
		//delete attachments if requested
		if(arguments.attId NEQ 0){
			deleteATT = dbUtils.deleteAtt(arguments.attId);
		}	                
        
		transaction {
			try {								
								
				 
				if(isNumeric(ARGUMENTS.assetId) && ARGUMENTS.assetId > 0){
					
					local.assetService = APPLICATION.objectFactory.create("AssetService");
					local.asset1 = local.assetService.getAsset(ARGUMENTS.assetId);
					//grab nhaassetid
					
					local.nhaassetid = local.asset1.getNHAAssetID();
					
					if(isNumeric(ARGUMENTS.newassetId) && ARGUMENTS.newassetid > 0){						
						local.asset2 = local.assetService.getAsset(ARGUMENTS.newassetid);
						local.newnhaassetid = local.asset2.getNHAAssetID();
						//need to check to see if nhaassetid is not blank
						if(isNumeric(trim(local.newnhaassetid))){
							
							throw(type="ConfigurationUpdateException", message="NHA Asset ID is not blank", detail="NHA Asset ID for " & local.asset2.getAssetID() & " is not empty");
		
						}else{
							//nha assetid is blank, so okay to update it
							addToRequest("success",{message='Configuration Updated'});
							local.result= {'success'=true,'message'='Configuration Updated'};
							
							//blank out asset
							local.asset1.setNHAAssetID('');
							local.asset1.setChgby(getUser());
							//set nhaassetid to first assets nhaassetid
							local.asset2.setNHAAssetID(local.nhaassetid);
							local.asset2.setChgby(getUser());
							
							//update two assets
							local.assetService.updateAsset(local.asset1);
							local.assetService.updateAsset(local.asset2);
							
							//commit transaction
							TransactionCommit();
							
							addToRequest("success",{message='Configuration Updated'});
							if(StructKeyExists(rc, "LRU") and rc.LRU){
								editConfig(local.nhaassetid,arguments.attId);
							}else{
								listConfig(local.nhaassetid);
							}
							editConfig(local.asset2,arguments.attId);
							
							
						}
						
						//commit transaction
						TransactionCommit();
						addToRequest("success",{message='Configuration Updated'});
						editConfig(ARGUMENTS.assetId,arguments.attId);
					}else{
						//rollback transaction					
						TransactionRollback();
						
						try{
							//Update Software Asset Table
			                if(Structkeyexists(form,"spareSoftwareId")){
			                    updateSWByAsset(local.asset1.getAssetId(),trim(form.spareSoftwareId));
			                }
			                TransactionCommit();
		                }catch(any e){}
	                

						local.result= {'success'=true,'message'=''};
						addToRequest("success",{message='Configuration Updated'});
						if(StructKeyExists(rc, "LRU") and rc.LRU){
							editConfig(local.nhaassetid);
						}else{						
							listConfig(local.nhaassetid);	
						}
						return local.result;
					}
					
					
				}else{
					//rollback transaction
					TransactionRollback();
					local.result= {'success'=true,'message'=''};
					addToRequest("success",{message='Configuration Updated'});
					listConfig(local.nhaassetid);
					editConfig(local.nhaassetid);
				}
				

			
			}catch(any e) {
				//rollback transaction
				TransactionRollback();
				addToRequest("error",e);
				editConfig("");
				
			}
			
			
			
		}
		
		
	}
	
	/*TODO: Refactor removeSRA() logic to service component*/
	remote any function removeSRA( Required String assetId ){
		
		
		
		//clears out NHA_ASSET_ID of asset pass in
		
		
		var local = {};
		local.page = getRootPath() & "/" & getProgram() & "/configuration/configuration.cfm"; 
		local.result= {'success'=false,'message'=''};
		
		try{
			
				if(isAjaxRequest()){
       	 			//add utilities for ajax calls
        			 addToRequest("util",new utilities());
       			}
			 
			local.aid = rc.util.decryptId(ARGUMENTS.assetId);
			local.assetService = APPLICATION.objectFactory.create("AssetService");
			
			if(isNumeric(local.aid) && local.aid > 0)
			{
				
				
				local.objAsset = local.assetService.getAsset(local.aid);
				//grab old nhaassetid
				local.nhaassetid = local.objAsset.getNHAAssetID();
				//update the asset object
				local.objAsset.setChgBy(getUser());
				local.objAsset.setNHAAssetID('');
				//send to update
				local.assetService.updateAsset(local.objAsset);
				
				addToRequest("success",{message='SRA Removed successfully'});
				
				if(isAjaxRequest()){
		          	local.result.success = true;
		          	local.result.message = 'SRA Removed successfully';  
		            return local.result;	  
		          }
				
				if(StructKeyExists(rc, "LRU") and rc.LRU){
					editConfig(local.nhaassetid);
				}else{
					listConfig(local.nhaassetid);	
				}
				//listConfig(rc.topAssetID); 
				
				
			}else{
				redirect(url=local.page,persist=true);  	
			}
		}catch(any e){
			
			getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="removeSRA");
			
			if(isAjaxRequest()){
	            local.result.success = false;
	            local.result.message = e.message;
	            local.result.stack = e.stackTrace;  
	            return local.result;      
	          }
			
			request.context.errorType = e.type;
			request.context.error = e;
			redirect(url=local.page,persist=true);  
			
		}
		
		
		
		
		
			
	}
	
	
	public query function searchConfiguration(required string criteria){
		var q = new Query();
		var local = {};
		getJavaLoggerProxy().info(message="Criteria:#ARGUMENTS.criteria#",sourceClass=getComponentName(), methodName="searchConfiguration");
		getSessionFacade().setValue("configurationCriteria",UCase(trim(ARGUMENTS.criteria)));
		local.page = getRootPath() & "/" & getProgram() & "/configuration/searchConfiguration.cfm";
		local.qSearch = getDBUtils().searchConfiguration(ARGUMENTS.criteria,getSessionFacade().getProgramIdSetting(),getSessionFacade().getLocIdSetting(),getSessionFacade().getSubSection()); 
		addToRequest("qSearch",local.qSearch);
		redirect(url=local.page,persist=true);  
		return local.qSearch;
	}
	
	public void function exportConfig(required struct formRequest){
		var q = new Query();
		var local = {};
		
		
		local.page = getRootPath() & "/" & getProgram() & "/configuration/exportConfig.cfm";
		local.qSearch = getDBUtils().searchConfiguration(getSessionFacade().getValue("configurationCriteria"),getSessionFacade().getProgramIdSetting(),getSessionFacade().getLocIdSetting(),getSessionFacade().getSubSection()); 
		
		addToRequest("qSearch",local.qSearch);
        addToRequest("exportType", arguments.formRequest.exportType);
        
        
		redirect(url=local.page,persist=true);  
	}
	
	remote any function addSRA( numeric partnoid, string serno ){
		var local = {};
		local.utils = new utilities();
		local.configBo = new ConfigBO();
		local.result= {'success'=false,'message'='','data'={}};
		local.codeService = APPLICATION.objectFactory.create("CodeService");
       	//default page
       	local.page = getRootPath() & "/" & getProgram() & "/configuration/editConfiguration.cfm";
       
        local.asset = populateAsset(ARGUMENTS);
      
       	local.asset.setActive('Y');
        local.asset.setReportable('N');
        local.asset.setValid('N');
        local.asset.setCfoTracked('N');
        local.asset.setBadActor('N');
        local.asset.setSysId(val(getDBUtils().getSysIdByProgram(getSessionFacade().getProgramSetting())));
        local.asset.setInsBy(getUser());
        local.asset.setStatusCD(local.codeService.findByCodeTypeCodeValue('STATUS','FMC').getCodeId());
        
        local.asset.setLocIdc(getSessionFacade().getLocIdSetting());
       	local.asset.setLocIda(getSessionFacade().getLocIdSetting());
       	
       
       
        	try
		       	{
		       		
					local.asset2 = local.configbo.createAsset(local.asset);
					local.partListService = APPLICATION.objectFactory.create("PartListService");
					local.partListObj = local.partListService.getPartList(local.asset2.getPartnoId());
					
					local.result.data = {
											'partnoid'=local.partListObj.getPartnoId(),
											'noun'=local.partListObj.getNoun(),
											'partno'=local.partListObj.getPartno(),
											'nsn'=local.partListObj.getNSN(),
											'assetid'=local.asset2.getAssetID(),
											'serno'=local.asset2.getSerno()
										};
					
					
					
					addToRequest("resultdata",local.result.data);
					
					
					if(isAjaxRequest()){
						local.result.success = true;
						local.result.message = 'SRA added successfully';  
						return local.result;      
					}
					return local.result;  
					//redirect(url=local.page, persist="true");
		
		       
		        }catch(any e){
		        	 addToRequest("error",e);
		          	 local.cause = local.utils.getCause(e);
		          	 local.utils.recordError(local.cause,getComponentName(),"addSRA",getUser());
		          	
		          	 local.result.message = "Cannot Insert SRA Asset. Asset exists.";  
		          	 
		          	 return local.result;
		        }
        	
        
      
        
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
        			local.attachments.setRepairId("");
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
	
	
	/* populate Sortie bean from formRequest */
    private Asset function populateAsset(required struct formRequest) {
        var local = {};
        local.asset = new Asset();
		
		if (StructKeyExists(arguments.formRequest, "partnoid")) {
            local.asset.setPartnoId(arguments.formRequest["partnoid"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "serNo")) {
            local.asset.setSerNo(arguments.formRequest["serNo"]);
        }
		
        local.asset.setLocIdc(application.sessionManager.getLocIdSetting());
        local.asset.setInsBy(application.sessionManager.getUserName());
        local.asset.setInsDate(Now());

        return local.asset;
    }
	
	
}