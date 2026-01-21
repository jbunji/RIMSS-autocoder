import cfc.utils.javaLoggerProxy;
import cfc.facade.SessionFacade;

component  output="true"
{
	

variables.instance = {
    'javaLoggerProxy' = "",
    'key' = 'RIMSSCONTEXT',
    'encoder' = ''
};

	public any function init(){
	   return this;	
	} 
	
	public any function getJavaLoggerProxy(){
	   local = {};
	   local.jp = new javaLoggerProxy();	
	   variables.instance.javaLoggerProxy = local.jp;
       return variables.instance.javaLoggerProxy; 
    } 
	
	public any function getUser(){
		var local = {};
		 local.sessionFacade = new SessionFacade(); 
         local.user = local.sessionFacade.getUserName();  
		 
		 //If Session UserName is empty, grab from request if it exists
		 if(!len(trim(local.user))){
		      local.user = getRemoteUser();	 
		 }
		 
       return local.user;      
    }
	
	public any function getComponentName(required any object){
        var local = {};
        local.name = "";
        if(StructKeyexists(getMetaData(object),"name")){
           local.name = getMetaData(object).name;   
        }
       return local.name;      
    }
	
	public any function getEncoder(){
	   local = {};
	   if(isSimpleValue(variables.instance.encoder)){
		   local.esapi = CreateObject("java", "org.owasp.esapi.ESAPI");
	       local.esapiEncoder = esapi.encoder();
	       variables.instance.encoder = local.esapiEncoder;
       } 
       return variables.instance.encoder; 
	}
	
	public boolean function isSessionEnabled(){
		try{
			if(isDefined("SESSION.urlToken")){}
			return true;	
		}catch(any e){
			return false;
		}
	}
	
	public void function expireSession(){
		var local = {};
		
		try{
			local.tagLib = new tagLib();
			if(isSessionEnabled()){
				for(local.key in SESSION){
					if(!listFindNoCase("cfid,cftoken,sessionid,urltoken", local.key)){
						structDelete(session, local.key);
					}
				}
			}
			
			local.tagLib.cookie(name="cfid",expires="now");
            local.tagLib.cookie(name="cftoken",expires="now");
            local.tagLib.cookie(name="jsessionid",expires="now");

        	try
            {
            	local.req = getPageContext().getRequest();
	            local.req.getSession().setMaxInactiveInterval(javaCast( "long", 1 ));
	            sleep(1500);
	            local.req.getSession().invalidate();    
            }
            catch(Any e)
            {
            	recordError(e,getComponentName(this),"expireSession");
            }

			
		}catch(any e){
			recordError(e,getComponentName(this),"expireSession");
		}
	}

	public boolean function isErrorType(required any error, required string type){
	    var local = {};
	    local.result = false;
        local.cause = getCause(ARGUMENTS.error); 
        
        if(isDefined('local.cause.stacktrace')){
           if(findnocase(trim(ARGUMENTS.type),local.cause.stacktrace)){
                local.result = true;	   
           }
       };   
	   return local.result;
	}
	
	public any function getErrorMessage(required any error,boolean recordStackTrace = false){
	   var local = {};
       local.lineseparator = createObject("java","java.lang.System").getProperty("line.separator");
       local.cause = getCause(ARGUMENTS.error);
       local.message = "";
       local.detail = "";
       
       
       
       if(isDefined("local.cause.message")){
        local.message = local.cause.message;   
       }; 
       if(isDefined("local.cause.detail")){
        local.detail = local.cause.detail;   
       }; 
       local.message = local.message & " " & local.detail;

       if(isDefined('local.cause.stacktrace') and (ARGUMENTS.recordStackTrace or isCFError(ARGUMENTS.error))){
           local.message &= local.lineseparator & local.cause.stacktrace;      
       };
       
       return local.message;   	
	}
	
	public any function recordError(required any error, string classname = "", string methodName="",string user = "",boolean recordStackTrace = true){
	   var local = {};
	   local.user = UCASE(TRIM(ARGUMENTS.user));
       
       if(not len(trim(local.user))){
           try{
              local.user = getUser();          
           }catch(any e){
               local.message = e.message;
           }       
       }
       
       
       
	   local.message = getErrorMessage(arguments.error, ARGUMENTS.recordStackTrace);
	   
	   if(len(trim(local.message))){
	       getJavaLoggerProxy().warning(local.message,ARGUMENTS.classname,ARGUMENTS.methodName,local.user);	   
	   }
	    
    }
	
	public any function getCause(Required any cause){
		if( StructKeyExists( ARGUMENTS.cause, 'RootCause' ) ){
		  return getCause(ARGUMENTS.cause.RootCause);
		}else if( StructKeyExists(ARGUMENTS.cause,'CAUSE') ){
		  return getCause(ARGUMENTS.cause.Cause);
		}else{
		  return ARGUMENTS.cause;
		}
	}

    
   public void function redirect(String url, boolean persist=false){
        
        
        if( ARGUMENTS.persist ){
            
            saveFlashContext();
            
        }
        
        location ( url, false);
        
        
    }
    
    
    private void function saveFlashContext(){
        var key = variables.instance.key;

            param name="session.#key#" default="#{ }#";
        
            structAppend( session[ key ], request.context );
            
      
    }
    
    
     private void function restoreFlashContext(){
        var key = 'RIMSSCONTEXT';
        StructDelete(SESSION,key);
    }
    
    public function serialize(required any myObject) { 
     return toBase64(objectsave(ARGUMENTS.myObject));
    }

    public function deserialize(required any mySerializedObject) {
     return objectload(tobinary(ARGUMENTS.mySerializedObject));
    }
    
    public string function genAESKeyFromString(required string string,required string salt64, numeric length= 128){
        var local = {};
        local.salt = toString(toBinary(arguments.salt64));
        local.keyFactory = createObject("java", "javax.crypto.SecretKeyFactory").getInstance("PBKDF2WithHmacSHA1");
        
        local.keySpec = createObject("java", "javax.crypto.spec.PBEKeySpec").init(
        arguments.string.toCharArray(), local.salt.getBytes(), 
        javaCast("int", 1024),
        javaCast("int", arguments.length) 
        );
        
        local.tempSecret = keyFactory.generateSecret(local.keySpec);
        local.secretKey = createObject("java", "javax.crypto.spec.SecretKeySpec").init(local.tempSecret.getEncoded(), "AES");
        return toBase64(local.secretKey.getEncoded());
	
    }
    
    private string function genSalt(numeric size=16){
        var local = {};
        local.byteType = createObject('java', 'java.lang.Byte').TYPE;
        local.bytes = createObject('java','java.lang.reflect.Array').newInstance( local.byteType , ARGUMENTS.size);
        local.rand = createObject('java', 'java.security.SecureRandom').nextBytes(local.bytes);
        return toBase64(local.bytes);    	
    }
    
    public string function getRemoteUser(){
    	var local = {};
    	local.user = "";
    	local.remoteUser = getPageContext().getRequest().getRemoteUser();
    	local.wlsRemoteUser = getPageContext().getRequest().getHeader("OAM_REMOTE_USER");
        
        if(isDefined("local.wlsRemoteUser")){
            local.user = local.wlsRemoteUser;
    	}else if(isDefined("local.remoteUser")){
    	    local.user = local.remoteUser;	
    	}
    	
    	return UCASE(TRIM(local.user));
    }
    
    public boolean function isCustomError(required any e){
	   var local = {};
	   local.cause = getCause(ARGUMENTS.e);
	   if(isDefined("local.cause.type") && findnocase("coldfusion.runtime.CustomException",local.cause.type)){
	   	   return true;   
	   }
	   if(isDefined("local.cause.stacktrace") && findnocase("coldfusion.runtime.CustomException",local.cause.stacktrace)){
	       return true;	   
	   }	  
	   return false;
	}
	
	public boolean function isCFError(required any e){
       var local = {};
       local.customError = isCustomError(ARGUMENTS.e);
       if(!local.customError){
            return true;	   
       }
       
       return false;
       
    }
    
   public any function getCFLogDirectory(required struct svr){
    var local = {};
    local.dirPath = "";

    if(Structkeyexists(ARGUMENTS.svr,"Coldfusion") && Structkeyexists(ARGUMENTS.svr['Coldfusion'],"RootDir")){
    	local.dirPath = ARGUMENTS.svr['Coldfusion']['RootDir'] & "/logs";  
    }  
    return local.dirPath; 
   }
   
   public void function logout(){
        var local = {};

        local.req = getPageContext().getRequest();
        local.res = getPageContext().getResponse();
        local.wlsRemoteUser = local.req.getHeader("OAM_REMOTE_USER");
        local.wlsLogoutUrl = "/oam/server/logout?end_url=/rampLogin/jsp/loggedOut.jsp";
        
        local.returnUrl = getPageContext().getRequest().getContextPath();
        local.osName = createobject("java", "java.lang.System").getProperty("os.name");
         
         applicationStop();
        //Expire the session
        expireSession();

        if(isDefined("wlsRemoteUser")){

            getJavaLoggerProxy().fine("Set Redirect to Web Logic '#local.wlsLogoutUrl#'");
			location(url="#local.wlsLogoutUrl#",addToken=false); 
			  	
        }else if(isDefined("local.osName") && local.osName.toLowerCase().indexOf("windows") eq -1){
            
            getJavaLoggerProxy().fine("Set Redirect to Oracle SSO '#local.returnUrl#'");
            
            getPageContext().getResponse().setHeader("Osso-Return-Url", "#local.returnUrl#");
            getPageContext().getResponse().sendError("470", "Oracle SSO");
            	  	
        }
        	   
   	   
   }
   
    public string function listRemoveDupes(inList,delim)
	{
		var listStruct = {};
		var i = 1;
		if(!StructKeyExists(ARGUMENTS,"delim")){ ARGUMENTS.delim =","; }
		
		for(i=1;i<=listlen(ARGUMENTS.inList, ARGUMENTS.delim);i++)
		{
		listStruct[listgetat(ARGUMENTS.inList,i)] = listgetat(ARGUMENTS.inList,i);
		}
		
		return structkeylist(listStruct);
	}

    public string function convertStructToString(struct struct = {}){
       var local = {};
       local.result = [];
       for(local.key in ARGUMENTS.struct){
           if(isSimpleValue(ARGUMENTS.struct[local.key])){
               ArrayAppend(local.result,local.key & "=" &  ARGUMENTS.struct[local.key]);       
           }else{
              ArrayAppend(local.result,local.key & "=[Complex Object]");  
           }       
       }
       return ArrayToList(local.result);
    }
    
    public string function getServerAddress(){
        var local = {};
        local.hostAddress = "";
        local.system = createobject("java","java.lang.System");
        local.inet = createobject("java","java.net.InetAddress");
        local.localhost = local.inet.getLocalHost();
        local.hostAddress = local.localHost.getHostAddress();
        return local.hostAddress; 
    }

    public string function sanitize(string text = ""){
	   var local = {};
	   local.text = ARGUMENTS.text;
	   local.text = REReplaceNoCase(local.text,"<[^>]*>","","ALL");
	   local.text = ReReplaceNoCase (local.text, "<script.*?>.*?</script>", "", "all");
	   local.text = ReReplaceNoCase (local.text, "<invalidtag.*?>.*?</invalidtag>", "", "all");
	   local.text = rereplacenocase(local.text, "<a.*?>(.*?)</a>", "\1", "all"); 
	   local.text = ReReplaceNoCase (local.text, '<[^>]*="javascript:[^"]*"[^>]*>', '', 'all');
	   
	   return local.text;  
	}
    
    /*Encoding Functions using (org.owasp.esapi) */
    public any function canonicalize(required string input){
        return getEncoder().canonicalize(ARGUMENTS.input);
    }
    
    public any function encodeForCSS(required string input){
        return getEncoder().encodeForCSS(ARGUMENTS.input);
    }
    
    public any function encodeForHTML(required string input){
        return getEncoder().encodeForHTML(ARGUMENTS.input);
    }
    
    public any function decodeForHTML(required string input){
        return getEncoder().decodeForHTML(ARGUMENTS.input);
    }
     
    public any function encodeForHTMLAttribute(required string input){
        return getEncoder().encodeForHTMLAttribute(ARGUMENTS.input);
    }    
    
    public any function encodeForJavaScript(required string input){
        return getEncoder().encodeForJavaScript(ARGUMENTS.input);
    }    
    
    public any function encodeForLDAP(required string input){
        return getEncoder().encodeForLDAP(ARGUMENTS.input);
    }  
    
    public any function encodeForXPath(required string input){
        return getEncoder().encodeForXPath(ARGUMENTS.input);
    }   
    
    public any function encodeForXML(required string input){
        return getEncoder().encodeForXML(ARGUMENTS.input);
    } 
    
    public any function encodeForXMLAttribute(required string input){
        return getEncoder().encodeForXMLAttribute(ARGUMENTS.input);
    }  
    
    public any function encodeForURL(required string input){
        return getEncoder().encodeForURL(ARGUMENTS.input);
    }    
    
    public any function decodeFromURL(required string input){
        return getEncoder().decodeFromURL(ARGUMENTS.input);
    }   
    
    
    public any function decryptIdList(required string id){
        var local = {};
        local.sessionFacade = new SessionFacade(); 
        local.result = 0;
        local.list = ListToArray(ARGUMENTS.id);
        local.result = [];
        local.currentDecrypt = "";
        for(local.i = 1;local.i <= ArrayLen(local.list); local.i++){
	        if(isNumeric(local.list[local.i])){
	           ArrayAppend(local.result,trim(local.list[local.i]));
	        }else{   
	           try{
	                if(len(trim(ARGUMENTS.id))){  
	                 ArrayAppend(local.result,trim(Decrypt(local.list[local.i],local.sessionFacade.getSecretKey(),"AES","HEX")));
	                }
	              }catch(err e){
	                  
	              }
	        }
        }
        return trim(ArrayToList(local.result));  
    }
    
    public any function decryptId(required string id){
        var local = {};
         local.sessionFacade = new SessionFacade(); 
         local.result = 0;
        if(isNumeric(ARGUMENTS.id)){
           return trim(ARGUMENTS.id);
        }   
           try{
                if(len(trim(ARGUMENTS.id))){
                    local.result = Decrypt(arguments.id,local.sessionFacade.getSecretKey(),"AES","HEX");
                }
              }catch(err e){
                  
              }
        
        return trim(local.result);  
    }
    
    public any function encryptId(required string id){
        var local = {};
         local.sessionFacade = new SessionFacade(); 
         local.result = "";
        if(!len(trim(ARGUMENTS.id))){
           return local.result;
        }   
           try{
                if(len(trim(ARGUMENTS.id))){
                	local.result = encrypt(trim(arguments.id),local.sessionFacade.getSecretkey(),'AES','HEX');
                }
              }catch(err e){
                  
              }
        
        return trim(local.result);  
    }
    
    public any function addEncryptedColumn(required query query, required string colname){
	   var local = {};
	   local.query = ARGUMENTS.query;
	   local.columnArray = [];
	   local.ColumnList = local.query.Columnlist;
       try{
       if(listFindNoCase(local.ColumnList,trim(ARGUMENTS.colName))){
       	   
	       for(local.i=1;local.i <= local.query.recordcount;local.i++){
	           ArrayAppend(local.columnArray,encryptId(local.query[ucase(trim(ARGUMENTS.colName))][i]));
	       }
	       
           if(local.query.recordcount && ArrayLen(local.columnArray) == local.query.recordcount){ 
                QueryAddColumn(local.query,"ENCRYPTED_" & UCASE(TRIM(ARGUMENTS.colName)),"VarChar",local.columnArray);
           }else{
           	   QueryAddColumn(local.query,"ENCRYPTED_" & UCASE(TRIM(ARGUMENTS.colName)),"VarChar",[]);
           } 
      
       }
       }catch(any e){}
       return local.query;
	}
    
    
    
}