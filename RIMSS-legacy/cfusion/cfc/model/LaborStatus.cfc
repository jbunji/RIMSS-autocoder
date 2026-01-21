component output="false" displayName="LaborStatus" name="LaborStatus" accessors="true" {
	/* properties */
	property name="labStatId" type="string";
    property name="laborId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="status" type="string";
    property name="statusDate" type="string";
    property name="remarks" type="string";
    property name="crewId" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize LaborStatus properties */
        setLabStatId("");
        setLaborId("");
        setInsBy("");
        setInsDate("");
        setStatus("");
        setStatusDate("");
        setRemarks("");
        setCrewId("");
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

    /* Validate LaborStatus */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getLabStatId()) or !len(trim(getLabStatId()))) {
            throw (type="LaborStatusException", message="Missing Lab_Stat_Id", detail="Please enter in the Lab_Stat_Id");
        }
        if (isNull(getLaborId()) or !len(trim(getLaborId()))) {
            throw (type="LaborStatusException", message="Missing Labor_Id", detail="Please enter in the Labor_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="LaborStatusException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="LaborStatusException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getLabStatId()) and len(trim(getLabStatId())) and !isNumeric(getLabStatId())) {
            throw (type="LaborStatusException", message="Lab_Stat_Id not a number", detail="Please enter a valid number for Lab_Stat_Id");
        }
        if (!isNull(getLaborId()) and len(trim(getLaborId())) and !isNumeric(getLaborId())) {
            throw (type="LaborStatusException", message="Labor_Id not a number", detail="Please enter a valid number for Labor_Id");
        }
        if (!isNull(getCrewId()) and len(trim(getCrewId())) and !isNumeric(getCrewId())) {
            throw (type="LaborStatusException", message="Crew_Id not a number", detail="Please enter a valid number for Crew_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="LaborStatusException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getStatusDate()) and len(trim(getStatusDate())) and !isDate(getStatusDate())) {
            throw (type="LaborStatusException", message="Status_Date not a valid date", detail="Please enter a valid date for Status_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="LaborStatusException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

