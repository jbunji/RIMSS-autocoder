import cfc.facade.SessionFacade;
import cfc.facade.SessionRequestFacade;
import cfc.factory.ObjectFactory;
import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;
import cfc.utils.QueryIterator;
import cfc.utils.utilities;
import acts.bo.InventoryBO;
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
	
    
    public void function sendEmail(required struct formRequest){
    	local = {};
		local.page = getRootPath() & "/help/help.cfm";
		
    	validate(formRequest);
    	
    	addToRequest("success", {message="Thank you for submitting your Help Desk Request Ticket!"});
    	
    	addToRequest("send", true);
    	redirect(local.page,true); 
    }
    
 	public void function validate(required struct formRequest){
 		
 		if (!StructKeyExists(arguments.formRequest, "commPhone") or arguments.formRequest.commPhone EQ "") {
            throw (type="FormException", message="Comm Phone cannot be empty", detail="Please enter a Comm Phone");
        }
        if (!StructKeyExists(arguments.formRequest, "description") or arguments.formRequest.description EQ "") {
            throw (type="FormException", message="Description cannot be empty", detail="Please enter a Description");
        }
        if (!StructKeyExists(arguments.formRequest, "email") or arguments.formRequest.email EQ "") {
            throw (type="FormException", message="Email cannot be empty", detail="Please enter a Email");
        }
        if (!StructKeyExists(arguments.formRequest, "organization") or arguments.formRequest.organization EQ "") {
            throw (type="FormException", message="Organization cannot be empty", detail="Please enter a Organization");
        }
        if (!StructKeyExists(arguments.formRequest, "subject") or arguments.formRequest.subject EQ "") {
            throw (type="FormException", message="Subject cannot be empty", detail="Please enter a Subject");
        }
        if (!StructKeyExists(arguments.formRequest, "submittedby") or arguments.formRequest.submittedby EQ "") {
            throw (type="FormException", message="Submitted By cannot be empty", detail="Please enter a Submitted By");
        }
       
 	}
    
}