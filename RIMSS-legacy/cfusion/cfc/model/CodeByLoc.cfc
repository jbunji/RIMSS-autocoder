component output="false" displayName="CodeByLoc" name="CodeByLoc" accessors="true" {
	/* properties */
	property name="cblId" type="string";
    property name="locId" type="string";
    property name="codeId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="sortOrder" type="string";
    property name="groupCd" type="string";
    property name="keyArea" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize CodeByLoc properties */
        setCblId("");
        setLocId("");
        setCodeId("");
        setInsBy("");
        setInsDate("");
        setSortOrder("");
        setGroupCd("");
        setKeyArea("");

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

    /* Validate CodeByLoc */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getCblId()) or !len(trim(getCblId()))) {
            throw (type="CodeByLocException", message="Missing Cbl_Id", detail="Please enter in the Cbl_Id");
        }
        if (isNull(getLocId()) or !len(trim(getLocId()))) {
            throw (type="CodeByLocException", message="Missing Loc_Id", detail="Please enter in the Loc_Id");
        }
        if (isNull(getCodeId()) or !len(trim(getCodeId()))) {
            throw (type="CodeByLocException", message="Missing Code_Id", detail="Please enter in the Code_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="CodeByLocException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="CodeByLocException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getCblId()) and len(trim(getCblId())) and !isNumeric(getCblId())) {
            throw (type="CodeByLocException", message="Cbl_Id not a number", detail="Please enter a valid number for Cbl_Id");
        }
        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="CodeByLocException", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
        if (!isNull(getCodeId()) and len(trim(getCodeId())) and !isNumeric(getCodeId())) {
            throw (type="CodeByLocException", message="Code_Id not a number", detail="Please enter a valid number for Code_Id");
        }
        if (!isNull(getSortOrder()) and len(trim(getSortOrder())) and !isNumeric(getSortOrder())) {
            throw (type="CodeByLocException", message="Sort_Order not a number", detail="Please enter a valid number for Sort_Order");
        }
        if (!isNull(getGroupCd()) and len(trim(getGroupCd())) and !isNumeric(getGroupCd())) {
            throw (type="CodeByLocException", message="Group_Cd not a number", detail="Please enter a valid number for Group_Cd");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="CodeByLocException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
    }
}

