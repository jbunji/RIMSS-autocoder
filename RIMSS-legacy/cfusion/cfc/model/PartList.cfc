component output="false" displayName="PartList" name="PartList" accessors="true" {
	/* properties */
	property name="partnoId" type="string";
    property name="partno" type="string";
    property name="sysType" type="string";
    property name="pgmId" type="string";
    property name="noun" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="active" type="string";
    property name="snTracked" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="wucCd" type="string";
    property name="mdsCd" type="string";
    property name="version" type="string";
    property name="nsn" type="string";
    property name="cage" type="string";
    property name="nhaId" type="string";
    property name="config" type="string";
    property name="unitPrice" type="string";
    property name="ctSysId" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="errc" type="string";
    property name="lsruFlag" type="string";
    property name="exchCost" type="string";
    property name="locIdr" type="string";
    property name="msl" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize PartList properties */
        setPartnoId("");
        setPartno("");
        setSysType("");
        setPgmId("");
        setNoun("");
        setInsBy("");
        setInsDate("");
        setActive("");
        setSnTracked("");
        setValid("");
        setValBy("");
        setValDate("");
        setWucCd("");
        setMdsCd("");
        setVersion("");
        setNsn("");
        setCage("");
        setNhaId("");
        setConfig("");
        setUnitPrice("");
        setCtSysId("");
        setChgBy("");
        setChgDate("");
        setErrc("");
        setLsruFlag("");
        setExchCost("");
        setLocIdr("");
        setMsl("");

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

    /* Validate PartList */
    public void function validate(boolean validatePk = true) {
        /* validate not null properties */
        if (isNull(getPartnoId()) or !len(trim(getPartnoId())) and validatePk) {
            throw (type="PartListException", message="Missing Partno_Id", detail="Please enter in the Partno_Id");
        }
        if (isNull(getPartno()) or !len(trim(getPartno()))) {
            throw (type="PartListException", message="Missing Partno", detail="Please enter in the Partno");
        }
        if (isNull(getSysType()) or !len(trim(getSysType()))) {
            throw (type="PartListException", message="Missing Sys_Type", detail="Please enter in the Sys_Type");
        }
        if (isNull(getPgmId()) or !len(trim(getPgmId()))) {
            throw (type="PartListException", message="Missing Pgm_Id", detail="Please enter in the Pgm_Id");
        }
        if (isNull(getNoun()) or !len(trim(getNoun()))) {
            throw (type="PartListException", message="Missing Noun", detail="Please enter in the Noun");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="PartListException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="PartListException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="PartListException", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getSnTracked()) or !len(trim(getSnTracked()))) {
            throw (type="PartListException", message="Missing Sn_Tracked", detail="Please enter in the Sn_Tracked");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="PartListException", message="Missing Valid", detail="Please enter in the Valid");
        }
        if (isNull(getLsruFlag()) or !len(trim(getLsruFlag()))) {
            throw (type="PartListException", message="Missing Lsru_Flag", detail="Please enter in the Lsru_Flag");
        }
    
        /* validate numeric properties */
        if (!isNull(getPartnoId()) and len(trim(getPartnoId())) and !isNumeric(getPartnoId())) {
            throw (type="PartListException", message="Partno_Id not a number", detail="Please enter a valid number for Partno_Id");
        }
        if (!isNull(getSysType()) and len(trim(getSysType())) and !isNumeric(getSysType())) {
            throw (type="PartListException", message="Sys_Type not a number", detail="Please enter a valid number for Sys_Type");
        }
        if (!isNull(getPgmId()) and len(trim(getPgmId())) and !isNumeric(getPgmId())) {
            throw (type="PartListException", message="Pgm_Id not a number", detail="Please enter a valid number for Pgm_Id");
        }
        if (!isNull(getWucCd()) and len(trim(getWucCd())) and !isNumeric(getWucCd())) {
            throw (type="PartListException", message="Wuc_Cd not a number", detail="Please enter a valid number for Wuc_Cd");
        }
        if (!isNull(getMdsCd()) and len(trim(getMdsCd())) and !isNumeric(getMdsCd())) {
            throw (type="PartListException", message="Mds_Cd not a number", detail="Please enter a valid number for Mds_Cd");
        }
        if (!isNull(getNhaId()) and len(trim(getNhaId())) and !isNumeric(getNhaId())) {
            throw (type="PartListException", message="Nha_Id not a number", detail="Please enter a valid number for Nha_Id");
        }
        if (!isNull(getUnitPrice()) and len(trim(getUnitPrice())) and !isNumeric(getUnitPrice())) {
            throw (type="PartListException", message="Unit_Price not a number", detail="Please enter a valid number for Unit_Price");
        }
        if (!isNull(getCtSysId()) and len(trim(getCtSysId())) and !isNumeric(getCtSysId())) {
            throw (type="PartListException", message="Ct_Sys_Id not a number", detail="Please enter a valid number for Ct_Sys_Id");
        }
        if (!isNull(getExchCost()) and len(trim(getExchCost())) and !isNumeric(getExchCost())) {
            throw (type="PartListException", message="Exch_Cost not a number", detail="Please enter a valid number for Exch_Cost");
        }
        if (!isNull(getLocIdr()) and len(trim(getLocIdr())) and !isNumeric(getLocIdr())) {
            throw (type="PartListException", message="Loc_Idr not a number", detail="Please enter a valid number for Loc_Idr");
        }
        if (!isNull(getMsl()) and len(trim(getMsl())) and !isNumeric(getMsl())) {
            throw (type="PartListException", message="MSL not a number", detail="Please enter a valid number for MSL");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="PartListException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="PartListException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="PartListException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

