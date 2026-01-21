component output="false" displayName="CodeGroup" name="CodeGroup" accessors="true" {
	/* properties */
	property name="cdgrpId" type="string";
    property name="groupCd" type="string";
    property name="codeId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="sortOrder" type="string";
    property name="description" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize CodeGroup properties */
        setCdgrpId("");
        setGroupCd("");
        setCodeId("");
        setInsBy("");
        setInsDate("");
        setSortOrder("");
        setDescription("");

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

    /* Validate CodeGroup */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getCdgrpId()) or !len(trim(getCdgrpId()))) {
            throw (type="CodeGroupException", message="Missing Cdgrp_Id", detail="Please enter in the Cdgrp_Id");
        }
        if (isNull(getGroupCd()) or !len(trim(getGroupCd()))) {
            throw (type="CodeGroupException", message="Missing Group_Cd", detail="Please enter in the Group_Cd");
        }
        if (isNull(getCodeId()) or !len(trim(getCodeId()))) {
            throw (type="CodeGroupException", message="Missing Code_Id", detail="Please enter in the Code_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="CodeGroupException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="CodeGroupException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getCdgrpId()) and len(trim(getCdgrpId())) and !isNumeric(getCdgrpId())) {
            throw (type="CodeGroupException", message="Cdgrp_Id not a number", detail="Please enter a valid number for Cdgrp_Id");
        }
        if (!isNull(getGroupCd()) and len(trim(getGroupCd())) and !isNumeric(getGroupCd())) {
            throw (type="CodeGroupException", message="Group_Cd not a number", detail="Please enter a valid number for Group_Cd");
        }
        if (!isNull(getCodeId()) and len(trim(getCodeId())) and !isNumeric(getCodeId())) {
            throw (type="CodeGroupException", message="Code_Id not a number", detail="Please enter a valid number for Code_Id");
        }
        if (!isNull(getSortOrder()) and len(trim(getSortOrder())) and !isNumeric(getSortOrder())) {
            throw (type="CodeGroupException", message="Sort_Order not a number", detail="Please enter a valid number for Sort_Order");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="CodeGroupException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
    }
}

