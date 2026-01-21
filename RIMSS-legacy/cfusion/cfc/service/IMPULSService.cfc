import cfc.facade.SessionFacade;
import cfc.factory.ObjectFactory;
import cfc.utils.impuls;
import cfc.utils.utilities;

component  displayname="IMPULS Service" output="false"
{
	
	variables.instance = {
		callingUrl='http://localhost:8500/RIMSS/cfc/utils/impulsMessage.cfm',
        user = 'UNKNOWN.USER',
        parsPort = 10040,
        parsUrl = 'http://ramp6.rampod.net:10040/pars/servlet/mil.af.robins.rampod.pars.servlet.ImpulsServlet',
        objectfactory = '',
        appPort = 10052,
        utilities = new utilities(),
        sessionFacade = new SessionFacade(),
        impuls = new impuls()
    };
    
    /*TODO: Add the functions to communicate with the impuls.cfc to send request to IMPULS. */
    
    /* init */
    public function init(string user = "", string parsUrl = "", string callingUrl="") { 
        
       
        getIMPULS().setProperty("user",getUser());
        /* getIMPULS().setProperty("parsUrl",TRIM(ARGUMENTS.parsUrl));
        getIMPULS().setProperty("callingUrl",TRIM(ARGUMENTS.callingUrl));
*/
        
        findUrl();
        
        return this;
    } 
    
    public any function findUrl(){
    	//writeLog(file="Impuls" text="findUrl(): Begin...");
        local.serverPage = "http://" & getUtilities().getServerAddress();
        //local.serverPage = "http://devrmpd.rampod.net";
        //writeLog(file="Impuls" text="findUrl(): local.serverPage: #local.serverPage#");
        
        
        if(!len(trim(getIMPULS().getProperty("user")))){
            getIMPULS().setProperty("user",getUser());  
        }
        
        if(!len(trim(getIMPULS().getProperty("parsUrl")))){
            getIMPULS().setProperty("parsUrl",TRIM(local.serverPage & ":" & getParsPort() & "/pars/servlet/mil.af.robins.rampod.pars.servlet.ImpulsServlet"));
        }
       // writeLog(file="Impuls" text="findUrl(): parsUrl: #parsUrl#");   

        if(!len(trim(getIMPULS().getProperty("callingUrl")))){
            getIMPULS().setProperty("callingUrl",TRIM(local.serverPage & ":" & getAppPort()  & getRootPath() & "/cfc/utils/impulsMessage.cfm"));
            //getIMPULS().setProperty("callingUrl", getRootPath() & "/cfc/utils/impulsMessage.cfm");    
        }	
       // writeLog(file="Impuls" text="findUrl(): callingUrl: #callingUrl#");
    }
    
    public any function getParsPort(){
        return trim(variables.instance.parsPort);    
    }  
    
    public any function setParsPort(required numeric port){
    	variables.instance.parsPort = trim(ARGUMENTS.port);
        return this;    
    }  
    
    public any function getAppPort(){
        return trim(variables.instance.appPort);    
    }  
    
    public any function setAppPort(required numeric port){
        variables.instance.appPort = trim(ARGUMENTS.port);
        return this;    
    }  
    
    public any function getInstance(){
        return getIMPULS().getInstance();	
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
    
    public any function getAssetService(){
    	variables.instance.assetService = getObjectFactory().create("AssetService");
        return variables.instance.assetService;    
    }  
    
    public any function getInvAssetService(){
    	variables.instance.invAssetsService = getObjectFactory().create("InvAssetsService");
        return variables.instance.invAssetsService;    
    }  
    
    public any function getIMPULS(){
        return variables.instance.impuls;    
    }  
    
    public any function getRootPath(){
       return Application.rootPath;      
    }
    
    public any function getUtilities(){
        return variables.instance.utilities;	
    }   
    
    public any function send(struct formFields = {} ){
        return getIMPULS().send(ARGUMENTS.formFields);   
    }  
    
    public any function getInvAssetFromGEAsset(required string assetId){
    	var local = {};
    	local.result = "";
    	try{
    	   local.asset = getAssetService().getAsset(val(ARGUMENTS.assetId));
    	   if(isNumeric(local.asset.getCTAssetId()) && local.asset.getCTAssetId()){
    	       local.result = getInvAssetsService().getInvAssets(trim(local.asset.getCTAssetId()));       
    	   }
    	   
    	}catch(any e){
    		
    	}
    	
    	return local.result;
    }
    
    public any function getInvAsset(required string assetId){
        var local = {};
        local.result = "";
        try{
           local.asset = getInvAssetsService().getInvAssets(val(ARGUMENTS.assetId));
           if(isNumeric(local.asset) && local.asset){
               local.result = local.asset;       
           }
           
        }catch(any e){
            
        }
        
        return local.result;
    }

	public string function getUser(){
		var local = {};
		local.user = "";
		local.remoteUser = getUtilities().getRemoteUser();
		if(len(trim(variables.instance.sessionFacade.getUserName()))){
		  local.user =  UCASE(TRIM(variables.instance.sessionFacade.getUserName())); 
		}else if(len(trim(local.remoteUser))){
		  local.user = UCASE(TRIM(local.remoteUser));
		}
		return local.user;
    }
	
}