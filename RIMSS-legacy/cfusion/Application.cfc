component  output="false"
{
    variables.rc = {};
    
    //Hold executionStartTime
    variables.executionStartTime = getTickCount();
    
    // application variables
    this.name = hash(getDirectoryFromPath(getCurrentTemplatePath()));
    this.applicationName = "RIMSS";
    this.datasource = "GLOBALEYE";
    this.applicationTimeout = CreateTimeSpan(0,8,0,0);
    
    this.sessionManagement = "true";
    this.sessionTimeout = CreateTimeSpan(0,0,30,0);
    this.scriptprotect = "all";
    this.setClientCookies = "false";  // use JSESSIONID
    this.setDomainCookies = "false";
    
    this.mappings["/cfc"]=replace(GetDirectoryFromPath(GetCurrentTemplatePath()),'\','/','ALL') & "cfc/";
    this.mappings["/acts"]=replace(GetDirectoryFromPath(GetCurrentTemplatePath()),'\','/','ALL') & "acts/";
    this.mappings["/ards"]=replace(GetDirectoryFromPath(GetCurrentTemplatePath()),'\','/','ALL') & "ards/";
    this.mappings["/criis"]=replace(GetDirectoryFromPath(GetCurrentTemplatePath()),'\','/','ALL') & "criis/";
    this.mappings["/default"]=replace(GetDirectoryFromPath(GetCurrentTemplatePath()),'\','/','ALL') & "default/";
    this.mappings["/236"]=replace(GetDirectoryFromPath(GetCurrentTemplatePath()),'\','/','ALL') & "236/";
    this.mappings["/ASQ-236"]=replace(GetDirectoryFromPath(GetCurrentTemplatePath()),'\','/','ALL') & "236/";
    this.mappings["/appRoot"]=replace(GetDirectoryFromPath(GetCurrentTemplatePath()),'\','/','ALL');
    
    variables.sessionkey = this.applicationName & 'Context';

    //import cfc paths
    import cfc.facade.SessionFacade;
    import cfc.facade.SessionRequestFacade;
    import cfc.factory.ObjectFactory;
    import cfc.utils.Datasource;
    import cfc.utils.javaLogger;
    import cfc.utils.javaLoggerProxy;
    import cfc.utils.SettingLib;
    import cfc.utils.tagLib;
    import cfc.utils.utilities;


    if(Structkeyexists(url,"reinit")){
        this.sessionTimeout = createTimeSpan( 0, 0, 0, 1 );	
    }


    public boolean function onApplicationStart() {
        var local = {};

        //Read application settings from config file
        //Set defaults
        APPLICATION.name = this.applicationName;
        APPLICATION.subTitle = "RAMPOD Inventory & Maintenance Software System";
        APPLICATION.datasource = this.datasource;
        APPLICATION.initialized = Now();
        
        application.rootpath = getPageContext().getRequest().getContextPath();
        if (!len(trim(application.rootpath))) {
            application.rootpath = getApplicationRootPath();
        } else {
        	//remove last '/' if exists.  Web Logic sometimes adds an ending slash on the context_root
        	application.rootPath = rereplacenocase(application.rootPath,"[\\/]+$","","all");
        }

        APPLICATION.ApplicationVersion = getAppVersion();
        local.profile = 'application';
        local.profileSections = getProfiles();
        local.getConfigFile = getProfileConfig();
        
        if(Structkeyexists(local.profileSections,local.profile)){
            local.profileArray = ListToArray(local.profileSections[local.profile]);
            for(local.key in local.profileArray){
                local.value = getProfileString(getConfigFile, profile, key);
                if(len(trim(local.value))){
                    APPLICATION[local.key] = getProfileString(getConfigFile, profile, key);
                }
            }   
        }

        //Global Default Paths
        local.currentTemplate = rereplacenocase(getDirectoryFromPath(getCurrentTemplatePath()),"[\\/]+$","","all");
        local.defaultLogPath = local.currentTemplate & "/#application.name#/logs";
        local.defaultMappingPath = local.currentTemplate & "/#application.name#/mappings";
        local.systemProps = createObject("java","java.lang.System").getProperties();
        
        if(isDefined("local.systemProps") && isStruct(local.systemProps) && Structkeyexists(local.systemProps,"user.home")){
        	//Set the paths to the java user.home directory as the default paths
        	local.userHome = rereplacenocase(local.systemProps['user.home'],"[\\/]+$","","all");
            local.defaultLogPath = local.userHome & "/#application.name#/logs";
            local.defaultMappingPath = local.userHome & "/#application.name#/mappings";      
        }
        APPLICATION.logPath = replace(local.defaultLogPath,'\','/','ALL');
        APPLICATION.mappingPath = replace(local.defaultMappingPath,'\','/','ALL');
        APPLICATION.settings = this;
        APPLICATION.javaLogger = new javaLogger(logName='#application.name#', directory="#local.defaultLogPath#");
        
        //initialize application objects
        APPLICATION.sessionManager = new SessionFacade();
        APPLICATION.settinglib = new SettingLib();

        local.objDatasource = new Datasource(this.datasource);
        
        APPLICATION.objectFactory = new  cfc.factory.ObjectFactory(local.objDatasource);   

        return true;
    }

    public void function onSessionStart() {
        var local = {};
        local.utils = new utilities();
        
        
        /*if(findnocase("jsessionid",session.urlToken)){
	        try{
	           tagLib.setCookie(name="jsessionid",expires="now");      
		    }catch(any e){}  
		    
		    local.req = getPageContext().getRequest();
	        local.res = getPageContext().getResponse();
		       
	        local.path = application.rootpath;
	        local.domain = CGI.server_name;
	        local.httpOnly = "HTTPOnly";
	        local.secure = "";
	   
	        local.header = "JSESSIONID" & "=" & SESSION.sessionid & ";path=" & local.path & "; " & local.HTTPOnly;
	        local.res.addheader("Set-Cookie",local.header);
        }*/
        
        
        application.sessionManager.setValue("initialized",now());
        application.sessionManager.setValue("configuration", "configurationDepot.cfm");
        session.ackMessage = false;
        
         //default SubSection
         application.sessionManager.setSubSection("AIRBORNE");
         
         //default BacklogSubSection
         application.sessionManager.setSubSection("AIRBORNE");
         
         application.sessionManager.getSecretKey();

        var userModel = getPageContext().getRequest().getSession().getAttribute("userModel");
        var userModel = createObject("java","mil.af.robins.rampod.security.model.UserModel").init();
        
        
        
        local.user = local.utils.getRemoteUser();
        //local.user = "JUSTIN.BUNDRICK";
        //local.user = "KEVIN.LOVETT";


        application.sessionManager.clearSessionVariables();
        
        local.securityManager = createObject("java","mil.af.robins.rampod.security.dao.SecurityManager").init();
        
        
        
        
        if(isDefined("local.user") and len(trim(local.user))){
            local.userModel = local.securityManager.getUserModel(JavaCast('String',local.user));
            session.security = CreateObject("component","cfc.utils.security").init(application.datasource,user);
            //APPLICATION.javaLogger.setUser(ucase(trim(local.user)));
        }
        
        //Used only when jsessionId is not enabled
        if(isDefined("SESSION.cfid")){
            cookie.cfid = SESSION.cfid;	
        }
        
        if(isDefined("SESSION.cftoken")){
            cookie.cftoken = SESSION.cftoken; 
        }
        
        
        if (!application.sessionManager.userExists()) {
            application.sessionManager.createSessionUser();
            application.sessionManager.createUserSettings();
        }

        if (IsDefined("local.userModel") and !application.sessionManager.userModelExists()) {
            application.sessionManager.setUserModel(local.userModel);
        }
    }
    
	    /**
	@hint "Runs when a session ends."
	@SessionScope "The Session scope"
	
	@ApplicationScope "The Application scope"
	*/
	public void function onSessionEnd(required struct SessionScope, struct ApplicationScope=structNew()) {
	    var local = {};
        
        
        dirMgr = CreateObject("component", "cfc.utils.Directory_Mgr");
        dirMgr.deleteDir("KEVIN.LOVETT"); 
        
        local.reqData = getHTTPRequestData();
        
        
	   if(not StructKeyExists(local.reqData.headers,"Session-Expired")){
                local.tagLib.HTTPHeader("Session-Expired","1"); 
            }
	return;
	}
    
    public void function onError(required any exception,required String eventName) {
        var local = {};
        
        local.tagLib = new tagLib();
        local.utils = new utilities();
        
        //Increase the request timeout so we can log the errors
        local.tagLib.requestTimeout((((getTickCount()-variables.executionStartTime)/1000)+10));

        local.cause = local.utils.getCause(ARGUMENTS.exception);
        
        addToRequest("ajaxErrorClass","global_error_msg");    

        
        
        if(isAJAXRequest()){
           addToRequest('isAjaxError',true);
        }
        
        
        //request.error = ARGUMENTS;
        addToRequest("error",local.cause);
        
        
        local.deniedErrors = [
        'UnauthorizedUser',
        'UnknownUser',
        'MissingTemplate',
        'mil.af.robins.rampod.security.dao.DataLevelSecurityException'
        ];
        
        local.infoErrors = [
        'MissingTemplate'
        ];
        
        
        //aborts cause onError to fire
        if(isDefined("arguments.exception.rootCause") and arguments.exception.rootCause eq "coldfusion.runtime.AbortException"){
            return;	
        }
        
        
        
        local.isDeniedError = false;
         local.isInfoError = false;
        local.errorType = "";
        
            for(local.e=1;local.e<=ArrayLen(local.deniedErrors);local.e++){
                if(isDefined("local.cause.stacktrace") and findNocase(local.deniedErrors[local.e],local.cause.stacktrace)){
                    local.isDeniedError = true;
                    rc.errorType = local.deniedErrors[local.e];
                    break;	
                }else if(isDefined("local.cause.type") and findNocase(local.deniedErrors[local.e],local.cause.type)){
                    local.isDeniedError = true;
                    rc.errorType = local.deniedErrors[local.e];
                    break;  	
                }	
            }
            
            for(local.e=1;local.e<=ArrayLen(local.infoErrors);local.e++){
                if(isDefined("local.cause.stacktrace") and findNocase(local.infoErrors[local.e],local.cause.stacktrace)){
                    local.isInfoError = true;
                    rc.errorType = local.infoErrors[local.e];
                    break;  
                }else if(isDefined("local.cause.type") and findNocase(local.infoErrors[local.e],local.cause.type)){
                    local.isInfoError = true;
                    rc.errorType = local.infoErrors[local.e];
                    break;      
                }   
            }
            
        if(local.isDeniedError){
        	addToRequest("ajaxErrorClass","global_notice_msg"); 
        }
        
        if(local.isInfoError){
            addToRequest("ajaxErrorClass","global_info_msg"); 
        }
        
        if( isDefined("arguments.exception.rootcause.message") && arguments.exception.rootcause.message == "SessionTimeout"){
            addToRequest("sessionHasExpired",true);   	
        }
        
         
        
        //getPageContext().getcfoutput().clearall();
		local.tagLib.contentReset();
		
		if(isAjaxRequest()){
			//throw(object=ARGUMENTS.exception);
			include "error/ajax.cfm";
            abort;
		}else{
        	include "error/index.cfm";
        	abort;            
        }
        
    return;
    }

    public boolean function onRequestStart(required String targetPage) output=false {
        var local = {};
        local.tagLib = new tagLib();
        local.utils = new utilities();
        local.req = getPageContext().getRequest();
        local.user = local.utils.getRemoteUser();
        local.urlStruct = {};
        local.formStruct = {};
        local.newUser = false;
        
        if ( isDefined('URL') ){
            local.urlStruct = Duplicate(URL);
        }
        
        if ( isDefined('FORM') ){
            local.formStruct = Duplicate(FORM);
        }

        //Default debug output settings to false
        local.tagLib..showDebugOutput(false);
        //application.settinglib.setShowDebugOutput(false);

        if (isDefined("url.reinit") or isDefined("url.init")) {
//            OnSessionEnd();
            //getPageContext().getSession().invalidate();
            try{
            	onApplicationStart();
            	onSessionStart();
                //local.utils.expireSession();
            }catch(any e){
            }
            
            try{
            	//onApplicationStart();
                applicationStop();
                //onSessionStart();
            }catch(any e){}

            location(url = APPLICATION.rootPath & "/",addToken = false);
        }   
        
        if (isDefined("url.logout")) {

            location(url = APPLICATION.rootPath & "/Logout.cfm",addToken = false);	
        }
        
        /*if ( !structKeyExists( request, 'context' ) ) {
            request.context = {};
  
        }*/
        
        //request test
        // ensure request.context is available
        param name="request.context" default="#{ }#";
        param name="request.context.urlStruct" default="#{ }#";
        
        local.reqData = getHTTPRequestData();
       
       if(isDefined("local.reqData.headers") and StructKeyExists(local.reqData.headers,"Referer")){
            addToRequest("httpreferer",local.reqData.headers['Referer']);      
       }
       
        addToRequest("httpRequest",local.reqData);  
        
        
        if ( isDefined('URL') ){
            structAppend(request.context,local.urlStruct);
            request.context['url'] = local.urlStruct;
        } 

        if ( isDefined('form') ){
            structAppend(request.context,local.formStruct);
            request.context['formStruct'] = local.formStruct;
            
        } 

        restoreFlashContext();
        variables.rc = request.context; 
        
        
            local.currentPage = replacenocase(ARGUMENTS.targetPage,"\","/","ALL");
            if(cgi.script_name eq application.rootPath & "index.cfm" ){
                request.ignorePrivs = true;    	
            }

        /*if(not application.sessionManager.getUserSettingsFlag() and (not findnocase("Login.cfm",local.currentPage) and not findnocase("userSettings.cfm",local.currentPage) and not findnocase("Logout.cfm",local.currentPage) and not isDefined("request.error"))){
           
            if(not getPageContext().getResponse().containsHeader("Session-Expired")){
                local.tagLib.HTTPHeader("Session-Expired","true");  
            }
        }*/
        
        
        if(!application.sessionManager.userModelExists() and isDefined("local.user") and len(trim(local.user))){
            onSessionStart();	
        }

        //Used only while local development (login.cfm) 
        if(not isDefined("local.user") or isDefined("local.user") and not len(trim(local.user))){
	        if (IsDefined("rc.username") and len(trim(rc.userName))){
	        	local.securityManager = createObject("java","mil.af.robins.rampod.security.dao.SecurityManager").init();
	            local.userModel = securityManager.getUserModel(JavaCast('String',trim(rc.username)));
	            local.newUser = true;
	           
	           // APPLICATION.javaLogger.setUser(ucase(trim(rc.username)));

            }
        }
        
        
                
        
        if (IsDefined("local.userModel") /*and !application.sessionManager.userModelExists()*/){
            if(local.newUser){
                application.sessionManager.clearSessionVariables(); 
            } 
            	
            application.sessionManager.setUserModel(local.userModel);  
            
        }

        if (IsDefined("url.debugout") and isBoolean(url.debugout)) {
            application.settinglib.setShowDebugOutput(url.debugout);
        }
        
        if (IsDefined("url.logLevel") and len(trim(url.logLevel))) {
        	lock type="exclusive" name="applicationJavaLoggerLevel" timeout="10" {
                application.javaLogger.setLevel(ucase(trim(url.logLevel)));
            }
        }
        
        
        //load session user security module
        local.userModel = application.sessionManager.getUserModel();
        
        local.programs = "";
        local.units = "";
        local.hasPrograms = false;
        local.hasUnits = false;
        local.maintLevels = "";
        local.hasMultipleMaintLevels = false;

        if(not findnocase("Login.cfm",ARGUMENTS.targetpage) and not findnocase("Logout.cfm",ARGUMENTS.targetpage) ){
	        if((application.sessionManager.userModelExists() and len(trim(application.sessionManager.getUserName())))){
				
				//make sure the application.sessionmanager settings are run once
				if(application.sessionManager.isUserLoggedOn() and !application.sessionManager.checkUserSettings()){
					
						try{
							//Give user initial access
							application.sessionManager.setUserAccessFlag(true);
							local.dbUtils = dbUtils = application.objectFactory.create("DbUtils");
							local.programs = local.dbUtils.getUserPrograms(application.sessionManager.getUserModel());
							local.units = local.dbUtils.getUserUnits(application.sessionManager.getUserModel());
		                    
		                    //Check for single user program/unit
		                    if(IsDefined("local.programs") and isQuery(local.programs)){
		                        if(local.programs.recordcount eq 1){
		                            application.sessionManager.setProgramSetting(local.programs.CODE_VALUE);
		                            application.sessionManager.setProgramIdSetting(local.programs.CODE_ID);
		                        }
		                        
		                    }
		                    
		                    if(IsDefined("local.units") and isQuery(local.units)){
		                        if(local.units.recordcount eq 1){
		                            application.sessionManager.setUnitSetting(local.units.UNIT);
		                            application.sessionManager.setLocIdSetting(local.units.LOC_ID);   
		                        }
		                       
		                    }
		                }catch(mil.af.robins.rampod.security.dao.DataLevelSecurityException e){
		                  //User does not have program/unit access
		                  application.sessionManager.setUserAccessFlag(false);
		                  rethrow; 	
		                }   

					//Check Source Cat & Maint level permissions
					if(application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_SHOP") 
					&& !application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_DEPOT")
					&& !application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_ALL")
					){
						//Only has SHOP access
					    application.sessionManager.setSourceCatSetting("I");
					    application.sessionManager.setMaintLevelSetting("SHOP");
					    
					}else if(application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_DEPOT") 
					&& !application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_SHOP")
					&& !application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_ALL")){
						
						//Only has DEPOT access
					    application.sessionManager.setSourceCatSetting("D");
					    application.sessionManager.setMaintLevelSetting("DEPOT"); 
					         
					}
	                
	                //Check to make sure all settings are set (this is run to set the settingsFlag when a user has access to one program/unit)
	                application.sessionManager.checkUserSettings();
	                

				}

	        }else{
	        	   if(isAjaxRequest()){ 
	        	   	  //Create an ajax error to tell the ajax to redirect in the global ajaxError function (functions.js) 
	        	      getpagecontext().getresponse().setstatus(403);
	        	      abort;
	        	      /*addToRequest("sessionHasExpired",true);
	        	      if(!findnocase("userSettings",ARGUMENTS.targetPage)){
	        	          throw(message="Unable to find user",type="UnknownUser", errorCode="403"); 
	        	      }	 
	        	      */    
	        	   }else{
	        	   	   if(!findnocase("impuls",ARGUMENTS.targetpage)){
	        	          throw(message="Unable to find user",type="UnknownUser");   
					  }      	   
	        	   }
  	
	        }

	        //Check User Settings to see if they have already been set
	        if(!application.sessionManager.checkUserSettings()){ 
	            local.mainPage = replacenocase(application.rootpath & "/index.cfm","/","\","ALL");
	            local.target = replacenocase(ARGUMENTS.targetpage,"/","\","ALL");
	            addToRequest("notice",{message="One or more user settings must set"});
	            if(not findnocase(local.mainPage,local.target) and not findnocase("userSettings",local.target) and not findnocase("\dialogs",local.target) and not findnocase("\error",local.target) and not findnocase("impuls",local.target) and not findnocase("\cfc",local.target)){
                    addToRequest("userSettingsSet",false);
                    throw(message="One or more user settings must set",type="UnknownUser");
                          
	            }
	        }
	        
        
       }

        
        variables.rc = request.context; 
        
        mapSessionToRequest();
        
        // ACTS ONLY: The BOM configuration applies to only SHOP. DEPOT uses default functionality 
        if ((application.sessionManager.getMaintLevelSetting() EQ 'DEPOT') && findnocase('/acts/configuration/configuration.cfm',CGI.script_name)){
        	redirect("configurationDepot.cfm",true);
        }
		
        return true;
    }
    
   
   public void function redirect(String url, boolean persist=false){
        
        
        if( ARGUMENTS.persist ){
            
            saveFlashContext();
            
        }
        location ( url, false);
        
        
    }
    
    public string function mapProgram(String program){
	   var local = {};
	   local.programs = {
	   	'ASQ-236'='236'	   	   
	   };
	   
	   if(Structkeyexists(local.programs,UCASE(TRIM(ARGUMENTS.program)))){
	       return local.programs[UCASE(TRIM(ARGUMENTS.program))];	   
	   }else{
	       return ARGUMENTS.program;	   
	   }
	   
	}
    
    
	public void function saveFlashContext() {
	        try {
	            param name="session.#variables.sessionkey#" default="#{ }#";
	            structAppend( session[ variables.sessionkey ], request.context );
	        } catch ( any ex ) {
	            // session scope not enabled, do nothing
	        }
	
	    }

    
    
	public void function restoreFlashContext() {
	        try {
	            if ( structKeyExists( session, sessionkey ) ) {
	                structAppend( request.context, session[ sessionkey ], false );
	                structDelete( session, sessionkey );
	
	            }
	        } catch ( any e ) {
	            // session scope not enabled, do nothing
	        }
	    }

    
   /*public void function onRequestEnd(Required String targetPage){
        var local = {};
    }*/

    public void function onRequest(required string targetPage) { 
    	var local = {};
    	
    	//Sanitizes input values for XSS Attacks
    	sanitizeInputs(); 
    	encodeScopes(); 
    	
    	combineUrlStructs();
        
        if ( isDefined('URL') ){
        	local.urlStruct = Duplicate(URL);
            structAppend(request.context,local.urlStruct);
            request.context['url'] = local.urlStruct;
        } 

        if ( isDefined('form') ){
        	local.formStruct = Duplicate(FORM);
            structAppend(request.context,local.formStruct);
            request.context['form'] = local.formStruct;
            
        } 

        variables.rc = request.context; 
              
        include arguments.targetPage;
    return;
    }
    
    public boolean function onMissingTemplate(required string template){
        addToRequest("missingTemplate",ARGUMENTS.template);
        this.onRequestStart( ARGUMENTS.template );
        this.onRequest( ARGUMENTS.template );

     return true;   	
    }
    
	/*public function onCFCRequest(required string cfcname,required string method,required struct args) {
	        var local = {};
            //if(not isAJAXRequest()){
	           //APPLICATION.javaLogger.info(message="Arguments: #SerializeJSON(args)#",sourceClass=ARGUMENTS.cfcName,methodName=ARGUMENTS.method);
	        //}
	        local.comp = createObject("component", arguments.cfcname);
	        local.res = evaluate("local.comp.#arguments.method#(argumentCollection=arguments.args)");
	        
	        if(isDefined("local.res")){
	            return local.res;	
	        }else{
	            return;	
	        }
	
	    }*/

    private void function combineUrlStructs(){
        if(isDefined("request.context.urlStruct") && isDefined("request.context.url")){
            StructAppend(request.context.url,request.context.urlStruct);
            StructDelete(request.context,"urlStruct");
        }   
        
    }
    
    public void function addToRequest(any name, Any value){
        if(isStruct(Arguments.Name)){
            StructAppend(request.context,Duplicate(ARGUMENTS.Name));
        }else{
            request.context['#name#'] = value;
        }
    }
    
    public void function addToFormRequest(String name, Any value){
        if(!Structkeyexists(request.context,"form")){
            request.context.form = {};
        }
        request.context.form['#name#'] = value;
        
    }
    
    public void function addFormToRequest(required struct formRequest,boolean append=false){
        if(!Structkeyexists(request.context,"form")){
            request.context.form = {};
        }
        if(ARGUMENTS.append){
            StructAppend(request.context.form,Duplicate(ARGUMENTS.formRequest));
        }else{
            request.context.form = duplicate(ARGUMENTS.formRequest);
        }
    }
    
    public void  function appendToFormRequest(required struct formRequest){
        addFormToRequest(formRequest = arguments.formRequest,append=true);
    }

    private String function getApplicationRootPath(){
        var local = {};
        local.objPattern = CreateObject( "java", "java.util.regex.Pattern" ).Compile( "^/{1}.[A-Za-z0-9_-]+" );
        local.objMatcher = objPattern.Matcher( getPageContext().getRequest().getServletPath() );
        local.objMatcher.find();
        local.sPath = objMatcher.group();// & "/";
        return local.sPath;
        
        //may need to uncomment if there are any sub-applications
        local.tempPath = ReplaceNoCase(ReplaceNocase(getDirectoryFromPath(getCurrentTemplatePath()),"\","/","ALL"),"/cfusion/","/","ALL");
        local.start = FindNoCase(local.sPath,local.tempPath);
        if(local.start > 0){
            return Mid(local.tempPath,local.start,Len(trim(local.tempPath))-local.start);
        }else{
            return local.sPath;	
        }
        
    }
    
    private struct function getProfiles(){
        var local = {};
        local.profiles = {};
        local.getConfigFile = getProfileConfig();
        if(len(trim(local.getConfigFile))){
            local.profiles = getProfileSections(local.getConfigFile);   
        }
        return local.profiles;  
    }
    
    private String function getProfileConfig(){
        var local = {};
        local.profiles = [];
        local.getConfigFile='';
        local.directory = ReplaceNocase(getDirectoryFromPath(getCurrentTemplatePath()),"\","/","ALL");
        local.directory = ReplaceNoCase(local.directory,"/admin/","/","ONE");
        local.configFile =ReplaceNocase(local.directory & "config\appConfig.cfm","\","/","ALL");
        local.checkConfigFile = FileExists(local.configFile);
        if(local.checkConfigFile){
            local.getConfigFile =local.configFile;  
        }
        local.getConfigFile = replacenocase(local.getConfigFile,"\","/","ALL");
        return local.getConfigFile;
    }
    
    private String function getAppVersion() {
        var result = "";
        if (FileExists(getDirectoryFromPath(getCurrentTemplatePath()) & '/config/appConfig.cfm')) {
            result = getProfileString(getDirectoryFromPath(getCurrentTemplatePath()) & '/config/appConfig.cfm',"application", "version");
        }
        return result;
    }

    public void function mapSessionToRequest(){
        var local = {};
        //Add Session keys into the REQUEST scope
        if(isDefined("rc.form")){
            StructAppend(form,rc.form,true);	
        }
        
    }

    public boolean function isAJAXRequest() {
        var local = {};
        local.reqData = getHTTPRequestData();
        if(Structkeyexists(local.reqData.headers, "X-Requested-With") and local.reqData.headers["X-Requested-With"] eq "XMLHttpRequest"){
           try{
               application.settinglib.setShowDebugOutput(false);
               //local.req = getPageContext().getRequest().a
            }catch(any e){}
           return true;         
        }
        return false;
    }   
    
    
    public void function encodeScopes(){
        var local = {};
       local.utils = new cfc.utils.utilities();
        
       if(isDefined("URL") and isStruct(URL)){
            for(local.u in URL){
                if(isSimpleValue(URL[local.u])){
                    URL[local.u] = local.utils.encodeForURL(URL[local.u]);
                }
            }   
        }
       
       
       local.req = getHTTPRequestData();
       local.method = local.req.method;
       
       /*if(UCASE(TRIM(local.method)) == "GET"){
       	   
            if(isDefined("FORM") and isStruct(FORM)){
            for(local.f in FORM){
                if(isSimpleValue(FORM[local.f])){
                    FORM[local.f] = local.utils.encodeForHTML(FORM[local.f]);
                }
            }   
        }
       }*/
    }
    
    public string function sanitize(string text = ""){
       var local = {};
       local.text = ARGUMENTS.text;
       local.text = REReplaceNoCase(local.text,"<[^>]*>","","ALL");
       local.text = ReReplaceNoCase (local.text, "<script.*?>.*?</script>", "", "all");
       local.text = ReReplaceNoCase (local.text, "<invalidtag.*?>.*?</invalidtag>", "", "all");
       local.text = rereplacenocase(local.text, "<a.*?>(.*?)</a>", "\1", "all"); 
       local.text = ReReplaceNoCase (local.text, '<[^>]*="javascript:[^"]*"[^>]*>', '', 'all');
       local.text = ReReplaceNoCase (local.text, '<!--', '', 'all');
       return local.text;  
    }
    
    public void function sanitizeInputs(){
        var local = {};
        
		try
        {
        	//local.utils = new cfc.utils.utilities();
	        
	        if(isDefined("URL") and isStruct(URL)){
	            for(local.u in URL){
	            	if(isSimpleValue(URL[local.u])){
	                    URL[local.u] = sanitize(URL[local.u]);
	                }
	            }	
	        }
	        
	        if(isDefined("FORM") and isStruct(FORM)){
	            for(local.f in FORM){
	                if(isSimpleValue(FORM[local.f])){
	                    FORM[local.f] = sanitize(FORM[local.f]);
	                }
	            }   
	        }
	        
	        
        }
        catch(Any e)
        {
        	writeLog(text="#e.message#", file="RIMSSDebug");
        }

        
    
    }
    
    
    
}