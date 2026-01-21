component output="false" displayName="MeterHist" name="MeterHist" accessors="true" {
	/* properties */
	property name="meterId" type="string";
    property name="assetId" type="string";
    property name="meterType" type="string";
    property name="meterAction" type="string";
    property name="changed" type="string";
    property name="valid" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="meterIn" type="string";
    property name="meterOut" type="string";
    property name="repairId" type="string";
    property name="remarks" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="seqNum" type="string";
    property name="failure" type="string";
    property name="laborId" type="string";
    property name="eventId" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize MeterHist properties */
        setMeterId("");
        setAssetId("");
        setMeterType("ETM");
        setMeterAction("RIMSS INSERT");
        setChanged("N");
        setValid("N");
        setInsBy("");
        setInsDate("");
        setMeterIn("");
        setMeterOut("");
        setRepairId("");
        setRemarks("");
        setChgBy("");
        setChgDate("");
        setSeqNum("");
        setFailure("");
        setLaborId("");
        setEventId("");

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

    /* Validate MeterHist */
    public void function validate() {
        /* validate not null properties */
//        if (isNull(getMeterId()) or !len(trim(getMeterId()))) {
//            throw (type="MeterHistException", message="Missing Meter_Id", detail="Please enter in the Meter_Id");
//        }
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="MeterHistException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getMeterType()) or !len(trim(getMeterType()))) {
            throw (type="MeterHistException", message="Missing Meter_Type", detail="Please enter in the Meter_Type");
        }
        if (isNull(getMeterAction()) or !len(trim(getMeterAction()))) {
            throw (type="MeterHistException", message="Missing Meter_Action", detail="Please enter in the Meter_Action");
        }
        if (isNull(getChanged()) or !len(trim(getChanged()))) {
            throw (type="MeterHistException", message="Missing Changed", detail="Please enter in the Changed");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="MeterHistException", message="Missing Valid", detail="Please enter in the Valid");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="MeterHistException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="MeterHistException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getMeterId()) and len(trim(getMeterId())) and !isNumeric(getMeterId())) {
            throw (type="MeterHistException", message="Meter_Id not a number", detail="Please enter a valid number for Meter_Id");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="MeterHistException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getMeterIn()) and len(trim(getMeterIn())) and !isNumeric(getMeterIn())) {
            throw (type="MeterHistException", message="Meter_In not a number", detail="Please enter a valid number for Meter_In");
        }
        if (!isNull(getMeterOut()) and len(trim(getMeterOut())) and !isNumeric(getMeterOut())) {
            throw (type="MeterHistException", message="Meter_Out not a number", detail="Please enter a valid number for Meter_Out");
        }
        if (!isNull(getRepairId()) and len(trim(getRepairId())) and !isNumeric(getRepairId())) {
            throw (type="MeterHistException", message="Repair_Id not a number", detail="Please enter a valid number for Repair_Id");
        }
        if (!isNull(getSeqNum()) and len(trim(getSeqNum())) and !isNumeric(getSeqNum())) {
            throw (type="MeterHistException", message="Seq_Num not a number", detail="Please enter a valid number for Seq_Num");
        }
        if (!isNull(getLaborId()) and len(trim(getLaborId())) and !isNumeric(getLaborId())) {
            throw (type="MeterHistException", message="Labor_Id not a number", detail="Please enter a valid number for Labor_Id");
        }
        if (!isNull(getEventId()) and len(trim(getEventId())) and !isNumeric(getEventId())) {
            throw (type="MeterHistException", message="Event_Id not a number", detail="Please enter a valid number for Event_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="MeterHistException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="MeterHistException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

