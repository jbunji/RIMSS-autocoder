import cfc.facade.SessionFacade;
import cfc.model.Asset;
import cfc.model.PartList;
import cfc.model.SoftwareAsset;
import cfc.utils.javaLoggerProxy;
import cfc.utils.utilities;


component  hint="Spares Business Object" output="false" extends="cfc.utils.Proxy"
{

	variables.instance={
	   sessionFacade = new SessionFacade(), 	
       assetService = '',
       componentName = "sparesBO",
       javaLoggerProxy = new  javaLoggerProxy(),
       objectFactory = '',
       dbUtils = "",
       utilities = new utilities(),
       asset = "",
       swAsset = "",
       partList = ""
       
    };

    /* init */
    public function init() {
        /* return success */
        return this;
    }
    
    /* get Session Facade */
    public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }
    
    /* Java Logger Proxy */
    public any function getJavaLoggerProxy(){
       return variables.instance.javaLoggerProxy;      
    }
    
    /*get Object Factory */
    public any function getObjectFactory(){
        if(isSimpleValue(variables.instance.objectFactory)){
           variables.instance.objectFactory = APPLICATION.objectFactory;    
        }   
        return variables.instance.objectFactory;      
    }
    
    public any function getDBUtils(){
       if(isSimpleValue(variables.instance.dbUtils)){
           variables.instance.dbUtils = getObjectFactory().create("DBUtils");    
        }       
       return variables.instance.dbUtils;      
    }
    
    /*get Asset Service */
    public any function getAssetService(){
       if(isSimpleValue(variables.instance.assetService)){
           variables.instance.assetService = getObjectFactory().create("AssetService");    
        }       
       return variables.instance.assetService;      
    }
    
     /*get User */
    public any function getUser(){
       return getSessionFacade().getUserName();      
    }
    
    /*get Utilities */
    public any function getUtilities(){
        return variables.instance.utilities;      
    }
    
    public any function createAsset(){
       variables.instance.asset = new Asset();
       return variables.instance.asset;      
    }
    
    public any function createPartList(){
       variables.instance.partList = new PartList();
       return variables.instance.partList;      
    }
    
    public any function createSwAsset(){
       variables.instance.swAsset = new SoftwareAsset();
       return variables.instance.swAsset;      
    }
    
    
    /* Create Spare */
    public any function createSpare() {
        var local = {};
        
        local.update = false;
                
        local.assetService = getObjectFactory().create("AssetService"); 
        local.partListService = getObjectFactory().create("PartListService");         
        
        local.asset = createAsset();
        
        if(Structkeyexists(ARGUMENTS,"spareSerNo") && Len(TRIM(ARGUMENTS.spareSerNo)) 
        && Structkeyexists(ARGUMENTS,"sparePartNo")  && Val(TRIM(ARGUMENTS.sparePartNo))){
            local.checkAsset = getDBUtils().checkAsset(getSessionFacade().getProgramSetting(),val(trim(ARGUMENTS.sparePartNo)),UCASE(TRIM(ARGUMENTS.spareSerNo)));
            if(val(local.checkAsset)){
                local.asset = local.assetService.getAsset(val(local.checkAsset));
                if(UCASE(TRIM(local.asset.getActive())) == 'N'){
                    local.asset.setActive("Y"); 
                    local.asset.setValid('N');
                    local.asset.setValBy('');
                    local.asset.setValDate("");
                    local.asset.setInsBy(getUser());
                    local.update = true;
                       	
                }
            }
   
        }
        
        if(Structkeyexists(ARGUMENTS,"spareSerNo")){
            local.asset.setSerNo(UCASE(TRIM(ARGUMENTS.spareSerNo)));   
        }   
        
        if(Structkeyexists(ARGUMENTS,"spareWarranty")){
            local.asset.setMfgDate(UCASE(TRIM(ARGUMENTS.spareWarranty)));   
        }   
        
        if(Structkeyexists(ARGUMENTS,"spareStatus")){
        	
            local.asset.setStatusCd(TRIM(ARGUMENTS.spareStatus));   
        } 
        
        if(Structkeyexists(ARGUMENTS,"spareRemarks")){
            local.asset.setRemarks(UCASE(TRIM(ARGUMENTS.spareRemarks))); 
        }       
        
        if(Structkeyexists(ARGUMENTS,"spareLocation")){
            local.asset.setLocIdC(Val(TRIM(ARGUMENTS.spareLocation))); 
            local.asset.setLocIdA(Val(TRIM(ARGUMENTS.spareLocation))); 
        }       
        
        
        
        local.asset.setActive('Y');
        local.asset.setReportable('N');
        local.asset.setValid('N');
        local.asset.setCfoTracked('N');
        local.asset.setBadActor('N');
        local.asset.setSysId(val(getDBUtils().getSysIdByProgram(getSessionFacade().getProgramSetting())));
        
        local.asset.setInsBy(getUser());
        local.asset.setChgBy(getUser());
        local.asset.setChgDate(Now());
        
        
        transaction 
            {
		        try
                {
                	
                	if(Structkeyexists(ARGUMENTS,"sparePartNo")  && Val(TRIM(ARGUMENTS.sparePartNo))){
			            local.asset.setPartNoId(UCASE(TRIM(ARGUMENTS.sparePartNo)));   
		                local.part = local.partListService.getPartList(val(UCASE(TRIM(ARGUMENTS.sparePartNo))));
		                
		                //Update Depot
		                if(Structkeyexists(ARGUMENTS,"spareDepot")){
		                    local.partHasChanged = true;
							local.part.setLocIdr(TRIM(ARGUMENTS.spareDepot));
							local.part.setChgBy(getUser());
							validatePartList(local.part);
							local.partListService.updatePartList(local.part);
		                               
		                }
			        }

                	validateAsset(local.asset);
			        
			        if(local.update){
			        	local.asset = local.assetService.updateAsset(local.asset);
			        }else{
			            local.asset = local.assetService.createAsset(local.asset);
			            
			        }

			        //Update Software Asset Table
                    if(Structkeyexists(ARGUMENTS,"spareSoftwareId")){
                        updateSWByAsset(local.asset.getAssetId(),trim(ARGUMENTS.spareSoftwareId));
					}
                    
                    addToRequest("success",{message="Spare Inserted Successfully"});
                    
                }catch(PartListException e){
                    addToRequest("notice",e);
                    addToRequest("hasError","true");
                }catch(AssetException e){
	                transactionRollback();
	                addToRequest("notice",e);
	                addToRequest("hasError","true");
                }catch(Database e){
	                transactionRollback(); 
	                local.cause = getUtilities().getCause(e);
	                if(isDefined("local.cause.type") && findnocase("SQLIntegrityConstraintViolationException",local.cause['type'])){
	                   addToRequest("notice",{message="Spare part number or serial number Already Exists"});    
	                   addToRequest("hasError","true");
	                }else{
	                   rethrow;
	                }
	
	            }catch(any e) 
	            { 
	                transactionRollback(); 
	                addToRequest("error",e);
	                addToRequest("hasError","true");
	                local.cause = getUtilities().getCause(e);
	                getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"createSpare",getUser());               
	            }
 
		   }
        
           return local.asset; 
    }
    
    
    /* Create Spare Part*/
    public any function createSparePart() {
        var local = {};
        
        local.update = false;

        local.partListService = getObjectFactory().create("PartListService"); 
        local.codeService = getObjectFactory().create("CodeService");   
        
        local.partCodeObj = local.codeService.findByCodeTypeCodeValue("SYS_TYPE","PART");
        
        local.sysType = val(local.partCodeObj.getCodeValue());
        
        local.part = createPartList();

        local.part.setPgmId(0);
        local.part.setSysType(local.sysType);        
        local.part.setActive("Y"); 
        local.part.setValid('N');
        local.part.setSNTracked('N');
        local.part.setLSRUFlag('-');
        local.part.setValBy('');
        local.part.setValDate("");
        local.part.setInsBy(getUser());
        
        if(Structkeyexists(ARGUMENTS,"spareNoun")){
            local.part.setNoun(UCASE(TRIM(ARGUMENTS.spareNoun)));   
        }   
        
        if(Structkeyexists(ARGUMENTS,"sparePartNo") && Len(TRIM(ARGUMENTS.sparePartNo))){
            local.part.setPartNo(UCASE(TRIM(ARGUMENTS.sparePartNo))); 
        }
        
        if(Structkeyexists(ARGUMENTS,"spareNSN") && Len(TRIM(ARGUMENTS.spareNSN))){
            local.part.setNSN(UCASE(TRIM(ARGUMENTS.spareNSN))); 
        }
        
        if(Structkeyexists(ARGUMENTS,"spareDepot") && isNumeric(TRIM(ARGUMENTS.spareDepot))){
            local.part.setLocIdr(UCASE(TRIM(ARGUMENTS.spareDepot))); 
        }

        transaction 
            {
                try
                {
                    
                    validatePartList(local.part);
                    local.partListService.createPartList(local.part);
                    addToRequest("success",{message="Spare Part Inserted Successfully"});
                    
                }catch(PartListException e){
                    addToRequest("notice",e);
                }catch(Database e){
                    transactionRollback(); 
                    local.cause = getUtilities().getCause(e);
                    if(isDefined("local.cause.type") && findnocase("SQLIntegrityConstraintViolationException",local.cause['type'])){
                    	addToRequest("error",e);
                       /*addToRequest("notice",{message="Spare part numnber already exists"});  */  
                        getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"createSparePart",getUser());   
                    }else{
                       getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"createSparePart",getUser());   
                       addToRequest("error",{message="Spare Part insert unsuccessful"});    
                    }
    
                }catch(any e) 
                { 
                    transactionRollback(); 
                    addToRequest("error",{message="Spare Part insert unsuccessful"});
                    local.cause = getUtilities().getCause(e);
                    getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"createSpare",getUser());               
                }
 
           }
        

    }
    
    
    public any function updateSWByAsset(required string assetId, required string swId){
        var local = {};
        local.softwareAsset = getObjectFactory().create("SoftwareAssetService");
        local.effDate = now();

        local.swIds = ListToArray(getUtilities().decryptIdList(ARGUMENTS.swId));
        local.currentSw = getDBUtils().getSoftwareByAssetId(val(ARGUMENTS.assetId));
        local.asset = getutilities().decryptId(trim(ARGUMENTS.assetId));
        
        
        
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
    
   /*Validate PartList */
    public any function validatePartList(cfc.model.PartList partlist){
        var local = {};
        if(!len(trim(ARGUMENTS.partlist.getNoun()))){
            throw(type="PartListException", message="Missing Noun");
        }   
        if(!len(trim(ARGUMENTS.partlist.getPartNo()))){
            throw(type="PartListException", message="Missing PartNo");
        }   
        if(!len(trim(ARGUMENTS.partlist.getNsn()))){
            throw(type="PartListException", message="Missing NSN");
        } 
        /*if(!len(trim(ARGUMENTS.partlist.getLocIdr()))){
            throw(type="PartListException", message="Missing Depot");
        }     */
  
    }
    
    /*Validate Asset */
    public any function validateAsset(required cfc.model.Asset asset){
        var local = {};
        
        if(!len(trim(ARGUMENTS.asset.getSerno()))){
            throw(type="AssetException", message="Missing SerNo");
        }   

        if(!val(trim(ARGUMENTS.asset.getStatusCd()))){
            throw(type="AssetException", message="Missing Status");
        }   
        
        if(!val(trim(ARGUMENTS.asset.getLocIdc()))){
            throw(type="AssetException", message="Missing Location");
        }   
    }
    
    
    /* Update Spare */
    public any function updateSpare(string spareAsset=""){
        var local = {};
        local.partHasChanged = false;
        local.assetService = getObjectFactory().create("AssetService"); 
        local.partListService = getObjectFactory().create("PartListService"); 
        
        try{
            
            local.currentSpare = getUtilities().decryptId(trim(ARGUMENTS.spareAsset));
            
            local.asset = local.assetService.getAsset(val(local.currentSpare));
            
            
            if(isDefined("local.asset")){
                
                if(Structkeyexists(ARGUMENTS,"spareSerNo") && UCASE(TRIM(ARGUMENTS.spareSerNo)) != UCASE(TRIM(local.asset.getSerNo()))){
                    local.asset.setSerNo(UCASE(TRIM(ARGUMENTS.spareSerNo)));   
                }  
                
                if(Structkeyexists(ARGUMENTS,"sparePartNo") && TRIM(ARGUMENTS.sparePartNo) != TRIM(local.asset.getPartNoId())){
                    local.asset.setPartNoId(TRIM(ARGUMENTS.sparePartNo));   
                }  
                
                if(Structkeyexists(ARGUMENTS,"spareStatus") && TRIM(ARGUMENTS.spareStatus) != TRIM(local.asset.getStatusCd())){
                    local.asset.setStatusCd(TRIM(ARGUMENTS.spareStatus));   
                } 
                
                if(Structkeyexists(ARGUMENTS,"spareRemarks")){
                    local.asset.setRemarks(UCASE(TRIM(ARGUMENTS.spareRemarks))); 
                }       
                
                if(Structkeyexists(ARGUMENTS,"spareLocation")){
                    local.asset.setLocIdC(TRIM(ARGUMENTS.spareLocation)); 
                }
                
                if(Structkeyexists(ARGUMENTS,"spareWarranty")){
                    local.asset.setMfgDate(TRIM(ARGUMENTS.spareWarranty)); 
                }
                
                local.asset.setSysId(val(getDBUtils().getSysIdByProgram(UCASE(TRIM(getSessionFacade().getProgramSetting())))));        
            }

            
            local.part = local.partListService.getPartList(val(local.asset.getPartNoId()));
            

            //Check to see if part information has changed
            if(Structkeyexists(ARGUMENTS,"spareNoun") || Structkeyexists(ARGUMENTS,"sparePartNo") || Structkeyexists(ARGUMENTS,"spareNSN") && isDefined("local.part")){

                    if(Structkeyexists(ARGUMENTS,"spareNoun")  && UCASE(TRIM(ARGUMENTS.spareNoun)) != UCASE(TRIM(local.part.getNoun()))){
                        local.partHasChanged = true;
                        local.part.setNoun(UCASE(TRIM(ARGUMENTS.spareNoun)));   
                    }
                    
                    if(Structkeyexists(ARGUMENTS,"spareNSN") && UCASE(TRIM(ARGUMENTS.spareNSN)) != UCASE(TRIM(local.part.getNsn()))){
                        local.partHasChanged = true;
                        local.part.setNsn(UCASE(TRIM(ARGUMENTS.spareNSN)));   
                    }
                    
                    if(Structkeyexists(ARGUMENTS,"spareDepot") && TRIM(ARGUMENTS.spareDepot) != UCASE(TRIM(local.part.getLocIdr()))){
                        local.partHasChanged = true;
                        local.part.setLocIdr(TRIM(ARGUMENTS.spareDepot));   
                    }

            }
            
            
            transaction 
            {
              try 
                    { 
                        if(local.partHasChanged){
                            local.part.setChgBy(UCASE(TRIM(getUser()))); 
                            
                            validatePartList(local.part);
                            
                            local.part.validate();
                            
                            local.partListService.updatePartList(local.part);   
                        }
                        if(isDefined("local.asset")){
                            local.asset.setChgBy(UCASE(TRIM(getUser())));
                            validateAsset(local.asset);
                            
                            local.asset.validate();
                            
                            local.assetService.updateAsset(local.asset);
                            transactionCommit();
                        }
                        
                        //Update Software Asset Table
	                    if(Structkeyexists(ARGUMENTS,"spareSoftwareId")){
	                        updateSWByAsset(local.asset.getAssetId(),trim(ARGUMENTS.spareSoftwareId));
	                    }
                        
                        
                        addToRequest("success",{message="Spare Updated Successfully"});
                        
                    } 
                    catch(PartListException e){
                        transactionRollback();
                        addToRequest("notice",e);
                        
                    }catch(AssetException e){
                        transactionRollback();
                        addToRequest("notice",e);
                    }catch(Database e){
                        transactionRollback(); 
                        local.cause = getUtilities().getCause(e);
                        if(isDefined("local.cause.type") && findnocase("SQLIntegrityConstraintViolationException",local.cause['type'])){
                           addToRequest("notice",{message="Spare part number or serial number Already Exists"});    
                        }else{
                           rethrow;
                        }

                    }catch(any e) 
                    { 
                        transactionRollback(); 
                        
                        addToRequest("error",e);
                        local.cause = getUtilities().getCause(e);
                        getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"updateSpare",getUser());               
                        
                    } 
  
            }
            
            
            
        }catch(any e){
            
            addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"updateSpare",getUser());
  
        } 
    
    }
    
    private numeric function decryptId(required string id){
       var local = {};
        local.result = 0;
        if(isNumeric(ARGUMENTS.id)){
           return trim(ARGUMENTS.id);
        }   
           try{
                local.result = Decrypt(arguments.id,getSessionFacade().getSecretKey(),"AES","HEX");
                
              }catch(err e){
                  
              }
        
        return trim(local.result);
    }
    
    /* Delete Spare */
    public struct function deleteSpare(required string spareAsset) {
        var local = {};
        local.result = {success=false,msg="",msgStatus=""};
        
        try{
            local.currentSpare = getUtilities().decryptId(trim(ARGUMENTS.spareAsset));            
            local.asset = getAssetService().getAsset(val(local.currentSpare));	
            local.asset.setActive("N");
            local.asset.setValid("N");
            local.asset.setValBy("");
            local.asset.setValDate("");
            local.asset.setChgBy(getUser());
        	getAssetService().updateAsset(local.asset);
        	
        	addToRequest("success", {message="Spare Removed Successfully"});
        	local.result.status = true;
        	local.result.msg="Spare Removed Successfully";
        	local.result.msgStatus="global_success_msg";
        }catch(any e){

        	addToRequest("error", {message="Spare Removed Unsuccessful"});
        	local.cause = getUtilities().getCause(e);
        	getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"deleteSpare",getUser());
        	
        	local.result.status = false;
            local.result.msg="Spare Removed Unsuccessful";
            local.result.msgStatus="global_error_msg";
        	
        }
        
        
       return local.result;
          
    }
	
}