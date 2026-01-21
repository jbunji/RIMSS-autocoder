component  displayname="SessionFacade" hint="Interacts with the Session" output="false" {
    public SessionFacade function init() {
    	getSecretKey();
        return this;
    }

    
    public boolean function userExists() {
        if (IsDefined("SESSION.user")) {
            return true;
        } else {
            return false;
        }
    }

    public boolean function userModelExists() {
        if (IsDefined("SESSION.user.userModel")) {
            return true;
        } else {
            return false;
        }
    }

    public void function createSessionUser() {
        if (!IsDefined("SESSION.user")) {
            lock timeout="60" scope="session" {
                SESSION.user = {};
            }
        } 
    }
    
   public string function getSecretKey(){
        var local = {};
        local.utilities = new cfc.utils.utilities();
        if(!IsDefined("SESSION.secretKey")){
        	local.path = getCurrentTemplatePath();
            SESSION.secretKey = local.utilities.genAESKeyFromString(local.path,toBase64(local.path));
            return SESSION.secretKey;
        }else{
            return SESSION.secretKey;	
        }
        	       
   } 
    
    
    public void function createUserSettings() {
        if (!IsDefined("SESSION.user.settings")) {
            lock timeout="60" scope="session" {
                SESSION.user.settings = {};
                SESSION.user.settings.isSet = false;
                SESSION.user.settings.hasAccess = false;
                SESSION.user.settings.ackMsgFlag = false;
            }
        }
    }
    
    public void function setAckMsgFlag(boolean flag){
    	if(IsDefined("SESSION.user.settings.ackMsgFlag")){
    		 lock timeout="60" scope="session" {
    		 	SESSION.user.settings.ackMsgFlag = flag;	 
    		 }    		
    	}
    }
    
    public boolean function getAckMsgFlag(){
    	if(IsDefined("SESSION.user.settings.ackMsgFlag")){
    		return SESSION.user.settings.ackMsgFlag;
    	}else{
    		return false;
    	}
    }

    public boolean function getUserSettingsFlag() {
        if (IsDefined("SESSION.user.settings.isSet")) {
            return SESSION.user.settings.isSet;
        } else {
            return false;
        }
    }

    public void function setLogoutEventFlag(required boolean logoutEventFlag) {
        if (IsDefined("SESSION.user.userModel")) {
            lock timeout="60" scope="session" {
                SESSION.user.userModel.setLogoutEventFlag(arguments.logoutEventFlag);
            }
        }
    }

    public void function setUserSettingsFlag(required boolean settingsFlag) {
        lock timeout="60" scope="session" {
            SESSION.user.settings.isSet = arguments.settingsFlag;
        }
    }
    
    public boolean function getUserAccessFlag() {
        if (IsDefined("SESSION.user.settings.hasAccess")) {
            return SESSION.user.settings.hasAccess;
        } else {
            return false;
        }
    }
    
    public void function setUserAccessFlag(required boolean accessFlag) {
        lock timeout="60" scope="session" {
            SESSION.user.settings.hasAccess = arguments.accessFlag;
        }
    }
    
    public string function getUserName() {
        if (IsDefined("SESSION.user.userModel")) {
            return SESSION.user.userModel.getUserName();
        } else {
            return "";
        }
    }
    
    
    remote string function getTab() {
        if (IsDefined("SESSION.tab")) {
            return SESSION.tab;
        }else{
            return "menuMaint";	
        }
    }
    
    remote any function setTab(required string tab){
        lock timeout="10" scope="session" {
            SESSION.tab = trim(arguments.tab);
        }
        return true;	
    }
    
    public string function getSubSection() {
        if (IsDefined("SESSION.subSection")) {
            return SESSION.subSection;
        }else{
            return "";	
        }
    }
    
    public any function setSubSection(required string subSection){
        lock timeout="10" scope="session" {
            SESSION.subSection = trim(arguments.subsection);
        }
        return true;	
    }

    public any function getUserModel() {
        if (IsDefined("SESSION.user.userModel")) {
            return SESSION.user.userModel;
        } else {
            return createobject("java", "mil.af.robins.rampod.security.model.UserModel").init();
        }
    }

    public void function setUserModel(required any userModel) {
        lock timeout="60" scope="session" {
            SESSION.user.userModel = arguments.userModel;
        }
    }

    public boolean function isUserLoggedOn() {
        if (IsDefined("SESSION.user.userModel")) {
            return !SESSION.user.userModel.isLogoutEventFlag();
        } else {
            return false;
        }
    }

    public boolean function userHasPermission(required string permission) {
        if (IsDefined("SESSION.user.userModel")) {
            return SESSION.user.userModel.hasPermission(arguments.permission);
        } else {
            return false;
        }
    }

    public string function getLocIdSetting() {
        if (IsDefined("SESSION.user.settings.locId")) {
            return SESSION.user.settings.locId;
        } else {
            return "";
        }
    }

    public void function setLocIdSetting(required string locId) {
        lock timeout="60" scope="session" {
            SESSION.user.settings.locId = arguments.locId;
        }
    }

    public string function getUnitSetting() {
        if (IsDefined("SESSION.user.settings.unit")) {
            return SESSION.user.settings.unit;
        } else {
            return "";
        }
    }

    public void function setUnitSetting(required string unit) {
        lock timeout="60" scope="session" {
            SESSION.user.settings.unit = arguments.unit;
        }
    }

    public string function getProgramSetting() {
        if (IsDefined("SESSION.user.settings.program")) {
            return SESSION.user.settings.program;
        } else {
            return "";
        }
    }
    
    remote any function remoteSetProgramSetting(required string program){
    	setProgramSetting(program);
    	
    	userModel = application.sessionManager.getUserModel();
		local.programs = "";
		local.units = "";
		if (IsDefined("userModel")){
		    dbUtils = application.objectFactory.create("DbUtils");
		    if (application.sessionManager.isUserLoggedOn()){
		        local.programs = dbUtils.getUserPrograms(userModel);
		        local.units = dbUtils.getUserUnits(userModel);
		    }
		}
    	
    	return local.units;
    }

    public void function setProgramSetting(required string program) {
        lock timeout="60" scope="session" {
            SESSION.user.settings.program = arguments.program;
        }
    }

    public string function getProgramIdSetting() {
        if (IsDefined("SESSION.user.settings.programId")) {
            return SESSION.user.settings.programId;
        } else {
            return "";
        }
    }

    public void function setProgramIdSetting(required string programId) {
        lock timeout="60" scope="session" {
            SESSION.user.settings.programId = arguments.programId;
        }
    }

    public void function setSourceCatSetting(required string sourceCat) {
        lock timeout="60" scope="session" {
            SESSION.user.settings.sourceCat = arguments.sourceCat;
        }
    }

    public any function getSourceCatSetting() {
        if (IsDefined("SESSION.user.settings.sourceCat")) {
            return SESSION.user.settings.sourceCat;
        } else {
            return "";
        }
    }

    public void function setMaintLevelSetting(required string maintLevel) {
        lock timeout="60" scope="session" {
            SESSION.user.settings.maintLevel = arguments.maintLevel;
        }
    }


    public any function getMaintLevelSetting() {
        if (IsDefined("SESSION.user.settings.maintLevel")) {
            return SESSION.user.settings.maintLevel;
        } else {
            return "";
        }
    }

    public void function deleteUserSettings() {
        if (IsDefined("SESSION.user.settings")) {
            lock timeout="60" scope="session" {
                StructDelete(SESSION.user, "settings");
            }
        }
    }

    public void function deleteUserModel() {
        if (IsDefined("SESSION.user.userModel")) {
            lock timeout="60" scope="session" {
                StructDelete(SESSION.user, "userModel");
            }
        }
    }

    public void function deleteUser() {
        if (IsDefined("SESSION.user")) {
            lock timeout="60" scope="session" {
                StructDelete(SESSION, "user");
            }
        }
    }

    public void function clearSessionVariables() {
        if (IsDefined("SESSION.user.settings")) {
            lock timeout="60" scope="session" {
                StructDelete(SESSION.user, "settings");
            }
        }

        if (IsDefined("SESSION.user.userModel")) {
            lock timeout="60" scope="session" {
                StructDelete(SESSION.user, "userModel");
            }
        }

        if (IsDefined("SESSION.user")) {
            lock timeout="60" scope="session" {
                StructDelete(SESSION, "user");
            }
        }
    }
    
    /* Section to set generic session variables */
    public any function getValue(required string  key) {
    	var local = {};
    	local.value = "";
        if(Structkeyexists(SESSION,ARGUMENTS.key)){
            local.value = SESSION[ARGUMENTS.key];	
        }
        return local.value;
    }
    
    public void function setValue(required string  key, required any value) {
        var local = {};
        lock timeout="60" scope="session" {
            SESSION[ARGUMENTS.key] = ARGUMENTS.value;
        }   
    }
    
    public void function removeValue(required string  key) {
        var local = {};
        lock timeout="60" scope="session" {
            try{StructDelete(SESSION,trim(ARGUMENTS.key));}catch(any e){}
        }   
    }
    
    public boolean function checkUserSettings(){
	
        //The userSettingsFlag does not get set when a user only has one program/unit/source
        if(len(trim(getProgramSetting())) 
            && len(trim(getUnitSetting())) 
            && len(trim(getLocIdSetting()))
            && len(trim(getSourceCatSetting()))
            ){
            setUserSettingsFlag(true);
            setUserAccessFlag(true);
        } 
      return getUserSettingsFlag();  
        	
    }
    
}