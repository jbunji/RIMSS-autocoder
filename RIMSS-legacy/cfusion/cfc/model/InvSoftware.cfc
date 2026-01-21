component output="false" displayName="InvSoftware" name="InvSoftware" accessors="true" {
	/* properties */
	property name="swId" type="string";
    property name="swNumber" type="string";
    property name="revision" type="string";
    property name="isCpin" type="string";
    property name="swDesc" type="string";
    property name="programId" type="string";
    property name="swType" type="string";
    property name="swTitle" type="string";
    property name="effDate" type="string";
    property name="isPending" type="string";
    property name="remarks" type="string";
    property name="isValid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="createDate" type="string";
    property name="createdBy" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize InvSoftware properties */
        setSwId("");
        setSwNumber("");
        setRevision("");
        setIsCpin("");
        setSwDesc("");
        setProgramId("");
        setSwType("");
        setSwTitle("");
        setEffDate("");
        setIsPending("");
        setRemarks("");
        setIsValid("");
        setValBy("");
        setValDate("");
        setChgBy("");
        setChgDate("");
        setCreateDate("");
        setCreatedBy("");

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

    /* Validate InvSoftware */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getSwId()) or !len(trim(getSwId()))) {
            throw (type="InvSoftwareException", message="Missing Sw_Id", detail="Please enter in the Sw_Id");
        }
        if (isNull(getSwNumber()) or !len(trim(getSwNumber()))) {
            throw (type="InvSoftwareException", message="Missing Sw_Number", detail="Please enter in the Sw_Number");
        }
        if (isNull(getIsCpin()) or !len(trim(getIsCpin()))) {
            throw (type="InvSoftwareException", message="Missing Is_Cpin", detail="Please enter in the Is_Cpin");
        }
        if (isNull(getProgramId()) or !len(trim(getProgramId()))) {
            throw (type="InvSoftwareException", message="Missing Program_Id", detail="Please enter in the Program_Id");
        }
        if (isNull(getSwType()) or !len(trim(getSwType()))) {
            throw (type="InvSoftwareException", message="Missing Sw_Type", detail="Please enter in the Sw_Type");
        }
        if (isNull(getEffDate()) or !len(trim(getEffDate()))) {
            throw (type="InvSoftwareException", message="Missing Eff_Date", detail="Please enter in the Eff_Date");
        }
        if (isNull(getIsValid()) or !len(trim(getIsValid()))) {
            throw (type="InvSoftwareException", message="Missing Is_Valid", detail="Please enter in the Is_Valid");
        }
        if (isNull(getChgBy()) or !len(trim(getChgBy()))) {
            throw (type="InvSoftwareException", message="Missing Chg_By", detail="Please enter in the Chg_By");
        }
        if (isNull(getChgDate()) or !len(trim(getChgDate()))) {
            throw (type="InvSoftwareException", message="Missing Chg_Date", detail="Please enter in the Chg_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getSwId()) and len(trim(getSwId())) and !isNumeric(getSwId())) {
            throw (type="InvSoftwareException", message="Sw_Id not a number", detail="Please enter a valid number for Sw_Id");
        }
        if (!isNull(getProgramId()) and len(trim(getProgramId())) and !isNumeric(getProgramId())) {
            throw (type="InvSoftwareException", message="Program_Id not a number", detail="Please enter a valid number for Program_Id");
        }
        if (!isNull(getSwType()) and len(trim(getSwType())) and !isNumeric(getSwType())) {
            throw (type="InvSoftwareException", message="Sw_Type not a number", detail="Please enter a valid number for Sw_Type");
        }
    
        /* validate date properties */
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="InvSoftwareException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="InvSoftwareException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="InvSoftwareException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getCreateDate()) and len(trim(getCreateDate())) and !isDate(getCreateDate())) {
            throw (type="InvSoftwareException", message="Create_Date not a valid date", detail="Please enter a valid date for Create_Date");
        }
    }
}

