component output="false" displayName="CfgSet" name="CfgSet" accessors="true" {
	/* properties */
	property name="cfgSetId" type="string";
    property name="cfgName" type="string";
    property name="cfgType" type="string";
    property name="pgmId" type="string";
    property name="active" type="string";
    property name="description" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="partnoId" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="sysId" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize CfgSet properties */
        setCfgSetId("");
        setCfgName("");
        setCfgType("");
        setPgmId("");
        setActive("");
        setDescription("");
        setInsBy("");
        setInsDate("");
        setPartnoId("");
        setChgBy("");
        setChgDate("");
        setSysId("");

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

    /* Validate CfgSet */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getCfgSetId()) or !len(trim(getCfgSetId()))) {
            throw (type="CfgSetException", message="Missing Cfg_Set_Id", detail="Please enter in the Cfg_Set_Id");
        }
        if (isNull(getCfgName()) or !len(trim(getCfgName()))) {
            throw (type="CfgSetException", message="Missing Cfg_Name", detail="Please enter in the Cfg_Name");
        }
        if (isNull(getCfgType()) or !len(trim(getCfgType()))) {
            throw (type="CfgSetException", message="Missing Cfg_Type", detail="Please enter in the Cfg_Type");
        }
        if (isNull(getPgmId()) or !len(trim(getPgmId()))) {
            throw (type="CfgSetException", message="Missing Pgm_Id", detail="Please enter in the Pgm_Id");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="CfgSetException", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getDescription()) or !len(trim(getDescription()))) {
            throw (type="CfgSetException", message="Missing Description", detail="Please enter in the Description");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="CfgSetException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="CfgSetException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getCfgSetId()) and len(trim(getCfgSetId())) and !isNumeric(getCfgSetId())) {
            throw (type="CfgSetException", message="Cfg_Set_Id not a number", detail="Please enter a valid number for Cfg_Set_Id");
        }
        if (!isNull(getPgmId()) and len(trim(getPgmId())) and !isNumeric(getPgmId())) {
            throw (type="CfgSetException", message="Pgm_Id not a number", detail="Please enter a valid number for Pgm_Id");
        }
        if (!isNull(getPartnoId()) and len(trim(getPartnoId())) and !isNumeric(getPartnoId())) {
            throw (type="CfgSetException", message="Partno_Id not a number", detail="Please enter a valid number for Partno_Id");
        }
        if (!isNull(getSysId()) and len(trim(getSysId())) and !isNumeric(getSysId())) {
            throw (type="CfgSetException", message="Sys_Id not a number", detail="Please enter a valid number for Sys_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="CfgSetException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="CfgSetException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

