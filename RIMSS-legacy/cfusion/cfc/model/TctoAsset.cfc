component output="false" displayName="TctoAsset" name="TctoAsset" accessors="true" {
	/* properties */
	property name="tctoId" type="string";
    property name="assetId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="remarks" type="string";
    property name="completeDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="repairId" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize TctoAsset properties */
        setTctoId("");
        setAssetId("");
        setInsBy("");
        setInsDate("");
        setValid("");
        setValBy("");
        setValDate("");
        setRemarks("");
        setCompleteDate("");
        setChgBy("");
        setChgDate("");
        setRepairId("");

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

    /* Validate TctoAsset */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getTctoId()) or !len(trim(getTctoId()))) {
            throw (type="TctoAssetException", message="Missing Tcto_Id", detail="Please enter in the Tcto_Id");
        }
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="TctoAssetException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="TctoAssetException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="TctoAssetException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="TctoAssetException", message="Missing Valid", detail="Please enter in the Valid");
        }
    
        /* validate numeric properties */
        if (!isNull(getTctoId()) and len(trim(getTctoId())) and !isNumeric(getTctoId())) {
            throw (type="TctoAssetException", message="Tcto_Id not a number", detail="Please enter a valid number for Tcto_Id");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="TctoAssetException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getRepairId()) and len(trim(getRepairId())) and !isNumeric(getRepairId())) {
            throw (type="TctoAssetException", message="Repair_Id not a number", detail="Please enter a valid number for Repair_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="TctoAssetException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="TctoAssetException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getCompleteDate()) and len(trim(getCompleteDate())) and !isDate(getCompleteDate())) {
            throw (type="TctoAssetException", message="Complete_Date not a valid date", detail="Please enter a valid date for Complete_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="TctoAssetException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

