component output="false" displayName="InvSystems" name="InvSystems" accessors="true" {
	/* properties */
	property name="sysId" type="string";
    property name="fffId" type="string";
    property name="cage" type="string";
    property name="partno" type="string";
    property name="version" type="string";
    property name="nsn" type="string";
    property name="isActive" type="string";
    property name="remarks" type="string";
    property name="isValid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="createDate" type="string";
    property name="createdBy" type="string";
    property name="programId" type="string";
    property name="sysType" type="string";
    property name="noun" type="string";
    property name="mds" type="string";
    property name="mNsn" type="string";
    property name="newCost" type="string";
    property name="exchCost" type="string";
    property name="config" type="string";
    property name="srd" type="string";
    property name="oldSysId" type="string";
    property name="isPars" type="string";
    property name="effDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize InvSystems properties */
        setSysId("");
        setFffId("");
        setCage("");
        setPartno("");
        setVersion("");
        setNsn("");
        setIsActive("");
        setRemarks("");
        setIsValid("");
        setValBy("");
        setValDate("");
        setChgBy("");
        setChgDate("");
        setCreateDate("");
        setCreatedBy("");
        setProgramId("");
        setSysType("");
        setNoun("");
        setMds("");
        setMNsn("");
        setNewCost("");
        setExchCost("");
        setConfig("");
        setSrd("");
        setOldSysId("");
        setIsPars("");
        setEffDate("");

		return this;
	}

	

    /* return the property name/value pair of this object */
    public any function toString() {
       var local = {};
       local.results = {};
       
       local.metaData = getMetaData(this);
       if(Structkeyexists(local.metaData,"properties") and isArray(local.metaData['properties'])) {           
          local.properties = local.metaData['properties']; 
          for(local.p=1;local.p<=ArrayLen(local.properties);local.p++) {
              local.name = local.properties[local.p].name;
               local.results[local.name] = (Structkeyexists(variables,local.name))? variables[local.name] :"";          
          }    
       }
       return SerializeJSON(local.results);  
    }

    /* Validate InvSystems */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getSysId()) or !len(trim(getSysId()))) {
            throw (type="InvSystemsException", message="Missing Sys_Id", detail="Please enter in the Sys_Id");
        }
        if (isNull(getFffId()) or !len(trim(getFffId()))) {
            throw (type="InvSystemsException", message="Missing Fff_Id", detail="Please enter in the Fff_Id");
        }
        if (isNull(getCage()) or !len(trim(getCage()))) {
            throw (type="InvSystemsException", message="Missing Cage", detail="Please enter in the Cage");
        }
        if (isNull(getPartno()) or !len(trim(getPartno()))) {
            throw (type="InvSystemsException", message="Missing Partno", detail="Please enter in the Partno");
        }
        if (isNull(getIsActive()) or !len(trim(getIsActive()))) {
            throw (type="InvSystemsException", message="Missing Is_Active", detail="Please enter in the Is_Active");
        }
        if (isNull(getIsValid()) or !len(trim(getIsValid()))) {
            throw (type="InvSystemsException", message="Missing Is_Valid", detail="Please enter in the Is_Valid");
        }
        if (isNull(getChgBy()) or !len(trim(getChgBy()))) {
            throw (type="InvSystemsException", message="Missing Chg_By", detail="Please enter in the Chg_By");
        }
        if (isNull(getChgDate()) or !len(trim(getChgDate()))) {
            throw (type="InvSystemsException", message="Missing Chg_Date", detail="Please enter in the Chg_Date");
        }
        if (isNull(getProgramId()) or !len(trim(getProgramId()))) {
            throw (type="InvSystemsException", message="Missing Program_Id", detail="Please enter in the Program_Id");
        }
        if (isNull(getSysType()) or !len(trim(getSysType()))) {
            throw (type="InvSystemsException", message="Missing Sys_Type", detail="Please enter in the Sys_Type");
        }
        if (isNull(getNoun()) or !len(trim(getNoun()))) {
            throw (type="InvSystemsException", message="Missing Noun", detail="Please enter in the Noun");
        }
        if (isNull(getEffDate()) or !len(trim(getEffDate()))) {
            throw (type="InvSystemsException", message="Missing Eff_Date", detail="Please enter in the Eff_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getSysId()) and len(trim(getSysId())) and !isNumeric(getSysId())) {
            throw (type="InvSystemsException", message="Sys_Id not a number", detail="Please enter a valid number for Sys_Id");
        }
        if (!isNull(getFffId()) and len(trim(getFffId())) and !isNumeric(getFffId())) {
            throw (type="InvSystemsException", message="Fff_Id not a number", detail="Please enter a valid number for Fff_Id");
        }
        if (!isNull(getProgramId()) and len(trim(getProgramId())) and !isNumeric(getProgramId())) {
            throw (type="InvSystemsException", message="Program_Id not a number", detail="Please enter a valid number for Program_Id");
        }
        if (!isNull(getSysType()) and len(trim(getSysType())) and !isNumeric(getSysType())) {
            throw (type="InvSystemsException", message="Sys_Type not a number", detail="Please enter a valid number for Sys_Type");
        }
        if (!isNull(getMds()) and len(trim(getMds())) and !isNumeric(getMds())) {
            throw (type="InvSystemsException", message="Mds not a number", detail="Please enter a valid number for Mds");
        }
        if (!isNull(getOldSysId()) and len(trim(getOldSysId())) and !isNumeric(getOldSysId())) {
            throw (type="InvSystemsException", message="Old_Sys_Id not a number", detail="Please enter a valid number for Old_Sys_Id");
        }
    
        /* validate date properties */
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="InvSystemsException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="InvSystemsException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getCreateDate()) and len(trim(getCreateDate())) and !isDate(getCreateDate())) {
            throw (type="InvSystemsException", message="Create_Date not a valid date", detail="Please enter a valid date for Create_Date");
        }
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="InvSystemsException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
    }
}

