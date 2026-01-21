component output="false" displayName="Labor" name="Labor" accessors="true" {
	/* properties */
	property name="laborId" type="string";
    property name="repairId" type="string";
    property name="laborSeq" type="string";
    property name="sentImds" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="newShopStatus" type="string";
    property name="typeMaint" type="string";
    property name="wucCd" type="string";
    property name="actionTaken" type="string";
    property name="whenDisc" type="string";
    property name="howMal" type="string";
    property name="catLabor" type="string";
    property name="assetId" type="string";
    property name="units" type="string";
    property name="startDate" type="string";
    property name="stopDate" type="string";
    property name="crewChief" type="string";
    property name="crewSize" type="string";
    property name="corrective" type="string";
    property name="discrepancy" type="string";
    property name="remarks" type="string";
    property name="correctedBy" type="string";
    property name="inspectedBy" type="string";
    property name="hours" type="string";
    property name="laborAction" type="string";
    property name="stationId" type="string";
    property name="bitLog" type="string";
    property name="editFlag" type="string";
    property name="omitWce" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="ddrDocno" type="string";
    property name="timeOverrideFlag" type="string";
    property name="testGrp" type="string";
    property name="testFailNo" type="string";
    property name="legacyPk" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize Labor properties */
        setLaborId("");
        setRepairId("");
        setLaborSeq("1");
        setSentImds("N");
        setInsBy("");
        setInsDate("");
        setValid("N");
        setValBy("");
        setValDate("");
        setNewShopStatus("");
        setTypeMaint("");
        setWucCd("");
        setActionTaken("");
        setWhenDisc("");
        setHowMal("");
        setCatLabor("");
        setAssetId("");
        setUnits("");
        setStartDate("");
        setStopDate("");
        setCrewChief("");
        setCrewSize("");
        setCorrective("");
        setDiscrepancy("");
        setRemarks("");
        setCorrectedBy("");
        setInspectedBy("");
        setHours("");
        setLaborAction("");
        setStationId("");
        setBitLog("");
        setEditFlag("");
        setOmitWce("");
        setChgBy("");
        setChgDate("");
        setDdrDocno("");
        setTimeOverrideFlag("");
        setTestGrp("");
        setTestFailNo("");
        setLegacyPk("");

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

    /* Validate Labor */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getRepairId()) or !len(trim(getRepairId()))) {
            throw (type="LaborException", message="Missing Repair_Id", detail="Please enter in the Repair_Id");
        }
        if (isNull(getLaborSeq()) or !len(trim(getLaborSeq()))) {
            throw (type="LaborException", message="Missing Labor_Seq", detail="Please enter in the Labor_Seq");
        }
        if (isNull(getSentImds()) or !len(trim(getSentImds()))) {
            throw (type="LaborException", message="Missing Sent_Imds", detail="Please enter in the Sent_Imds");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="LaborException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="LaborException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="LaborException", message="Missing Valid", detail="Please enter in the Valid");
        }
    
        /* validate numeric properties */
        if (!isNull(getLaborId()) and len(trim(getLaborId())) and !isNumeric(getLaborId())) {
            throw (type="LaborException", message="Labor_Id not a number", detail="Please enter a valid number for Labor_Id");
        }
        if (!isNull(getRepairId()) and len(trim(getRepairId())) and !isNumeric(getRepairId())) {
            throw (type="LaborException", message="Repair_Id not a number", detail="Please enter a valid number for Repair_Id");
        }
        if (!isNull(getLaborSeq()) and len(trim(getLaborSeq())) and !isNumeric(getLaborSeq())) {
            throw (type="LaborException", message="Labor_Seq not a number", detail="Please enter a valid number for Labor_Seq");
        }
        if (!isNull(getNewShopStatus()) and len(trim(getNewShopStatus())) and !isNumeric(getNewShopStatus())) {
            throw (type="LaborException", message="New_Shop_Status not a number", detail="Please enter a valid number for New_Shop_Status");
        }
        if (!isNull(getTypeMaint()) and len(trim(getTypeMaint())) and !isNumeric(getTypeMaint())) {
            throw (type="LaborException", message="Type_Maint not a number", detail="Please enter a valid number for Type_Maint");
        }
        if (!isNull(getWucCd()) and len(trim(getWucCd())) and !isNumeric(getWucCd())) {
            throw (type="LaborException", message="Wuc_Cd not a number", detail="Please enter a valid number for Wuc_Cd");
        }
        if (!isNull(getActionTaken()) and len(trim(getActionTaken())) and !isNumeric(getActionTaken())) {
            throw (type="LaborException", message="Action_Taken not a number", detail="Please enter a valid number for Action_Taken");
        }
        if (!isNull(getWhenDisc()) and len(trim(getWhenDisc())) and !isNumeric(getWhenDisc())) {
            throw (type="LaborException", message="When_Disc not a number", detail="Please enter a valid number for When_Disc");
        }
        if (!isNull(getHowMal()) and len(trim(getHowMal())) and !isNumeric(getHowMal())) {
            throw (type="LaborException", message="How_Mal not a number", detail="Please enter a valid number for How_Mal");
        }
        if (!isNull(getCatLabor()) and len(trim(getCatLabor())) and !isNumeric(getCatLabor())) {
            throw (type="LaborException", message="Cat_Labor not a number", detail="Please enter a valid number for Cat_Labor");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="LaborException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getUnits()) and len(trim(getUnits())) and !isNumeric(getUnits())) {
            throw (type="LaborException", message="Units not a number", detail="Please enter a valid number for Units");
        }
        if (!isNull(getCrewChief()) and len(trim(getCrewChief())) and !isNumeric(getCrewChief())) {
            throw (type="LaborException", message="Crew_Chief not a number", detail="Please enter a valid number for Crew_Chief");
        }
        if (!isNull(getCrewSize()) and len(trim(getCrewSize())) and !isNumeric(getCrewSize())) {
            throw (type="LaborException", message="Crew_Size not a number", detail="Please enter a valid number for Crew_Size");
        }
        if (!isNull(getHours()) and len(trim(getHours())) and !isNumeric(getHours())) {
            throw (type="LaborException", message="Hours not a number", detail="Please enter a valid number for Hours");
        }
        if (!isNull(getLegacyPk()) and len(trim(getLegacyPk())) and !isNumeric(getLegacyPk())) {
            throw (type="LaborException", message="Legacy_Pk not a number", detail="Please enter a valid number for Legacy_Pk");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="LaborException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="LaborException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getStartDate()) and len(trim(getStartDate())) and !isDate(getStartDate())) {
            throw (type="LaborException", message="Start_Date not a valid date", detail="Please enter a valid date for Start_Date");
        }
        if (!isNull(getStopDate()) and len(trim(getStopDate())) and !isDate(getStopDate())) {
            throw (type="LaborException", message="Stop_Date not a valid date", detail="Please enter a valid date for Stop_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="LaborException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
    
    public void function validateLabor() {
        /* validate not null properties */
        if (isNull(getLaborId()) or !len(trim(getLaborId()))) {
            throw (type="LaborException", message="Missing Labor_Id", detail="Please enter in the Labor_Id");
        }
    }    
    
}

