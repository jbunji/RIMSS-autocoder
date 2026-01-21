<cfsilent>

    <cfscript>
        param name="request.context" default="#{ }#";
        
        import cfc.facade.SessionRequestFacade;
        import cfc.facade.SessionFacade;
        import cfc.utils.javaLoggerProxy;
        import cfc.utils.import.importSortie;
        import cfc.utils.utilities;
        import default.controller.configurationController;
        import default.controller.maintenanceUIDController;
        import default.controller.sortieController;
        
        if ( isDefined('URL') ){
            local.urlStruct = Duplicate(URL);
        }
        
        if ( isDefined('FORM') ){
            local.formStruct = Duplicate(FORM);
        }
        
        if ( isDefined('URL') ){
            structAppend(request.context,local.urlStruct);
            request.context['url'] = local.urlStruct;
        } 

        if ( isDefined('form') ){
            structAppend(request.context,local.formStruct);
            request.context['form'] = local.formStruct;
            
        } 

    variables.instance = {
        action="",
        componentName = "",
        javaLoggerProxy = new  javaLoggerProxy(),
        locationService = '',
        objectFactory = '',
        sessionFacade = new SessionFacade(), 
        sessionRequestFacade = new SessionRequestFacade(), 
        utilities = new utilities()
    };

    public any function init(String action = getAction()){
      setAction(ARGUMENTS.action);
  
       return this;   
    }
    
    public any function getSessionRequestFacade(){
       return variables.instance.sessionRequestFacade;      
    }
    
    public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }
    
    public any function getJavaLoggerProxy(){
       return variables.instance.javaLoggerProxy;      
    }
    
    public any function getComponentName(){
        var local = {};
        /*if(StructKeyexists(getMetaData(this),"name")){
           variables.instance.componentName = getMetaData(this).name;   
        }*/
        variables.instance.componentName = cgi.script_name;
       return variables.instance.componentName;      
    }
    
    public any function getRootPath(){
       return Application.rootPath;      
    }
    
    public any function getUtilities(){
       return variables.instance.utilities;      
    }
    
    public any function getProgram(){
       return lcase(trim(getSessionFacade().getProgramSetting()));      
    }
    
    public String function getAction(){
    
       return variables.instance.action;    
    }
    
    public any function getUser(){
       return getSessionFacade().getUserName();      
    }
    
    public any function getObjectFactory(){
        if(isSimpleValue(variables.instance.objectFactory)){
           variables.instance.objectFactory = APPLICATION.objectFactory;    
        }   
        return variables.instance.objectFactory;      
    }
    
    public any function getLocationService(){
       if(isSimpleValue(variables.instance.locationService)){
           variables.instance.locationService = getObjectFactory().create("LocationService");    
        }       
       return variables.instance.locationService;      
    }
    
    public any function setAction(required string action){
       variables.instance.action = trim(ARGUMENTS.action);
       return this;    
    }
    
    
    remote any function forward(required String action){
        var local = {};
        local.page = getRootPath();
        local.utils = new utilities();
        getJavaLoggerProxy().fine(message="Looking for action '#ARGUMENTS.action#'",sourceClass=getUtilities().getComponentName(this), methodName="forward");
        
            try{
                
                setAction(ARGUMENTS.action);
                
                //local.sessionRequestFacade = new sessionRequestFacade(); 
                //local.sessionRequestFacade.createSessionRequest();       
                //local.sessionRequestFacade.addFormToRequest(rc.form);
                
                
                switch(lcase(trim(ARGUMENTS.action))){

                    default:{
                        throw(message="Unknown Action '#ARGUMENTS.action#'",type="UnknownAction");
                        break;      
                    }
                  
            
                }
        }catch(any e){
            addToRequest("error",e);
            if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
                local.page = trim(rc.httpreferer); 
                local.utils.recordError(e,getComponentName(),"forward",getUser());
                redirectPage(local.page,true);
                
            }else{
                rethrow;
            }
            
        }
    }
    
    remote any function doAction(required String action) {
        var local = {};
        local.utils = new utilities();
        local.page = getRootPath();
        
        if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
            local.page = trim(rc.httpreferer); 
        }
        
            try{
                setAction(ARGUMENTS.action);
                
                local.sessionRequestFacade = new SessionRequestFacade(); 
                local.sessionRequestFacade.createSessionRequest();       
                local.sessionRequestFacade.addFormToRequest(Duplicate(form));
                local.sessionFacade = new SessionFacade();
                
                switch(lcase(trim(ARGUMENTS.action))){

                    case 'retrieve.uii': {
                        param name="form.UIICodes" default="";
                        getJavaLoggerProxy().fine(message="Sending to maintenanceUIDController.readUII()",sourceClass=getUtilities().getComponentName(this), methodName="doAction");
                        local.maintenanceUIDController= new maintenanceUIDController();
                        local.maintenanceUIDController.checkUIIRegistry(form.UIICodes);
                        redirect(local.page,true);
                    break;
                    }
                    
                    case 'retrieve.uii.pn': {
                        param name="form.enterpriseIdentifier" default="";
                        param name="form.partNumber" default="";
                        param name="form.serialNumber" default="";
                        
                        local.pedigree = [
                          {
                          	  'EnterpriseIdentifier' = trim(form.enterpriseIdentifier),
                          	  'PartNumber' = trim(form.partNumber),
                          	  'SerialNumber' = trim(form.serialNumber)
                          	  
                          }  
                        ];
                        getJavaLoggerProxy().fine(message="Sending to maintenanceUIDController.readUIIByPn()",sourceClass=getUtilities().getComponentName(this), methodName="doAction");
                        local.maintenanceUIDController= new maintenanceUIDController();
                        local.maintenanceUIDController.readUIIByPn(local.pedigree);
                        
                    break;
                    }

                    default:{
                        throw(message="Unknown Action '#ARGUMENTS.action#'",type="UnknownAction");
                        break;      
                    }
                  
            
                }
        }catch(any e){
           addToRequest("error",e);
            if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
                local.page = trim(rc.httpreferer); 
                local.utils.recordError(e,getComponentName(),"doAction",getUser());
                redirectPage(local.page,true);
            }else{
                rethrow;
            }
                 
        }
    }
    
  
   public void function redirectPage(String url, boolean persist=false){

        if( ARGUMENTS.persist ){
            saveRequestContext();
            
        }
        location ( url, false);
        
        
    }
    
    
    private void function saveRequestContext() {
            try {
                param name="session.RIMSSContext" default="#{ }#";
               
                structAppend( session[ variables.sessionkey ], request.context );
            } catch ( any ex ) {
                // session scope not enabled, do nothing
            }
    
        }
    
    
    private void function restoreRequestContext() {
            try {
                if ( structKeyExists( session, sessionkey ) ) {
                    structAppend( request.context, session[ sessionkey ], false );
                    structDelete( session, sessionkey );
                }
               
            } catch ( any e ) {
                // session scope not enabled, do nothing
            }
        }
    
    </cfscript>
    
    
   <cfparam name="request.context.method" default="forward"/> 
   <cfif isDefined('request.context.action') and isDefined("request.context.method")>
       <cfset params = {'action'=request.context.action}/>   
       <cfinvoke <!---component="#mainController#" --->method="#request.context.method#" argumentCollection="#params#"  returnvariable="results">
       <cfabort/>
    </cfif>
    
</cfsilent> 