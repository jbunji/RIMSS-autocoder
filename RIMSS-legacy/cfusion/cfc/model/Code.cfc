component output="false" displayName="Code" name="Code" accessors="true" {
	/* properties */
	property name="codeId" type="string";
    property name="codeType" type="string";
    property name="codeValue" type="string";
    property name="description" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="active" type="string";
    property name="sortOrder" type="string";
    property name="ctCodeId" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize Code properties */
        setCodeId("");
        setCodeType("");
        setCodeValue("");
        setDescription("");
        setInsBy("");
        setInsDate("");
        setActive("");
        setSortOrder("");
        setCtCodeId("");
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

    /* Validate Code */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getCodeId()) or !len(trim(getCodeId()))) {
            throw (type="CodeException", message="Missing Code_Id", detail="Please enter in the Code_Id");
        }
        if (isNull(getCodeType()) or !len(trim(getCodeType()))) {
            throw (type="CodeException", message="Missing Code_Type", detail="Please enter in the Code_Type");
        }
        if (isNull(getCodeValue()) or !len(trim(getCodeValue()))) {
            throw (type="CodeException", message="Missing Code_Value", detail="Please enter in the Code_Value");
        }
        if (isNull(getDescription()) or !len(trim(getDescription()))) {
            throw (type="CodeException", message="Missing Description", detail="Please enter in the Description");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="CodeException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="CodeException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="CodeException", message="Missing Active", detail="Please enter in the Active");
        }
    
        /* validate numeric properties */
        if (!isNull(getCodeId()) and len(trim(getCodeId())) and !isNumeric(getCodeId())) {
            throw (type="CodeException", message="Code_Id not a number", detail="Please enter a valid number for Code_Id");
        }
        if (!isNull(getSortOrder()) and len(trim(getSortOrder())) and !isNumeric(getSortOrder())) {
            throw (type="CodeException", message="Sort_Order not a number", detail="Please enter a valid number for Sort_Order");
        }
        if (!isNull(getCtCodeId()) and len(trim(getCtCodeId())) and !isNumeric(getCtCodeId())) {
            throw (type="CodeException", message="Ct_Code_Id not a number", detail="Please enter a valid number for Ct_Code_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="CodeException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="CodeException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

