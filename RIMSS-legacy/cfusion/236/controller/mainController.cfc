﻿import cfc.facade.SessionRequestFacade;
import cfc.facade.SessionFacade;
import cfc.utils.javaLoggerProxy;
import cfc.utils.import.importSortie;
import cfc.utils.utilities;


component  hint="Main Controller for the Program" output="false" extends="cfc.utils.Proxy" {
	
	property string action;
	property any sessionRequestFacade;
	property any sessionFacade;
	property any rootPath;
	property any program;

    

    variables.instance = {
        action="",
        sessionRequestFacade = new SessionRequestFacade(), 
        sessionFacade = new SessionFacade(), 
        javaLoggerProxy = new  javaLoggerProxy(),
        componentName = "mainController",
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
    	if(StructKeyexists(getMetaData(this),"name")){
    	   variables.instance.componentName = getMetaData(this).name;	
    	}
       return variables.instance.componentName;      
    }
    
    public any function getRootPath(){
       return Application.rootPath;      
    }
    
    public any function getUtilities(){
       return variables.instance.utilities;      
    }
    
    public any function getProgram(){
       return lcase(trim(application.sessionManager.getProgramSetting()));      
    }
    
    public String function getAction(){
    
       return variables.instance.action;    
    }
    
    public any function setAction(required string action){
       variables.instance.action = trim(ARGUMENTS.action);
       return this;    
    }
    
    
    remote any function forward(required String action){
        var local = {};
        local.page = getRootPath();
        local.utils = new utilities();
        getJavaLoggerProxy().info(message="Looking for action '#ARGUMENTS.action#'",sourceClass=getComponentName(), methodName="forward");
        
            try{
            	
		        setAction(ARGUMENTS.action);
		        
		        //local.sessionRequestFacade = new sessionRequestFacade(); 
		        //local.sessionRequestFacade.createSessionRequest();       
	            //local.sessionRequestFacade.addFormToRequest(rc.form);
		        
		        
		        switch(lcase(trim(ARGUMENTS.action))){
		            /*
		            case 'create.sortie':{
		            	local.page = getRootPath() & "/" & getProgram() & "/sortie/createSortie.cfm";
		            	getJavaLoggerProxy().info(message="Redirecting to #local.page#",sourceClass=getComponentName(), methodName="forward");
                        local.utils.redirect(url=local.page, persist = true);   
		                //location(url=local.page, addToken="no");    
		            break;
		            }
		            
		            case 'import.sortie':{
		            	local.page = getRootPath() & "/" & getProgram() & "/sortie/uploadSortie.cfm";
		            	
		            	getJavaLoggerProxy().info(message="Redirecting to #local.page#",sourceClass=getComponentName(), methodName="forward");
		            	request.context.blah="here";
		                local.utils.redirect(url=local.page, persist = true);    
		            break;
		            }
		            
		            case 'upload.sortie':{
		            	
		            	//Sortie upload process
		            	local.page = getRootPath() & "/" & getProgram() & "/sortie/uploadSortie.cfm";
		                sortieController= new sortieController();
		                getJavaLoggerProxy().info(message="Sending to sortieController.uploadSortie()",sourceClass=getComponentName(), methodName="forward");
		                
		                local.sortieUpload = sortieController.uploadSortie(Duplicate(form));
	                     
		            break;
		            }
*/
                    case 'create.maintenance': {
                        local.page = getRootPath() & "/" & getProgram() & "/maintenance/createMaintenance.cfm";
                        getJavaLoggerProxy().info(message="Redirecting to #local.page#",sourceClass=getComponentName(), methodName="forward");

				        local.newJobIdService = application.objectFactory.create("NewJobIdService");
				        local.newJobId = local.newJobIdService.getNewJobId(application.sessionManager.getProgramSetting(),application.sessionManager.getLocIdSetting());
                        //local.sessionRequestFacade.addToFormRequest("jobId", local.newJobId);
                        addToFormRequest("jobId",local.newJobId);
                        redirect(local.page,true);
                        //location(url=local.page, addToken="no");    
                    break;
                    }

                    case 'create.maintenance.detail': {
                        local.page = getRootPath() & "/" & getProgram() & "/maintenance/createMaintenanceDetail.cfm";
                        getJavaLoggerProxy().info(message="Redirecting to #local.page#",sourceClass=getComponentName(), methodName="forward");
                        redirect(local.page,true);
                        location(url=local.page, addToken="no");    
                    break;
                    }

                    case 'create.configuration': {
                        local.page = getRootPath() & "/" & getProgram() & "/configuration/createConfiguration.cfm";
                        getJavaLoggerProxy().info(message="Redirecting to #local.page#",sourceClass=getComponentName(), methodName="forward");
                        
                        location(url=local.page, addToken="no");    
                    break;
                    }
                    
                    
                    case 'list.configuration': {
                    	param name="request.context.assetid" default="0";
                    	param name="request.context.nhaassetid" default="0";
                    	local.configController = new configurationController();
                    	getJavaLoggerProxy().info(message="Sending to configController.listConfig()",sourceClass=getComponentName(), methodName="forward");
                    	local.configController.listConfig(request.context.assetid);
                    break;
                    }
                    
                    
                    case 'edit.configuration': {
                    	param name="request.context.assetid" default="0";
                    	param name="request.context.nhaassetid" default="0";
                    	local.page = getRootPath() & "/" & getProgram() & "/configuration/editConfiguration.cfm";
                    	local.configController = new configurationController();
                    	getJavaLoggerProxy().info(message="Sending to configController.editConfig()",sourceClass=getComponentName(), methodName="forward");
                    	local.x = local.configController.editConfig(request.context.assetid);
                    	  
                   
                    break;
                    }


		            default:{
		                throw(message="Unknown Action '#ARGUMENTS.action#'",type="cfc.controller.#getProgram()#.mainController.UnknownAction");
		                break;    	
		            }
		          
		    
		        }
        }catch(any e){
        	addToRequest("error",e);
        	if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
                local.page = trim(rc.httpreferer); 
                local.utils.recordError(e);
                redirect(local.page,true);
                
            }else{
            	rethrow;
            }
            
            request.context.test=1;
            //local.sessionRequestFacade.addToRequest("error",e);
            //rethrow;
            redirect(url=local.page,persist=true);      	
        }
    }
    
    remote any function doAction(required String action) {
        var local = {};
        local.utils = new utilities();
        local.page = getRootPath();
            try{
                setAction(ARGUMENTS.action);
                
                local.sessionRequestFacade = new SessionRequestFacade(); 
                local.sessionRequestFacade.createSessionRequest();       
                local.sessionRequestFacade.addFormToRequest(Duplicate(form));
                local.sessionFacade = new SessionFacade();
                
                switch(lcase(trim(ARGUMENTS.action))){
                    /*
                    case 'upload.sortie':{
                        //Sortie upload process
                        local.page = getRootPath() & "/" & getProgram() & "/sortie/uploadSortie.cfm";
                        local.sortieController= new sortieController();
                        getJavaLoggerProxy().info(message="Sending to sortieController.uploadSortie()",sourceClass=getComponentName(), methodName="doAction");
                        
                        local.sortieUpload = local.sortieController.uploadSortie(Duplicate(form));
                        
                    break;
                    }
                    
                    case 'load.mappings':{

                        local.sortieController= new sortieController();
                        getJavaLoggerProxy().info(message="Sending to sortieController.loadMappings()",sourceClass=getComponentName(), methodName="doAction");
                        
                        local.sortieUpload = local.sortieController.loadMappings(Duplicate(form));
                        
                    break;
                    }
                   
                    case 'save.mappings':{

                        local.sortieController= new sortieController();
                        getJavaLoggerProxy().info(message="Sending to sortieController.saveMappings()",sourceClass=getComponentName(), methodName="doAction");
                        
                        local.save = local.sortieController.saveMappings(Duplicate(form));
                        
                    break;
                    }
                    
                    case 'import.sortie':{
                        //Sortie upload process
                        local.page = getRootPath() & "/" & getProgram() & "/sortie/uploadSortie.cfm";
                        local.sortieController= new sortieController();
                        getJavaLoggerProxy().info(message="Sending to sortieController.importSortie()",sourceClass=getComponentName(), methodName="doAction");
                        
                        local.sortieUpload = local.sortieController.uploadSortie(Duplicate(form));
                        
                    break;
                    }
                    */
                    case 'insert.event': {
                        //insert new event record
                        local.maintenanceController= new maintenanceController();
                        getJavaLoggerProxy().info(message="Sending to maintenanceController.insertEvent()",sourceClass=getComponentName(), methodName="doAction");
                        
                        maintenanceController.insertEvent(Duplicate(form));
                    break;
                    }
                    
                    
                    default:{
                        throw(message="Unknown Action '#ARGUMENTS.action#'",type="cfc.controller.#getProgram()#.mainController.UnknownAction");
                        break;      
                    }
                  
            
                }
        }catch(any e){
            rethrow;  
        }
    }
    
    remote void function saveSubSection(required string subSection){
	   local.sessionFacade = new SessionFacade(); 
	   getJavaLoggerProxy().info(message="Sending to sessionFacade.setSubSection()",sourceClass=getComponentName(), methodName="saveSubSection");
       local.sessionFacade.setSubSection(form.subSection); 
	}
    
}