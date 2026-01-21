component output="false" displayName="LocSet" name="LocSet" accessors="true" {
	/* properties */
	property name="setId" type="string";
    property name="setName" type="string";
    property name="locId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="active" type="string";
    property name="displayName" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize LocSet properties */
        setSetId("");
        setSetName("");
        setLocId("");
        setInsBy("");
        setInsDate("");
        setActive("");
        setDisplayName("");

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

    /* Validate LocSet */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getSetId()) or !len(trim(getSetId()))) {
            throw (type="LocSetException", message="Missing Set_Id", detail="Please enter in the Set_Id");
        }
        if (isNull(getSetName()) or !len(trim(getSetName()))) {
            throw (type="LocSetException", message="Missing Set_Name", detail="Please enter in the Set_Name");
        }
        if (isNull(getLocId()) or !len(trim(getLocId()))) {
            throw (type="LocSetException", message="Missing Loc_Id", detail="Please enter in the Loc_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="LocSetException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="LocSetException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="LocSetException", message="Missing Active", detail="Please enter in the Active");
        }
    
        /* validate numeric properties */
        if (!isNull(getSetId()) and len(trim(getSetId())) and !isNumeric(getSetId())) {
            throw (type="LocSetException", message="Set_Id not a number", detail="Please enter a valid number for Set_Id");
        }
        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="LocSetException", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="LocSetException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
    }
}

