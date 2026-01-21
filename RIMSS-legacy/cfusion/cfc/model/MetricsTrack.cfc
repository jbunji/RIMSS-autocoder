component output="false" displayName="MetricsTrack" name="MetricsTrack" accessors="true" {
	/* properties */
	property name="trackId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="assetId" type="string";
    property name="repairId" type="string";
    property name="vetType" type="string";
    property name="vetStatus" type="string";
    property name="typeFail" type="string";
    property name="vetDate" type="string";
    property name="remarks" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize MetricsTrack properties */
        setTrackId("");
        setInsBy("");
        setInsDate("");
        setAssetId("");
        setRepairId("");
        setVetType("");
        setVetStatus("");
        setTypeFail("");
        setVetDate("");
        setRemarks("");
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

    /* Validate MetricsTrack */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getTrackId()) or !len(trim(getTrackId()))) {
            throw (type="MetricsTrackException", message="Missing Track_Id", detail="Please enter in the Track_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="MetricsTrackException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="MetricsTrackException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="MetricsTrackException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getRepairId()) or !len(trim(getRepairId()))) {
            throw (type="MetricsTrackException", message="Missing Repair_Id", detail="Please enter in the Repair_Id");
        }
        if (isNull(getVetType()) or !len(trim(getVetType()))) {
            throw (type="MetricsTrackException", message="Missing Vet_Type", detail="Please enter in the Vet_Type");
        }
        if (isNull(getVetStatus()) or !len(trim(getVetStatus()))) {
            throw (type="MetricsTrackException", message="Missing Vet_Status", detail="Please enter in the Vet_Status");
        }
        if (isNull(getTypeFail()) or !len(trim(getTypeFail()))) {
            throw (type="MetricsTrackException", message="Missing Type_Fail", detail="Please enter in the Type_Fail");
        }
    
        /* validate numeric properties */
        if (!isNull(getTrackId()) and len(trim(getTrackId())) and !isNumeric(getTrackId())) {
            throw (type="MetricsTrackException", message="Track_Id not a number", detail="Please enter a valid number for Track_Id");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="MetricsTrackException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getRepairId()) and len(trim(getRepairId())) and !isNumeric(getRepairId())) {
            throw (type="MetricsTrackException", message="Repair_Id not a number", detail="Please enter a valid number for Repair_Id");
        }
        if (!isNull(getVetStatus()) and len(trim(getVetStatus())) and !isNumeric(getVetStatus())) {
            throw (type="MetricsTrackException", message="Vet_Status not a number", detail="Please enter a valid number for Vet_Status");
        }
        if (!isNull(getTypeFail()) and len(trim(getTypeFail())) and !isNumeric(getTypeFail())) {
            throw (type="MetricsTrackException", message="Type_Fail not a number", detail="Please enter a valid number for Type_Fail");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="MetricsTrackException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getVetDate()) and len(trim(getVetDate())) and !isDate(getVetDate())) {
            throw (type="MetricsTrackException", message="Vet_Date not a valid date", detail="Please enter a valid date for Vet_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="MetricsTrackException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

