component output="false" displayName="AssetInspection" name="AssetInspection" accessors="true" {
	/* properties */
	property name="histId" type="string";
    property name="assetId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="valid" type="string";
    property name="wucCd" type="string";
    property name="jstId" type="string";
    property name="repairId" type="string";
    property name="completeDate" type="string";
    property name="nextDueDate" type="string";
    property name="jobNo" type="string";
    property name="completedBy" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="pmiType" type="string";
    property name="completedEtm" type="string";
    property name="nextDueEtm" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize AssetInspection properties */
        setHistId("");
        setAssetId("");
        setInsBy("");
        setInsDate("");
        setValid("");
        setWucCd("");
        setJstId("");
        setRepairId("");
        setCompleteDate("");
        setNextDueDate("");
        setJobNo("");
        setCompletedBy("");
        setChgBy("");
        setChgDate("");
        setPmiType("");
        setCompletedEtm("");
        setNextDueEtm("");

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

    /* Validate AssetInspection */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getHistId()) or !len(trim(getHistId()))) {
            throw (type="AssetInspectionException", message="Missing Hist_Id", detail="Please enter in the Hist_Id");
        }
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="AssetInspectionException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="AssetInspectionException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="AssetInspectionException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="AssetInspectionException", message="Missing Valid", detail="Please enter in the Valid");
        }
    
        /* validate numeric properties */
        if (!isNull(getHistId()) and len(trim(getHistId())) and !isNumeric(getHistId())) {
            throw (type="AssetInspectionException", message="Hist_Id not a number", detail="Please enter a valid number for Hist_Id");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="AssetInspectionException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getWucCd()) and len(trim(getWucCd())) and !isNumeric(getWucCd())) {
            throw (type="AssetInspectionException", message="Wuc_Cd not a number", detail="Please enter a valid number for Wuc_Cd");
        }
        if (!isNull(getJstId()) and len(trim(getJstId())) and !isNumeric(getJstId())) {
            throw (type="AssetInspectionException", message="Jst_Id not a number", detail="Please enter a valid number for Jst_Id");
        }
        if (!isNull(getRepairId()) and len(trim(getRepairId())) and !isNumeric(getRepairId())) {
            throw (type="AssetInspectionException", message="Repair_Id not a number", detail="Please enter a valid number for Repair_Id");
        }
        if (!isNull(getPmiType()) and len(trim(getPmiType())) and !isNumeric(getPmiType())) {
            throw (type="AssetInspectionException", message="Pmi_Type not a number", detail="Please enter a valid number for Pmi_Type");
        }
        if (!isNull(getCompletedEtm()) and len(trim(getCompletedEtm())) and !isNumeric(getCompletedEtm())) {
            throw (type="AssetInspectionException", message="Completed_Etm not a number", detail="Please enter a valid number for Completed_Etm");
        }
        if (!isNull(getNextDueEtm()) and len(trim(getNextDueEtm())) and !isNumeric(getNextDueEtm())) {
            throw (type="AssetInspectionException", message="Next_Due_Etm not a number", detail="Please enter a valid number for Next_Due_Etm");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="AssetInspectionException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getCompleteDate()) and len(trim(getCompleteDate())) and !isDate(getCompleteDate())) {
            throw (type="AssetInspectionException", message="Complete_Date not a valid date", detail="Please enter a valid date for Complete_Date");
        }
        if (!isNull(getNextDueDate()) and len(trim(getNextDueDate())) and !isDate(getNextDueDate())) {
            throw (type="AssetInspectionException", message="Next_Due_Date not a valid date", detail="Please enter a valid date for Next_Due_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="AssetInspectionException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

