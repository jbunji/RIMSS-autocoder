import cfc.dao.AdmVariableDao;
import cfc.model.AdmVariable;
import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;

component  displayname="NewJobIdService" hint="Generates a new JOB ID for RIMSS" output="false" {
    variables.instance = {
        javaLoggerProxy = new javaLoggerProxy(),
        username = '',
        admVariableService = ''
    };

    /* init */
    public function init() {
        variables.instance.username = application.sessionManager.getUserName();

        /* return success */
        return this;
    }

    private any function getAdmVariableService() {
        return variables.instance.admVariableService;
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

    private any function getUserName() {
        return variables.instance.username;
    }
    
    private any function createNewAdmVariable(required string varGroup) {
        var admVariable = new AdmVariable();

        // load values into AdmVariable object
        local.admVariable.setVarGroup(arguments.varGroup);
        local.admVariable.setVarValue("0");
        local.admVariable.setVarType("NUMBER");
        local.admVariable.setActive("Y");
        local.admVariable.setInsBy(getUserName());
        local.admVariable.setInsDate("");
        local.admVariable.setChgBy("");
        local.admVariable.setChgDate("");

        // insert new row into GLOBALEYE.ADM_VARIABLE table
        return getAdmVariableService().createAdmVariable(local.admVariable);
    }

    /* load ADM_VARIABLE */
    private AdmVariable function getAdmVariable(required string varGroup) {
        var admVariable = "";
        var newAdmVariableRowId = "";

        getJavaLoggerProxy().fine(message="#arguments.varGroup#",sourceClass=getComponentName(), methodName="getAdmVariable");

        try {
            local.admVariable = getAdmVariableService().readByVarGroup(arguments.varGroup);
            //getJavaLoggerProxy().fine(message="#serializeJSON(local.admVariable)#",sourceClass=getComponentName(), methodName="getAdmVariable");
        } catch (NoQueryResultException e) {
            getJavaLoggerProxy().fine(message="#e.message#",sourceClass=getComponentName(), methodName="getAdmVariable");
            getJavaLoggerProxy().fine(message="#e.detail#",sourceClass=getComponentName(), methodName="getAdmVariable");
            local.newAdmVariableRowId = createNewAdmVariable(arguments.varGroup);
            local.admVariable = getAdmVariableService().readByVarGroup(arguments.varGroup);
        }

        return local.admVariable;
    }

    /* create the stored VAR_GROUP value (i.e. 'ACTS_SEQ_999') */
    private string function createVarGroupString(required string program, required string locId) {
        var seqString = "_SEQ_";
        getJavaLoggerProxy().fine(message="#ucase(arguments.program) & local.seqString & arguments.locId#",sourceClass=getComponentName(), methodName="createVarGroupString");
        return ucase(arguments.program) & local.seqString & arguments.locId;
    }

    /* check to see if GLOBALEYE.ADM_VARIABLE.CHG_DATE is different from current date */
    private boolean function isNewDate(required string chgDate) {
        var tmpDate = "";
        var curDate = LSDateFormat(now(), "dd-mmm-yyyy");
        var comparison = -9999;

        if (IsDate(arguments.chgDate)) {
            local.tmpDate = LSDateFormat(LSParseDateTime(arguments.chgDate),"dd-mmm-yyyy");

	        if (IsDate(tmpDate) and IsDate(curDate)) {
		        local.comparison = DateCompare(local.tmpDate, local.curDate);
		
		        if (local.comparison neq 0) {
		            getJavaLoggerProxy().info(message="A new date was found",sourceClass=getComponentName(), methodName="isNewDate");
		            return true;
		        } else {
                    getJavaLoggerProxy().info(message="A new date was not found",sourceClass=getComponentName(), methodName="isNewDate");
		            return false;
		        }
	        } else {
	            return false;
	        }
        } else {
            return false;
        }
    }

    /* increment the stored VAR_VALUE by 1 to get a new sequence number */
    private string function getNextSequenceValue(required AdmVariable admVariable) {
        var newSequenceNo = "";
        var numericVarValue = -1;

        if (FindNoCase("NUMBER", arguments.admVariable.getVarType()) && IsNumeric(arguments.admVariable.getVarValue())) {
            // increment saved sequence number

            if (!isNewDate(arguments.admVariable.getChgDate())) {
                local.numericVarValue = LSParseNumber(arguments.admVariable.getVarValue()) + 1;
            } else {
                local.numericVarValue = 1;
            }

            getJavaLoggerProxy().fine(message="#local.numericVarValue#",sourceClass=getComponentName(), methodName="getNextSequenceValue");

            // update ADM_VARIABLE with new sequence number
            arguments.admVariable.setVarValue(ToString(local.numericVarValue));
            arguments.admVariable.setChgBy(getUserName());
            arguments.admVariable.setChgDate(LSDateFormat(now(), 'mmmm d, yyyy') & " " & LSTimeFormat(now(), 'HH:mm:ss'));
            getJavaLoggerProxy().fine(message="Updating AdmVariable...",sourceClass=getComponentName(), methodName="getNextSequenceValue");
            getAdmVariableService().updateAdmVariable(arguments.admVariable);

            //getJavaLoggerProxy().fine(message="#serializeJSON(arguments.admVariable)#",sourceClass=getComponentName(), methodName="getNextSequenceValue");

            // convert new sequence number to a 3 character string
            local.newSequenceNo = createNewSequenceNumberString(local.numericVarValue);
        } else {
            throw(message="Unable to create new sequence number.", type="NoSequenceNumberException");
        }

        return local.newSequenceNo;
    }

    /* convert sequence number to a 3 character string (i.e. 1 becomes '001' and 10 becomes '010') */
    private string function createNewSequenceNumberString(required numeric sequenceValue) {
        var newSequenceNo = "";

        if (arguments.sequenceValue lt 10) {
            local.newSequenceNo = "00" & arguments.sequenceValue;
        } else if (arguments.sequenceValue lt 100) {
            local.newSequenceNo = "0" & arguments.sequenceValue;
        } else {
            local.newSequenceNo = ToString(arguments.sequenceValue);
        }
        return local.newSequenceNo;
    }

    /* generate a new maintenance job identification number
       format:  yyyymmddseq
           yyyy = 4 digit year (2012)
           mm = 2 digit month (01)
           dd = 2 digit day of month (25)
           seq = 3 character value representing a sequence value
     */
    public string function getNewJobId(required string program, required string locId) {
        /* initialize variables */
        var result = '';
        var newJobId = "";
        var newSeq = "";
        var varGroup = "";
        var admVariable = "";
        var jobDate = "";

        variables.instance.admVariableService = application.objectFactory.create("AdmVariableService");

        getJavaLoggerProxy().fine(message="Inside service CFC",sourceClass=getComponentName(), methodName="getNewJobId");

        /* populate local variables */
        /* Hardcode RIMSS value so that different systems with the same location return a unique sequence numger*/
        local.varGroup = createVarGroupString("RIMSS",arguments.locId);
        local.admVariable = getAdmVariable(local.varGroup);
         
        local.jobDate = LSDateFormat(Now(),"yyyymmdd");

        try {
            // lock the getNextSequenceValue so as to not get same
            // sequence value for multiple users from same location
            lock timeout="60" scope="application" type="exclusive" {
	            local.newSeq = getNextSequenceValue(local.admVariable);
            }

            local.newJobId = local.jobDate & local.newSeq;

            getJavaLoggerProxy().fine(message="#local.newJobId#",sourceClass=getComponentName(), methodName="getNewJobId");

            result = local.newJobId;

            return result;
        } catch (any e) {
            throw(message="Unable to create new JOB ID number.", type="NewJobIdException", detail="#e.message#");
        }
    }
}