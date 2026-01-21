component output="false" displayName="LaborPart" name="LaborPart" accessors="true" {
	/* properties */
	property name="laborPartId" type="string";
    property name="laborId" type="string";
    property name="assetId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="partAction" type="string";
    property name="howMal" type="string";
    property name="tagNo" type="string";
    property name="partQty" type="string";
    property name="refdes" type="string";
    property name="fsc" type="string";
    property name="wucCd" type="string";
    property name="legacyPk" type="string";
    property name="isPqdr" type="string";
    property name="drNum" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize LaborPart properties */
        setLaborPartId("");
        setLaborId("");
        setAssetId("");
        setInsBy("");
        setInsDate("");
        setPartAction("");
        setHowMal("");
        setTagNo("");
        setPartQty("");
        setRefdes("");
        setFsc("");
        setWucCd("");
        setLegacyPk("");
        setIsPqdr("");
        setDrNum("");

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

    /* Validate LaborPart */
    public void function validate() {
        /* validate not null properties */
//        if (isNull(getLaborPartId()) or !len(trim(getLaborPartId()))) {
//            throw (type="LaborPartException", message="Missing Labor_Part_Id", detail="Please enter in the Labor_Part_Id");
//        }
        if (isNull(getLaborId()) or !len(trim(getLaborId()))) {
            throw (type="LaborPartException", message="Missing Labor_Id", detail="Please enter in the Labor_Id");
        }
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="LaborPartException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="LaborPartException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="LaborPartException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getPartAction()) or !len(trim(getPartAction()))) {
            throw (type="LaborPartException", message="Missing Part_Action", detail="Please enter in the Part_Action");
        }
    
        /* validate numeric properties */
        if (!isNull(getLaborPartId()) and len(trim(getLaborPartId())) and !isNumeric(getLaborPartId())) {
            throw (type="LaborPartException", message="Labor_Part_Id not a number", detail="Please enter a valid number for Labor_Part_Id");
        }
        if (!isNull(getLaborId()) and len(trim(getLaborId())) and !isNumeric(getLaborId())) {
            throw (type="LaborPartException", message="Labor_Id not a number", detail="Please enter a valid number for Labor_Id");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="LaborPartException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getHowMal()) and len(trim(getHowMal())) and !isNumeric(getHowMal())) {
            throw (type="LaborPartException", message="How_Mal not a number", detail="Please enter a valid number for How_Mal");
        }
        if (!isNull(getPartQty()) and len(trim(getPartQty())) and !isNumeric(getPartQty())) {
            throw (type="LaborPartException", message="Part_Qty not a number", detail="Please enter a valid number for Part_Qty");
        }
        if (!isNull(getWucCd()) and len(trim(getWucCd())) and !isNumeric(getWucCd())) {
            throw (type="LaborPartException", message="Wuc_Cd not a number", detail="Please enter a valid number for Wuc_Cd");
        }
        if (!isNull(getLegacyPk()) and len(trim(getLegacyPk())) and !isNumeric(getLegacyPk())) {
            throw (type="LaborPartException", message="Legacy_Pk not a number", detail="Please enter a valid number for Legacy_Pk");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="LaborPartException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        
        if (!isNull(getIsPqdr()) and trim(getIsPqdr()) EQ 'Y' and (isNull(getDrNum()) or !len(getDrNum()))) {
            throw (type="LaborPartException", message="PQDR must have a DR Number", detail="Please enter a DR Number");
        }
        
        if (!isNull(getDrNum()) and len(getDrNum())GTE 30) {
            throw (type="LaborPartException", message="DR Number must be less than 30 characters", detail="Please enter a DR Number less than 30 characters");
        }
    }
}

