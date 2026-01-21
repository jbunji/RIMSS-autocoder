component output="false" displayName="Event" name="Event" accessors="true" {
	/* properties */
	property name="eventId" type="string";
    property name="locId" type="string";
    property name="source" type="string";
    property name="sourceCat" type="string";
    property name="sentImds" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="wucCd" type="string";
    property name="wcCd" type="string";
    property name="maintTypeEe" type="string";
    property name="squad" type="string";
    property name="nonImds" type="string";
    property name="assetId" type="string";
    property name="jobNo" type="string";
    property name="tailNo" type="string";
    property name="discrepancy" type="string";
    property name="startJob" type="string";
    property name="stopJob" type="string";
    property name="whenDisc" type="string";
    property name="priority" type="string";
    property name="symbol" type="string";
    property name="tctoId" type="string";
    property name="imdsUserid" type="string";
    property name="eticDate" type="string";
    property name="editFlag" type="string";
    property name="oldJob" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="howMal" type="string";
    property name="lruInd" type="string";
    property name="srd" type="string";
    property name="pec" type="string";
    property name="mti" type="string";
    property name="eventType" type="string";
    property name="sortieId" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize Event properties */
        setEventId("");
        setLocId("");
        setSource("RIMSS");
        setSourceCat("");
        setSentImds("N");
        setInsBy("");
        setInsDate("");
        setValid("N");
        setValBy("");
        setValDate("");
        setWucCd("");
        setWcCd("");
        setMaintTypeEe("");
        setSquad("");
        setNonImds("Y");
        setAssetId("");
        setJobNo("");
        setTailNo("");
        setDiscrepancy("");
        setStartJob("");
        setStopJob("");
        setWhenDisc("");
        setPriority("");
        setSymbol("");
        setTctoId("");
        setImdsUserid("");
        setEticDate("");
        setEditFlag("");
        setOldJob("");
        setChgBy("");
        setChgDate("");
        setHowMal("");
        setLruInd("");
        setSrd("");
        setPec("");
        setMti("");
        setEventType("");
        setSortieId("");

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

    /* Validate Event */
    public void function validate() {
        /* validate not null properties */
//        if (isNull(getEventId()) or !len(trim(getEventId()))) {
//            throw (type="EventException", message="Missing Event_Id", detail="Please enter in the Event_Id");
//        }
        if (isNull(getLocId()) or !len(trim(getLocId()))) {
            throw (type="EventException", message="Missing Loc_Id", detail="Please enter in the Loc_Id");
        }
        if (isNull(getSource()) or !len(trim(getSource()))) {
            throw (type="EventException", message="Missing Source", detail="Please enter in the Source");
        }
        if (isNull(getSourceCat()) or !len(trim(getSourceCat()))) {
            throw (type="EventException", message="Missing Source_Cat", detail="Please enter in the Source_Cat");
        }
        if (isNull(getSentImds()) or !len(trim(getSentImds()))) {
            throw (type="EventException", message="Missing Sent_Imds", detail="Please enter in the Sent_Imds");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="EventException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="EventException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="EventException", message="Missing Valid", detail="Please enter in the Valid");
        }
    
        /* validate numeric properties */
        if (!isNull(getEventId()) and len(trim(getEventId())) and !isNumeric(getEventId())) {
            throw (type="EventException", message="Event_Id not a number", detail="Please enter a valid number for Event_Id");
        }
        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="EventException", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
        if (!isNull(getWucCd()) and len(trim(getWucCd())) and !isNumeric(getWucCd())) {
            throw (type="EventException", message="Wuc_Cd not a number", detail="Please enter a valid number for Wuc_Cd");
        }
        if (!isNull(getWcCd()) and len(trim(getWcCd())) and !isNumeric(getWcCd())) {
            throw (type="EventException", message="Wc_Cd not a number", detail="Please enter a valid number for Wc_Cd");
        }
        if (!isNull(getMaintTypeEe()) and len(trim(getMaintTypeEe())) and !isNumeric(getMaintTypeEe())) {
            throw (type="EventException", message="Maint_Type_Ee not a number", detail="Please enter a valid number for Maint_Type_Ee");
        }
        if (!isNull(getSquad()) and len(trim(getSquad())) and !isNumeric(getSquad())) {
            throw (type="EventException", message="Squad not a number", detail="Please enter a valid number for Squad");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="EventException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getWhenDisc()) and len(trim(getWhenDisc())) and !isNumeric(getWhenDisc())) {
            throw (type="EventException", message="When_Disc not a number", detail="Please enter a valid number for When_Disc");
        }
        if (!isNull(getTctoId()) and len(trim(getTctoId())) and !isNumeric(getTctoId())) {
            throw (type="EventException", message="Tcto_Id not a number", detail="Please enter a valid number for Tcto_Id");
        }
        if (!isNull(getHowMal()) and len(trim(getHowMal())) and !isNumeric(getHowMal())) {
            throw (type="EventException", message="How_Mal not a number", detail="Please enter a valid number for How_Mal");
        }
        if (!isNull(getSortieId()) and len(trim(getSortieId())) and !isNumeric(getSortieId())) {
            throw (type="EventException", message="Sortie_Id not a number", detail="Please enter a valid number for Sortie_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="EventException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="EventException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getStartJob()) and len(trim(getStartJob())) and !isDate(getStartJob())) {
            throw (type="EventException", message="Start_Job not a valid date", detail="Please enter a valid date for Start_Job");
        }
        if (!isNull(getStopJob()) and len(trim(getStopJob())) and !isDate(getStopJob())) {
            throw (type="EventException", message="Stop_Job not a valid date", detail="Please enter a valid date for Stop_Job");
        }
        if (!isNull(getEticDate()) and len(trim(getEticDate())) and !isDate(getEticDate())) {
            throw (type="EventException", message="Etic_Date not a valid date", detail="Please enter a valid date for Etic_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="EventException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

