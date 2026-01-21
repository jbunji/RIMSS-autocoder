component output="false" displayName="AuxAssetsTcto" name="AuxAssetsTcto" accessors="true" {
	/* properties */
	property name="assetId" type="string";
    property name="tctoId" type="string";
    property name="createDate" type="string";
    property name="createdBy" type="string";
    property name="remarks" type="string";
    property name="isValid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="effDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize AuxAssetsTcto properties */
        setAssetId("");
        setTctoId("");
        setCreateDate("");
        setCreatedBy("");
        setRemarks("");
        setIsValid("");
        setValBy("");
        setValDate("");
        setChgBy("");
        setChgDate("");
        setEffDate("");

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

    /* Validate AuxAssetsTcto */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="AuxAssetsTctoException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getTctoId()) or !len(trim(getTctoId()))) {
            throw (type="AuxAssetsTctoException", message="Missing Tcto_Id", detail="Please enter in the Tcto_Id");
        }
        if (isNull(getEffDate()) or !len(trim(getEffDate()))) {
            throw (type="AuxAssetsTctoException", message="Missing Eff_Date", detail="Please enter in the Eff_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="AuxAssetsTctoException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getTctoId()) and len(trim(getTctoId())) and !isNumeric(getTctoId())) {
            throw (type="AuxAssetsTctoException", message="Tcto_Id not a number", detail="Please enter a valid number for Tcto_Id");
        }
    
        /* validate date properties */
        if (!isNull(getCreateDate()) and len(trim(getCreateDate())) and !isDate(getCreateDate())) {
            throw (type="AuxAssetsTctoException", message="Create_Date not a valid date", detail="Please enter a valid date for Create_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="AuxAssetsTctoException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="AuxAssetsTctoException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="AuxAssetsTctoException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
    }
}

