<cfsilent>

    <cfscript>
        param name="request.context" default="#{ }#";

        import cfc.facade.SessionRequestFacade;
        import cfc.facade.SessionFacade;
        import cfc.utils.javaLoggerProxy;
        import cfc.utils.import.importSortie;
        import cfc.utils.QueryIterator;
        import cfc.utils.utilities;
        import criis.controller.configurationController;
        import criis.controller.maintenanceUIDController;
        import criis.controller.sortieController;
        import criis.controller.notificationsController;
        
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
        dbUtils = '', 
        utilities = new utilities()
    };

    public any function init(String action = getAction()){
      setAction(ARGUMENTS.action);
  
       return this;   
    }
    
    public any function getDBUtils(){
       if(isSimpleValue(variables.instance.dbUtils)){
           variables.instance.dbUtils = getObjectFactory().create("DbUtils");    
        }       
       return variables.instance.dbUtils;      
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
        var local = {};
        local.program = lcase(trim(application.sessionManager.getProgramSetting()));
        local.programPath = "/" & local.program;
    	if(!DirectoryExists(ExpandPath(local.programPath))){
    	   local.program = "default";	
    	}
       return local.program;      
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
        getJavaLoggerProxy().fine(message="Looking for action '#ARGUMENTS.action#'",sourceClass=getComponentName(), methodName="forward");
        
            try{
                
                setAction(ARGUMENTS.action);
                
                //local.sessionRequestFacade = new sessionRequestFacade(); 
                //local.sessionRequestFacade.createSessionRequest();       
                //local.sessionRequestFacade.addFormToRequest(rc.form);
                
                
                switch(lcase(trim(ARGUMENTS.action))){
                    
                    

                    case 'create.maintenance': {
                        local.page = getRootPath() & "/" & getProgram() & "/maintenance/createMaintenance.cfm";
                        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");

                        local.newJobIdService = application.objectFactory.create("NewJobIdService");
                        local.newJobId = local.newJobIdService.getNewJobId(application.sessionManager.getProgramSetting(),application.sessionManager.getLocIdSetting());
                        //local.sessionRequestFacade.addToFormRequest("jobId", local.newJobId);
                        addToFormRequest("jobId",local.newJobId);
                        redirect(local.page,true);
                        //location(url=local.page, addToken="no");    
                    break;
                    }
                    
                    case 'delete.maintenance': {
                        local.maintenanceController = new maintenanceController();
                        local.maintenanceController.deleteEvent(rc.eventJob, rc.page);
                           
                    break;
                    }

                    case 'create.maintenance.detail': {
                        local.maintenanceController = new maintenanceController();
                        local.maintenanceController.getRepairSeq(Duplicate(Form));
                           
                    break;
                    }
                    
                    case 'delete.maintenance.detail': {
                        local.maintenanceController = new maintenanceController();
                        local.maintenanceController.deleteRepair(rc.eventRepair);
                           
                    break;
                    }
                    
                    case 'create.maintenance.uid': {
                        local.page = getRootPath() & "/" & getProgram() & "/maintenance/createMaintenanceUID.cfm";
                        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        redirect(local.page,true);
                        //location(url=local.page, addToken="no"); 
                           
                    break;
                    }
                    
                    case 'create.maintenance.uid.detail': {
                        local.page = getRootPath() & "/" & getProgram() & "/maintenance/createMaintenanceUIDDetail.cfm";
                        param name="request.context.assetid" default="0";
                        local.dbUtils = getObjectFactory().create("DBUtils");
                        local.assetLevels = local.dbUtils.readLevelsByAssetId(request.context.assetid);
                        addToRequest("qAssetLevels",local.assetLevels);
                        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        redirect(local.page,true);
                        //location(url=local.page, addToken="no"); 
                           
                    break;
                    }
                    
                    // edit.maintenance add - Kevin 08 November 2013 
                    case 'edit.maintenance': {
                        param name="rc.eventJob" default="";
                        addFormToRequest(form);
                        
                        local.maintenanceController= new maintenanceController();
                        local.maintenanceController.editEvent(rc.eventJob);

                    break;
                    }
                    // edit.maintenance add - end
                    
                    case 'delete.bitPc': {
                    	
                    	
                        addFormToRequest(form);
                        
                        local.maintenanceController= new maintenanceController();
                        local.maintenanceController.deleteLaborBitPc(Duplicate(request.context));
                    }
                    
                    case 'edit.maintenance.detail': {
                    	param name="rc.eventRepair" default="";
                    	addFormToRequest(form);
                    	
                    	local.maintenanceController= new maintenanceController();
                        local.maintenanceController.editEventDetail(rc.eventRepair);
                    }
                    
                    // search.backlog add - Kevin Added on 05 November 2013
                    case 'search.backlog': {
                    	param name="session.searchCriteria" default="";
                        param name="form.searchCriteria" default="#session.searchCriteria#";
                        addFormToRequest(form);
                        
                        local.maintController= new maintenanceController();
                        local.maintController.searchBacklog(form.searchCriteria);

                    break;
                    }
                    // search.backlog end
                    
                                       
                    case 'export.backlog': {
                    	param name="url.exportType" default="";
                    	param name="form.exportType" default="#url.exportType#";
                    	addFormToRequest(form);
                    	
                    	local.maintenanceController=new maintenanceController();
                    	local.maintenanceController.exportBacklog(Duplicate(Form));
                    }
                                       
                    case 'export.pmi': {
                    	param name="url.exportType" default="";
                    	param name="form.exportType" default="#url.exportType#";
                    	addFormToRequest(form);
                    	
                    	local.maintenanceController=new maintenanceController();
                    	local.maintenanceController.exportPmi(Duplicate(Form));
                    }
                                       
                    case 'export.tcto': {
                    	param name="url.exportType" default="";
                    	param name="form.exportType" default="#url.exportType#";
                    	addFormToRequest(form);
                    	
                    	local.maintenanceController=new maintenanceController();
                    	local.maintenanceController.exportTcto(Duplicate(Form));
                    }
                    
                    case 'export.partOrdered': {
                    	param name="url.exportType" default="";
                    	param name="form.exportType" default="#url.exportType#";
                    	param name="form.searchCriteria" default="";
                    	addFormToRequest(form);
                    	
                    	local.maintenanceController=new maintenanceController();
                    	local.maintenanceController.exportPartOrdered(Duplicate(Form));
                    }
                    
                    case 'search.pmi': {                    	
                    	param name="session.searchCriteria" default="";
                        param name="form.searchCriteria" default="#session.searchCriteria#";
                        param name="session.dueDateInterval" default="60";
                        param name="form.dueDateInterval" default="#session.dueDateInterval#";
                        addFormToRequest(form);
                        
                        local.maintController= new maintenanceController();
                        local.maintController.searchPmi(form.searchCriteria,form.dueDateInterval);                    	
                    }
                    
                    case 'search.tcto': {                    	
                    	param name="session.searchCriteria" default="";
                        param name="form.searchCriteria" default="#session.searchCriteria#";
                        addFormToRequest(form);
                        
                        local.maintController= new maintenanceController();
                        local.maintController.searchTcto(form.searchCriteria);                    	
                    }
                    
                    case 'search.partOrdered': {
                    	param name="form.searchCriteria" default="";
                    	
                    	local.maintController= new maintenanceController();
                    	local.maintController.searchPartOrdered(form.searchCriteria);
                    }

					case 'new.configuration': {
                        param name="request.context.assetid" default="0";
                    	param name="request.context.nhaassetid" default="0";
                    	param name="request.context.serno" default="";
                    	param name="request.context.partno" default="";
                    	local.configController = new configurationController();
                    	getJavaLoggerProxy().fine(message="Sending to configController.newConfig()",sourceClass=local.utils.getComponentName(this), methodName="forward");
                    	local.configController.newConfig(request.context.assetid);
                    break;
                    }
					
					
                    case 'create.configuration': {
                        param name="request.context.assetid" default="0";
                    	param name="request.context.nhaassetid" default="0";
                    	param name="request.context.sranoun" default="";
                    	param name="request.context.lru" default="false";
                    	local.configController = new configurationController();
                    	getJavaLoggerProxy().fine(message="Sending to configController.updateConfig()",sourceClass=local.utils.getComponentName(this), methodName="forward");
                    	local.configController.updateConfig(request.context.assetid,request.context.nhaassetid,request.context.sranoun);
                    break;
                    }
                    
                    
                    case 'list.configuration': {
                        param name="request.context.assetid" default="0";
                    	param name="request.context.nhaassetid" default="0";
                    	local.configController = new configurationController();
                    	getJavaLoggerProxy().fine(message="Sending to configController.listConfig()",sourceClass=local.utils.getComponentName(this), methodName="forward");
                    	local.configController.listConfig(request.context.assetid);
                    break;
                    }
                    
                    case 'edit.configuration': {
                    	param name="request.context.assetid" default="0";
                    	param name="request.context.nhaassetid" default="0";
                    	local.page = getRootPath() & "/" & getProgram() & "/configuration/editConfiguration.cfm";
                    	local.configController = new configurationController();
                    	getJavaLoggerProxy().fine(message="Sending to configController.editConfig()",sourceClass=local.utils.getComponentName(this), methodName="forward");
                    	local.x = local.configController.editConfig(request.context.assetid);
                    break;
                    }
                    
                    case 'edit.configuration.sub': {
                    	param name="request.context.assetid" default="0";
                    	param name="request.context.nhaassetid" default="0";
                    	local.page = getRootPath() & "/" & getProgram() & "/configuration/addSubConfiguration.cfm";
                    	local.configController = new configurationController();
                    	getJavaLoggerProxy().fine(message="Sending to configController.editConfig()",sourceClass=local.utils.getComponentName(this), methodName="forward");
                    	local.x = local.configController.editSubConfig(request.context.assetid);
                    break;
                    }
                    
                    case 'add.configuration.sub': {
                    	param name="request.context.assetid" default="0";
                    	param name="request.context.nhaassetid" default="0";
                    	local.page = getRootPath() & "/" & getProgram() & "/configuration/addSubConfiguration.cfm";
                    	local.configController = new configurationController();
                    	getJavaLoggerProxy().fine(message="Sending to configController.editConfig()",sourceClass=local.utils.getComponentName(this), methodName="forward");
                    	local.x = local.configController.addSubConfig(request.context.assetid);
                    break;
                    }                 
                    
                    case 'export.config': {
                    	param name="url.exportType" default="";
                    	param name="url.assetID" default="";
                    	param name="form.exportType" default="#url.exportType#";
                    	param name="form.assetID" default="#url.assetID#";
                    	addFormToRequest(form);                    	
                    	
                    	local.configController=new configurationController();
                    	local.configController.exportConfig(Duplicate(Form));
                    }
                                        
                    case 'export.spares': {
                    	param name="url.exportType" default="";
                    	param name="form.exportType" default="#url.exportType#";
                    	param name="form.sparescriteria" default="#getSessionFacade().getValue("sparesCriteria")#";
                    	addFormToRequest(form);
                    	
                    	local.sparesController=new sparesController();
                    	local.sparesController.exportSpares(Duplicate(Form));
                    }
                    
                    case 'create.sortie':{
                        local.page = getRootPath() & "/" & getProgram() & "/sortie/createSortie.cfm";

                        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        
                        local.sortieController= new sortieController();
                        local.sortieController.createSortie(Duplicate(Form));
                        
                      
                    break;
                    }
                    
                    
                    case 'create.sortie1':{
                        local.page = getRootPath() & "/" & getProgram() & "/sortie/createSortie.cfm";

                        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        
                        local.sortieController= new sortieController();
                        local.sortieController.createSortie(Duplicate(Form));
                        
                      
                    break;
                    }
                    
                    case 'createlike.sortie':{
                        local.page = getRootPath() & "/" & getProgram() & "/sortie/createSortie.cfm";
                        
                        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        
                        local.likeFields = [
                            'SerNo',
                            'CurrentUnit',
                            'CurrentUnitCd',
                            'Range',
                            'RangeCd',
                            'MissionId',
                            'SortieDate',
                            'AcType',
                            'AcTypeCd',
                            'assignedUnitCd',
                            'assignedUnit',
                            'fieldnames'
                        ];
                        
                        local.currentForm = rc.form;
                        for(local.key in local.currentForm){
                        	if(!listFindNoCase(ArrayToList(local.likeFields),trim(local.key))){
                        	   rc.form['#local.key#'] = "";      	
                        	}
                        	
                        }
                        
                        redirectPage(local.page,true);

                    break;
                    }
                    
                    case 'import.sortie':{
                        local.page = getRootPath() & "/" & getProgram() & "/sortie/uploadSortie.cfm";
                        
                        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        redirect(url=local.page, persist = true);    
                    break;
                    }
                    
                    case 'export.sortie': {
                    	
                    	local.sortieController=new sortieController();
                    	local.sortieController.exportSortie(Duplicate(Form));
                    }
                    
                    
                    case 'upload.sortie':{
                        
                        //Sortie upload process
                        local.page = getRootPath() & "/" & getProgram() & "/sortie/uploadSortie.cfm";
                        sortieController= new sortieController();
                        getJavaLoggerProxy().fine(message="Sending to sortieController.uploadSortie()",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        
                        local.sortieUpload = sortieController.uploadSortie(Duplicate(form));
                         
                    break;
                    }
                    
                    case 'edit.sortie': {
                    	local.page = getRootPath() & "/" & getProgram() & "/sortie/editSortie.cfm";
                        getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        param name="url.sortie" default="0";
                        local.sortieController= new sortieController();
                        local.sortieController.editSortie(url.sortie);
                       
                    break;
                    }
                    
                    case 'search.sortie': {
                        
                        local.programId = getSessionFacade().getProgramIdSetting();
                        local.currentUnitId = getSessionFacade().getLocIdSetting();
                        
                        param name="form.sortieSerno" default="";
                        param name="form.missionId" default="";
                        param name="form.sortieDate" default="";
                        param name="form.programid" default="#val(local.programId)#";
                        param name="form.currentUnitId" default="#val(local.currentUnitId)#";
                        param name="form.isNonPodded" default="N";
                        
                        local.sortieController= new sortieController();
                        
                        if(Structkeyexists(form,"sortieCriteria")){
                        	
                        	local.page = getRootPath() & "/" & getProgram() & "/sortie/sortieSearch.cfm"; 
                			
                			getSessionFacade().setValue("sortieCriteria",trim(form.sortieCriteria));
                			local.search = getDBUtils().searchSortieMenu(sortieCriteria=trim(form.sortieCriteria), programId = form.programId,locId=form.currentUnitId);	
                			addToFormRequest("sortieResults",local.search);        
                			redirect(local.page,true); 
                        	 
                        }else{
                            local.sortieController.searchSortie(serno=form.sortieSerno,missionid=form.missionid,sortieDate = form.sortieDate, programId = form.programId,locId=form.currentUnitId, isNonPodded=form.isNonPodded);	
                        }
                		local.sortieController.searchSortieMenu(argumentCollection=arguments); 
                        
                        local.sortieController.searchSortie(serno=form.sortieSerno,missionid=form.missionid,sortieDate = form.sortieDate, programId = form.programId,locId=form.currentUnitId);
                       
                    break;
                    }
                    
                    case 'remove.sra': {
                        
                        param name="rc.assetid" default="0";  
                        local.configurationController= new configurationController();
                        local.configurationController.removeSRA(rc.assetid);
                       
                    break;
                    }
                    
                    case 'update.sra': {
                        
                        param name="form.assetid" default="0";
                        param name="form.newassetid" default="0";    
                        local.configurationController= new configurationController();
                        local.configurationController.moveConfig(form.assetid,form.newassetid);

                    break;
                    }
                    
                    case 'search.configuration': {
                        
                        
                        local.programId = getSessionFacade().getProgramIdSetting();
                        local.currentUnitId = getSessionFacade().getLocIdSetting();
                        local.system = getSessionFacade().getSubSection();
                        
                        if(!len(trim(local.system))){
                        	local.system = 'AIRBORNE';
                        }
                        
                        param name="rc.configurationCriteria" default="";
                        param name="rc.programid" default="#val(local.programId)#";
                        param name="rc.currentUnitId" default="#val(local.currentUnitId)#";
                        param name="rc.system" default="#local.system#";
                        local.configurationController= new configurationController();
                        local.configurationController.searchConfiguration(form.configurationCriteria);
                       
                    break;
					}
                    
                    case 'list.spares.page': {
                        param name="form.spareNouns" default="";
                        getSessionFacade().removeValue("sparesCriteria");
                        addFormToRequest(form);
                        
                        local.sparesController= new sparesController();
                        local.sparesController.listSpares(form.spareNouns);

                    break;
                    }
                    
                    case 'list.spares': {
                        
                        
                        if(isDefined("rc.spareNoun")){
                            param name="form.spareNouns" default="#ucase(trim(rc.spareNoun))#";	
                        }
 
                        addFormToRequest(form);
                        
                        local.sparesController= new sparesController();
                        if(!Structkeyexists(form,"spareNouns")){
	                        local.criteria = getSessionFacade().getValue("sparesCriteria");
	                        local.noun = getSessionFacade().getValue("spareNouns");

	                        if(len(trim(local.noun))){
	                            addToFormRequest("spareNouns",local.noun);
	                            param name="form.spareNouns" default="#ucase(trim(local.noun))#";
	                            local.sparesController.getSpares(local.noun);    
	                        }else if(len(trim(local.criteria))){
	                            addToFormRequest("sparesCriteria",local.criteria);
	                            local.sparesController.searchSpares(local.criteria);
	                        }else{
	                        	local.sparesController.listSpares('');
	                        }
                        }else{
                        	local.sparesController.getSpares(form.spareNouns);
                        }


                    break;
                    }
                    
                    
                    case 'search.spares': {
                        param name="form.sparesCriteria" default="";
                        addFormToRequest(form);
                        
                        local.sparesController= new sparesController();
                        local.sparesController.searchSpares(form.sparesCriteria);

                    break;
                    }
                    
                    case 'add.spare': {
                        param name="rc.spareAsset" default="";
                        param name="rc.spareNouns" default="";
                        local.sparesController= new sparesController();
                        local.sparesController.addSpare(rc.spareAsset,rc.spareNouns);

                    break;
                    }
                    
                    case 'add.like.spare': {
                        param name="rc.spareAsset" default="";
                        local.sparesController= new sparesController();
                        local.sparesController.addLikeSpare(rc.spareAsset);

                    break;
                    }
                    
                    case 'add.spare.part': {
                        local.sparesController= new sparesController();
                        local.sparesController.addSparePart();

                    break;
                    }
                    
                    case 'edit.spare': {
                        param name="rc.spareAsset" default="";
                        
                        local.sparesController= new sparesController();
                        local.sparesController.editSpare(rc.spareAsset);

                    break;
                    }
                    
                    case 'create.spare': {
                        local.sparesController= new sparesController();
                        local.sparesController.createSpare(argumentCollection=form);

                    break;
                    }
                    
                    case 'create.spare.part': {
                        local.sparesController= new sparesController();
                        local.sparesController.createSparePart(argumentCollection=form);

                    break;
                    }

                    case 'update.spare': {
                        param name="form.spareAsset" default="0";
                        local.sparesController= new sparesController();
                        local.sparesController.updateSpare(argumentCollection=form);

                    break;
                    }

                    case 'delete.spare': {
                        param name="rc.spareAsset" default="0";
                        local.sparesController= new sparesController();
                        local.sparesController.deleteSpare(rc.spareAsset);

                    break;
                    }
                    
                    case 'list.notifications': {
                        
                        local.notifications = new notificationsController();
                        local.notifications.listNotifications();
                        
                        
                    break;
                    }
                    
                    case 'get.notifications': {
                        
                        local.notifications = new notificationsController();
                        local.notifications.listNotifications(true);

                    break;
                    }
                    
                    case 'add.notification':{
                        local.notifications = new notificationsController();
                        local.notifications.addNotification();   

                    break;
                    }
                    
                    case 'edit.notification':{
                    	param name="rc.msg" default="";
                    	if(isDefined("rc.msgId")){
                    	   rc.msg = rc.msgId;	
                    	}

                    	local.notifications = new notificationsController();
                    	local.notifications.editNotification(rc.msg);

                    break;
                    }
                    case 'search.notifications': {
                        param name="rc.programs" default="-1";
                        param name="rc.startDate" default="";
                        param name="rc.stopDate" default="";
                        
                        local.notifications = new notificationsController();
                        local.notifications.searchNotifications(programid = rc.programs,startDate = rc.startDate,stopDate=rc.stopDate);
                        
                    break;
                    }

                    case 'delete.notification.link': {
                        param name="rc.msg" default="0";
                       
                        local.notifications = new notificationsController();
                        local.notifications.deleteNotificationLink(msgId = trim(rc.msg));
                        
                    break;
                    }
                      
                                        
                    case 'search.inventory':{
                    	param name="rc.system" default="";
                        param name="form.system" default="#rc.system#"; 
                        param name="rc.searchCriteria" default="";
                        param name="form.searchCriteria" default="#rc.searchCriteria#";
                        
                        addToRequest(form);
                        local.inventory = new inventoryController();
                        local.inventory.searchAssets(Duplicate(Form));
                        //getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        //redirect(url=local.page, persist = true);    
                    break;
                    }
                                     
                    case 'edit.inventory':{
                    	local.page = getRootPath() & "/" & getProgram() & "/inventory/editInventory.cfm";
                        
                        local.inventory = new inventoryController();
                        local.inventory.getAsset(rc.assetId);
                        //getJavaLoggerProxy().fine(message="Redirecting to #local.page#",sourceClass=local.utils.getComponentName(this), methodName="forward");
                        //redirect(url=local.page, persist = true);    
                    break;
                    }
                    
                                        
                    case 'export.inventory': {
                    	param name="url.exportType" default="";
                    	param name="form.exportType" default="#url.exportType#";
                    	param name="form.system" default="#url.system#";
                    	addFormToRequest(form);
                    	
                    	local.inventoryController=new inventoryController();
                    	local.inventoryController.exportInventory(Duplicate(Form));
                    }
                    
                    case 'update.bitPc' :{
                    	param name="url.laborBitId" default="#url.labor_bit_id#";
                    	param name="url.eventRepair" default="#url.eventRepair#";
                    	
                    	local.page = getRootPath() & "/" & getProgram() & "/maintenance/createBitPc.cfm";
                    	
                    	local.maintenanceController = new maintenanceController();
                    	var laborBitPc = maintenanceController.getLaborBitPc(url.laborBitId, url.eventRepair);
                    	addToRequest(laborBitPc);
                    	
                        redirect(local.page,true);
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
                    
                    
                    
                    case 'insert.event': {
                        //insert new event record
                        local.maintenanceController= new maintenanceController();
                       // getJavaLoggerProxy().fine(message="Sending to maintenanceController.insertEvent()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        
                        maintenanceController.insertEvent(Duplicate(form));
                    break;
                    }
                    
                    case 'insert.eventDetail': {
                    	// insert new event detail
                    	local.maintenanceController = new maintenanceController();
                        maintenanceController.insertRepair(Duplicate(form));
                    }
                    
                    case 'update.eventDetail': {
                    	// update event detail
                    	local.maintenanceController = new maintenanceController();
                    	maintenanceController.updateRepair(Duplicate(form));
                    }
                    
                    
                    case 'update.eventDetail.bitPc' :{
                    	local.page = getRootPath() & "/" & getProgram() & "/maintenance/createBitPc.cfm";
                    	
                    	local.maintenanceController = new maintenanceController();
                    	
                    	if(StructKeyExists(rc, "repairId")){
                    		maintenanceController.updateRepairBitPc(Duplicate(rc));
                    	} else{
                    		maintenanceController.insertRepairBitPc(Duplicate(rc));
                    	}
                    	
                    	
                        redirect(local.page,true);
                    }
                    
                    case 'insert.bitPc':{
                    	param name="form.bPartno" default="#request.context.bPartno#";
                    	param name="form.bName" default="#request.context.bName#";
                    	param name="form.bQty" default="#request.context.bQty#";
                    	param name="form.laborId" default="#request.context.laborId#";
                    	param name="form.eventRepair" default="#request.context.eventRepair#";
                    	
                    	local.maintenanceController = new maintenanceController();
                    	maintenanceController.insertBitPc(Duplicate(request.context));
                    	
                    }
                    
                    case 'update.event': {
                        //update event record
                        local.maintenanceController= new maintenanceController();
                        getJavaLoggerProxy().fine(message="Sending to maintenanceController.updateEvent()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        
                        maintenanceController.updateEvent(Duplicate(form));
                    break;
                    }
                    
                    case 'read.uid': {
                        param name="form.uids" default="";
                        getJavaLoggerProxy().fine(message="Sending to maintenanceUIDController.readUII()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        local.maintenanceUIDController= new maintenanceUIDController();
                        local.maintenanceUIDController.readUII(form.uids);
                    break;
                    }
                    
                    case 'save.subsystem':{
                        
                         param name="form.subSystem" default="airborne";
                        local.sessionFacade = new SessionFacade(); 
					    getJavaLoggerProxy().fine(message="Sending to sessionFacade.setSubSection()",sourceClass=local.utils.getComponentName(this), methodName="saveSubSection");
					    local.sessionFacade.setSubSection(form.subSystem); 
                        
                    break;
                    }
                    
                    case 'search.sortie': {
                        
                        local.programId = getSessionFacade().getProgramIdSetting();
                        local.currentUnitId = getSessionFacade().getLocIdSetting();
                        
                        param name="form.sortieSerno" default="";
                        param name="form.missionId" default="";
                        param name="form.sortieDate" default="";
                        param name="form.programid" default="#val(local.programId)#";
                        param name="form.currentUnitId" default="#val(local.currentUnitId)#";
                        if(StructKeyExists(form, "isNonPodded") and form.isNonPodded EQ 'on')
                        	param name="isNonPodded" default="Y";
                        else
                        	param name="isNonPodded" default="N";
                        	
                        local.sortieController= new sortieController();
                        
                        if(Structkeyexists(form,"sortieCriteria")){
                            //local.sortieController.searchSortie(sortieCriteria = trim(form.sortieCriteria));
                            
                            getSessionFacade().setValue("sortieCriteria",trim(form.sortieCriteria));
                			local.search = getDBUtils().searchSortieMenu(sortieCriteria=trim(form.sortieCriteria), programId = form.programId,locId=form.currentUnitId);	
                			
                			addToFormRequest("sortieResults",local.search);                			
                			redirect(local.page,true); 
                			
                        }else{
                            local.sortieController.searchSortie(serno=form.sortieSerno,missionid=form.missionid,sortieDate = form.sortieDate, programId = form.programId,locId=form.currentUnitId, isNonPodded=isNonPodded); 
                        }
                        //local.sortieController.searchSortieMenu(argumentCollection=arguments); 
                        
                        //local.sortieController.searchSortie(serno=form.sortieSerno,missionid=form.missionid,sortieDate = form.sortieDate, programId = form.programId,locId=form.currentUnitId);
                       
                    break;
                    }
                    
                    case 'list.sorties':{
                        getJavaLoggerProxy().fine(message="Sending to sortieController.searchSortie()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        local.programId = getSessionFacade().getProgramIdSetting();
                        local.locId = getSessionFacade().getLocIdSetting();
                        
                        
                        local.sortieSearch = getSessionFacade().getValue("sortieSearch");
                        local.sortieCriteria = getSessionFacade().getValue("sortieCriteria");
                        
                        param name="form.sortieSerno" default="#local.sortieSearch#";
                        param name="form.missionId" default="";
                        param name="form.sortieDate" default="";
                        param name="form.programid" default="#val(local.programId)#";
                        param name="form.locId" default="#val(local.locId)#";
                        local.sortieController= new sortieController();
                        
                        
                        if(len(trim(local.sortieCriteria))){
                            local.sortieController.searchSortie(sortieSearch = true,sortieCriteria=local.sortieCriteria,missionid=form.missionid,sortieDate = form.sortieDate, programId = form.programId,locId=form.locId); 
                        }else if(len(trim(local.sortieSearch))){
                        	local.sortieController.searchSortie(sortieSearch=true,serno=form.sortieSerno,missionid=form.missionid,sortieDate = form.sortieDate, programId = form.programId,locId=form.locId); 
                        }else{
                        	
                            redirect('../sortie/sortieSearch.cfm',true);	
                        }   	
                    }
                    
                    case 'insert.sortie': {
                        getJavaLoggerProxy().fine(message="Sending to sortieController.insertSortie()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        local.programId = getSessionFacade().getProgramIdSetting();
                        local.currentLocId = getSessionFacade().getLocIdSetting();
                        
                        param name="form.sortieCriteria" default="";
                        param name="form.programid" default="#val(local.programId)#";
                        param name="form.locId" default="#val(local.currentLocId )#";
                        local.sortieController= new sortieController();
                        local.sortieController.insertSortie(Duplicate(form));
                       
                    break;
                    }
                    
                    case 'upload.sortie':{
                        //Sortie upload process
                        local.page = getRootPath() & "/" & getProgram() & "/sortie/uploadSortie.cfm";
                        local.sortieController= new sortieController();
                        getJavaLoggerProxy().fine(message="Sending to sortieController.uploadSortie()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        
                        local.sortieUpload = local.sortieController.uploadSortie(Duplicate(form));
                        
                    break;
                    }
                    
                    case 'load.mappings':{

                        local.sortieController= new sortieController();
                        getJavaLoggerProxy().fine(message="Sending to sortieController.loadMappings()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        
                        local.sortieUpload = local.sortieController.loadMappings();
                        
                    break;
                    }
                   
                    case 'save.mappings':{

                        local.sortieController= new sortieController();
                        getJavaLoggerProxy().fine(message="Sending to sortieController.saveMappings()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        
                        local.save = local.sortieController.saveMappings(Duplicate(form));
                        
                    break;
                    }
                    
                    case 'import.sortie':{
                        //Sortie upload process
                        local.page = getRootPath() & "/" & getProgram() & "/sortie/uploadSortie.cfm";
                        local.sortieController= new sortieController();
                        getJavaLoggerProxy().fine(message="Sending to sortieController.importSortie()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        
                        local.sortieUpload = local.sortieController.uploadSortie(Duplicate(form));
                        
                    break;
                    }
                    
                    case 'update.sortie': {
                        param name="form.sortieCriteria" default="";
                        getJavaLoggerProxy().fine(message="Sending to sortieController.updateSortie()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        local.sortieController= new sortieController();
                        local.sortieController.updateSortie(Duplicate(form));
                       
                    break;
                    }
                    
                    case 'delete.sortie': {
                        param name="form.sortieCriteria" default="";
                        getJavaLoggerProxy().fine(message="Sending to sortieController.deleteSortie()",sourceClass=local.utils.getComponentName(this), methodName="doAction");
                        local.sortieController= new sortieController();
                        local.sortieId = 0;
                        if(isDefined("form.sortieId")){
                            local.sortieId = trim(form.sortieId);	
                        }
                        local.sortieController.deleteSortie(form.sortieId);
                       
                    break;
                    }
                    
                    case 'insert.notification': {

                        local.notifications = new notificationsController();
                        local.notifications.createNotification(Duplicate(form));
                        
                    break;
                    }
                    
                    case 'update.notification': {
                        param name="form.msgId" default="";
                        
                        
                        local.notifications = new notificationsController();
                        local.notifications.updateNotification(Duplicate(form));
                        
                    break;
                    }
                    
                    case 'delete.notification': {
                        param name="rc.msgId" default="0";
                       
                        local.notifications = new notificationsController();
                        local.notifications.deleteNotification(msgId = rc.msgId);
                        
                    break;
                    }
                    
                    case 'update.inventory':{
                    	
                    	local.inventory = new inventoryController();
                        local.inventory.updateAsset(Duplicate(form));
                    }
                    
                    case 'insert.maintenance.uid': {
                        param name="form.assets" default="0";
                        local.maintenanceUIDController= new maintenanceUIDController();
                        local.maintenanceUIDController.insertEvents(form.assets);
                           
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