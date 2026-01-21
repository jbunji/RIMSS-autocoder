component output="false" displayName="SoftwareAsset" name="SoftwareAsset" accessors="true" {
	/* properties */
	property name="assetId" type="string";
    property name="swId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="effDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize SoftwareAsset properties */
        setAssetId("");
        setSwId("");
        setInsBy("");
        setInsDate("");
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

    /* Validate SoftwareAsset */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="SoftwareAssetException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getSwId()) or !len(trim(getSwId()))) {
            throw (type="SoftwareAssetException", message="Missing Sw_Id", detail="Please enter in the Sw_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="SoftwareAssetException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="SoftwareAssetException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="SoftwareAssetException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getSwId()) and len(trim(getSwId())) and !isNumeric(getSwId())) {
            throw (type="SoftwareAssetException", message="Sw_Id not a number", detail="Please enter a valid number for Sw_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="SoftwareAssetException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="SoftwareAssetException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
    }
}

