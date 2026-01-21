import cfc.facade.SessionFacade;
import cfc.model.Asset;
import cfc.model.PartList;
import cfc.model.Attachments;
import cfc.utils.javaLoggerProxy;
import cfc.utils.utilities;
import cfc.dao.DBUtils;   
import cfc.service.IMPULSService;

import acts.controller.configurationController;

component hint="Configuration Business Object"  output="false"
{
	
	variables.instance={
       componentName = "ConfigBO",
       javaLoggerProxy = new  javaLoggerProxy(),
       sessionFacade = new SessionFacade(),
       utilities = new utilities(), 
       objectFactory = '',
       assetService = '',
       locationService = '',
       dbUtils = ''
    };
    
    
     /* init */
    public function init() {
        /* return success */
        return this;
    }
    /* Get Component Name */
    public any function getComponentName(){
        var local = {};
        if(StructKeyexists(getMetaData(this),"name")){
           variables.instance.componentName = getMetaData(this).name;   
        }
       return variables.instance.componentName;      
    }
    
    //Insert attachments
    public Array function insertAttachment(required Array attachment) {
    	var attachmentsService = application.objectFactory.create("AttachmentsService");
    	
    	//
    	for(i = 1; i LTE ArrayLen(arguments.attachment); i = i + 1) {
    		
    		local.attachmentsService.createAttachments(arguments.attachment[i]);
    		};
    	
    	return arguments.attachment;
    }    
    
    /* Java Logger Proxy */
    public any function getJavaLoggerProxy(){
       return variables.instance.javaLoggerProxy;      
    }
    
    public any function getAssetService(){
       if(isSimpleValue(variables.instance.assetService)){
           variables.instance.assetService = getObjectFactory().create("AssetService");    
        }       
       return variables.instance.assetService;      
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
    
    /*get Utilities */
    public any function getUtilities(){
        return variables.instance.utilities;      
    }
    
    public any function getLocationService(){
       if(isSimpleValue(variables.instance.locationService)){
           variables.instance.locationService = getObjectFactory().create("LocationService");    
        }       
       return variables.instance.locationService;      
    }
	
	public any function populateAsset(){
       variables.instance.asset = new Asset();
       return variables.instance.asset;      
    }
    
   
    /* get Session Facade */
    public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }
	
	/* Create Asset */
    public Asset function createAsset(Required Asset asset) {
        var local = {};
        local.assetService = getAssetService();

         transaction {
         	try {
                // insert asset
                local.result = local.assetService.createAsset(arguments.asset);
                // commit transcation
                TransactionCommit();
                return local.result;
            } catch (any e) {
                TransactionRollback();
                throw(type="CreateException", message=e.message, detail=e.detail);
            } 
 
         };

    }

	
	
}