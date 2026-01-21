component output="false" displayName="Repair" name="Repair" accessors="true" {
	/* properties */
	property name="repairId" type="string";
    property name="repairSeq" type="string";
    property name="eventId" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="micap" type="string";
    property name="micapLogin" type="string";
    property name="damage" type="string";
    property name="chiefReview" type="string";
    property name="superReview" type="string";
    property name="etiChange" type="string";
    property name="repeatRecur" type="string";
    property name="sentImds" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="typeMaint" type="string";
    property name="pwc" type="string";
    property name="wucCd" type="string";
    property name="howMal" type="string";
    property name="whenDisc" type="string";
    property name="shopStatus" type="string";
    property name="srdCd" type="string";
    property name="assetId" type="string";
    property name="narrative" type="string";
    property name="startDate" type="string";
    property name="stopDate" type="string";
    property name="eticDate" type="string";
    property name="recvDate" type="string";
    property name="tagNo" type="string";
    property name="docNo" type="string";
    property name="symbol" type="string";
    property name="equipId" type="string";
    property name="fsc" type="string";
    property name="etiIn" type="string";
    property name="etiOut" type="string";
    property name="etiDelta" type="string";
    property name="etiDeltaNonCnd" type="string";
    property name="deferStatus" type="string";
    property name="editFlag" type="string";
    property name="oldJob" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="legacyPk" type="string";
    property name="jobType" type="string";
    property name="stationType" type="string";
    property name="jstId" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize Repair properties */
        setRepairId("");
        setRepairSeq("");
        setEventId("");
        setInsBy("");
        setInsDate("");
        setMicap("N");
        setMicapLogin("N");
        setDamage("N");
        setChiefReview("N");
        setSuperReview("N");
        setEtiChange("N");
        setRepeatRecur("N");
        setSentImds("N");
        setValid("N");
        setValBy("");
        setValDate("");
        setTypeMaint("");
        setPwc("");
        setWucCd("");
        setHowMal("");
        setWhenDisc("");
        setShopStatus("");
        setSrdCd("");
        setAssetId("");
        setNarrative("");
        setStartDate("");
        setStopDate("");
        setEticDate("");
        setRecvDate("");
        setTagNo("");
        setDocNo("");
        setSymbol("");
        setEquipId("");
        setFsc("");
        setEtiIn("");
        setEtiOut("");
        setEtiDelta("");
        setEtiDeltaNonCnd("");
        setDeferStatus("");
        setEditFlag("");
        setOldJob("");
        setChgBy("");
        setChgDate("");
        setLegacyPk("");
        setJobType("");
        setStationType("");
        setJstId("");

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

    /* Validate Repair */
    public void function validate() {
        /* validate not null properties */

        if (isNull(getRepairSeq()) or !len(trim(getRepairSeq()))) {
            throw (type="RepairException", message="Missing Repair_Seq", detail="Please enter in the Repair_Seq");
        }
        if (isNull(getEventId()) or !len(trim(getEventId()))) {
            throw (type="RepairException", message="Missing Event_Id", detail="Please enter in the Event_Id");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="RepairException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="RepairException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getMicap()) or !len(trim(getMicap()))) {
            throw (type="RepairException", message="Missing Micap", detail="Please enter in the Micap");
        }
        if (isNull(getMicapLogin()) or !len(trim(getMicapLogin()))) {
            throw (type="RepairException", message="Missing Micap_Login", detail="Please enter in the Micap_Login");
        }
        if (isNull(getDamage()) or !len(trim(getDamage()))) {
            throw (type="RepairException", message="Missing Damage", detail="Please enter in the Damage");
        }
        if (isNull(getChiefReview()) or !len(trim(getChiefReview()))) {
            throw (type="RepairException", message="Missing Chief_Review", detail="Please enter in the Chief_Review");
        }
        if (isNull(getSuperReview()) or !len(trim(getSuperReview()))) {
            throw (type="RepairException", message="Missing Super_Review", detail="Please enter in the Super_Review");
        }
        if (isNull(getEtiChange()) or !len(trim(getEtiChange()))) {
            throw (type="RepairException", message="Missing Eti_Change", detail="Please enter in the Eti_Change");
        }
        if (isNull(getRepeatRecur()) or !len(trim(getRepeatRecur()))) {
            throw (type="RepairException", message="Missing Repeat_Recur", detail="Please enter in the Repeat_Recur");
        }
        if (isNull(getSentImds()) or !len(trim(getSentImds()))) {
            throw (type="RepairException", message="Missing Sent_Imds", detail="Please enter in the Sent_Imds");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="RepairException", message="Missing Valid", detail="Please enter in the Valid");
        }
    
        /* validate numeric properties */
        if (!isNull(getRepairId()) and len(trim(getRepairId())) and !isNumeric(getRepairId())) {
            throw (type="RepairException", message="Repair_Id not a number", detail="Please enter a valid number for Repair_Id");
        }
        if (!isNull(getRepairSeq()) and len(trim(getRepairSeq())) and !isNumeric(getRepairSeq())) {
            throw (type="RepairException", message="Repair_Seq not a number", detail="Please enter a valid number for Repair_Seq");
        }
        if (!isNull(getEventId()) and len(trim(getEventId())) and !isNumeric(getEventId())) {
            throw (type="RepairException", message="Event_Id not a number", detail="Please enter a valid number for Event_Id");
        }
        if (!isNull(getTypeMaint()) and len(trim(getTypeMaint())) and !isNumeric(getTypeMaint())) {
            throw (type="RepairException", message="Type_Maint not a number", detail="Please enter a valid number for Type_Maint");
        }
        if (!isNull(getPwc()) and len(trim(getPwc())) and !isNumeric(getPwc())) {
            throw (type="RepairException", message="Pwc not a number", detail="Please enter a valid number for Pwc");
        }
        if (!isNull(getWucCd()) and len(trim(getWucCd())) and !isNumeric(getWucCd())) {
            throw (type="RepairException", message="Wuc_Cd not a number", detail="Please enter a valid number for Wuc_Cd");
        }
        if (!isNull(getHowMal()) and len(trim(getHowMal())) and !isNumeric(getHowMal())) {
            throw (type="RepairException", message="How_Mal not a number", detail="Please enter a valid number for How_Mal");
        }
        if (!isNull(getWhenDisc()) and len(trim(getWhenDisc())) and !isNumeric(getWhenDisc())) {
            throw (type="RepairException", message="When_Disc not a number", detail="Please enter a valid number for When_Disc");
        }
        if (!isNull(getShopStatus()) and len(trim(getShopStatus())) and !isNumeric(getShopStatus())) {
            throw (type="RepairException", message="Shop_Status not a number", detail="Please enter a valid number for Shop_Status");
        }
        if (!isNull(getSrdCd()) and len(trim(getSrdCd())) and !isNumeric(getSrdCd())) {
            throw (type="RepairException", message="Srd_Cd not a number", detail="Please enter a valid number for Srd_Cd");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="RepairException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getEtiIn()) and len(trim(getEtiIn())) and !isNumeric(getEtiIn())) {
            throw (type="RepairException", message="Eti_In not a number", detail="Please enter a valid number for Eti_In");
        }
        if (!isNull(getEtiOut()) and len(trim(getEtiOut())) and !isNumeric(getEtiOut())) {
            throw (type="RepairException", message="Eti_Out not a number", detail="Please enter a valid number for Eti_Out");
        }
        if (!isNull(getEtiDelta()) and len(trim(getEtiDelta())) and !isNumeric(getEtiDelta())) {
            throw (type="RepairException", message="Eti_Delta not a number", detail="Please enter a valid number for Eti_Delta");
        }
        if (!isNull(getEtiDeltaNonCnd()) and len(trim(getEtiDeltaNonCnd())) and !isNumeric(getEtiDeltaNonCnd())) {
            throw (type="RepairException", message="Eti_Delta_Non_Cnd not a number", detail="Please enter a valid number for Eti_Delta_Non_Cnd");
        }
        if (!isNull(getLegacyPk()) and len(trim(getLegacyPk())) and !isNumeric(getLegacyPk())) {
            throw (type="RepairException", message="Legacy_Pk not a number", detail="Please enter a valid number for Legacy_Pk");
        }
        if (!isNull(getJstId()) and len(trim(getJstId())) and !isNumeric(getJstId())) {
            throw (type="RepairException", message="Jst_Id not a number", detail="Please enter a valid number for Jst_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="RepairException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="RepairException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getStartDate()) and len(trim(getStartDate())) and !isDate(getStartDate())) {
            throw (type="RepairException", message="Start_Date not a valid date", detail="Please enter a valid date for Start_Date");
        }
        if (!isNull(getStopDate()) and len(trim(getStopDate())) and !isDate(getStopDate())) {
            throw (type="RepairException", message="Stop_Date not a valid date", detail="Please enter a valid date for Stop_Date");
        }
        if (!isNull(getEticDate()) and len(trim(getEticDate())) and !isDate(getEticDate())) {
            throw (type="RepairException", message="Etic_Date not a valid date", detail="Please enter a valid date for Etic_Date");
        }
        if (!isNull(getRecvDate()) and len(trim(getRecvDate())) and !isDate(getRecvDate())) {
            throw (type="RepairException", message="Recv_Date not a valid date", detail="Please enter a valid date for Recv_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="RepairException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }

    public void function validateRepair() {
        /* validate not null properties */
        if (isNull(getRepairId()) or !len(trim(getRepairId()))) {
            throw (type="RepairException", message="Missing Repair_Id", detail="Please enter in the Repair_Id");
        }
    }

}



