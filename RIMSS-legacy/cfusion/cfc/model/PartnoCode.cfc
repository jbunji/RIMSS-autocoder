component output="false" displayName="PartnoCode" name="PartnoCode" accessors="true" {
	/* properties */
	property name="pnCdId" type="string";
    property name="partnoId" type="string";
    property name="codeId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="locId" type="string";
    property name="groupCd" type="string";
    property name="stationType" type="string";
    property name="contracted" type="string";
    property name="priorityFlag" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize PartnoCode properties */
        setPnCdId("");
        setPartnoId("");
        setCodeId("");
        setInsBy("");
        setInsDate("");
        setLocId("");
        setGroupCd("");
        setStationType("");
        setContracted("");
        setPriorityFlag("");
        setChgBy("");
        setChgDate("");

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

    /* Validate PartnoCode */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getPnCdId()) or !len(trim(getPnCdId()))) {
            throw (type="PartnoCodeException", message="Missing Pn_Cd_Id", detail="Please enter in the Pn_Cd_Id");
        }
        if (isNull(getPartnoId()) or !len(trim(getPartnoId()))) {
            throw (type="PartnoCodeException", message="Missing Partno_Id", detail="Please enter in the Partno_Id");
        }
        if (isNull(getCodeId()) or !len(trim(getCodeId()))) {
            throw (type="PartnoCodeException", message="Missing Code_Id", detail="Please enter in the Code_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="PartnoCodeException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="PartnoCodeException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getPnCdId()) and len(trim(getPnCdId())) and !isNumeric(getPnCdId())) {
            throw (type="PartnoCodeException", message="Pn_Cd_Id not a number", detail="Please enter a valid number for Pn_Cd_Id");
        }
        if (!isNull(getPartnoId()) and len(trim(getPartnoId())) and !isNumeric(getPartnoId())) {
            throw (type="PartnoCodeException", message="Partno_Id not a number", detail="Please enter a valid number for Partno_Id");
        }
        if (!isNull(getCodeId()) and len(trim(getCodeId())) and !isNumeric(getCodeId())) {
            throw (type="PartnoCodeException", message="Code_Id not a number", detail="Please enter a valid number for Code_Id");
        }
        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="PartnoCodeException", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
        if (!isNull(getGroupCd()) and len(trim(getGroupCd())) and !isNumeric(getGroupCd())) {
            throw (type="PartnoCodeException", message="Group_Cd not a number", detail="Please enter a valid number for Group_Cd");
        }
        if (!isNull(getContracted()) and len(trim(getContracted())) and !isNumeric(getContracted())) {
            throw (type="PartnoCodeException", message="Contracted not a number", detail="Please enter a valid number for Contracted");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="PartnoCodeException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="PartnoCodeException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

