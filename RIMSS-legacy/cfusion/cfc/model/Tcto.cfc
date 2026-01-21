component output="false" displayName="Tcto" name="Tcto" accessors="true" {
	/* properties */
	property name="tctoId" type="string";
    property name="pgmId" type="string";
    property name="tctoNo" type="string";
    property name="active" type="string";
    property name="sysType" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="effDate" type="string";
    property name="remarks" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="stationType" type="string";
    property name="tctoType" type="string";
    property name="tctoCode" type="string";
    property name="wucCd" type="string";
    property name="oldPartnoId" type="string";
    property name="newPartnoId" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize Tcto properties */
        setTctoId("");
        setPgmId("");
        setTctoNo("");
        setActive("");
        setSysType("");
        setInsBy("");
        setInsDate("");
        setEffDate("");
        setRemarks("");
        setChgBy("");
        setChgDate("");
        setStationType("");
        setTctoType("");
        setTctoCode("");
        setWucCd("");
        setOldPartnoId("");
        setNewPartnoId("");

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

    /* Validate Tcto */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getTctoId()) or !len(trim(getTctoId()))) {
            throw (type="TctoException", message="Missing Tcto_Id", detail="Please enter in the Tcto_Id");
        }
        if (isNull(getPgmId()) or !len(trim(getPgmId()))) {
            throw (type="TctoException", message="Missing Pgm_Id", detail="Please enter in the Pgm_Id");
        }
        if (isNull(getTctoNo()) or !len(trim(getTctoNo()))) {
            throw (type="TctoException", message="Missing Tcto_No", detail="Please enter in the Tcto_No");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="TctoException", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getSysType()) or !len(trim(getSysType()))) {
            throw (type="TctoException", message="Missing Sys_Type", detail="Please enter in the Sys_Type");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="TctoException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="TctoException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getTctoId()) and len(trim(getTctoId())) and !isNumeric(getTctoId())) {
            throw (type="TctoException", message="Tcto_Id not a number", detail="Please enter a valid number for Tcto_Id");
        }
        if (!isNull(getPgmId()) and len(trim(getPgmId())) and !isNumeric(getPgmId())) {
            throw (type="TctoException", message="Pgm_Id not a number", detail="Please enter a valid number for Pgm_Id");
        }
        if (!isNull(getSysType()) and len(trim(getSysType())) and !isNumeric(getSysType())) {
            throw (type="TctoException", message="Sys_Type not a number", detail="Please enter a valid number for Sys_Type");
        }
        if (!isNull(getTctoCode()) and len(trim(getTctoCode())) and !isNumeric(getTctoCode())) {
            throw (type="TctoException", message="Tcto_Code not a number", detail="Please enter a valid number for Tcto_Code");
        }
        if (!isNull(getWucCd()) and len(trim(getWucCd())) and !isNumeric(getWucCd())) {
            throw (type="TctoException", message="Wuc_Cd not a number", detail="Please enter a valid number for Wuc_Cd");
        }
        if (!isNull(getOldPartnoId()) and len(trim(getOldPartnoId())) and !isNumeric(getOldPartnoId())) {
            throw (type="TctoException", message="Old_Partno_Id not a number", detail="Please enter a valid number for Old_Partno_Id");
        }
        if (!isNull(getNewPartnoId()) and len(trim(getNewPartnoId())) and !isNumeric(getNewPartnoId())) {
            throw (type="TctoException", message="New_Partno_Id not a number", detail="Please enter a valid number for New_Partno_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="TctoException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="TctoException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="TctoException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

