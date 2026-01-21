import cfc.facade.SessionFacade;
import cfc.facade.SessionRequestFacade;
import cfc.factory.ObjectFactory;
import cfc.model.MsgTransmit;
import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;
import cfc.utils.QueryIterator;
import cfc.utils.utilities;


component hint="Controller for notification processes" output="false" extends="cfc.utils.Proxy"
{
	
	
	
	property any sessionRequestFacade;

    variables.instance={
       sessionRequestFacade = new SessionRequestFacade(),
       sessionFacade = new SessionFacade(), 
       javaLoggerProxy = new  javaLoggerProxy(),
       objectFactory = '',
       msgTransmitService = '',
       codeService = '',
       dbUtils = '',
       dropDownDao = '',
       program = '',
       utilities = new utilities()           
    };
    
    variables.instance.program = "default";
    
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

    public any function getMsgTransmitService(){
       if(isSimpleValue(variables.instance.msgTransmitService)){
           variables.instance.msgTransmitService = getObjectFactory().create("MsgTransmitService");    
        }       
       return variables.instance.msgTransmitService;      
    }
    
    
    public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }

    public any function getUser(){
       return getSessionFacade().getUserName();      
    }
    
    
    remote any function setAckFlag(boolean flag){
    	local = {};
    	getSessionFacade().setAckMsgFlag(flag);
    	//session.user.settings.ackmsgflag = flag;
    }
    
    public any function listNotifications(boolean reQuery = false){
        var local = {};
        
        if(ARGUMENTS.reQuery){
        	local.programId = getSessionFacade().getValue("notificationProgramId");
        	local.startDate = getSessionFacade().getValue("notificationStartDate");
        	local.stopDate = getSessionFacade().getValue("notificationStopDate");
        	searchNotifications(local.programId,local.startDate,local.stopDate,ARGUMENTS.requery);
        }else{
            
            getSessionFacade().removeValue("notificationProgramId");
            getSessionFacade().removeValue("notificationStartDate");
            getSessionFacade().removeValue("notificationStopDate");
            
            local.page = getRootPath() & "/" & getProgram() & "/notifications/notifications.cfm";     
            getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=getUtilities().getComponentName(this), methodName="listNotifications");
            redirect(local.page,true); 
        }
       
    }
    
    
    public any function searchNotifications(required numeric programId, string startDate = "", string stopDate = "",boolean reQuery = false){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/notifications/notifications.cfm";
        
        getSessionFacade().setValue("notificationProgramId",trim(ARGUMENTS.programId));
        getSessionFacade().setValue("notificationStartDate",trim(ARGUMENTS.startDate));
        getSessionFacade().getValue("notificationStopDate",trim(ARGUMENTS.stopDate));
        
        addToFormRequest("programs",ARGUMENTS.programId);
        addToFormRequest("startDate",ARGUMENTS.startDate);
        addToFormRequest("stopDate",ARGUMENTS.stopDate);

        local.sysId = ARGUMENTS.programId;
        if(val(ARGUMENTS.programId) > 0){
            local.sysId = getDBUtils().getSysIdByProgramId(val(ARGUMENTS.programId));
            if(local.sysId <=0){
                local.sysId = -1;   
            }
                
        }else{
            local.programs = getDBUtils().getAllPrograms();
            local.programIds = ValueList(local.programs.code_id); 
            local.sysId = ListAppend(getDBUtils().getSysIdByProgramId(trim(local.programIds)),0);
        }

        
         getJavaLoggerProxy().fine(message="Querying Notifications getMsgTransmitBySysId('#local.sysId#','#ARGUMENTS.startDate#','#ARGUMENTS.stopDate#')",sourceClass=getUtilities().getComponentName(this), methodName="listNotifications");
        
        local.getNotifications = getMsgTransmitService().getMsgTransmitBySysId(sysId = local.sysId,startDate = ARGUMENTS.startDate, stopDate = ARGUMENTS.stopDate);

        local.getNotifications = getUtilities().addEncryptedColumn(local.getNotifications,"msg_id");
        
        local.iterator = new QueryIterator(local.getNotifications);

        addToRequest("qNotifications",local.iterator);
        
        if(!ARGUMENTS.reQuery){
	        if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
	            
	            local.page = trim(rc.httpreferer); 
	        }
        }
        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=getUtilities().getComponentName(this), methodName="listNotifications");
        
        redirect(local.page,true);

    }

    public any function editNotification(required string msgId){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/notifications/editNotification.cfm"; 
        //throw("here");
       try{
            local.decryptMsgId = decryptId(arguments.msgId);
            
            local.msg = getMsgTransmitService().getMsgTransmit(val(local.decryptMsgId));
            
            local.programId = getDBUtils().getProgamIdBySysId(val(msg.getSysId()));
            
            addToFormRequest("programs",local.programId);
            addToFormRequest("notification",local.msg.getMsgText());
            addToFormRequest("priority",local.msg.getPriority());
            addToFormRequest("msgId",arguments.msgId);
            local.startDate = isDate(local.msg.getStartDate()) ? UCASE(TRIM(DateFormat(local.msg.getStartDate(),"dd-mmm-yyyy"))): local.msg.getStartDate();
            local.stopDate = isDate(local.msg.getStopDate()) ? UCASE(TRIM(DateFormat(local.msg.getStopDate(),"dd-mmm-yyyy"))): local.msg.getStopDate();
            addToFormRequest("startDate",local.startDate);
            addToFormRequest("stopDate",local.stopDate);
            
        }catch(any e){
        	addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"editNotification",getUser());
        	
        	
            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            }
        }
        
        redirect(local.page,true); 

    }
    
    public any function addNotification(){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/notifications/addNotification.cfm"; 

       try{

        }catch(any e){
            addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"editNotification",getUser());
            
            
            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            }
        }
        
        redirect(local.page,true); 

    }

    
    public any function createNotification(required struct formRequest){
        var local = {};
        local.partHasChanged = false;
        local.page = getRootPath() & "/" & getProgram() & "/notifications/editNotification.cfm"; 
        
        ARGUMENTS.insBy = UCASE(TRIM(getUser()));
        
        local.msgTransmitService = getObjectFactory().create("MsgTransmitService");
        
        try{
            
            local.notification = populateNotification(ARGUMENTS.formRequest);
            
            


            transaction 
            {
              try 
                    { 
                        
                        if(isDefined("local.notification")){
                            local.notification.setInsBy(UCASE(TRIM(getUser())));
                            local.notification.setInsDate(now());  

                            getJavaLoggerProxy().info(message="Creating Notification Params #local.notification.toString()#",sourceClass=getUtilities().getComponentName(this), methodName="createNotification");
        
                            
                            local.notification.validate(false);

                            local.insertMessage = local.msgTransmitService.createMsgTransmit(local.notification);
                            
                            
                            transactionCommit();
                            
                            addToRequest("success",{message="Notification Inserted Successfully"});
                            
                            if(isDate(local.notification.getStopDate())){
	                        addToFormRequest("stopDate",UCASE(TRIM(DateFormat(local.notification.getStopDate(),"dd-mmm-yyyy"))));
	                        }
	                        
	                        if(isNumeric(local.notification.getPriority())){
	                        addToFormRequest("priority",trim(local.notification.getPriority()));
	                        }
                            
                            if(val(local.insertMessage.getMsgId())){
                                editNotification(getUtilities().encryptId(local.insertMessage.getMsgId()));   	
                            }
                            
                            
 
                        }

                    }catch(MsgTransmitException e){
                        transactionRollback();
                        addToRequest("notice",e);
                        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                            local.page = rc.httpReferer;   
                        }
                    }catch(Database e){
                        transactionRollback(); 
                        local.cause = getUtilities().getCause(e);
                        if(isDefined("local.cause.type") && findnocase("SQLIntegrityConstraintViolationException",local.cause['type'])){
                           addToRequest("notice",{message="Notification Already Exists"});    
                        }else{
                           rethrow;
                        }

                    }catch(any e) 
                    { 
                        transactionRollback(); 
                        
                        addToRequest("error",{message="Notification Insert Unsuccessful"});
                        //addToRequest("error",e);
                        local.cause = getUtilities().getCause(e);
                        getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"createNotification",getUser());               
                        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
			                local.page = rc.httpReferer;   
			            }
                    } 
  
            }
            
            
            
        }catch(any e){
            
            addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"createNotification",getUser());
            
            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;   
            } 
        
        
        } 
        
        
        
        redirect(local.page,true); 
        
    }
    
   public any function deleteMsgTransmit(required string msgId){
      var local = {};
      
         
         local.msgTransmitService = getObjectFactory().create("MsgTransmitService");
         local.delete = local.msgTransmitService.deleteMsgTransmit(val(ARGUMENTS.msgId)); 	  
            	   
   } 
    
   
   public any function deleteNotificationLink(string msgId=""){
        var local = {};
        
        try{
        local.msgId = getUtilities().decryptId(arguments.msgId); 
        local.deleteNotification = deleteMsgTransmit(val(local.msgId));
        addToRequest("success",{message='Notification deleted successfully'});
        }catch(any e){
        	local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getComponentName(),"deleteNotification",getUser());
            addToRequest("error",{message='Notification deleted unsuccessful'});
        }
        listNotifications(true);
         
    } 
    
    
   remote any function deleteNotification(required string msgId) output=false{
        var local = {};
        //default page
       local.page = getRootPath() & "/" & getProgram() & "/notifications/editNotification.cfm"; 
       local.result= {'success'=false,'message'=''};
       if(isDefined("request.httpReferer") and len(trim(request.httpReferer))){
            local.page = request.httpReferer;      
       }
       
       try{
       local.utils = new utilities();

          local.msgId = getUtilities().decryptId(arguments.msgId); 

          deleteMsgTransmit(val(local.msgId));
          addToRequest("success",{message='Notification deleted successfully'});
          local.page = getRootPath() & "/" & getProgram() & "/notifications/addNotification.cfm"; 
          
          if(isAjaxRequest()){
            local.result.success = true;
            local.result.message = 'Notification deleted successfully';  
            return local.result;      
          }
          redirect(url=local.page, persist="true");
            
       
       
       }catch(any e){
          //addToRequest("error",e);
          local.cause = getUtilities().getCause(e);
          getUtilities().recordError(local.cause,getComponentName(),"deleteNotification",getUser());
          addToRequest("error",{message='Notification deleted unsuccessful'});
          if(isAjaxRequest()){
            local.result.success = false;
            local.result.message = e.message;  
            return local.result;      
          }
          
          redirect(url=local.page,persist=true);           
       }
        
    }
    
    
    
    public any function updateNotification(required struct formRequest){
        var local = {};
        local.partHasChanged = false;
        local.page = getRootPath() & "/" & getProgram() & "/notifications/editNotification.cfm"; 
        
        ARGUMENTS.chgBy = UCASE(TRIM(getUser()));
        
        local.msgTransmitService = getObjectFactory().create("MsgTransmitService");
        
        try{
            
            local.notification = populateNotification(ARGUMENTS.formRequest);
            
            local.currentNotificationId = getUtilities().decryptId(trim(ARGUMENTS.formRequest['msgId']));
            
            local.currentNotification = local.msgTransmitService.getMsgTransmit(val(local.currentNotificationId));

            if(isDefined("local.currentNotification") && isDefined("local.notification")){
                local.notification.setInsBy(local.currentNotification.getInsBy());
                local.notification.setInsDate(local.currentNotification.getInsDate());	
            }


            transaction 
            {
              try 
                    { 
                        
                        if(isDefined("local.notification")){
                            local.notification.setChgBy(UCASE(TRIM(getUser())));
                            //local.notification.validate(local.notification);
                            
                            //throw(local.notification.toString());
                            
                            getJavaLoggerProxy().info(message="Updating Notification Params #local.notification.toString()#",sourceClass=getUtilities().getComponentName(this), methodName="updateNotification");
        
                            
                            local.notification.validate();

                            local.msgTransmitService.updateMsgTransmit(local.notification);
                            transactionCommit();
                        }
                        
                        
                        
                        addToRequest("success",{message="Notification Updated Successfully"});
                        
                        if(isDate(local.notification.getStopDate())){
                        addToFormRequest("stopDate",UCASE(TRIM(DateFormat(local.notification.getStopDate(),"dd-mmm-yyyy"))));
                        }
                        
                        if(isNumeric(local.notification.getPriority())){
                        addToFormRequest("priority",trim(local.notification.getPriority()));
                        }

                    }catch(MsgTransmitException e){
                        transactionRollback();
                        addToRequest("notice",e);
                    }catch(Database e){
                        transactionRollback(); 
                        local.cause = getUtilities().getCause(e);
                        if(isDefined("local.cause.type") && findnocase("SQLIntegrityConstraintViolationException",local.cause['type'])){
                           addToRequest("notice",{message="Notification Already Exists"});    
                        }else{
                           rethrow;
                        }

                    }catch(any e) 
                    { 
                        transactionRollback(); 
                        
                        addToRequest("error",{message="Notification Updated Unsuccessful"});
                        //addToRequest("error",e);
                        local.cause = getUtilities().getCause(e);
                        getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"updateNotification",getUser());               
                        
                    } 
  
            }
            
            
            
        }catch(any e){
            
            addToRequest("error",e);
            local.cause = getUtilities().getCause(e);
            getUtilities().recordError(local.cause,getUtilities().getComponentName(this),"updateNotification",getUser());
  
        } 
        
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = rc.httpReferer;   
        } 
        
        redirect(local.page,true); 
        
    }
    
    
    /* populate Notification bean from formRequest */
    private MsgTransmit function populateNotification(required struct formRequest) {
        var local = {};
        local.notification = new MsgTransmit();
        
        
        
        if (StructKeyExists(arguments.formRequest, "msgId") && len(trim(arguments.formRequest["msgId"]))) {
            local.msgId = getUtilities().decryptId(trim(arguments.formRequest["msgId"]));
            local.notification.setMsgId(val(local.msgId));
        }
        
        if (StructKeyExists(arguments.formRequest, "startDate")) {
            local.notification.setStartDate(UCASE(TRIM(arguments.formRequest["startDate"])));
        }
        
        if (StructKeyExists(arguments.formRequest, "startDate") && isDate(arguments.formRequest["startDate"])) {
            if (StructKeyExists(arguments.formRequest, "stopDate") && !isDate(arguments.formRequest["stopDate"]) ) { 
                arguments.formRequest["stopDate"] = DateAdd("d",31,arguments.formRequest["startDate"]); 
            }       
        }

        if (StructKeyExists(arguments.formRequest, "stopDate")) {
            local.notification.setStopDate(UCASE(TRIM(arguments.formRequest["stopDate"])));
        }

        if (StructKeyExists(arguments.formRequest, "priority")) {
            local.notification.setPriority(UCASE(TRIM(arguments.formRequest["priority"])));
        }
        if (StructKeyExists(arguments.formRequest, "priority") && !val(arguments.formRequest["priority"])) {
            local.notification.setPriority(3);
        }

        if (StructKeyExists(arguments.formRequest, "notification")) {
            local.notification.setMsgText(UCASE(TRIM(arguments.formRequest["notification"])));
        }

        if (StructKeyExists(arguments.formRequest, "programs")) {
        	
        	local.sysId = val(arguments.formRequest["programs"]);
            if(local.sysId > 0){
                local.sysId = getDBUtils().getSysIdByProgramId(val(arguments.formRequest["programs"]));
            }
            local.notification.setSysId((TRIM(local.sysId)));

        }

        return local.notification;
    }
    
    private void function validateNotification(MsgTransmit notification){
        	
    	
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
    
    
    
}