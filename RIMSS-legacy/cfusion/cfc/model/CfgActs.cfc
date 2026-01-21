component output="false" displayName="CfgActs" name="CfgActs" accessors="true" {
	/* properties */
	property name="assetId" type="string";
    property name="aDelays" type="string";
    property name="bDelays" type="string";
    property name="bearing" type="string";
    property name="distance" type="string";
    property name="elevation" type="string";
    property name="latitude" type="string";
    property name="longitude" type="string";
    property name="rxSensA" type="string";
    property name="rxSensB" type="string";
    property name="txPwrA" type="string";
    property name="txPwrB" type="string";
    property name="umbilCode" type="string";
    property name="podId" type="string";
    property name="frequency" type="string";
    property name="deployedDate" type="string";
    property name="remarks" type="string";
    property name="isValid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="createDate" type="string";
    property name="createdBy" type="string";
    property name="accessibility" type="string";
    property name="dfTubeCnt" type="string";
    property name="effDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize CfgActs properties */
        setAssetId("");
        setADelays("");
        setBDelays("");
        setBearing("");
        setDistance("");
        setElevation("");
        setLatitude("");
        setLongitude("");
        setRxSensA("");
        setRxSensB("");
        setTxPwrA("");
        setTxPwrB("");
        setUmbilCode("");
        setPodId("");
        setFrequency("");
        setDeployedDate("");
        setRemarks("");
        setIsValid("");
        setValBy("");
        setValDate("");
        setChgBy("");
        setChgDate("");
        setCreateDate("");
        setCreatedBy("");
        setAccessibility("");
        setDfTubeCnt("");
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

    /* Validate CfgActs */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="CfgActsException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getIsValid()) or !len(trim(getIsValid()))) {
            throw (type="CfgActsException", message="Missing Is_Valid", detail="Please enter in the Is_Valid");
        }
        if (isNull(getChgBy()) or !len(trim(getChgBy()))) {
            throw (type="CfgActsException", message="Missing Chg_By", detail="Please enter in the Chg_By");
        }
        if (isNull(getChgDate()) or !len(trim(getChgDate()))) {
            throw (type="CfgActsException", message="Missing Chg_Date", detail="Please enter in the Chg_Date");
        }
        if (isNull(getEffDate()) or !len(trim(getEffDate()))) {
            throw (type="CfgActsException", message="Missing Eff_Date", detail="Please enter in the Eff_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="CfgActsException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getBearing()) and len(trim(getBearing())) and !isNumeric(getBearing())) {
            throw (type="CfgActsException", message="Bearing not a number", detail="Please enter a valid number for Bearing");
        }
        if (!isNull(getDistance()) and len(trim(getDistance())) and !isNumeric(getDistance())) {
            throw (type="CfgActsException", message="Distance not a number", detail="Please enter a valid number for Distance");
        }
        if (!isNull(getElevation()) and len(trim(getElevation())) and !isNumeric(getElevation())) {
            throw (type="CfgActsException", message="Elevation not a number", detail="Please enter a valid number for Elevation");
        }
        if (!isNull(getRxSensA()) and len(trim(getRxSensA())) and !isNumeric(getRxSensA())) {
            throw (type="CfgActsException", message="Rx_Sens_A not a number", detail="Please enter a valid number for Rx_Sens_A");
        }
        if (!isNull(getRxSensB()) and len(trim(getRxSensB())) and !isNumeric(getRxSensB())) {
            throw (type="CfgActsException", message="Rx_Sens_B not a number", detail="Please enter a valid number for Rx_Sens_B");
        }
        if (!isNull(getTxPwrA()) and len(trim(getTxPwrA())) and !isNumeric(getTxPwrA())) {
            throw (type="CfgActsException", message="Tx_Pwr_A not a number", detail="Please enter a valid number for Tx_Pwr_A");
        }
        if (!isNull(getTxPwrB()) and len(trim(getTxPwrB())) and !isNumeric(getTxPwrB())) {
            throw (type="CfgActsException", message="Tx_Pwr_B not a number", detail="Please enter a valid number for Tx_Pwr_B");
        }
        if (!isNull(getUmbilCode()) and len(trim(getUmbilCode())) and !isNumeric(getUmbilCode())) {
            throw (type="CfgActsException", message="Umbil_Code not a number", detail="Please enter a valid number for Umbil_Code");
        }
        if (!isNull(getAccessibility()) and len(trim(getAccessibility())) and !isNumeric(getAccessibility())) {
            throw (type="CfgActsException", message="Accessibility not a number", detail="Please enter a valid number for Accessibility");
        }
        if (!isNull(getDfTubeCnt()) and len(trim(getDfTubeCnt())) and !isNumeric(getDfTubeCnt())) {
            throw (type="CfgActsException", message="Df_Tube_Cnt not a number", detail="Please enter a valid number for Df_Tube_Cnt");
        }
    
        /* validate date properties */
        if (!isNull(getDeployedDate()) and len(trim(getDeployedDate())) and !isDate(getDeployedDate())) {
            throw (type="CfgActsException", message="Deployed_Date not a valid date", detail="Please enter a valid date for Deployed_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="CfgActsException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="CfgActsException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getCreateDate()) and len(trim(getCreateDate())) and !isDate(getCreateDate())) {
            throw (type="CfgActsException", message="Create_Date not a valid date", detail="Please enter a valid date for Create_Date");
        }
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="CfgActsException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
    }
}

