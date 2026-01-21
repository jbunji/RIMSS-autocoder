
import cfc.dao.DBUtils;


import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;
import cfc.utils.utilities;
import cfc.facade.SessionRequestFacade;
import cfc.facade.SessionFacade;
import cfc.utils.QueryIterator;
import cfc.model.CfgList;
import cfc.service.CfgListService;
import cfc.model.PartList;
import cfc.service.PartListService;
import cfc.model.Code;
import cfc.service.CodeService;


component displayname="BomController" extends="cfc.utils.Proxy" {
    variables.instance = {
        javaLoggerProxy = new  javaLoggerProxy(),
        utilities = new utilities(),
        sessionRequestFacade = new SessionRequestFacade(),
        sessionFacade = new SessionFacade(),
        dbUtils = '',
        objectFactory = '', 
        cfgList='',
        cfgListService='',
        partList='',
        partListService='',
        codeService='',
        code=''
    };

	// Getters/Setters
    function init() {
        return this;
    }

    private any function getJavaLoggerProxy() {
       return variables.instance.javaLoggerProxy;      
    }
    
    private any function getComponentName(){
        var local = {};
        if(StructKeyexists(getMetaData(this),"name")) {
           variables.instance.componentName = getMetaData(this).name;   
        }
        return variables.instance.componentName;      
    }

    private any function getSessionRequestFacade(){
       return variables.instance.sessionRequestFacade;      
    }
    
    private any function getUtilities(){
       return variables.instance.utilities;      
    }
    
    public any function getObjectFactory(){
        if(isSimpleValue(variables.instance.objectFactory)){
           variables.instance.objectFactory = APPLICATION.objectFactory;    
        }   
        return variables.instance.objectFactory;      
    }
    
    private any function getRootPath(){
       return Application.rootPath;      
    }
    
    private any function getProgram(){
       return lcase(trim(application.sessionManager.getProgramSetting()));      
    }
    
    public any function getDBUtils(){
       if(isSimpleValue(variables.instance.dbUtils)){
           variables.instance.dbUtils = getObjectFactory().create("DbUtils");    
        }       
       return variables.instance.dbUtils;      
    }
    
    public any function getCfgListService(){
       if(isSimpleValue(variables.instance.cfgListService)){
           variables.instance.cfgListService = getObjectFactory().create("CfgListService");    
        }       
       return variables.instance.cfgListService;      
    }
    
    public any function getPartListService(){
       if(isSimpleValue(variables.instance.partListService)){
           variables.instance.partListService = getObjectFactory().create("PartListService");    
        }       
       return variables.instance.partListService;      
    }
    
    public any function getCodeService(){
       if(isSimpleValue(variables.instance.codeService)){
           variables.instance.codeService = getObjectFactory().create("CodeService");    
        }       
       return variables.instance.codeService;      
    }
   
   
   // UDF
   
   public any function partRequestEmail(required string locIdr){
   	
   	var emails = getDbUtils().getPartRequestEmailByLocIdr(arguments.locIdr);
   	
   	var fullPath = #mid(cgi.HTTP_REFERER, 1, REFind("/RIMSS/",cgi.HTTP_REFERER)-1)# & #application.rootpath# & "/";
   	var ret = "";
   
   	try{	
	  	for(email in emails){
	  		ret = ret & ' ' & emails.user_name;
	   		savecontent variable="mailBody" {
			  writeOutput( email.user_name & " 
			  <br/>
			  (Unit, Site) has requested (noun, part number) for job number (Job Number (<a href="& #URLEncodedFormat('www.google.com')# &">link</a>)).  
			  <br/>
			  To access the job, log into RAMPOD and access RIMSS, then click the Job Number link in this email. " & fullPath);
			};
		
		// Create and populate the mail object
			mailService = new mail(
			  to = "#email.email#",
			  from = "no-reply@RAMPOD.net",
			  subject = "Example email",
			  body = mailBody,
			  type="html"
			);
			
			
		// Send
			mailService.send();
	   		
	   	};
   	
   	
	   /*	savecontent variable="mailBody2" {
		  writeOutput( "	
		  	Your Email Message!!" );
		};
	
	// Create and populate the mail object
		mailService = new mail(
		  to = "#emails.email#",
		  from = "sender@example.com",
		  subject = "Example email",
		  body = mailBody2,
		  failto="justinbundrick@gmail.com",
		  debug="true",
		  query="#emails#"
		);
	
	// Send
		mailService.send();*/
   	
   		return mailService;
   	} catch(any e){
   		return e.message;
   	}
   }
   
public any function getParentPart(required string partnoId){
	return getPartListService().getPartList(arguments.partnoId);
}
  
public any function getParentPartByCfgSetId(required string cfgSetId){
	
	try{
		return getDbUtils().getParentPartByCfgSetId(arguments.cfgSetId);
	}catch(any e){
		return e.message;
	}
}
  
 remote any function updateConfig(required string listId, required string partnoId, required string qpa){
 	
 	local.ret = {};	
	local.args.partnoC = arguments.partnoId;
	local.args.listId = arguments.listId;
	local.args.QPA = arguments.qpa;
	
	try{
		local.cfgListObj = populateCfgList(local.args);
		
		getCfgListService().updateCfgList(local.cfgListObj);
		
		local.ret.message = "Conguration Successfully Updated ";
 		local.ret.success = true;
		return serializeJSON(local.ret);
	}catch (any e) {
		local.ret.success = false;
 		local.ret.message = e.message;
		return serializeJSON(local.ret);
	}
	
 }
 
 
 remote any function addToConfig(required string cfgSetId, required string partnoC, required string partnoP){
 	
 	local.ret = {};	
 	
	local.args.partnoC = arguments.partnoC;
	local.args.partnoP = arguments.partnoP;
	local.args.cfgSetId =  arguments.cfgSetId;
	local.args.sortOrder = 1;
	local.args.active = 'Y';
	local.args.QPA = arguments.qpa;

	
	try{
		local.cfgListObj = populateCfgList(local.args);
		
		getCfgListService().createCfgList(local.cfgListObj);
		
 		local.ret.message = "Conguration Successfully Added ";
 		local.ret.success = true;
		return serializeJSON(local.ret);
	}catch (any e) {
 		local.ret.success = false;
 		local.ret.message = e.message;
		return serializeJSON(local.ret);
	}
	
 }
 
 remote any function deleteConfig(required string listId){
 	 	
 	local.ret = {};
 	try{		
		getCfgListService().deleteCfgList(arguments.listId);
		
 		local.ret.message = "Conguration Successfully Deleted ";
 		local.ret.success = true;
 		return serializeJSON(local.ret);
	}catch (any e) {
 		local.ret.success = false;
 		local.ret.message = e.message;
 		return serializeJSON(local.ret);
	}
 }
 
 remote any function insertPartList(required string partno, required string noun, required string nsn, required string msl){
 	
 	local.ret = {};
 		
 	try{
 		local.args.partno = arguments.partno;
 		local.args.noun = arguments.noun;
 		local.args.nsn = arguments.nsn;
 		local.args.msl = arguments.msl;
 		 		
 		local.sysTypeObj = getCodeService().findByCodeTypeCodeValue('SYS_TYPE', 'PART');
 		local.args.sysType = sysTypeObj.getCodeId();
 		local.pgmIdObj =  getCodeService().findByCodeTypeCodeValue('PROGRAM_ID', 'ACTS');
 		local.args.pgm = pgmIdObj.getCodeId();
 		
 		local.partListObj = populatePartList(local.args);
 		
 		local.partListObj.validate(false);
 		
 		local.partListObj = getPartListService().createPartList(partListObj);
 		
 		local.ret.id = local.partListObj.getPartnoId();
 		local.ret.message = "Part Added Successfully";
 		local.ret.success = true;
 		return serializeJSON(local.ret);
 	}catch(any e){
 		
 		local.ret.success = false;
 		local.ret.message = e.message;
 		return serializeJSON(local.ret);
 	}
 }
 
 
 
 private CfgList function populateCfgList(struct args) {
 	
 		if(StructKeyExists(arguments.args, "listId")){
 			local.cfgList = getCfgListService().getCfgList(arguments.args.listId);	
 		}else{
 			local.cfgList = new CfgList();	
 		}
 		
 		if(StructKeyExists(arguments.args, "cfgSetId")){
 			local.cfgList.setCfgSetId(arguments.args.cfgSetId);	
 		}
 		
    	if (StructKeyExists(arguments.args, "partnoC")) {
    		local.cfgList.setPartnoC(arguments.args["partnoC"]);
    	}
    	if (StructKeyExists(arguments.args, "partnoP")) {
    		local.cfgList.setPartnoP(arguments.args["partnoP"]);
    	}
    	
    	if (StructKeyExists(arguments.args, "sortOrder")) {
    		local.cfgList.setSortOrder(arguments.args["sortOrder"]);
    	}
    	
    	if (StructKeyExists(arguments.args, "active")) {
    		local.cfgList.setActive(arguments.args["active"]);
    	}
    	
    	if (StructKeyExists(arguments.args, "QPA")) {
    		local.cfgList.setQPA(arguments.args["QPA"]);
    	}    
    	//else{
    		//local.cfgList.setQPA("1");
    	//}	
    	
    	if (isNull(local.cfgList.getInsBy()) or !len(trim(local.cfgList.getInsBy()))) {
            local.cfgList.setInsBy(application.sessionManager.getUserName());
        }
        
        if (isNull(local.cfgList.getInsDate()) or !len(trim(local.cfgList.getInsDate()))) {
            local.cfgList.setInsDate(Now());
        }
    	
    	local.cfgList.setChgBy(application.sessionManager.getUserName());
    	local.cfgList.setChgDate(Now());
    	
    	return local.cfgList;
    	
    }
    
       /*Validate PartList */
    public PartList function populatePartList(struct args){
        var local = {};
        
        if(StructKeyExists(arguments.args, "partnoId")){
 			local.partList = getPartListService().getPartList(arguments.args.partnoId);	
 		}else{
 			local.partList = new PartList();	
 		}
 		
        if(StructKeyExists(ARGUMENTS.args, 'noun')){
            local.partlist.setNoun(ARGUMENTS.args.noun);
        }        
        if(StructKeyExists(ARGUMENTS.args, 'partno')){
            local.partlist.setPartno(ARGUMENTS.args.partno);
        }           
        if(StructKeyExists(ARGUMENTS.args, 'nsn')){
            local.partlist.setNsn(ARGUMENTS.args.nsn);
        }            
        if(StructKeyExists(ARGUMENTS.args, 'msl')){
            local.partlist.setMsl(ARGUMENTS.args.msl);
        }    
               
        if(StructKeyExists(ARGUMENTS.args, 'sysType')){
            local.partlist.setSysType(ARGUMENTS.args.sysType);
        }           
        if(StructKeyExists(ARGUMENTS.args, 'pgm')){
            local.partlist.setPgmId(ARGUMENTS.args.pgm);
        }    
        
    	if (isNull(local.partlist.getInsBy()) or !len(trim(local.partlist.getInsBy()))) {
            local.partlist.setInsBy(application.sessionManager.getUserName());
        }
        if (isNull(local.partlist.getInsDate()) or !len(trim(local.partlist.getInsDate()))) {
            local.partlist.setInsDate(Now());
        }
        if (isNull(local.partlist.getActive()) or !len(trim(local.partlist.getActive()))) {
            local.partlist.setActive('Y');
        }
        if (isNull(local.partlist.getLsruFlag()) or !len(trim(local.partlist.getLsruFlag()))) {
            local.partlist.setLsruFlag('-');
        }
        
        if (isNull(local.partlist.getSnTracked()) or !len(trim(local.partlist.getSnTracked()))) {
            local.partlist.setSnTracked('N');
        }
        if (isNull(local.partlist.getValid()) or !len(trim(local.partlist.getValid()))) {
            local.partlist.setValid('Y');
        }
        
        
    	local.partlist.setChgBy(application.sessionManager.getUserName());
    	local.partlist.setChgDate(Now());
       return partlist;
    }









}