component output="false" displayName="Software" name="Software" accessors="true" {
	/* properties */
	property name="swId" type="string";
    property name="swNumber" type="string";
    property name="swType" type="string";
    property name="sysId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="active" type="string";
    property name="cpinFlag" type="string";
    property name="revision" type="string";
    property name="revisionDate" type="string";
    property name="swTitle" type="string";
    property name="swDesc" type="string";
    property name="effDate" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize Software properties */
        setSwId("");
        setSwNumber("");
        setSwType("");
        setSysId("");
        setInsBy("");
        setInsDate("");
        setActive("");
        setCpinFlag("");
        setRevision("");
        setRevisionDate("");
        setSwTitle("");
        setSwDesc("");
        setEffDate("");
        setValid("");
        setValBy("");
        setValDate("");
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

    /* Validate Software */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getSwId()) or !len(trim(getSwId()))) {
            throw (type="SoftwareException", message="Missing Sw_Id", detail="Please enter in the Sw_Id");
        }
        if (isNull(getSwNumber()) or !len(trim(getSwNumber()))) {
            throw (type="SoftwareException", message="Missing Sw_Number", detail="Please enter in the Sw_Number");
        }
        if (isNull(getSwType()) or !len(trim(getSwType()))) {
            throw (type="SoftwareException", message="Missing Sw_Type", detail="Please enter in the Sw_Type");
        }
        if (isNull(getSysId()) or !len(trim(getSysId()))) {
            throw (type="SoftwareException", message="Missing Sys_Id", detail="Please enter in the Sys_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="SoftwareException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="SoftwareException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="SoftwareException", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getCpinFlag()) or !len(trim(getCpinFlag()))) {
            throw (type="SoftwareException", message="Missing Cpin_Flag", detail="Please enter in the Cpin_Flag");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="SoftwareException", message="Missing Valid", detail="Please enter in the Valid");
        }
    
        /* validate numeric properties */
        if (!isNull(getSwId()) and len(trim(getSwId())) and !isNumeric(getSwId())) {
            throw (type="SoftwareException", message="Sw_Id not a number", detail="Please enter a valid number for Sw_Id");
        }
        if (!isNull(getSwType()) and len(trim(getSwType())) and !isNumeric(getSwType())) {
            throw (type="SoftwareException", message="Sw_Type not a number", detail="Please enter a valid number for Sw_Type");
        }
        if (!isNull(getSysId()) and len(trim(getSysId())) and !isNumeric(getSysId())) {
            throw (type="SoftwareException", message="Sys_Id not a number", detail="Please enter a valid number for Sys_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="SoftwareException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getRevisionDate()) and len(trim(getRevisionDate())) and !isDate(getRevisionDate())) {
            throw (type="SoftwareException", message="Revision_Date not a valid date", detail="Please enter a valid date for Revision_Date");
        }
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="SoftwareException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="SoftwareException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="SoftwareException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

