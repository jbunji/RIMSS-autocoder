component output="false" displayName="AuxAssetsSw" name="AuxAssetsSw" accessors="true" {
	/* properties */
	property name="assetId" type="string";
    property name="swId" type="string";
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
	    /* initialize AuxAssetsSw properties */
        setAssetId("");
        setSwId("");
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

    /* Validate AuxAssetsSw */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="AuxAssetsSwException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getSwId()) or !len(trim(getSwId()))) {
            throw (type="AuxAssetsSwException", message="Missing Sw_Id", detail="Please enter in the Sw_Id");
        }
        if (isNull(getIsValid()) or !len(trim(getIsValid()))) {
            throw (type="AuxAssetsSwException", message="Missing Is_Valid", detail="Please enter in the Is_Valid");
        }
        if (isNull(getChgBy()) or !len(trim(getChgBy()))) {
            throw (type="AuxAssetsSwException", message="Missing Chg_By", detail="Please enter in the Chg_By");
        }
        if (isNull(getChgDate()) or !len(trim(getChgDate()))) {
            throw (type="AuxAssetsSwException", message="Missing Chg_Date", detail="Please enter in the Chg_Date");
        }
        if (isNull(getEffDate()) or !len(trim(getEffDate()))) {
            throw (type="AuxAssetsSwException", message="Missing Eff_Date", detail="Please enter in the Eff_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="AuxAssetsSwException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getSwId()) and len(trim(getSwId())) and !isNumeric(getSwId())) {
            throw (type="AuxAssetsSwException", message="Sw_Id not a number", detail="Please enter a valid number for Sw_Id");
        }
    
        /* validate date properties */
        if (!isNull(getCreateDate()) and len(trim(getCreateDate())) and !isDate(getCreateDate())) {
            throw (type="AuxAssetsSwException", message="Create_Date not a valid date", detail="Please enter a valid date for Create_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="AuxAssetsSwException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="AuxAssetsSwException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="AuxAssetsSwException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
    }
}

