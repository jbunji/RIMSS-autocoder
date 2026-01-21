import cfc.dao.DBUtils;
import cfc.utils.Datasource;

component  displayname="UserSettingService" hint="A service component used for user settings" {
    variables.instance = {
        dbUtils = '',
        utils = ''
    };

    /* init */
    public function init(required Datasource datasource) {
        variables.instance.dbUtils = createObject('component', 'cfc.dao.DBUtils').init(arguments.datasource);
        variables.instance.utils = createObject('component', 'cfc.utils.utilities').init();

        /* return success */
        return this;
    }


    remote String function setUserSettings(required String programId, required String program, required String locId, required String unit, required String sourceCat, required String maintLevel) {
        var result = {
        	"program" = ARGUMENTS.program,
        	"unit" = ARGUMENTS.unit,
        	"maintLevel" = ARGUMENTS.maintLevel
        };
        if (IsDefined("APPLICATION")) {
            if (StructKeyExists(APPLICATION,"sessionManager")) {
                application.sessionManager.setProgramSetting(arguments.program);
                application.sessionManager.setProgramIdSetting(arguments.programId);
                application.sessionManager.setUnitSetting(arguments.unit);
                application.sessionManager.setLocIdSetting(arguments.locId);
                application.sessionManager.setUserSettingsFlag(true);
                application.sessionManager.setSourceCatSetting(arguments.sourceCat);
                application.sessionManager.setMaintLevelSetting(arguments.maintLevel);
                
                /*Set or Reset SubSection */
                application.sessionManager.setSubSection("AIRBORNE");
            }
        }
        
        
        
        return SerializeJSON(result);
    }

    public String function setProgramInSession(required String program, required String programId) {
        var local.program = arguments.program;
        var local.programId = arguments.programId;
        if (IsDefined("APPLICATION")) {
            if (StructKeyExists(APPLICATION,"sessionManager")) {
                application.sessionManager.setProgramSetting(local.program);
                application.sessionManager.setProgramIdSetting(local.programId);
                application.sessionManager.setUserSettingsFlag(true);
            }
        }
        return program;
    }

    public String function setUnitInSession(required String unit, required String locId) {
        var local.unit = arguments.unit;
        var local.locId = arguments.locId;
        if (IsDefined("APPLICATION")) {
            if (StructKeyExists(APPLICATION,"sessionManager")) {
                application.sessionManager.setUnitSetting(local.unit);
                application.sessionManager.setLocIdSetting(local.locId);
                application.sessionManager.setUserSettingsFlag(true);
            }
        }
        return unit;
    }

    public Query function getUserPrograms() {
        var userModel = application.sessionManager.getUserModel();
        var programs = variables.instance.dbUtils.getUserPrograms(userModel);
        return programs;
    }

    public Query function getUserUnits() {
        var userModel = application.sessionManager.getUserModel();
        var units = variables.instance.dbUtils.getUserUnits(userModel);
        return units;
    }
}