component output="false" displayName="Sorties" name="Sorties" accessors="true" {
	/* properties */
	property name="sortieId" type="string";
    property name="missionId" type="string";
    property name="serno" type="string";
    property name="acTailno" type="string";
    property name="sortieDate" type="string";
    property name="assetId" type="string";
    property name="sortieEffect" type="string";
    property name="acStation" type="string";
    property name="acType" type="string";
    property name="currentUnit" type="string";
    property name="assignedUnit" type="string";
    property name="range" type="string";
    property name="reason" type="string";
    property name="remarks" type="string";
    property name="sourceData" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="pgmId" type="string";
    property name="isNonPodded" type="string";
    property name="isDebrief" type="string";
    property name="isLiveMonitor" type="string";

	
	

	/* init */
	function init() {
	    /* initialize Sorties properties */
        setSortieId("");
        setMissionId("");
        setSerno("");
        setAcTailno("");
        setSortieDate("");
        setAssetId("");
        setSortieEffect("");
        setAcStation("");
        setAcType("");
        setCurrentUnit("");
        setAssignedUnit("");
        setRange("");
        setReason("");
        setRemarks("");
        setSourceData("");
        setInsBy("");
        setInsDate("");
        setChgBy("");
        setChgDate("");
        setValid("N");
        setValBy("");
        setValDate("");
        setPgmId("");
	    setIsNonPodded("");
	    setIsDebrief("");
	    setIsLiveMonitor("");
	    
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

    /* Validate Sorties */
    public void function validate() {
        /* validate not null properties */
//        if (isNull(getSortieId()) or !len(trim(getSortieId()))) {
//            throw (type="SortiesException", message="Missing Sortie_Id", detail="Please enter in the Sortie_Id");
//        }
        if (isNull(getPgmId()) or !isNumeric(trim(getPgmId()))) {
            throw (type="SortiesException", message="Missing Pgm_id", detail="Please enter in the Pgm_id");
        }
        
        if (isNull(getMissionId()) or !len(trim(getMissionId()))) {
            throw (type="SortiesException", message="Missing Mission_Id", detail="Please enter in the Mission_Id");
        }
        if (isNull(getSerno()) or !len(trim(getSerno()))) {
            throw (type="SortiesException", message="Missing Serno", detail="Please enter in the Serno");
        }
        if (isNull(getAcTailno()) or !len(trim(getAcTailno()))) {
            throw (type="SortiesException", message="Missing Ac_Tailno", detail="Please enter in the Ac_Tailno");
        }
        if (isNull(getSortieDate()) or !len(trim(getSortieDate()))) {
            throw (type="SortiesException", message="Missing Sortie_Date", detail="Please enter in the Sortie_Date");
        }
        
        if (isNull(getRange()) or !len(trim(getRange()))) {
            throw (type="SortiesException", message="Missing Range", detail="Please enter in the Range");
        }
        
        if (isNull(getSortieEffect()) or !len(trim(getSortieEffect()))) {
            throw (type="SortiesException", message="Missing Sortie_Effect", detail="Please enter in the Sortie_Effect");
        }
        
        /* validate numeric properties */
        if (!isNull(getSortieId()) and len(trim(getSortieId())) and !isNumeric(getSortieId())) {
            throw (type="SortiesException", message="Sortie_Id not a number", detail="Please enter a valid number for Sortie_Id");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="SortiesException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getSortieEffect()) and len(trim(getSortieEffect())) and !isNumeric(getSortieEffect())) {
            throw (type="SortiesException", message="Sortie_Effect not a number", detail="Please enter a valid number for Sortie_Effect");
        }
        if (!isNull(getAcType()) and len(trim(getAcType())) and !isNumeric(getAcType())) {
            throw (type="SortiesException", message="Ac_Type not a number", detail="Please enter a valid number for Ac_Type");
        }
        if (!isNull(getCurrentUnit()) and len(trim(getCurrentUnit())) and !isNumeric(getCurrentUnit())) {
            throw (type="SortiesException", message="Current_Unit not a number", detail="Please enter a valid number for Current_Unit");
        }
        if (!isNull(getAssignedUnit()) and len(trim(getAssignedUnit())) and !isNumeric(getAssignedUnit())) {
            throw (type="SortiesException", message="Assigned_Unit not a number", detail="Please enter a valid number for Assigned_Unit");
        }
        if (!isNull(getRange()) and len(trim(getRange())) and !isNumeric(getRange())) {
            throw (type="SortiesException", message="Range not a number", detail="Please enter a valid number for Range");
        }
    
        /* validate date properties */
        if (!isNull(getSortieDate()) and len(trim(getSortieDate())) and !isDate(getSortieDate())) {
            throw (type="SortiesException", message="Sortie_Date not a valid date", detail="Please enter a valid date for Sortie_Date");
        }
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="SortiesException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="SortiesException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="SortiesException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
    }
}

