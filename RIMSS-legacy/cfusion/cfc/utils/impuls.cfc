component hint="Component for IMPULS transactions"  output="false"
{
	variables.instance = {
        dsn = '',
        parsUrl='',
        cookies='',
        message='',
        callingURL='',
        timeout=60,
        hasMessage=false,
        errorStruct={},
        errors=[],
        error_msg='',
        user='UNKNOWN.USER',
        logName = 'IMPULS'     
    };

	public any function init(string user="",  string parsUrl ="", string callingUrl="" ){
	   var local = {};
	       
	    //Run setup IMPULS methods
	    //getRequestCookies();
	    
	    if(len(trim(ARGUMENTS.user))){
	       setProperty("user",UCASE(TRIM(ARGUMENTS.user)));
	    }
	    
	    if(len(trim(ARGUMENTS.parsUrl))){
	       setProperty("parsUrl",TRIM(ARGUMENTS.parsUrl));
	    }
	    
	    if(len(trim(ARGUMENTS.callingUrl))){
	        setProperty("callingUrl",TRIM(ARGUMENTS.callingUrl));	
	    }
	    
	    
	    
	}

	public any function send(struct formFields = {}){
        var local = {};
        local.message = "Unknown Message";
        local.fileContent = "";
        local.httpResult = {};
        try{
        	
        	
        	
        	local.httpService = new http();
        	local.httpService.setUrl(getProperty("parsUrl"));
        	local.httpService.setMethod("POST");
        	local.httpService.setThrowOnError(true);
        	local.httpService.setTimeOut(getProperty("timeout"));
        	local.httpService.setRedirect(true);
        	local.httpService.setUserAgent("Mozilla/4.0");
        	
        	if(!Structkeyexists(ARGUMENTS.formFields,"callingUrl")){
        	   ARGUMENTS.formFields['callingUrl'] = getproperty("callingUrl");
        	}
        	
        	//getJavaLoggerProxy().fine("send() IMPULS Fields: " & SerializeJSON(arguments.formFields));
            logIMPULS("send() IMPULS Fields: #SerializeJSON(arguments.formFields)#");
        	
        	
        	//Add Parameters
            local.httpService.setUserName(UCASE(TRIM(getProperty("user"))));
            
            local.httpService.addParam(type="header", name="OAM_REMOTE_USER", value="#UCASE(TRIM(getProperty("user")))#");

            for(local.f in ARGUMENTS.formFields){
                local.httpService.addParam(type="formfield", name="#local.f#", value="#ARGUMENTS.formFields[local.f]#");    	
            }

            local.httpResult = local.httpService.send().getPrefix();
            
            if(isDefined("local.httpResult") and isStruct(local.httpResult)){
            	local.fileContent = "";
                if(Structkeyexists(local.httpResult,"fileContent") && len(trim(local.httpResult['fileContent']))){
                    local.fileContent = trim(local.httpResult['fileContent']);
                
                }
                //Parse response
                if(findnocase('PARS',local.fileContent)){
                    local.findError=regExMatch("<td.*?>(.*?)</td>",local.filecontent);	
                    if(Arraylen(local.findError) >= 2){
                        local.findError = rereplacenocase(local.findError[2], "<td.*?>(.*?)</td>", "\1", "all"); 
                        setProperty("message",local.findError);   
                    }else{
                         setProperty("message",trim(local.filecontent));	
                    }
                }
                
                setProperty("message",trim(local.filecontent));
            }

        }catch(any e){

            local.message = trim(e.message);
            if(isDefined("e.detail") && len(trim(e.detail))){
                local.message &= " " & e.detail;	
            }
            setProperty("message",local.message);

        } 
        logIMPULS("send() IMPULS Response: " & getProperty("message"));
        return getProperty("message"); 		
	}

	public any function getProperty(required String prop){
       if(not StructKeyexists(VARIABLES.instance,trim(ARGUMENTS.prop))){
           throw("Property '#ARGUMENTS.prop#' does not exist");
       }else{
           return VARIABLES.instance[ARGUMENTS.prop];
       }    
    }

    public any function setProperty(required String prop,required any value){
       VARIABLES.instance[UCase(ARGUMENTS.prop)] = ARGUMENTS.value;
       return this;   
    }
    
    public any function removeProperty(required String prop){
       structDelete(VARIABLES.instance,ARGUMENTS.prop);
       return this;   
    }
	
	private void function logIMPULS(required string message, string type = "INFO"){
	   if(len(trim(ARGUMENTS.message))){
	   	   ARGUMENTS.message = ToString(Replace(ARGUMENTS.message,'"',"''","ALL"));
	       WriteLog(type="#trim(ARGUMENTS.type)#", file="#getProperty('logName')#", application="yes", text="#getProperty('user')# : #ARGUMENTS.message#"); 
	   
	   }	
	}

    private string function getRequestCookies(){
       var local = {};
       local.req = getPageContext().getRequest();
       local.cookies="";
       
       if(isdefined("local.req")){
           local.tempcookies = local.req.getCookies();         
       }

       if(isdefined("local.tempcookies")){
           for(local.c = 1;local.c <=ArrayLen(local.tempcookies);local.c++){
               if(!refindNoCase("^cfadmin|^cfid|^cftoken|^jsessionid|^ge|^spry",local.tempcookies[local.c].getName())){
	               local.curCookie = local.tempcookies[local.c].getName() & "=" & local.tempcookies[local.c].getValue();
	               local.cookies = listprepend(local.cookies,local.curCookie,';');
               }     
           }           
       }
       //Add splashed4 cookie for RAMPOD OC4J instances
       /*local.cookies = listprepend(local.cookies,"splashed4=splashed",';');*/    
       setProperty("cookies",local.cookies);
       return getProperty("cookies");
    }
	
	
	public any function getInstance(){
        return variables.instance;  
    }
	
	private any function regExMatch(required string re, required string string){
	   var local = {};
	   try{
	        local.result = [];
	        local.objPattern = CreateObject("java","java.util.regex.Pattern").Compile("#ARGUMENTS.re#"); 
	   	    local.objMatcher = local.objPattern.Matcher(arguments.string);
	   	    while(local.objMatcher.Find()){
	   	       ArrayAppend(local.result,local.objMatcher.Group());   	   
	   	    }
	   }catch(any e){}
	   return local.result;
	}
}