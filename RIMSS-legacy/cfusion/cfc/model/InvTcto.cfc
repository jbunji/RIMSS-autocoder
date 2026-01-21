component output="false" displayName="InvTcto" name="InvTcto" accessors="true" {
	/* properties */
	property name="tctoNo" type="string";
    property name="tctoId" type="string";
    property name="programId" type="string";
    property name="sysType" type="string";
    property name="remarks" type="string";
    property name="isValid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="createDate" type="string";
    property name="createdBy" type="string";
    property name="effDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize InvTcto properties */
        setTctoNo("");
        setTctoId("");
        setProgramId("");
        setSysType("");
        setRemarks("");
        setIsValid("");
        setValBy("");
        setValDate("");
        setChgBy("");
        setChgDate("");
        setCreateDate("");
        setCreatedBy("");
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

    /* Validate InvTcto */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getTctoNo()) or !len(trim(getTctoNo()))) {
            throw (type="InvTctoException", message="Missing Tcto_No", detail="Please enter in the Tcto_No");
        }
        if (isNull(getTctoId()) or !len(trim(getTctoId()))) {
            throw (type="InvTctoException", message="Missing Tcto_Id", detail="Please enter in the Tcto_Id");
        }
        if (isNull(getProgramId()) or !len(trim(getProgramId()))) {
            throw (type="InvTctoException", message="Missing Program_Id", detail="Please enter in the Program_Id");
        }
        if (isNull(getSysType()) or !len(trim(getSysType()))) {
            throw (type="InvTctoException", message="Missing Sys_Type", detail="Please enter in the Sys_Type");
        }
        if (isNull(getIsValid()) or !len(trim(getIsValid()))) {
            throw (type="InvTctoException", message="Missing Is_Valid", detail="Please enter in the Is_Valid");
        }
        if (isNull(getChgBy()) or !len(trim(getChgBy()))) {
            throw (type="InvTctoException", message="Missing Chg_By", detail="Please enter in the Chg_By");
        }
        if (isNull(getChgDate()) or !len(trim(getChgDate()))) {
            throw (type="InvTctoException", message="Missing Chg_Date", detail="Please enter in the Chg_Date");
        }
        if (isNull(getEffDate()) or !len(trim(getEffDate()))) {
            throw (type="InvTctoException", message="Missing Eff_Date", detail="Please enter in the Eff_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getTctoId()) and len(trim(getTctoId())) and !isNumeric(getTctoId())) {
            throw (type="InvTctoException", message="Tcto_Id not a number", detail="Please enter a valid number for Tcto_Id");
        }
        if (!isNull(getProgramId()) and len(trim(getProgramId())) and !isNumeric(getProgramId())) {
            throw (type="InvTctoException", message="Program_Id not a number", detail="Please enter a valid number for Program_Id");
        }
        if (!isNull(getSysType()) and len(trim(getSysType())) and !isNumeric(getSysType())) {
            throw (type="InvTctoException", message="Sys_Type not a number", detail="Please enter a valid number for Sys_Type");
        }
    
        /* validate date properties */
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="InvTctoException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="InvTctoException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getCreateDate()) and len(trim(getCreateDate())) and !isDate(getCreateDate())) {
            throw (type="InvTctoException", message="Create_Date not a valid date", detail="Please enter a valid date for Create_Date");
        }
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="InvTctoException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
    }
}

