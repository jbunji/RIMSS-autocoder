component output="false" displayName="CodeByCode" name="CodeByCode" accessors="true" {
	/* properties */
	property name="cbcId" type="string";
    property name="groupCd" type="string";
    property name="codeA" type="string";
    property name="codeB" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="sortOrder" type="string";
    property name="locId" type="string";
    property name="keyArea" type="string";
    property name="ruType" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize CodeByCode properties */
        setCbcId("");
        setGroupCd("");
        setCodeA("");
        setCodeB("");
        setInsBy("");
        setInsDate("");
        setSortOrder("");
        setLocId("");
        setKeyArea("");
        setRuType("");

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

    /* Validate CodeByCode */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getCbcId()) or !len(trim(getCbcId()))) {
            throw (type="CodeByCodeException", message="Missing Cbc_Id", detail="Please enter in the Cbc_Id");
        }
        if (isNull(getGroupCd()) or !len(trim(getGroupCd()))) {
            throw (type="CodeByCodeException", message="Missing Group_Cd", detail="Please enter in the Group_Cd");
        }
        if (isNull(getCodeA()) or !len(trim(getCodeA()))) {
            throw (type="CodeByCodeException", message="Missing Code_A", detail="Please enter in the Code_A");
        }
        if (isNull(getCodeB()) or !len(trim(getCodeB()))) {
            throw (type="CodeByCodeException", message="Missing Code_B", detail="Please enter in the Code_B");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="CodeByCodeException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="CodeByCodeException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getCbcId()) and len(trim(getCbcId())) and !isNumeric(getCbcId())) {
            throw (type="CodeByCodeException", message="Cbc_Id not a number", detail="Please enter a valid number for Cbc_Id");
        }
        if (!isNull(getGroupCd()) and len(trim(getGroupCd())) and !isNumeric(getGroupCd())) {
            throw (type="CodeByCodeException", message="Group_Cd not a number", detail="Please enter a valid number for Group_Cd");
        }
        if (!isNull(getCodeA()) and len(trim(getCodeA())) and !isNumeric(getCodeA())) {
            throw (type="CodeByCodeException", message="Code_A not a number", detail="Please enter a valid number for Code_A");
        }
        if (!isNull(getCodeB()) and len(trim(getCodeB())) and !isNumeric(getCodeB())) {
            throw (type="CodeByCodeException", message="Code_B not a number", detail="Please enter a valid number for Code_B");
        }
        if (!isNull(getSortOrder()) and len(trim(getSortOrder())) and !isNumeric(getSortOrder())) {
            throw (type="CodeByCodeException", message="Sort_Order not a number", detail="Please enter a valid number for Sort_Order");
        }
        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="CodeByCodeException", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="CodeByCodeException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
    }
}

