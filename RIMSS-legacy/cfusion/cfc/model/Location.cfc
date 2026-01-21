component output="false" displayName="Location" name="Location" accessors="true" {
	/* properties */
	property name="locId" type="string";
    property name="majcomCd" type="string";
    property name="siteCd" type="string";
    property name="unitCd" type="string";
    property name="description" type="string";
    property name="active" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="squadCd" type="string";
    property name="geoloc" type="string";
    property name="displayName" type="string";
    property name="ctLocId" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize Location properties */
        setLocId("");
        setMajcomCd("");
        setSiteCd("");
        setUnitCd("");
        setDescription("");
        setActive("");
        setInsBy("");
        setInsDate("");
        setSquadCd("");
        setGeoloc("");
        setDisplayName("");
        setCtLocId("");
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

    /* Validate Location */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getLocId()) or !len(trim(getLocId()))) {
            throw (type="LocationException", message="Missing Loc_Id", detail="Please enter in the Loc_Id");
        }
        if (isNull(getMajcomCd()) or !len(trim(getMajcomCd()))) {
            throw (type="LocationException", message="Missing Majcom_Cd", detail="Please enter in the Majcom_Cd");
        }
        if (isNull(getSiteCd()) or !len(trim(getSiteCd()))) {
            throw (type="LocationException", message="Missing Site_Cd", detail="Please enter in the Site_Cd");
        }
        if (isNull(getUnitCd()) or !len(trim(getUnitCd()))) {
            throw (type="LocationException", message="Missing Unit_Cd", detail="Please enter in the Unit_Cd");
        }
        if (isNull(getDescription()) or !len(trim(getDescription()))) {
            throw (type="LocationException", message="Missing Description", detail="Please enter in the Description");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="LocationException", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="LocationException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="LocationException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="LocationException", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
        if (!isNull(getMajcomCd()) and len(trim(getMajcomCd())) and !isNumeric(getMajcomCd())) {
            throw (type="LocationException", message="Majcom_Cd not a number", detail="Please enter a valid number for Majcom_Cd");
        }
        if (!isNull(getSiteCd()) and len(trim(getSiteCd())) and !isNumeric(getSiteCd())) {
            throw (type="LocationException", message="Site_Cd not a number", detail="Please enter a valid number for Site_Cd");
        }
        if (!isNull(getUnitCd()) and len(trim(getUnitCd())) and !isNumeric(getUnitCd())) {
            throw (type="LocationException", message="Unit_Cd not a number", detail="Please enter a valid number for Unit_Cd");
        }
        if (!isNull(getSquadCd()) and len(trim(getSquadCd())) and !isNumeric(getSquadCd())) {
            throw (type="LocationException", message="Squad_Cd not a number", detail="Please enter a valid number for Squad_Cd");
        }
        if (!isNull(getCtLocId()) and len(trim(getCtLocId())) and !isNumeric(getCtLocId())) {
            throw (type="LocationException", message="Ct_Loc_Id not a number", detail="Please enter a valid number for Ct_Loc_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="LocationException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="LocationException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

