import default.bo.SortiesBO;

import cfc.facade.SessionFacade;
import cfc.facade.SessionRequestFacade;
import cfc.factory.ObjectFactory;
import cfc.model.Sorties;
import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;
import cfc.utils.utilities;
import cfc.utils.import.importSortie;

component  hint="Controller for processes" output="false" extends="cfc.utils.Proxy"
{
    property any sessionRequestFacade;
    
    
    variables.instance={
       sessionRequestFacade = new SessionRequestFacade(),
       sessionFacade = new SessionFacade(), 
       componentName = "sortieController",
       javaLoggerProxy = new  javaLoggerProxy(),
       objectFactory = '',
       locationService = '',
       sortieService = '',
       codeService = '',
       dbUtils = '',
       program = 'default',
       rc = request.context,
       importSortie = new importSortie()            
    };
    
    
    public any function init(){
       return this; 
    }
    
    public any function getComponentName(){
        var local = {};
        local.utils = new utilities();
        if(StructKeyexists(getMetaData(this),"name")){
           variables.instance.componentName = local.utils.getComponentName(this);   
        }
       return variables.instance.componentName;      
    }
    
    public any function getJavaLoggerProxy(){
       return variables.instance.javaLoggerProxy;      
    }
    
    public any function getImportSortie(){
       return variables.instance.importSortie;      
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
    
    public any function getCodeService(){
       if(isSimpleValue(variables.instance.codeService)){
           variables.instance.codeService = getObjectFactory().create("CodeService");    
        }       
       return variables.instance.codeService;      
    }
    
    public any function getLocationService(){
       if(isSimpleValue(variables.instance.locationService)){
           variables.instance.locationService = getObjectFactory().create("LocationService");    
        }       
       return variables.instance.locationService;      
    }
    
    public any function getSortieService(){
       if(isSimpleValue(variables.instance.sortieService)){
           variables.instance.sortieService = getObjectFactory().create("SortiesService");    
        }       
       return variables.instance.sortieService;      
    }
    
    public any function getSortie(){
       
       return new Sorties();      
    }
    
    public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }
    
    public any function getUser(){
       return getSessionFacade().getUserName();      
    }
    
    public any function createSortie(required struct formRequest){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/sortie/createSortie.cfm";
        
        
        //Add default Unit and code to prefill
        local.unit = "";
        local.unitCd ="";
        try{
            local.locationObj = getLocationService().getLocation(val(application.sessionmanager.getLocIdSetting()));
            local.unit = application.sessionmanager.getUnitSetting();
            local.unitCd = local.locationObj.getUnitCd();

        }catch(any e){
            rethrow;
        }
        addToFormRequest("currentUnitCd",local.unitCd);
        addToFormRequest("currentUnit",local.unit);

        /*if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = getDirectoryFromPath(rc.httpReferer) & "createSortie.cfm";

        }*/
       
       redirect(local.page,true); 
    }
    
    public any function editSortie(required any sortieId){
        var local = {};
        local.page = getRootPath() & "/" & getProgram() & "/sortie/editSortie.cfm";     
        addToFormRequest("sortie",arguments.sortieId);
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = getDirectoryFromPath(rc.httpReferer) & "editSortie.cfm";
            try{
                //local.sortie = decryptSortieId(arguments.sortieId);
                //local.sortie = Decrypt(arguments.sortieId,application.sessionmanager.getSecretKey(),"AES","HEX");
                addToFormRequest("sortieId",ARGUMENTS.sortieId);
                populateSortieFromId(val(decryptSortieId(ARGUMENTS.sortieId)));    

            }catch(coldfusion.runtime.Encryptor$InvalidParamsForEncryptionException e){
                throw("Unable to find sortie to edit");
            }catch(any e){   
                rethrow;    
            }
      
        }

       redirect(local.page,true); 
    }
    
    public any function searchSortie(string serno, string missionid, string sortieDate, numeric programId, numeric locId){
        var local = {};
        local.utils = new utilities();
        //local.codeService = application.objectFactory.create("CodeService");
        //local.currentProgram = UCASE(TRIM(getSessionFacade().getProgramSetting()));
        //local.systemCatCode = local.codeService.findByCodeTypeCodeValue(local.currentProgram & '_SYSTEM_CATS', 'AIRBORNE');
        //local.systemTypeCodeList = local.codeByCodeService.getAllCodeBAsValueListByCodeA(local.systemCatCode.getCodeId());
        
        try{
            
            local.locationId = 0;
            
            
            
            try{
                //Have to get the unitCode id from the locid passed in
                local.locationObj = getLocationService().getLocation(val(arguments.locId));
                //local.locationId = local.locationObj.getUnitCd();
                local.locationId = local.locationObj.getLocId();
               
                
            }catch(any e){
            }
            
            ARGUMENTS.locId = local.locationId;
            ARGUMENTS.programId = getSessionFacade().getProgramIdSetting();
            ARGUMENTS.locId = getSessionFacade().getLocIdSetting();
            
            local.page = getRootPath() & "/" & getProgram() & "/sortie/sortieSearch.cfm";   
            if(!isDefined("ARGUMENTS.sortieSearch")){
	            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
	            local.page = rc.httpReferer;      
	            }
            }
            if(Structkeyexists(ARGUMENTS,"sortieCriteria")){
            	local.page = getRootPath() & "/" & getProgram() & "/sortie/sortieSearch.cfm";   
            	getSessionFacade().setValue("sortieCriteria",trim(ARGUMENTS.sortieCriteria));
                local.search = getDBUtils().searchSortieMenu(argumentCollection=arguments);	
                
            }else{
            	getSessionFacade().removeValue("sortieCriteria");
            	
            	if(!len(trim(arguments.serno))){
	                throw("Serial Number must be filled in", "EmptySerialNumber");  
	            }
	            getSessionFacade().setValue("sortieSearch",ucase(trim(ARGUMENTS.serno)));
	            
            	local.search = getDBUtils().searchSortie(argumentCollection=arguments);
            }
            
            //local.search = getDBUtils().searchSortie(argumentCollection=arguments);
            
            addToFormRequest("sortieResults",local.search);

            redirect(local.page,true); 
        }catch(EmptySerialNumber e){
        	   
            local.page = getRootPath() & "/" & getProgram() & "/sortie/sortieSearch.cfm";  
            addToRequest("error",e);

            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;      
            }
                
            redirect(local.page,true);	
        	
        }catch(any e){
            
            local.utils.recordError(e,local.utils.getComponentName(this),"searchSortie",getUser());   	
            	
            local.page = getRootPath() & "/" & getProgram() & "/sortie/sortieSearch.cfm";  
            addToRequest("error",e);

            if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
                local.page = rc.httpReferer;      
            }
                
            redirect(local.page,true);     
        }
        
    }
    
    remote any function loadMappings(){
        var local = {};
        local.result = {'success'=false,'load'={},'message'=''};
        local.utils = new utilities();
        local.page = getRootPath() & "/" & getProgram() & "/sortie/mapSortie.cfm"; 
        
        ARGUMENTS.formRequest = request.context.form;
        
        if(isDefined("rc.httpReferer") and len(trim(rc.httpReferer))){
            local.page = getDirectoryFromPath(rc.httpReferer) & "mapSortie.cfm";      
        }
        
        try{

           //local.columns = readColumns(ARGUMENTS.formRequest['type'],ARGUMENTS.formRequest['filePath'],ARGUMENTS.formRequest['sortieCurrentItem']);
           //SESSION.sortieImport.upload.setColumns(local.columns); 
            
            
           //getImportSortie().setColumns(local.columns);
           
           
           /*local.sessionRequestFacade = new sessionRequestFacade();     
           local.sessionRequestFacade.createSessionRequest();  
           local.sessionRequestFacade.addFormToRequest(variables.instance.rc);*/
           /*if(Structkeyexists(ARGUMENTS.formRequest,"sortieCurrentItem")){
                 readColumns(ARGUMENTS.formRequest['type'],ARGUMENTS.formRequest['filePath'],ARGUMENTS.formRequest['sortieCurrentItem']);   
           } */
           
           //if(Structkeyexists(SESSION,"sortieImport")){
            //addFormToRequest(SESSION.sortieImport);
            //appendToFormRequest(SESSION.sortieImport);    
           /*   for(local.k in SESSION.sortieImport){
                   //local.sessionRequestFacade.addToFormRequest(local.k,SESSION.sortieImport[local.k]); 
                      
               }     */  
           //}

           local.importSortie = getImportSortie();  
           local.load = local.importSortie.loadMappingFromFile();
           /*local.sessionRequestFacade.addToFormRequest("mappingsInfo",local.load);    
           local.sessionRequestFacade.addToFormRequest("mappings",{"field_mapping" = local.load['fieldmappings']});*/   
           
           //SESSION.sortieImport.mappings = local.load;
           request.context.mappings = local.load;
           addToFormRequest("mappings",{"field_mapping" = local.load['fieldmappings']});
           //location(url=local.page,addToken=false);
           //redirect(url=local.page,persist=true);      
            local.result.success = true; 
            local.result.load = local.load; 
            local.result.message = ''; 
        }catch(any e){
            
            
          local.utils.recordError(e,getComponentName(),"loadMappings",getUser());   
          //getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="loadMappings");
          //local.sessionRequestFacade.addToRequest("errorType",e.type);
          //local.sessionRequestFacade.addToRequest("error",e);
          //request.context.error = e;
          //redirect(url=local.page,persist=true);    
          //location(url=local.page,addToken=false);
          //local.utils.redirect(url=local.page,persist=true); 
          local.result.success = false; 
          local.result.message = e.message; 
          rethrow;
        }
       return local.result;     
    }
    
    
    
    public any function uploadSortie(){
       var local = {};
       local.result = {};
       local.utils = new utilities();
       //default page
       local.page = getRootPath() & "/" & getProgram() & "/sortie/uploadSortie.cfm"; 
       
       if(isDefined("request.httpReferer") and len(trim(request.httpReferer))){
            local.page = request.httpReferer;      
       }

        try{ 
           
           SESSION.sortieImport = {};

           //local.sessionRequestFacade = new sessionRequestFacade();      
           //local.sessionRequestFacade.createSessionRequest();  
           //local.sessionRequestFacade.addFormToRequest(Duplicate(ARGUMENTS.formRequest));
           
           
           
           local.importSortie = getImportSortie();
           local.importType = (isDefined("rc.form") && StructKeyExists(rc.form,'importType'))? trim(rc.form['importType']) :"";
           SESSION.sortieImport.importType = local.importType;
           
           local.formField = (StructKeyExists(isDefined("rc.form") && rc.form,'fileData'))? "fileData" :"";
           SESSION.sortieImport.fileData = local.formField;
           
            
           local.upload = local.importSortie.upload(action=local.importType,formField=local.formField);
           SESSION.sortieImport.upload = Duplicate(local.upload); 
           SESSION.sortieImport.columns = local.upload.getColumns();
           SESSION.sortieImport.items = local.upload.getItems();
           //local.sessionRequest = getSessionRequestFacade().createSessionRequest(); 
           //local.sessionRequest.addFormToRequest(ARGUMENTS.formRequest);

           //local.sessionRequest.addToFormRequest("upload",local.upload);

           //local.result = local.sessionRequest.getSessionRequest(); 

           local.page = getDirectoryFromPath(local.page) & "mapSortie.cfm";
           
           request.context.form['upload'] = local.upload;
            
           redirect(url=local.page,persist=true);
             
        }catch(any e){
          
          /*getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="uploadSortie");*/
           
          //local.sessionRequestFacade.addToRequest("errorType",e.type);
          //local.sessionRequestFacade.addToRequest("error",e);
          addToRequest("error",e);
          local.utils.recordError(e,getComponentName(),"uploadSortie",getUser());
          //location(url=local.page,addToken=false); 
          redirect(url=local.page,persist=true); 

        }
       
        
       return local.result;                     
    }
    
    public any function insertSortie(required struct formRequest){
       var local = {};
       
       //default page
       local.page = getRootPath() & "/" & getProgram() & "/sortie/createSortie.cfm"; 
       
       if(isDefined("request.httpReferer") and len(trim(request.httpReferer))){
            local.page = request.httpReferer;      
       }
       
       try{
           
            local.utils = new utilities();
           local.sortieBo = new SortiesBO();
           
           local.sortie = populateSortie(ARGUMENTS.formRequest);
           local.sortieInsert = local.sortieBo.createSortie(local.sortie);
           local.page = getRootPath() & "/" & getProgram() & "/sortie/editSortie.cfm"; 
           addToFormRequest("sortieId",local.sortieInsert.getSortieId());
           populateSortieFromId(val(local.sortieInsert.getSortieId()));
           addToRequest("success",{message='Sortie inserted successfully'});
           redirect(url=local.page, persist="true");
       }catch(CreateException e){
           
           local.utils.recordError(e,getComponentName(),"insertSortie",getUser(),true);
           if(isDefined("e.detail") and findnocase("unique constraint",e.detail)){
                addToRequest("notice",{message="Sortie already exists"});   
                redirect(url=local.page,persist=true);        
           }else{
                addToRequest("error",e);
                redirect(url=local.page,persist=true);    
           }
       
       }catch(Database e){
           local.utils.recordError(e,getComponentName(),"insertSortie",getUser(),true);
           if(isDefined("e.stacktrace") and findnocase("java.sql.SQLIntegrityConstraintViolationException",e.stacktrace)){
                addToRequest("notice",{message="Sortie already exists"});   
                redirect(url=local.page,persist=true);        
           }else{
                addToRequest("error",e);
                redirect(url=local.page,persist=true);    
           }
       }catch(any e){
          addToRequest("error",e);
          local.cause = local.utils.getCause(e);
          local.utils.recordError(local.cause,getComponentName(),"insertSortie",getUser(),true);
          redirect(url=local.page,persist=true);       
       }    
    }
    
    public any function updateSortie(required struct formRequest){
       var local = {};
       
       //default page
       local.page = getRootPath() & "/" & getProgram() & "/sortie/editSortie.cfm"; 
       
       if(isDefined("request.httpReferer") and len(trim(request.httpReferer))){
            local.page = request.httpReferer;      
       }
       
       try{
           
           local.utils = new utilities();
           local.sortieBo = new SortiesBO();
           
           local.sortie = populateSortie(ARGUMENTS.formRequest);
           local.sortieUpdate = local.sortieBo.updateSortie(local.sortie);
           local.page = getRootPath() & "/" & getProgram() & "/sortie/editSortie.cfm"; 
           //populateSortieFromId(val(local.sortieUpdate.getSortieId()));
           addToRequest("success",{message='Sortie updated successfully'});
           redirect(url=local.page, persist="true");
       }catch(UpdateException e){
           
           local.utils.recordError(e,getComponentName(),"updateSortie",getUser(),true);
           if(isDefined("e.detail") and findnocase("unique constraint",e.detail)){
                addToRequest("notice",{message="Sortie already exists"});   
                redirect(url=local.page,persist=true);        
           }else{
                addToRequest("error",e);
                redirect(url=local.page,persist=true);    
           }
       
       }catch(Database e){
           local.utils.recordError(e,getComponentName(),"updateSortie",getUser(),true);
           if(isDefined("e.stacktrace") and findnocase("java.sql.SQLIntegrityConstraintViolationException",e.stacktrace)){
                addToRequest("notice",{message="Sortie already exists"});   
                redirect(url=local.page,persist=true);        
           }else{
                addToRequest("error",e);
                redirect(url=local.page,persist=true);    
           }
       }catch(any e){
          addToRequest("error",e);
          local.cause = local.utils.getCause(e);
          local.utils.recordError(local.cause,getComponentName(),"updateSortie",getUser(),true);
          redirect(url=local.page,persist=true);       
       }    
        
        
    }
    
    
    remote any function deleteSortie(required string sortieId) output=false{
        var local = {};
        //default page
       local.page = getRootPath() & "/" & getProgram() & "/sortie/editSortie.cfm"; 
       local.result= {'success'=false,'message'=''};
       if(isDefined("request.httpReferer") and len(trim(request.httpReferer))){
            local.page = request.httpReferer;      
       }
       
       try{
       local.utils = new utilities();
       local.sortieBo = new SortiesBO();
        
          local.sortie = decryptSortieId(arguments.sortieId); 
          local.sortieBo = new SortiesBO(); 
          local.sortieUpdate = local.sortieBo.deleteSortie(val(local.sortie));
          addToRequest("success",{message='Sortie deleted successfully'});
          local.page = getRootPath() & "/" & getProgram() & "/sortie/createSortie.cfm"; 
          
          if(isAjaxRequest()){
            local.result.success = true;
            local.result.message = 'Sortie deleted successfully';  
            return local.result;      
          }
          redirect(url=local.page, persist="true");
            
       
       
       }catch(any e){
          addToRequest("error",e);
          local.cause = local.utils.getCause(e);
          local.utils.recordError(local.cause,getComponentName(),"deleteSortie",getUser());
          
          if(isAjaxRequest()){
            local.result.success = false;
            local.result.message = e.message;  
            return local.result;      
          }
          
          redirect(url=local.page,persist=true);           
       }
        
    }
    
    
    private numeric function decryptSortieId(required string sortieId){
       var local = {};
        local.sortie = 0;
        if(isNumeric(ARGUMENTS.sortieId)){
           return trim(ARGUMENTS.sortieId);
        }   
           try{
                local.sortie = Decrypt(arguments.sortieId,getSessionFacade().getSecretKey(),"AES","HEX");
                
              }catch(err e){
                  
              }
        
        return local.sortie;
    }

    private void function populateSortieFromId(required numeric sortieId){
        var local = {};
        local.sortie = val(decryptSortieId(ARGUMENTS.sortieId));
       if(isNumeric(local.sortie) and local.sortie > 0){
           local.sortieObj = getSortieService().getSorties(local.sortie);
           addToFormRequest("serno",local.sortieObj.getSerNo());  
           addToFormRequest("missionId",local.sortieObj.getMissionId());
            
           
           
           addToFormRequest("rangeCd",local.sortieObj.getRange());
           try{
               if(isNumeric(local.sortieObj.getRange())){
                 local.code = getCodeService().getCode(val(local.sortieObj.getRange())); 
                 addToFormRequest("range",local.code.getCodeValue());
                                   
               } 
           }catch(any e){
               
           }
           
           addToFormRequest("sortieEffectCd",local.sortieObj.getSortieEffect());
           try{
               if(isNumeric(local.sortieObj.getSortieEffect())){
                 local.code = getCodeService().getCode(val(local.sortieObj.getSortieEffect())); 
                 addToFormRequest("sortieEffect",local.code.getCodeValue());
                                   
               } 
           }catch(any e){
               
           }
            
           if(isDate(local.sortieObj.getSortieDate())){
               local.sortieDate = UCASE(TRIM(DateFormat(local.sortieObj.getSortieDate(),"dd-mmm-yyyy")));      
               addToFormRequest("sortieDate",local.sortieDate); 
           }
           
           addToFormRequest("acTypeCd",local.sortieObj.getAcType());
           try{
               if(isNumeric(local.sortieObj.getAcType())){
                 local.code = getCodeService().getCode(val(local.sortieObj.getAcType())); 
                 addToFormRequest("acType",local.code.getCodeValue());
                                   
               } 
           }catch(any e){
               
           }
           
           addToFormRequest("currentUnitCd",local.sortieObj.getCurrentUnit());
           try{
               if(isNumeric(local.sortieObj.getCurrentUnit())){
                 local.code = getCodeService().getCode(val(local.sortieObj.getCurrentUnit())); 
                 addToFormRequest("currentUnit",local.code.getCodeValue());
                                   
               } 
           }catch(any e){
               
           }
              
           
           addToFormRequest("acTailNo",local.sortieObj.getAcTailNo());
           addToFormRequest("acStation",local.sortieObj.getAcStation());  
           addToFormRequest("remarks",local.sortieObj.getRemarks());
           addToFormRequest("reason",local.sortieObj.getReason());      
        }   
    }
    
    
    /* populate Sortie bean from formRequest */
    private Sorties function populateSortie(required struct formRequest) {
        var local = {};
        local.sortie = new Sorties();

        if (StructKeyExists(arguments.formRequest, "sortieId")) {
        	local.sortieId = decryptSortieId(arguments.formRequest["sortieId"]);
            local.sortie.setSortieId(val(local.sortieId));
        }
        
        if (StructKeyExists(arguments.formRequest, "missionId")) {
            local.sortie.setMissionId(arguments.formRequest["missionId"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "serNo")) {
            local.sortie.setSerNo(arguments.formRequest["serNo"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "acTailNo")) {
            local.sortie.setAcTailno(arguments.formRequest["acTailNo"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "sortieDate")) {
            local.sortie.setSortieDate(arguments.formRequest["sortieDate"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "assetId")) {
            local.sortie.setAssetId(arguments.formRequest["assetId"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "sortieEffectCd")) {
            local.sortie.setSortieEffect(arguments.formRequest["sortieEffectCd"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "acStation")) {
            local.sortie.setAcStation(arguments.formRequest["acStation"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "acTypeCd")) {
            local.sortie.setAcType(arguments.formRequest["acTypeCd"]);
        }

        if (StructKeyExists(arguments.formRequest, "rangeCd")) {
            local.sortie.setRange(arguments.formRequest["rangeCd"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "reason")) {
            local.sortie.setReason(arguments.formRequest["reason"]);
        }
        
        if (StructKeyExists(arguments.formRequest, "remarks")) {
            local.sortie.setRemarks(arguments.formRequest["remarks"]);
        }
        
        
        if (StructKeyExists(arguments.formRequest, "currentUnitCd")) {
            local.sortie.setCurrentUnit(arguments.formRequest["currentUnitCd"]);
        }

        local.sortie.setPgmId(application.sessionManager.getProgramIdSetting());
        local.sortie.setInsBy(application.sessionManager.getUserName());
        local.sortie.setInsDate(Now());

        return local.sortie;
    }
    
    remote any function saveMappings(required any mappings){
        var local = {};
        local.utils = new utilities();
        local.result = {'success'=false,'message'=''};
         try{ 
             
             
             local.page = getRootPath() & "/" & getProgram() & "/sortie/mapSortie.cfm"; 
             
             //local.sessionRequestFacade = new sessionRequestFacade();    
             //local.sessionRequestFacade.createSessionRequest();  
             //local.sessionRequestFacade.addFormToRequest(Duplicate(ARGUMENTS.formRequest));
             
             if(isDefined("request.httpReferer") and len(trim(request.httpReferer))){
                    local.page = request.httpReferer;      
             }
            local.importSortie = getImportSortie();
            
            local.mappings = ARGUMENTS.mappings;
            
            if(IsJSON(local.mappings)){
                    local.mappings = DeserializeJSON(local.mappings);              
             } 
            ARGUMENTS.mappings = local.mappings;
            
            SESSION.sortieImport.mappings = local.mappings;
            //local.sessionRequestFacade.addToFormRequest("upload",SESSION.sortieImport.upload);
            //local.sessionRequestFacade.addToFormRequest("mappings",local.mappings);
            
            addToFormRequest("upload",SESSION.sortieImport.upload);
            addToFormRequest("mappings",local.mappings);
            
            local.result = local.importSortie.saveMappings(argumentcollection=arguments);

            /*if(local.save.success){
                //local.sessionRequestFacade.addToRequest("success",{message="Mappings Saved Successfully!"}); 
                addToRequest("success",{message="Mappings Saved Successfully!22"});     
            }else if(len(trim(local.save.message))){
                //local.sessionRequestFacade.addToRequest("error",{message="Mappings Unsuccessfully Saved!"}); 
                addToRequest("error",{message="Mappings Unsuccessfully Saved!"});               
            }*/
            
            //location(url=local.page,addToken=false);
            //redirect(local.page,true);
            
        }catch(any e){
            //getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="saveMappings");
            //local.sessionRequestFacade.addToRequest("errorType",e.type);
            //local.sessionRequestFacade.addToRequest("error",e);
            
            local.result['success'] = false;
            local.result['message'] = e.message;
            addToRequest("error",e); 
            local.utils.recordError(e,getComponentName(),"saveMappings",getUser());
            //location(url=local.page,addToken=false); 
            //redirect(local.page,true);    
        }
        
        
        return local.result;    
    }
    
    remote any function importData(required string filepath,required string action,required string item,required any mappings){
        var local = {};
        local.result = {'success'=false,'message'=''};
        local.utils = new utilities();
        
        if(isJSON(ARGUMENTS.mappings)){
            ARGUMENTS.mappings = DeserializeJSON(ARGUMENTS.mappings);   
        }
        
        local.importSortie = getImportSortie();
        local.page = getRootPath() & "/" & getProgram() & "/sortie/mapSortie.cfm"; 
        try{
            local.result = local.importSortie.importData(argumentCollection=arguments);
        }catch(cfc.utils.import.importSortie.InvalidMappings e){
          local.result['success'] = false;
          local.result['message'] = e.message;
        }catch(any e){
          //getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="importData");
          local.utils.recordError(e,getComponentName(),"importData",getUser());
          
          local.message = "There was an error importing sortie data.";
          
          if(local.utils.isCustomError(e)){
              
             local.message = e.message ;
             
             if(isDefined("e.detail") and findnocase("not found in the list of parameters specified",e.detail)){
                 local.message = "There was an error with column headers while importing sortie data.  Please make sure #Arguments.action# document has valid column headers." ; 
              }
            
          }
          
          local.result['success'] = false;
          local.result['message'] = local.message;
          
          addToRequest("error",{message=e.message});   
          
          
        }
    return local.result;        
    }
    
    remote array function getSortieColumns(){
        var local = {};
        return getDBUtils().getSortieColumns();    
    }
    
    remote any function readColumns(required String action,required String filepath,required String item){
        var local = {};
        
        SESSION.sortieImport.upload = "";
        SESSION.sortieImport.sortieCurrentItem = ARGUMENTS.item;
        local.columns = getImportSortie().readColumns(argumentCollection=arguments);
        if(not isSimpleValue(SESSION.sortieImport.upload)){
            SESSION.sortieImport.upload.setColumns(local.columns);
        }
        return local.columns;    
    }
    
    public any function getSessionRequestFacade(){
       return variables.instance.sessionRequestFacade;      
    }
    
}