component output="false" displayName="BadActor" name="BadActor" accessors="true" {
	/* properties */
	property name="badActorId" type="string";
    property name="locId" type="string";
    property name="sysId" type="string";
    property name="statusPeriod" type="string";
    property name="statusPeriodType" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="active" type="string";
    property name="multiAc" type="string";
    property name="statusCount" type="string";
    property name="statusCd" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize BadActor properties */
        setBadActorId("");
        setLocId("");
        setSysId("");
        setStatusPeriod("");
        setStatusPeriodType("");
        setInsBy("");
        setInsDate("");
        setActive("");
        setMultiAc("");
        setStatusCount("");
        setStatusCd("");
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

    /* Validate BadActor */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getBadActorId()) or !len(trim(getBadActorId()))) {
            throw (type="BadActorException", message="Missing Bad_Actor_Id", detail="Please enter in the Bad_Actor_Id");
        }
        if (isNull(getLocId()) or !len(trim(getLocId()))) {
            throw (type="BadActorException", message="Missing Loc_Id", detail="Please enter in the Loc_Id");
        }
        if (isNull(getSysId()) or !len(trim(getSysId()))) {
            throw (type="BadActorException", message="Missing Sys_Id", detail="Please enter in the Sys_Id");
        }
        if (isNull(getStatusPeriod()) or !len(trim(getStatusPeriod()))) {
            throw (type="BadActorException", message="Missing Status_Period", detail="Please enter in the Status_Period");
        }
        if (isNull(getStatusPeriodType()) or !len(trim(getStatusPeriodType()))) {
            throw (type="BadActorException", message="Missing Status_Period_Type", detail="Please enter in the Status_Period_Type");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="BadActorException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="BadActorException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="BadActorException", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getMultiAc()) or !len(trim(getMultiAc()))) {
            throw (type="BadActorException", message="Missing Multi_Ac", detail="Please enter in the Multi_Ac");
        }
    
        /* validate numeric properties */
        if (!isNull(getBadActorId()) and len(trim(getBadActorId())) and !isNumeric(getBadActorId())) {
            throw (type="BadActorException", message="Bad_Actor_Id not a number", detail="Please enter a valid number for Bad_Actor_Id");
        }
        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="BadActorException", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
        if (!isNull(getSysId()) and len(trim(getSysId())) and !isNumeric(getSysId())) {
            throw (type="BadActorException", message="Sys_Id not a number", detail="Please enter a valid number for Sys_Id");
        }
        if (!isNull(getStatusPeriod()) and len(trim(getStatusPeriod())) and !isNumeric(getStatusPeriod())) {
            throw (type="BadActorException", message="Status_Period not a number", detail="Please enter a valid number for Status_Period");
        }
        if (!isNull(getStatusCount()) and len(trim(getStatusCount())) and !isNumeric(getStatusCount())) {
            throw (type="BadActorException", message="Status_Count not a number", detail="Please enter a valid number for Status_Count");
        }
        if (!isNull(getStatusCd()) and len(trim(getStatusCd())) and !isNumeric(getStatusCd())) {
            throw (type="BadActorException", message="Status_Cd not a number", detail="Please enter a valid number for Status_Cd");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="BadActorException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="BadActorException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

