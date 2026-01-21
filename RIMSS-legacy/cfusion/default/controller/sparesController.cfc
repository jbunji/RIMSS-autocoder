import default.bo.SparesBO;
import cfc.facade.SessionFacade;
import cfc.facade.SessionRequestFacade;
import cfc.factory.ObjectFactory;
import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;
import cfc.utils.QueryIterator;
import cfc.utils.utilities;

component hint="Controller for spares processes" output="false" extends="cfc.utils.Proxy"
{
	
	
	
	property any sessionRequestFacade;
    
    
    variables.instance={
       sessionRequestFacade = new SessionRequestFacade(),
       sessionFacade = new SessionFacade(), 
       sparesBO = new SparesBO(), 
       javaLoggerProxy = new  javaLoggerProxy(),
       objectFactory = '',
       partListService = '',
       assetService = '',
       locationService = '',
       sparesService = '',
       codeService = '',
       dbUtils = '',
       dropDownDao = '',
       program = 'default',
       utilities = new utilities()           
    };
    
    //variables.instance.program = lcase(trim(getSessionFacade().getProgramSetting()));
    
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
    
    public any function getCodeService(){
       if(isSimpleValue(variables.instance.codeService)){
           variables.instance.codeService = getObjectFactory().create("CodeService");    
        }       
       return variables.instance.codeService;      
    }
    
    public any function getLocationService(){
       if(isSimpleValue(variables.instance.locationService)){
           variables.instance.locationService = getObjectFactory().create("LocationService");    
        }       
       return variables.instance.locationService;      
    }
    
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
    
    public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }
    
    public any function getSparesBO(){
       return variables.instance.sparesBO;      
    }

    public any function getUser(){
       return getSessionFacade().getUserName();      
    }
    
    
    public any function listSpares( string sparesNoun= ""){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/spares/spares.cfm";     
        addToFormRequest("sparesNouns",arguments.sparesNoun);
        
        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=getUtilities().getComponentName(this), methodName="listSpares");

       redirect(local.page,true); 
    }
    
    
    public any function getSpares( string sparesNoun= ""){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/spares/spares.cfm";
             
        addToFormRequest("spareNouns",arguments.sparesNoun);
        /*if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = getDirectoryFromPath(rc.httpReferer) & "/spares/spares.cfm";
        }*/
        getSessionFacade().removeValue("sparesCriteria");
        getSessionFacade().setValue("spareNouns",trim(ARGUMENTS.sparesNoun));
        
        local.spares = getDBUtils().getSpares(UCASE(TRIM(getSessionFacade().getProgramSetting())),ARGUMENTS.sparesNoun);
        
        local.spares = getUtilities().addEncryptedColumn(local.spares,"asset_id");
        
        getJavaLoggerProxy().fine(message="Querying Spares dbUtils.getSpares(#getSessionFacade().getProgramSetting()#,#ARGUMENTS.sparesNoun#)",sourceClass=getUtilities().getComponentName(this), methodName="listSpares");
        addToRequest("qSpares",new QueryIterator(local.spares));

        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=getUtilities().getComponentName(this), methodName="listSpares");

       redirect(local.page,true); 
    }
    
     public any function exportSpares(required struct formRequest){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/spares/exportSpares.cfm";
             
        /*if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = getDirectoryFromPath(rc.httpReferer) & "/spares/spares.cfm";
        }*/
       
        local.spares = getDBUtils().getSpares(UCASE(TRIM(getSessionFacade().getProgramSetting())),getSessionFacade().getValue("spareNouns") );
        
        local.spares = getUtilities().addEncryptedColumn(local.spares,"asset_id");
        
        addToRequest("qSpares",new QueryIterator(local.spares));
        addToRequest("qsearch",local.spares);
        addToRequest("exportType", arguments.formRequest.exportType);

       redirect(local.page,true); 
    }
    
    
    public any function searchSpares( string sparesCriteria= ""){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/spares/spares.cfm";     
        addToFormRequest("sparesCriteria",ARGUMENTS.sparesCriteria);
        
        getSessionFacade().setValue("sparesCriteria",ARGUMENTS.sparesCriteria);
        getSessionFacade().removeValue("spareNouns");

        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = getDirectoryFromPath(rc.httpReferer) & "spares.cfm";
        }
        
        local.spares = getDBUtils().searchSpares(getSessionFacade().getProgramSetting(),ARGUMENTS.sparesCriteria);
        
        local.spares = getUtilities().addEncryptedColumn(local.spares,"asset_id");
        
        getJavaLoggerProxy().fine(message="Querying Spares dbUtils.getSpares(#getSessionFacade().getProgramSetting()#,#ARGUMENTS.sparesCriteria#)",sourceClass=getUtilities().getComponentName(this), methodName="searchSpares");
        
        addToRequest("qSpares",new QueryIterator(local.spares));
        
        
        local.nouns = getUtilities().listRemoveDupes(ValueList(local.spares.noun));
        if(listlen(local.nouns) eq 1){
            addToFormRequest("spareNouns",local.nouns);	
        }
        
        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=getUtilities().getComponentName(this), methodName="searchSpares");

       redirect(local.page,true); 
    }
    
    public any function addSpare( string spareAsset= "", string spareNoun = ""){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/spares/addSpare.cfm"; 

        try{

        	if(len(trim(ARGUMENTS.spareAsset))){
	            local.decryptAsset = decryptId(arguments.spareAsset);
	            local.asset = getAssetService().getAsset(val(local.decryptAsset));
	            StructClear(request.context.form); 
	            local.partList = getPartListService().getPartList(val(local.asset.getPartNoId()));
	            addToFormRequest("spareNoun",local.partList.getNoun());
	            addToFormRequest("sparePartNo",local.partList.getPartNoId());
	            addToFormRequest("spareStatus",local.asset.getStatusCd());  
	            addToFormRequest("spareNSN",local.partList.getNSN());    
	            addToFormRequest("spareAsset",val(arguments.spareAsset));
	            addToFormRequest("spareLocation",local.asset.getLocIdC());
	            addToFormRequest("spareDepot",local.partList.getLocIdr());
	            
	            //Check software against asset_id
	            local.assetId = getUtilities().decryptId(trim(ARGUMENTS.spareAsset));
                local.getSoftware = getDBUtils().getSoftwareByAssetId(local.assetId);
                local.getSoftware = getUtilities().addEncryptedColumn(local.getSoftware,"sw_id");
                addToRequest("qSpareSoftware",local.getSoftware);
                addToFormRequest("spareSoftwareId",trim(valuelist(local.getSoftware.encrypted_sw_id)));     
	            redirect(local.page,true); 
	            
            }else if(len(trim(ARGUMENTS.spareNoun))){
                addToFormRequest("spareNoun",ucase(trim(ARGUMENTS.spareNoun)));    	
            }
            
            //Check spareSoftwareId form field
            if(Structkeyexists(ARGUMENTS,"spareSoftwareId")){
                local.swIds = getUtilities().decryptIdList(trim(ARGUMENTS.spareSoftwareId));
                addToRequest("decryptedIds",local.swIds);
                local.getSoftware = getDBUtils().getSoftwareById(local.swIds);
                addToRequest("records",local.getSoftware.recordcount);
                local.getSoftware = getUtilities().addEncryptedColumn(local.getSoftware,"sw_id");
                addToRequest("qSpareSoftware",local.getSoftware);
                addToFormRequest("spareSoftwareId",trim(valuelist(local.getSoftware.encrypted_sw_id)));   	
            }
            
            
            //local.page = getRootPath() & "/" & getProgram() & "/spares/editSpare.cfm";
            redirect(local.page,true); 
            
        }catch(any e){
            addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"addSpare",getUser());

            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            }
        }
        
        redirect(local.page,true); 
        
        
    }
    
    public any function addSparePart(){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/spares/addSparePart.cfm"; 

        redirect(local.page,true); 
        
        
    }
    
    
    public any function addLikeSpare(string spareAsset= ""){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/spares/addSpare.cfm"; 
        
        try{
            if(len(trim(ARGUMENTS.spareAsset))){
                local.decryptAsset = decryptId(arguments.spareAsset);
                local.asset = getAssetService().getAsset(val(local.decryptAsset));
                StructClear(request.context.form); 
                local.partList = getPartListService().getPartList(val(local.asset.getPartNoId()));
                addToFormRequest("spareNoun",local.partList.getNoun());
                addToFormRequest("sparePartNo",local.partList.getPartNoId());
                addToFormRequest("spareStatus",local.asset.getStatusCd());  
                addToFormRequest("spareNSN",local.partList.getNSN());    
                addToFormRequest("spareAsset",val(arguments.spareAsset));
                addToFormRequest("spareLocation",local.asset.getLocIdC());
                addToFormRequest("spareDepot",local.partList.getLocIdr());
                
                local.warranty = isDate(local.asset.getMfgDate()) ? UCASE(TRIM(DateFormat(local.asset.getMfgDate(),"dd-mmm-yyyy"))): local.asset.getMfgDate();
                addToFormRequest("spareWarranty",local.warranty);

                local.assetId = getUtilities().decryptId(trim(ARGUMENTS.spareAsset));
                local.getSoftware = getDBUtils().getSoftwareByAssetId(local.assetId);
                local.getSoftware = getUtilities().addEncryptedColumn(local.getSoftware,"sw_id");
                addToRequest("qSpareSoftware",local.getSoftware);
                addToFormRequest("spareSoftwareId",trim(valuelist(local.getSoftware.encrypted_sw_id)));     

                
            }else if(len(trim(ARGUMENTS.spareNoun))){
                addToFormRequest("spareNoun",ucase(trim(ARGUMENTS.spareNoun)));     
            }
            redirect(local.page,true); 
            
        }catch(any e){
            addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"addSpare",getUser());

            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            }
        }
        
        redirect(local.page,true); 
        
        
    }
	
	
    
    public any function editSpare( string spareAsset= ""){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/spares/editSpare.cfm"; 
        
        try{
            local.decryptAsset = decryptId(arguments.spareAsset);
            local.asset = getAssetService().getAsset(val(local.decryptAsset));
        
            local.partList = getPartListService().getPartList(val(local.asset.getPartNoId()));
            addToFormRequest("spareNoun",local.partList.getNoun());
            addToFormRequest("sparePartNo",local.partList.getPartNoId());
            addToFormRequest("spareSerNo",local.asset.getSerNo());
            addToFormRequest("spareStatus",local.asset.getStatusCd()); 
            addToFormRequest("spareRemarks",local.asset.getRemarks()); 
            addToFormRequest("spareNSN",local.partList.getNSN());
            addToFormRequest("spareLocation",local.asset.getLocIdc());    
            addToFormRequest("spareAsset",arguments.spareAsset);
            local.warranty = isDate(local.asset.getMfgDate()) ? UCASE(TRIM(DateFormat(local.asset.getMfgDate(),"dd-mmm-yyyy"))): local.asset.getMfgDate();
            addToFormRequest("spareWarranty",local.warranty);
            addToFormRequest("spareDepot",local.partList.getLocIdr());

            local.getSoftware = getDBUtils().getSoftwareByAssetId(local.asset.getAssetId());
            local.getSoftware = getUtilities().addEncryptedColumn(local.getSoftware,"sw_id");
            addToRequest("qSpareSoftware",local.getSoftware);
            addToFormRequest("spareSoftwareId",trim(valuelist(local.getSoftware.encrypted_sw_id)));     

            redirect(local.page,true); 
            
        }catch(any e){
        	addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"editSpare",getUser());
        	
        	
            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            }
        }
        
        redirect(local.page,true); 

    }

    
    public any function createSpare(){
        var local = {};
        local.partHasChanged = false;
        local.page = getRootPath() & "/" & getProgram() & "/spares/addSpare.cfm"; 
        
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            } 
        
        try
        {
        	local.sparesBO = getSparesBO().createSpare(argumentCollection=ARGUMENTS);
        	if(!isDefined('rc.hasError')){
        	   local.page = getRootPath() & "/" & getProgram() & "/spares/editSpare.cfm"; 
        	}
        	
        	if(Structkeyexists(ARGUMENTS,"spareSoftwareId")){
                local.swIds = getUtilities().decryptIdList(trim(ARGUMENTS.spareSoftwareId));
                addToRequest("decryptedIds",local.swIds);
                local.getSoftware = getDBUtils().getSoftwareById(local.swIds);
                addToRequest("records",local.getSoftware.recordcount);
                local.getSoftware = getUtilities().addEncryptedColumn(local.getSoftware,"sw_id");
                addToRequest("qSpareSoftware",local.getSoftware);
                addToFormRequest("spareSoftwareId",trim(valuelist(local.getSoftware.encrypted_sw_id)));     
            }
        	
        }
        catch(Any e)
        {
            
        	rethrow;
        }

        
        
        
        redirect(local.page,true); 
        
    }
    
    public any function createSparePart(){
        var local = {};
        local.partHasChanged = false;
        local.page = getRootPath() & "/" & getProgram() & "/spares/addSparePart.cfm"; 

        local.sparesBO = getSparesBO().createSparePart(argumentCollection=ARGUMENTS);
        
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = rc.httpReferer;   
        } 
        
        redirect(local.page,true); 
        
    }
    
    public any function deleteSpare(string spareAsset=""){
        var local = {};
        local.sparesBO = getSparesBO().deleteSpare(argumentCollection=ARGUMENTS);
        local.criteria = getSessionFacade().getValue("sparesCriteria");
        local.noun = getSessionFacade().getValue("spareNouns");
        
        //Determine which function to call based on how the list spares was populated.
        if(len(trim(local.noun))){
        	addToFormRequest("spareNouns",local.noun);
            getSpares(local.noun);    
        }else if(len(trim(local.criteria))){
        	addToFormRequest("sparesCriteria",local.criteria);
            searchSpares(local.criteria);
        }else{
  
        } 
         
    }
    
    
    
    public any function updateSpare(string spareAsset=""){
        var local = {};
        local.partHasChanged = false;
        local.page = getRootPath() & "/" & getProgram() & "/spares/editSpare.cfm"; 
        
        ARGUMENTS.chgBy = UCASE(TRIM(getUser()));
        
        local.sparesBO = getSparesBO().updateSpare(argumentCollection=ARGUMENTS);
        
        /*if(Structkeyexists(ARGUMENTS,"spareAsset")){
                local.assetId = getUtilities().decryptId(trim(ARGUMENTS.spareAsset));
                local.getSoftware = getDBUtils().getSoftwareByAssetId(local.assetId);
                local.getSoftware = getUtilities().addEncryptedColumn(local.getSoftware,"sw_id");
                addToRequest("qSpareSoftware",local.getSoftware);
                addToFormRequest("spareSoftwareId",trim(valuelist(local.getSoftware.encrypted_sw_id)));     
            }*/
            
        if(Structkeyexists(ARGUMENTS,"spareSoftwareId")){
                local.swIds = getUtilities().decryptIdList(trim(ARGUMENTS.spareSoftwareId));
                addToRequest("decryptedIds",local.swIds);
                local.getSoftware = getDBUtils().getSoftwareById(local.swIds);
                addToRequest("records",local.getSoftware.recordcount);
                local.getSoftware = getUtilities().addEncryptedColumn(local.getSoftware,"sw_id");
                addToRequest("qSpareSoftware",local.getSoftware);
                addToFormRequest("spareSoftwareId",trim(valuelist(local.getSoftware.encrypted_sw_id)));     
        }else if(Structkeyexists(ARGUMENTS,"spareAsset")){
                local.assetId = getUtilities().decryptId(trim(ARGUMENTS.spareAsset));
                local.getSoftware = getDBUtils().getSoftwareByAssetId(local.assetId);
                local.getSoftware = getUtilities().addEncryptedColumn(local.getSoftware,"sw_id");
                addToRequest("qSpareSoftware",local.getSoftware);
                addToFormRequest("spareSoftwareId",trim(valuelist(local.getSoftware.encrypted_sw_id)));     
            }	
        
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = rc.httpReferer;   
        } 
        
        redirect(local.page,true); 
        
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
    
    remote any function getPartsByNoun(string noun="", string partNo = ""){
        var local = {};
        ARGUMENTS.programId = getSessionFacade().getProgramIdSetting();
        
        if(len(trim(ARGUMENTS.noun))){ 
                getSessionFacade().removeValue("sparesCriteria");
                getSessionFacade().setValue("spareNouns",ucase(trim(ARGUMENTS.noun)));
        }
        
        
        return getDropDownDao().getPartsByNounPart(argumentCollection=ARGUMENTS);		
    }
    
}